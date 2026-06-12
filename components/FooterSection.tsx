"use client";

import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer className="bg-stone-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
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
                { label: "O nama", href: "/about-us" },
                // { label: "Vjerske službe", href: "/vjerske-sluzbe" },
                { label: "Vijesti", href: "/news" },
                { label: "Humanitarni rad", href: "/humanitarian-work" },
                { label: "Članarina", href: "/membership" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-emerald-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.workingHours")}</h4>
            <ul className="space-y-2 text-stone-400">
              <li>Pon - Pet: 08h - 16h</li>
              <li>Sub: 09h - 13h</li>
              <li>Ned: Zatvoreno</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">{t("footer.followUs")}</h4>
            <div className="flex space-x-4">
              <a
                key="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/profile.php?id=100079529330378"
                className="bg-stone-800 hover:bg-emerald-700 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                key="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/medzlisbl/"
                className="bg-stone-800 hover:bg-emerald-700 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                key="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@medzlisbl"
                className="bg-stone-800 hover:bg-emerald-700 p-2 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
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
