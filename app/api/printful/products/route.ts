import { NextResponse } from "next/server";
import {
  listStoreProducts,
  getStoreProductDetail,
} from "@/lib/printful";
import { assertRetailCoversCosts } from "@/lib/margins";

/**
 * Printful names mockup files predictably: "<product-slug>-<color>-<SIDE>-<hash>.jpg"
 * e.g. "unisex-staple-t-shirt-red-front-69e14..." or "youth-long-sleeve-tee-black-back-69e115...".
 * We use that to know which side the preview actually depicts, since Printful
 * generates the preview from whichever side has the design — not always the front.
 */
function detectPreviewSide(
  filename: string | undefined
): "front" | "back" | "left" | "right" | "sleeve" | "unknown" {
  if (!filename) return "unknown";
  const f = filename.toLowerCase();
  if (/-back-/.test(f)) return "back";
  if (/-front-/.test(f)) return "front";
  if (/-left-/.test(f)) return "left";
  if (/-right-/.test(f)) return "right";
  if (/-sleeve-/.test(f)) return "sleeve";
  return "unknown";
}


// Cache product data for 2 minutes — short enough that newly-added Printful
// products appear on /merch within a couple minutes of being created.
let cache: { data: unknown; timestamp: number } | null = null;
const CACHE_TTL = 2 * 60 * 1000;

/**
 * Returns every live Axolotl Army product synced from Printful, grouped by
 * color for the product-detail UI. retail_price is the source of truth
 * for pricing (set in the Printful dashboard, includes shipping).
 *
 * Products whose retail price is zero, whose variants are all ignored, or
 * which fail the margin guard for the given catalog type are filtered out —
 * better to hide a product than to sell it at a loss.
 */
export async function GET() {
  try {
    if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
      return NextResponse.json(cache.data);
    }

    const summaries = await listStoreProducts();

    const details = await Promise.all(
      summaries
        .filter((s) => !s.is_ignored && s.synced > 0)
        .map(async (s) => {
          try {
            const detail = await getStoreProductDetail(s.id);
            return { summary: s, detail };
          } catch (err) {
            console.error(`Store product ${s.id} detail failed:`, err);
            return null;
          }
        })
    );

    const products = details
      .filter((d): d is NonNullable<typeof d> => d !== null)
      .map(({ summary, detail }) => {
        const variants = (detail.sync_variants || []).filter(
          (v) => !v.is_ignored
        );
        if (variants.length === 0) return null;

        // Group variants by color
        type ColorGroup = {
          color: string;
          colorCode: string;
          image: string;
          imageSide: "front" | "back" | "left" | "right" | "sleeve" | "unknown";
          backImage?: string;
          sizes: Array<{
            syncVariantId: number;
            variantId: number;
            size: string;
            retailPrice: number;
            inStock: boolean;
          }>;
        };
        const colorGroups: Record<string, ColorGroup> = {};

        for (const v of variants) {
          const retailPrice = parseFloat(v.retail_price);
          if (!(retailPrice > 0)) {
            console.warn(
              `Sync variant ${v.id} (${v.name}) has no retail_price — hiding`
            );
            continue;
          }

          // Margin guard — skip variants priced below viable
          const check = assertRetailCoversCosts(retailPrice, v.variant_id);
          if (!check.ok) {
            console.warn(
              `Sync variant ${v.id} (${v.name}) below margin floor: ${check.reason}`
            );
            continue;
          }

          // Prefer the design-on-garment preview URL (from files[] type=preview).
          // Falls back to the product image (blank garment) if no preview found,
          // then to the store product's thumbnail (which is usually a preview too).
          const previewFile = v.files?.find((f) => f.type === "preview");
          const backFile = v.files?.find((f) => f.type === "back");
          const variantImage =
            previewFile?.preview_url ||
            previewFile?.url ||
            v.product?.image ||
            summary.thumbnail_url;
          const imageSide = detectPreviewSide(
            previewFile?.filename as string | undefined
          );
          const backArt = backFile?.preview_url || backFile?.url;

          const key = v.color || "default";
          if (!colorGroups[key]) {
            // Only attach the back artwork thumbnail when the main image isn't
            // already showing the back. Otherwise it's redundant.
            const includeBack = !!backArt && imageSide !== "back";
            colorGroups[key] = {
              color: v.color || "Default",
              colorCode: "#000",
              image: variantImage,
              imageSide,
              ...(includeBack ? { backImage: backArt } : {}),
              sizes: [],
            };
          }
          colorGroups[key].sizes.push({
            syncVariantId: v.id,
            variantId: v.variant_id,
            size: v.size,
            retailPrice,
            inStock: v.availability_status === "active",
          });
        }

        const colors = Object.values(colorGroups).filter(
          (c) => c.sizes.length > 0
        );
        if (colors.length === 0) return null;

        const minPrice = Math.min(
          ...colors.flatMap((c) => c.sizes.map((s) => s.retailPrice))
        );

        // For the grid card, prefer the Printful sync product thumbnail_url
        // (which IS the design-on-garment preview), falling back to the first
        // variant's computed image if somehow missing.
        const thumbnail =
          summary.thumbnail_url || colors[0]?.image || "";

        return {
          syncProductId: summary.id,
          name: summary.name,
          thumbnail,
          startingPrice: minPrice,
          colors,
        };
      })
      .filter((p): p is NonNullable<typeof p> => p !== null);

    const response = { products };
    cache = { data: response, timestamp: Date.now() };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Printful products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

