import { NextResponse } from "next/server";
import { getMockupsForProduct } from "@/lib/printful-mockups";

/**
 * On-demand mockup generator endpoint.
 *
 * GET /api/printful/mockups/<syncProductId>
 * Returns { byColor: { [color]: [{ placement: "front"|"back", url }] }, partial: boolean }
 *
 * First request per product can take 20–60s while Printful renders. Result
 * is cached 24h in memory per server instance — subsequent requests are instant.
 */

// Let Next's route handler run long enough for the Printful task to finish.
export const maxDuration = 60;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ syncProductId: string }> }
) {
  try {
    const { syncProductId } = await ctx.params;
    const id = parseInt(syncProductId, 10);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    }

    const mockups = await getMockupsForProduct(id);
    return NextResponse.json({
      syncProductId: mockups.syncProductId,
      byColor: mockups.byColor,
      partial: mockups.partial,
      generatedAt: mockups.generatedAt,
    });
  } catch (err) {
    console.error("Mockups endpoint failed:", err);
    return NextResponse.json(
      { error: "Mockup generation failed" },
      { status: 500 }
    );
  }
}
