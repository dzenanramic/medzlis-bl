"use client";

import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-emerald-400">
              Džemat Landsberg am Lech
            </h3>
            <p className="text-stone-400 leading-relaxed">
              {t("footer.description")}
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.quickLinks")}</h4>
            <ul className="space-y-2 text-stone-400">
              {[
                { key: "links.about", href: "/about-us" },
                { key: "links.news", href: "/news" },
              ].map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {t(`footer.${item.key}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.impressum")}</h4>
            <ul className="space-y-2 text-stone-400">
              <li className="font-medium text-white">
                {t("footer.impressumName")}
              </li>
              <li>{t("footer.impressumAddress")}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-10 pt-6 text-center text-stone-500 text-sm">
          © {new Date().getFullYear()} Džemat Landsberg am Lech.{" "}
          {t("footer.rights")}
        </div>
      </div>
    </footer>
  );
}
