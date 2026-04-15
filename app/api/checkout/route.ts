import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createOrder, type OrderRecipient, type OrderItem } from "@/lib/printful";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key, { apiVersion: "2026-03-25.dahlia" });
}

interface CheckoutBody {
  items: Array<{
    variantId: number;
    quantity: number;
    price: number;
    designUrl: string;
    productLabel: string;
  }>;
  shipping: OrderRecipient;
  email: string;
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

    // Calculate total in cents for Stripe
    const totalCents = body.items.reduce(
      (sum, item) => sum + item.price * item.quantity * 100,
      0
    );

    // Create Stripe PaymentIntent
    const stripe = getStripe()!;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalCents),
      currency: "usd",
      metadata: {
        source: "axolotl-army-merch",
        email: body.email,
      },
    });

    // Create Printful draft order (not confirmed until payment succeeds)
    const printfulItems: OrderItem[] = body.items.map((item) => ({
      variant_id: item.variantId,
      quantity: item.quantity,
      files: [
        {
          type: "default",
          url: item.designUrl,
        },
      ],
    }));

    const printfulOrder = await createOrder(
      { ...body.shipping, email: body.email },
      printfulItems,
      true // draft mode
    );

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      printfulOrderId: (printfulOrder as { id: number }).id,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed" },
      { status: 500 }
    );
  }
}
