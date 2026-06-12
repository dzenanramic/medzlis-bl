"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface PayPalButtonProps {
  amount: number;
  currency?: string;
  onSuccess?: (data: {
    orderId: string;
    captureId: string;
    amount: string;
    currency: string;
    payerEmail?: string;
    payerName?: string;
  }) => void;
  onError?: (error: string) => void;
  disabled?: boolean;
}

const PayPalButtonInner: React.FC<{
  amount: number;
  currency: string;
  onSuccess?: PayPalButtonProps["onSuccess"];
  onError?: PayPalButtonProps["onError"];
  disabled?: boolean;
}> = ({ amount, currency, onSuccess, onError, disabled }) => {
  const { t } = useTranslation();
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <PayPalButtons
      style={{
        layout: "vertical",
        color: "gold",
        shape: "rect",
        label: "pay",
      }}
      disabled={disabled || isProcessing}
      createOrder={async () => {
        setIsProcessing(true);
        try {
          const response = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount, currency }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to create order");
          }

          const data = await response.json();
          return data.orderId;
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to create order";
          onError?.(message);
          setIsProcessing(false);
          throw error;
        }
      }}
      onApprove={async (data) => {
        try {
          const response = await fetch("/api/paypal/capture-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: data.orderID }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Failed to capture order");
          }

          const captureData = await response.json();
          onSuccess?.(captureData);
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to process payment";
          onError?.(message);
        } finally {
          setIsProcessing(false);
        }
      }}
      onCancel={() => {
        setIsProcessing(false);
        onError?.(t("membership.paymentCancelled", "Payment cancelled."));
      }}
      onError={(err) => {
        setIsProcessing(false);
        const message = typeof err === "string" ? err : "PayPal error";
        onError?.(message);
      }}
    />
  );
};

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  currency = "EUR",
  onSuccess,
  onError,
  disabled = false,
}) => {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  if (!clientId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
        PayPal nije konfigurisan. Molimo kontaktirajte administratora.
      </div>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency,
        intent: "capture",
      }}
    >
      <PayPalButtonInner
        amount={amount}
        currency={currency}
        onSuccess={onSuccess}
        onError={onError}
        disabled={disabled}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
