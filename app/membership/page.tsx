"use client";

import { useTranslation } from "react-i18next";

export default function MembershipPage() {
  const { t } = useTranslation();

  return (
    <main className="text-foreground font-sans pt-16">
      <section className="py-10 px-2 max-w-2xl mx-auto text-center">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4 text-foreground">
          {t("nav.membership")}
        </h1>
        <p className="text-muted-foreground">
          Obrazac za učlanjenje u izradi. Bit će dostupan uskoro.
        </p>
      </section>
    </main>
  );
}
