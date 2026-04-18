import { NextResponse } from "next/server";
import {
  getSizeChart,
  getStoreProductDetail,
  type SizeChart,
} from "@/lib/printful";

/**
 * Returns Printful's per-product size chart keyed by our sync_product_id.
 * We translate sync_product_id → catalog_product_id server-side (via the
 * sync variant's `product.product_id`) so the client doesn't need to know
 * about catalog IDs.
 *
 * Size charts are stable; cache for 12h.
 */
export const revalidate = 43200;

// Tiny in-memory cache so a burst of views for the same product doesn't
// re-hit Printful four times in a row during the Vercel instance lifetime.
const cache = new Map<number, { chart: SizeChart | null; at: number }>();
const CACHE_TTL_MS = 12 * 60 * 60 * 1000;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ syncProductId: string }> }
) {
  try {
    const { syncProductId } = await ctx.params;
    const spid = parseInt(syncProductId, 10);
    if (!Number.isFinite(spid)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const detail = await getStoreProductDetail(spid);
    const catalogId = detail.sync_variants?.[0]?.product?.product_id;
    if (!catalogId) {
      return NextResponse.json({ chart: null, catalogProductId: null });
    }

    const cached = cache.get(catalogId);
    if (cached && Date.now() - cached.at < CACHE_TTL_MS) {
      return NextResponse.json({
        catalogProductId: catalogId,
        chart: cached.chart,
      });
    }

    const chart = await getSizeChart(catalogId);
    cache.set(catalogId, { chart, at: Date.now() });
    return NextResponse.json({ catalogProductId: catalogId, chart });
  } catch (err) {
    console.error("Size chart route failed:", err);
    return NextResponse.json(
      { error: "Size chart fetch failed" },
      { status: 500 }
    );
  }
}
