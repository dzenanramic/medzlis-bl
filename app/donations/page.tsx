"use client";

import { useTranslation } from "react-i18next";
import DonationForm from "@/components/DonationForm";

export default function DonationsPage() {
  const { t } = useTranslation();

  return (
    <main className="text-foreground font-sans pt-16">
      <section className="py-10 px-2 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-foreground">
            {t("donations.title")}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {t("donations.description")}
          </p>
        </div>

        <DonationForm />
      </section>
    </main>
  );
}
