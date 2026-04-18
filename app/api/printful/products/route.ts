import { NextResponse } from "next/server";
import {
  listStoreProducts,
  getStoreProductDetail,
  getCatalogVariants,
  type CatalogVariant,
} from "@/lib/printful";
import { assertRetailCoversCosts } from "@/lib/margins";

/**
 * Per-catalog-product cache of variant_id → color_code hex. Printful's
 * sync_variant payload doesn't include color codes, so we have to call
 * /catalog-products/{id}/catalog-variants separately. That data is stable,
 * so we cache it in-memory for 24h to avoid hammering Printful.
 */
const colorCodeCache = new Map<number, { map: Map<number, string>; at: number }>();
const COLOR_TTL_MS = 24 * 60 * 60 * 1000;

async function getColorCodeMap(
  catalogProductId: number
): Promise<Map<number, string>> {
  const hit = colorCodeCache.get(catalogProductId);
  if (hit && Date.now() - hit.at < COLOR_TTL_MS) return hit.map;
  const map = new Map<number, string>();
  try {
    const variants: CatalogVariant[] = await getCatalogVariants(catalogProductId);
    for (const v of variants) {
      if (v.color_code) map.set(v.id, v.color_code);
    }
  } catch (err) {
    console.error(
      `Failed to fetch catalog variants for product ${catalogProductId}:`,
      err
    );
  }
  colorCodeCache.set(catalogProductId, { map, at: Date.now() });
  return map;
}

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

    // Collect every catalog product id referenced and fetch color-code maps
    // for all of them in parallel once. Downstream lookups are then synchronous.
    const catalogProductIds = new Set<number>();
    for (const d of details) {
      if (!d) continue;
      for (const v of d.detail.sync_variants || []) {
        const id = v.product?.product_id;
        if (id) catalogProductIds.add(id);
      }
    }
    const colorMapsByCatalog = new Map<number, Map<number, string>>();
    await Promise.all(
      [...catalogProductIds].map(async (cid) => {
        colorMapsByCatalog.set(cid, await getColorCodeMap(cid));
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
            // Look up the real color hex from the catalog; fall back to a
            // neutral gray if Printful didn't provide one for this variant.
            const catalogMap = v.product?.product_id
              ? colorMapsByCatalog.get(v.product.product_id)
              : undefined;
            const colorCode = catalogMap?.get(v.variant_id) || "#666";
            colorGroups[key] = {
              color: v.color || "Default",
              colorCode,
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

