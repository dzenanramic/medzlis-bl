"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";
import { CreditCard } from "lucide-react";

const PayPalButton = dynamic(() => import("@/components/PayPalButton"), {
  ssr: false,
  loading: () => <div className="h-10 bg-muted animate-pulse rounded-lg" />,
});

const PRESET_AMOUNTS = [10, 20, 30, 50];

const MembershipInstructions: React.FC = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<number>(20);
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [paymentMessage, setPaymentMessage] = useState<string>("");

  const handlePresetClick = (value: number) => {
    setAmount(value);
    setIsCustom(false);
    setCustomAmount("");
    setPaymentStatus("idle");
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9.,]/g, "");
    setCustomAmount(val);
    setIsCustom(true);
    const num = parseFloat(val.replace(",", "."));
    if (!isNaN(num) && num > 0) {
      setAmount(num);
    }
    setPaymentStatus("idle");
  };

  const handleSuccess = () => {
    setPaymentStatus("success");
    setPaymentMessage(t("membership.paymentSuccessful"));
  };

  const handleError = (error: string) => {
    setPaymentStatus("error");
    setPaymentMessage(error || t("membership.paymentError"));
  };

  const getAmount = (): number => {
    if (isCustom) {
      const num = parseFloat(customAmount.replace(",", "."));
      return isNaN(num) ? 0 : num;
    }
    return amount;
  };

  return (
    <section className="py-10 px-2 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-foreground">
          {t("nav.membership")}
        </h1>
      </div>

      {/* PayPal Online Payment Section */}
      <div className="bg-card rounded-lg shadow-sm border border-border p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-emerald-50 p-3 rounded-lg flex items-center justify-center">
            <CreditCard
              className="w-7 h-7 text-emerald-600"
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground tracking-tight">
              {t("membership.onlinePaymentTitle")}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {t("membership.onlinePaymentDesc")}
            </p>
          </div>
        </div>

        {/* Amount Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {t("membership.amountLabel")}
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {PRESET_AMOUNTS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => handlePresetClick(preset)}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                  !isCustom && amount === preset
                    ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                    : "bg-card text-muted-foreground border-border hover:border-emerald-300 hover:bg-emerald-50"
                }`}
              >
                {preset} €
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setIsCustom(true);
                setPaymentStatus("idle");
              }}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all border-2 ${
                isCustom
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                  : "bg-card text-muted-foreground border-border hover:border-emerald-300 hover:bg-emerald-50"
              }`}
            >
              {t("membership.customAmount")}
            </button>
          </div>

          {isCustom && (
            <div className="relative">
              <input
                type="text"
                inputMode="decimal"
                value={customAmount}
                onChange={handleCustomChange}
                placeholder="0.00"
                className="w-full px-4 py-2.5 border border-input bg-background rounded-lg focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 text-lg font-mono"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                €
              </span>
            </div>
          )}
        </div>

        {/* PayPal Button */}
        <div className="min-h-[40px]">
          {getAmount() > 0 ? (
            <PayPalButton
              amount={getAmount()}
              currency="EUR"
              onSuccess={handleSuccess}
              onError={handleError}
              disabled={paymentStatus === "success"}
            />
          ) : (
            <div className="p-3 bg-muted rounded-lg text-center text-muted-foreground text-sm">
              {t("membership.amountLabel")}
            </div>
          )}
        </div>

        {/* Payment Status Messages */}
        {paymentStatus === "success" && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-emerald-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-emerald-800 text-sm font-medium">
              {paymentMessage}
            </span>
          </div>
        )}

        {paymentStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-red-600 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-red-800 text-sm font-medium">
              {paymentMessage}
            </span>
          </div>
        )}

        {/* Security Note */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <span>Zahlung erfolgt über PayPals sichere Server</span>
        </div>
      </div>
    </section>
  );
};

export default MembershipInstructions;
