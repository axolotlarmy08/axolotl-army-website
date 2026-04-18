import { NextResponse } from "next/server";
import {
  listStoreProducts,
  getStoreProductDetail,
} from "@/lib/printful";
import {
  assertRetailCoversCosts,
  computeMinViableRetail,
  PRINTFUL_COST_ESTIMATES,
} from "@/lib/margins";

/**
 * Diagnostic endpoint — read-only. Returns everything the merch API saw,
 * with per-variant reasons for kept/hidden so you can see exactly why
 * /merch is empty without guessing.
 *
 * Does not touch orders, payments, or secrets. Safe to hit from the
 * browser. Cached for 30 seconds.
 */
export const revalidate = 30;

export async function GET() {
  try {
    if (!process.env.PRINTFUL_API_TOKEN) {
      return NextResponse.json({
        ok: false,
        reason: "PRINTFUL_API_TOKEN not configured on this deployment",
      });
    }

    const summaries = await listStoreProducts();

    const detailed = await Promise.all(
      summaries.map(async (s) => {
        try {
          const detail = await getStoreProductDetail(s.id);
          const variants = detail.sync_variants.map((v) => {
            const retailPrice = parseFloat(v.retail_price);
            const known = PRINTFUL_COST_ESTIMATES[v.variant_id];
            const usCheck = assertRetailCoversCosts(retailPrice, v.variant_id, {
              intl: false,
            });
            const intlCheck = assertRetailCoversCosts(
              retailPrice,
              v.variant_id,
              { intl: true }
            );
            const usMin = computeMinViableRetail(v.variant_id, false);
            const intlMin = computeMinViableRetail(v.variant_id, true);

            let visibility: "live" | "hidden" = "live";
            const reasons: string[] = [];
            if (v.is_ignored) {
              visibility = "hidden";
              reasons.push("is_ignored=true in Printful");
            }
            if (!(retailPrice > 0)) {
              visibility = "hidden";
              reasons.push("retail_price is 0 or missing");
            }
            if (!usCheck.ok) {
              visibility = "hidden";
              reasons.push(`US margin: ${usCheck.reason}`);
            }
            if (!known) {
              reasons.push(
                `catalog variant_id ${v.variant_id} not in PRINTFUL_COST_ESTIMATES (falls back to $25 floor)`
              );
            }

            return {
              sync_variant_id: v.id,
              name: v.name,
              size: v.size,
              color: v.color,
              catalog_variant_id: v.variant_id,
              retail_price: v.retail_price,
              retail_price_parsed: retailPrice,
              min_retail_us: usMin,
              min_retail_intl: intlMin,
              us_margin_ok: usCheck.ok,
              intl_margin_ok: intlCheck.ok,
              is_ignored: v.is_ignored,
              availability_status: v.availability_status,
              visibility,
              reasons,
            };
          });

          const liveCount = variants.filter(
            (v) => v.visibility === "live"
          ).length;

          return {
            sync_product_id: s.id,
            name: s.name,
            synced_count: s.synced,
            is_ignored: s.is_ignored,
            variant_count: variants.length,
            live_variant_count: liveCount,
            status: liveCount > 0 ? "live" : "hidden",
            variants,
          };
        } catch (err) {
          return {
            sync_product_id: s.id,
            name: s.name,
            status: "error",
            error: err instanceof Error ? err.message : String(err),
          };
        }
      })
    );

    const totals = {
      store_products: summaries.length,
      live_products: detailed.filter((d) => d.status === "live").length,
      hidden_products: detailed.filter((d) => d.status === "hidden").length,
      errored_products: detailed.filter((d) => d.status === "error").length,
    };

    return NextResponse.json({
      ok: true,
      totals,
      products: detailed,
      cost_estimates: PRINTFUL_COST_ESTIMATES,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        reason: "Diagnose endpoint failed",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
