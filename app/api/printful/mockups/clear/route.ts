import { NextRequest, NextResponse } from "next/server";
import { clearMockupsFromDb } from "@/lib/db";

/**
 * Admin-only: wipe cached mockups (all, or one product) to force the
 * /api/printful/mockups endpoint to regenerate them. Used after changes
 * to the mockup generator logic that produce visually different output.
 *
 * Protected by a shared-secret header check so a random visitor can't
 * empty your cache.
 *
 *   curl -X POST "https://.../api/printful/mockups/clear" \
 *     -H "Authorization: Bearer $PRINTFUL_API_TOKEN"
 *
 *   Optional ?syncProductId=123 to clear just one product.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  const token = process.env.PRINTFUL_API_TOKEN;
  if (!token || auth !== `Bearer ${token}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const url = new URL(req.url);
  const idParam = url.searchParams.get("syncProductId");
  const id = idParam ? parseInt(idParam, 10) : undefined;
  const deleted = await clearMockupsFromDb(id);
  return NextResponse.json({ deleted, scope: id ?? "all" });
}
