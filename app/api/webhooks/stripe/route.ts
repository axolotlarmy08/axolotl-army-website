import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { confirmOrder } from "@/lib/printful";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY not configured");
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

/**
 * Stripe → Printful confirmation webhook.
 *
 * Listens for both:
 *   - checkout.session.completed (new hosted-checkout flow)
 *   - payment_intent.succeeded   (belt-and-suspenders in case the session
 *                                  event gets missed and the intent fires)
 *
 * Both carry `printfulOrderId` in metadata; the first one that sees it
 * confirms the Printful draft order and returns. Printful's confirm is
 * idempotent, so a duplicate call on the second event is harmless.
 */

async function confirmFromMetadata(
  metadata: Record<string, string | null | undefined> | null | undefined,
  source: string
): Promise<boolean> {
  const raw = metadata?.printfulOrderId;
  if (!raw) {
    console.warn(`[stripe-webhook ${source}] no printfulOrderId in metadata`);
    return false;
  }
  const id = parseInt(raw, 10);
  if (!Number.isFinite(id)) {
    console.warn(`[stripe-webhook ${source}] bad printfulOrderId: ${raw}`);
    return false;
  }
  try {
    await confirmOrder(id);
    console.log(`[stripe-webhook ${source}] Printful order ${id} confirmed`);
    return true;
  } catch (err) {
    console.error(`[stripe-webhook ${source}] confirm failed for ${id}:`, err);
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  try {
    const stripe = getStripe();
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      // Only confirm for fully-paid sessions.
      if (session.payment_status === "paid") {
        await confirmFromMetadata(session.metadata, "session.completed");
      }
    } else if (event.type === "payment_intent.succeeded") {
      const intent = event.data.object as Stripe.PaymentIntent;
      await confirmFromMetadata(intent.metadata, "intent.succeeded");
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Stripe webhook error:", err);
    return NextResponse.json(
      { error: "Webhook verification failed" },
      { status: 400 }
    );
  }
}
