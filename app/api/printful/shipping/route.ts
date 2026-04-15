import { NextRequest, NextResponse } from "next/server";

const PRINTFUL_TOKEN = process.env.PRINTFUL_API_TOKEN;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipient, items } = body;

    if (!recipient?.country_code || !recipient?.zip || !items?.length) {
      return NextResponse.json(
        { error: "Missing recipient address or items" },
        { status: 400 }
      );
    }

    // Use v1 API directly — works with catalog variant IDs
    const res = await fetch("https://api.printful.com/shipping/rates", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PRINTFUL_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ recipient, items }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Printful shipping error:", err);
      return NextResponse.json(
        { error: "Failed to get shipping rates" },
        { status: 500 }
      );
    }

    const data = await res.json();
    // v1 API uses "result" not "data"
    const rates = data.result || [];

    return NextResponse.json({ rates });
  } catch (error) {
    console.error("Shipping rates error:", error);
    return NextResponse.json(
      { error: "Failed to get shipping rates" },
      { status: 500 }
    );
  }
}
