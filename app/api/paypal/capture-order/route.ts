import { NextRequest, NextResponse } from "next/server";
import { capturePayPalOrder } from "@/lib/paypalClient";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid orderId." },
        { status: 400 },
      );
    }

    const captureData = await capturePayPalOrder(orderId);

    // Check if capture was successful
    const captureStatus = captureData.status;
    if (captureStatus !== "COMPLETED") {
      return NextResponse.json(
        { error: `Payment not completed. Status: ${captureStatus}` },
        { status: 400 },
      );
    }

    // Extract relevant info for response
    const capture =
      captureData.purchase_units?.[0]?.payments?.captures?.[0] ?? {};
    const payer = captureData.payer ?? {};

    const responseData = {
      status: "success",
      orderId: captureData.id,
      captureId: capture.id,
      amount: capture.amount?.value,
      currency: capture.amount?.currency_code,
      payerEmail: payer.email_address,
      payerName: payer.name?.given_name
        ? `${payer.name.given_name} ${payer.name.surname ?? ""}`
        : undefined,
    };

    // Save payment to Supabase (fire-and-forget, non-blocking)
    if (supabase) {
      try {
        await supabase.from("payments").insert({
          amount: parseFloat(capture.amount?.value ?? "0"),
          currency: capture.amount?.currency_code ?? "EUR",
          status: "COMPLETED",
          provider: "paypal",
          paypal_order_id: captureData.id,
          paypal_capture_id: capture.id,
          payer_email: payer.email_address ?? null,
          payer_name: responseData.payerName ?? null,
          payment_type: "membership",
          is_recurring: false,
        });
        console.log("Payment saved to Supabase:", captureData.id);
      } catch (dbError) {
        // Log but don't fail the response — payment is already captured
        console.error("Failed to save payment to Supabase:", dbError);
      }
    }

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error capturing PayPal order:", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
