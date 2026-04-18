import { NextRequest, NextResponse } from "next/server";
import { getCatalogVariants } from "@/lib/printful";
import {
  saveCatalogColorsToDb,
  getCatalogColorsFromDb,
  saveCatalogRegionsToDb,
} from "@/lib/db";

function extractRegions(
  variants: Array<{
    availability_status?: Array<{ region: string; status: string }>;
  }>
): string[] {
  const regions = new Set<string>();
  for (const v of variants) {
    for (const s of v.availability_status || []) {
      if (s?.region && (s.status === "in_stock" || s.status === "stocked_on_demand")) {
        regions.add(s.region);
      }
    }
  }
  return [...regions].sort();
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids") || "71,748,807";
  const ids = idsParam
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));
  const result: Record<string, { rows: number; sample: Array<[number, string]> }> = {};
  for (const cid of ids) {
    const m = await getCatalogColorsFromDb(cid);
    result[String(cid)] = {
      rows: m.size,
      sample: [...m.entries()].slice(0, 3),
    };
  }
  return NextResponse.json({ result });
}

/**
 * Admin-only helper: force-populate the catalog-color cache in Neon for
 * the catalog product IDs we need. Runs one Printful call per ID with
 * 500ms spacing to stay well under any burst limit.
 *
 *   curl -X POST -H "Authorization: Bearer $PRINTFUL_API_TOKEN" \
 *     "https://.../api/printful/colors/seed?ids=71,748,807"
 */
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const idsParam = url.searchParams.get("ids");
  if (!idsParam) {
    return NextResponse.json(
      { error: "Pass ?ids=catalogId1,catalogId2" },
      { status: 400 }
    );
  }
  const ids = idsParam
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => Number.isFinite(n));

  const result: Record<string, { colors: number; regions: string[]; error?: string }> = {};
  for (const cid of ids) {
    try {
      const variants = await getCatalogVariants(cid);
      const rows = variants
        .filter((v) => !!v.color_code)
        .map((v) => ({ variantId: v.id, colorCode: v.color_code }));
      if (rows.length > 0) {
        await saveCatalogColorsToDb(cid, rows);
      }
      // Also populate fulfillment regions from the same response.
      const regions = extractRegions(
        variants as unknown as Array<{
          availability_status?: Array<{ region: string; status: string }>;
        }>
      );
      if (regions.length > 0) {
        await saveCatalogRegionsToDb(cid, regions);
      }
      result[String(cid)] = { colors: rows.length, regions };
    } catch (err) {
      result[String(cid)] = {
        colors: 0,
        regions: [],
        error: err instanceof Error ? err.message.slice(0, 200) : String(err),
      };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return NextResponse.json({ result });
}
