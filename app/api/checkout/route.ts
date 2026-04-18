import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import {
  createOrder,
  getStoreProductDetail,
  listStoreProducts,
  type OrderRecipient,
  type OrderItem,
  type SyncVariant,
} from "@/lib/printful";
import { assertRetailCoversCosts } from "@/lib/margins";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

interface CheckoutBody {
  items: Array<{
    syncVariantId: number;
    quantity: number;
  }>;
  shipping: OrderRecipient;
  email: string;
}

/**
 * Server-side lookup of every sync_variant_id the client sent.
 * Walks all store products (cached by Printful for ~1s, cheap). Returns a
 * Map keyed by sync_variant_id to the fresh retail_price and catalog id.
 */
async function loadSyncVariants(
  syncVariantIds: number[]
): Promise<Map<number, SyncVariant>> {
  const map = new Map<number, SyncVariant>();
  const summaries = await listStoreProducts();
  await Promise.all(
    summaries.map(async (s) => {
      try {
        const detail = await getStoreProductDetail(s.id);
        for (const v of detail.sync_variants) {
          if (syncVariantIds.includes(v.id)) {
            map.set(v.id, v);
          }
        }
      } catch (err) {
        console.error(`Failed to hydrate store product ${s.id}:`, err);
      }
    })
  );
  return map;
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Stripe is not configured yet" },
        { status: 503 }
      );
    }

    const body: CheckoutBody = await req.json();

    if (!body.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Server-side price lookup — never trust client-sent prices
    const ids = body.items.map((i) => i.syncVariantId);
    const variantMap = await loadSyncVariants(ids);

    // 2. Build priced line items + run margin guard per line
    const intl = body.shipping.country_code !== "US";
    let totalCents = 0;
    for (const item of body.items) {
      const v = variantMap.get(item.syncVariantId);
      if (!v) {
        return NextResponse.json(
          { error: `Unknown product (${item.syncVariantId})` },
          { status: 400 }
        );
      }
      const retail = parseFloat(v.retail_price);
      const check = assertRetailCoversCosts(retail, v.variant_id, { intl });
      if (!check.ok) {
        console.error("Margin guard rejected line", check);
        return NextResponse.json(
          { error: "This item isn't available for purchase right now." },
          { status: 400 }
        );
      }
      totalCents += Math.round(retail * 100) * item.quantity;
    }

    const stripe = getStripe()!;

    // 3. Create Printful draft order with sync_variant_id (no design files needed)
    const printfulItems: OrderItem[] = body.items.map((item) => ({
      sync_variant_id: item.syncVariantId,
      quantity: item.quantity,
    }));
    const printfulOrder = await createOrder(
      { ...body.shipping, email: body.email },
      printfulItems,
      true // draft mode — confirmed by Stripe webhook after payment succeeds
    );
    const printfulOrderId = (printfulOrder as { id: number }).id;

    // 4. Create Stripe PaymentIntent with printfulOrderId in metadata so the
    //    webhook can confirm the right Printful order when payment succeeds.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: "usd",
      metadata: {
        source: "axolotl-army-merch",
        email: body.email,
        printfulOrderId: String(printfulOrderId),
        syncVariantIds: ids.join(","),
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      printfulOrderId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
