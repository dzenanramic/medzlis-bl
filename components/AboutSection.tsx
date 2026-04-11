"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

type AboutSectionProps = {
  compact?: boolean;
};

export default function AboutSection({ compact = false }: AboutSectionProps) {
  const { t } = useTranslation();

  return (
    <section
      className={
        compact
          ? "py-14 pb-10 px-4 max-w-7xl mx-auto"
          : "py-20 pb-10 px-4 max-w-7xl mx-auto"
      }
    >
      <div className="rounded-3xl bg-gradient-to-br from-emerald-900 via-green-800 to-emerald-700 p-6 text-white shadow-xl md:p-10">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <p className="mb-3 inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide uppercase">
              {t("about.badge")}
            </p>
            <h2 className="text-3xl font-bold leading-tight md:text-4xl">
              {t("about.title")}
            </h2>
            <p className="mt-4 text-green-50 leading-relaxed md:text-lg">
              {t("about.description")}
            </p>
            {!compact && (
              <Link
                href="/about-us"
                className="mt-6 inline-flex rounded-xl bg-white px-5 py-2.5 font-semibold text-green-900 transition hover:bg-green-50"
              >
                {t("about.cta")}
              </Link>
            )}
          </div>

          {/* <div className="rounded-2xl border border-white/20 bg-black/10 p-5 backdrop-blur-sm">
            <h3 className="text-lg font-semibold">{t("about.valuesTitle")}</h3>
            <ul className="mt-3 space-y-2 text-sm text-green-50 md:text-base">
              <li>{t("about.values.faith")}</li>
              <li>{t("about.values.community")}</li>
              <li>{t("about.values.education")}</li>
            </ul>
          </div> */}
        </div>
      </div>
    </section>
  );
}
