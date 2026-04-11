"use client";

import { ReactNode, useEffect } from "react";
import i18n from "@/lib/i18n/client";
import {
  AppLanguage,
  fallbackLanguage,
  supportedLanguages,
} from "@/lib/i18n/resources";

const LANGUAGE_STORAGE_KEY = "app-language";

export default function I18nProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const storedLanguage = localStorage.getItem(
      LANGUAGE_STORAGE_KEY,
    ) as AppLanguage | null;

    const nextLanguage =
      storedLanguage && supportedLanguages.includes(storedLanguage)
        ? storedLanguage
        : fallbackLanguage;

    if (i18n.language !== nextLanguage) {
      i18n.changeLanguage(nextLanguage);
    }

    document.documentElement.lang = nextLanguage;

    const handleLanguageChange = (language: string) => {
      document.documentElement.lang = language;
      localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    };

    i18n.on("languageChanged", handleLanguageChange);

    return () => {
      i18n.off("languageChanged", handleLanguageChange);
    };
  }, []);

  return <>{children}</>;
}
