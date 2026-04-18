import { NextRequest, NextResponse } from "next/server";
import { getCatalogVariants } from "@/lib/printful";
import { saveCatalogColorsToDb } from "@/lib/db";

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

  const result: Record<string, { saved: number; error?: string }> = {};
  for (const cid of ids) {
    try {
      const variants = await getCatalogVariants(cid);
      const rows = variants
        .filter((v) => !!v.color_code)
        .map((v) => ({ variantId: v.id, colorCode: v.color_code }));
      if (rows.length > 0) {
        await saveCatalogColorsToDb(cid, rows);
      }
      result[String(cid)] = { saved: rows.length };
    } catch (err) {
      result[String(cid)] = {
        saved: 0,
        error: err instanceof Error ? err.message.slice(0, 200) : String(err),
      };
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return NextResponse.json({ result });
}
