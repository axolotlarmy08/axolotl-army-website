import { NextResponse } from "next/server";
import {
  listStoreProducts,
  getStoreProductDetail,
} from "@/lib/printful";
import { assertRetailCoversCosts } from "@/lib/margins";

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

          const key = v.color || "default";
          if (!colorGroups[key]) {
            colorGroups[key] = {
              color: v.color || "Default",
              colorCode: "#000",
              image: v.product?.image || summary.thumbnail_url,
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

        // The store product's thumbnail_url is often the blank garment. Prefer
        // the first variant's mockup (which has the design applied) so the
        // grid shows the finished product, not a blank shirt/long-sleeve/etc.
        const thumbnail =
          colors[0]?.image || summary.thumbnail_url;

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

