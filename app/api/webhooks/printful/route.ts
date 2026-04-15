import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();

    // Log all Printful webhook events for now
    console.log("Printful webhook:", event.type, JSON.stringify(event.data));

    switch (event.type) {
      case "package_shipped":
        console.log("Order shipped:", event.data);
        // TODO: Send shipping confirmation email to customer
        break;

      case "order_failed":
        console.log("Order failed:", event.data);
        // TODO: Alert admin, potentially refund customer
        break;

      case "order_canceled":
        console.log("Order canceled:", event.data);
        break;

      default:
        console.log("Unhandled Printful event:", event.type);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Printful webhook error:", err);
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }
}
