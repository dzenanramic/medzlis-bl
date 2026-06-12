"use client";

import { useTranslation } from "react-i18next";

/**
 * iRaiser Donation Form Wrapper
 *
 * Kada klijent dostavi embed kod sa iRaiser platforme,
 * zamijeniti iframe ispod sa stvarnim kodom.
 *
 * iRaiser obično daje:
 * 1. Iframe embed code
 * 2. JavaScript widget code
 *
 * Primjer iframe koda:
 * <iframe src="https://www.iraiser.eu/...&language=bs" ...></iframe>
 *
 * Za višejezičnost, iRaiser podržava &language= parametar:
 * - bs (Bosanski)
 * - de (Njemački)
 */

const IRAISER_EMBED_URL = process.env.NEXT_PUBLIC_IRAISER_EMBED_URL ?? "";

const DonationForm: React.FC = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language === "de" ? "de" : "bs";

  if (!IRAISER_EMBED_URL) {
    return (
      <div className="p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M8 12l4 4m0 0l4-4m-4 4V4"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          {t("donations.embedInstruction")}
        </h3>
        <p className="text-sm text-gray-400 max-w-md mx-auto">
          {t("donations.embedPlaceholder")}
        </p>
      </div>
    );
  }

  // Add language parameter to iRaiser URL
  const embedUrl = IRAISER_EMBED_URL.includes("?")
    ? `${IRAISER_EMBED_URL}&language=${currentLang}`
    : `${IRAISER_EMBED_URL}?language=${currentLang}`;

  return (
    <div className="w-full">
      <iframe
        src={embedUrl}
        title="iRaiser Donation Form"
        className="w-full min-h-[600px] border-0 rounded-2xl"
        allow="payment"
        loading="lazy"
      />
    </div>
  );
};

export default DonationForm;
