import { NextRequest, NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypalClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount } = body;

    if (!amount || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be a positive number." },
        { status: 400 },
      );
    }

    if (amount > 9999) {
      return NextResponse.json(
        { error: "Amount exceeds the maximum limit of 9999 EUR." },
        { status: 400 },
      );
    }

    const order = await createPayPalOrder(amount);

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    console.error("Error creating PayPal order:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
