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

    // 1. Server-side price + metadata lookup — never trust client-sent prices
    const ids = body.items.map((i) => i.syncVariantId);
    const variantMap = await loadSyncVariants(ids);

    const intl = body.shipping.country_code !== "US";

    type Line = {
      syncVariantId: number;
      quantity: number;
      retail: number;
      productName: string;
      image?: string;
    };
    const lines: Line[] = [];

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
      lines.push({
        syncVariantId: item.syncVariantId,
        quantity: item.quantity,
        retail,
        productName: v.name,
        image: v.product?.image,
      });
    }

    const stripe = getStripe()!;

    // 2. Create Printful draft order (confirmed by webhook on payment success)
    const printfulItems: OrderItem[] = body.items.map((item) => ({
      sync_variant_id: item.syncVariantId,
      quantity: item.quantity,
    }));
    const printfulOrder = await createOrder(
      { ...body.shipping, email: body.email },
      printfulItems,
      true
    );
    const printfulOrderId = (printfulOrder as { id: number }).id;

    // 3. Create a Stripe Checkout Session — Stripe hosts the payment page,
    //    so card collection, 3DS, Apple Pay/Google Pay all "just work".
    const origin =
      req.headers.get("origin") ||
      `https://${req.headers.get("host") || "www.axolotlarmy.net"}`;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lines.map((l) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(l.retail * 100),
          product_data: {
            name: l.productName,
            images: l.image ? [l.image] : undefined,
          },
        },
        quantity: l.quantity,
      })),
      success_url: `${origin}/checkout?session_id={CHECKOUT_SESSION_ID}&status=success`,
      cancel_url: `${origin}/checkout?status=cancelled`,
      customer_email: body.email,
      metadata: {
        source: "axolotl-army-merch",
        printfulOrderId: String(printfulOrderId),
        syncVariantIds: ids.join(","),
      },
      payment_intent_data: {
        // Mirror metadata onto the PaymentIntent so the webhook can find
        // printfulOrderId from either event source.
        metadata: {
          source: "axolotl-army-merch",
          printfulOrderId: String(printfulOrderId),
        },
      },
    });

    return NextResponse.json({
      url: session.url,
      sessionId: session.id,
      printfulOrderId,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
