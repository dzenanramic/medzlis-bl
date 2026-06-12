"use client";

import { useTranslation } from "react-i18next";
import DonationForm from "@/components/DonationForm";

export default function DonationsPage() {
  const { t } = useTranslation();

  return (
    <main className="bg-gradient-to-br from-white to-gray-50 text-gray-800 font-sans pt-16">
      <section className="py-10 px-2 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black-700">
            {t("donations.title")}
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            {t("donations.description")}
          </p>
        </div>

        <DonationForm />
      </section>
    </main>
  );
}
