"use client";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { fallbackLanguage, resources } from "./resources";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: fallbackLanguage,
    fallbackLng: fallbackLanguage,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });
}

export default i18n;
