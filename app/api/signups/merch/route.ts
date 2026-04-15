import { NextRequest, NextResponse } from "next/server";
import { saveMerchSignup } from "@/lib/db";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const { email, source } = await req.json();

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const result = await saveMerchSignup(email, source || "merch-section");

    return NextResponse.json({
      success: true,
      alreadySubscribed: !result.inserted,
    });
  } catch (err) {
    console.error("Merch signup error:", err);
    return NextResponse.json(
      { error: "Could not save signup" },
      { status: 500 }
    );
  }
}
