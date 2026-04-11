"use client";

import { useTranslation } from "react-i18next";
import i18n from "@/lib/i18n/client";
import { AppLanguage } from "@/lib/i18n/resources";

const languageOptions: {
  code: AppLanguage;
  labelKey: string;
  flag: string;
  shortLabel: string;
}[] = [
  { code: "bs", labelKey: "language.bosnian", flag: "🇧🇦", shortLabel: "BS" },
  { code: "de", labelKey: "language.german", flag: "🇩🇪", shortLabel: "DE" },
];

type LanguageSwitcherProps = {
  className?: string;
  lightOptions?: boolean;
  embedded?: boolean;
};

export default function LanguageSwitcher({
  className,
  lightOptions = false,
  embedded = false,
}: LanguageSwitcherProps) {
  const { t } = useTranslation();

  const activeLanguage =
    languageOptions.find((option) => i18n.language.startsWith(option.code)) ??
    languageOptions[0];

  const groupClassName = embedded
    ? "flex w-full items-center gap-1"
    : lightOptions
      ? "inline-flex w-full items-center gap-2"
      : "inline-flex items-center gap-1";

  const baseButtonClassName = embedded
    ? "flex h-8 flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-base font-medium transition"
    : lightOptions
      ? "inline-flex flex-1 items-center justify-center gap-2 rounded-lg px-2 py-2 text-base font-medium transition"
      : "inline-flex items-center gap-1 rounded-md px-2 py-1 text-base font-medium transition";

  const getStateClassName = (isActive: boolean) => {
    if (embedded) {
      return isActive
        ? "bg-black/10 dark:bg-white/20"
        : "opacity-70 hover:opacity-100";
    }

    if (lightOptions) {
      return isActive
        ? "bg-green-700 text-white"
        : "bg-white text-green-900 border border-green-200 hover:bg-green-100";
    }

    return isActive ? "bg-white/20 text-white" : "opacity-75 hover:opacity-100";
  };

  return (
    <div className={className} aria-label={t("language.label")}>
      <div
        className={groupClassName}
        role="group"
        aria-label={t("language.label")}
      >
        {languageOptions.map((option) => {
          const isActive = option.code === activeLanguage.code;

          return (
            <button
              key={option.code}
              type="button"
              onClick={() => i18n.changeLanguage(option.code)}
              title={t(option.labelKey)}
              aria-pressed={isActive}
              className={`${baseButtonClassName} ${getStateClassName(isActive)}`}
            >
              <span className="text-lg leading-none">{option.flag}</span>
              <span>{option.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
