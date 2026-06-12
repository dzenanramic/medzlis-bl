import { NextRequest, NextResponse } from "next/server";
import { verifyPayPalWebhook } from "@/lib/paypalClient";
import { supabase } from "@/lib/supabaseClient";

/**
 * PayPal Webhook handler.
 *
 * Listens for various PayPal events:
 *  - CHECKOUT.ORDER.APPROVED
 *  - PAYMENT.CAPTURE.COMPLETED
 *  - PAYMENT.CAPTURE.REFUNDED
 *  - BILLING.SUBSCRIPTION.* (for future subscription support)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();

    // Build headers object for verification
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Verify webhook signature
    const isValid = await verifyPayPalWebhook(headers, body);

    if (!isValid) {
      console.warn("PayPal webhook verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const eventType = event.event_type;

    console.log(`PayPal webhook received: ${eventType}`);

    switch (eventType) {
      case "PAYMENT.CAPTURE.COMPLETED": {
        const capture = event.resource;
        console.log("Payment captured:", {
          id: capture.id,
          amount: capture.amount?.value,
          currency: capture.amount?.currency_code,
          status: capture.status,
          payerEmail: capture.payer_email,
        });

        // Save to Supabase if not already saved (idempotent check)
        if (supabase) {
          try {
            // Check if already exists
            const { data: existing } = await supabase
              .from("payments")
              .select("id")
              .eq("paypal_capture_id", capture.id)
              .maybeSingle();

            if (!existing) {
              await supabase.from("payments").insert({
                amount: parseFloat(capture.amount?.value ?? "0"),
                currency: capture.amount?.currency_code ?? "EUR",
                status: "COMPLETED",
                provider: "paypal",
                paypal_order_id:
                  capture.supplementary_data?.related_ids?.order_id,
                paypal_capture_id: capture.id,
                payer_email: capture.payer_email ?? null,
                payer_name: capture.payer_name?.given_name
                  ? `${capture.payer_name.given_name} ${capture.payer_name.surname ?? ""}`
                  : null,
                payment_type: "membership",
                is_recurring: false,
                metadata: {
                  webhook_event: eventType,
                  webhook_id: event.id,
                },
              });
              console.log("Payment saved via webhook:", capture.id);
            } else {
              console.log("Payment already saved, skipping:", capture.id);
            }
          } catch (dbError) {
            console.error("Failed to save payment via webhook:", dbError);
          }
        }
        break;
      }

      case "PAYMENT.CAPTURE.REFUNDED": {
        const refund = event.resource;
        console.log("Payment refunded:", {
          id: refund.id,
          amount: refund.amount?.value,
          status: refund.status,
        });

        // Update payment status in Supabase
        if (supabase) {
          try {
            await supabase
              .from("payments")
              .update({
                status: "REFUNDED",
                updated_at: new Date().toISOString(),
              })
              .eq("paypal_capture_id", refund.id);
            console.log("Payment marked as refunded:", refund.id);
          } catch (dbError) {
            console.error("Failed to update refund status:", dbError);
          }
        }
        break;
      }

      case "CHECKOUT.ORDER.APPROVED": {
        console.log("Order approved, awaiting capture:", event.resource.id);
        break;
      }

      default:
        console.log(`Unhandled webhook event type: ${eventType}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error processing PayPal webhook:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 },
    );
  }
}
