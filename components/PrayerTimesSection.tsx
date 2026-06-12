import { usePrayerTimes } from "@/hooks/usePrayerTimes";
import { useTranslation } from "react-i18next";
import { Sunrise, Sun, CloudSun, Sunset, Moon } from "lucide-react";

const PRAYER_NAMES = [
  { key: "prayers.names.fajr", icon: Sunrise },
  { key: "prayers.names.dhuhr", icon: Sun },
  { key: "prayers.names.asr", icon: CloudSun },
  { key: "prayers.names.maghrib", icon: Sunset },
  { key: "prayers.names.isha", icon: Moon },
];

export default function PrayerTimesSection() {
  const { t } = useTranslation();
  const { prayerTimes, date, loading, error } = usePrayerTimes();

  return (
    <section className="py-16 px-4 bg-emerald-800 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold tracking-tight mb-3">
            {t("prayers.title")}
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto">
            {t("prayers.description")}
          </p>
          {date && <p className="text-emerald-200 mt-2 text-sm">{date}</p>}
        </div>
        {loading ? (
          <div className="text-center text-emerald-200">
            {t("prayers.loading")}
          </div>
        ) : error ? (
          <div className="text-center text-red-300">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {PRAYER_NAMES.map((prayer, i) => {
              const Icon = prayer.icon;
              return (
                <div
                  key={prayer.key}
                  className="bg-white/8 p-5 rounded-lg border border-white/10 flex flex-col items-center hover:bg-white/12 hover:border-white/30 transition-all"
                >
                  <Icon
                    className="w-7 h-7 text-emerald-200 mb-2"
                    strokeWidth={1.5}
                  />
                  <h3 className="font-semibold text-lg">{t(prayer.key)}</h3>
                  <p className="text-xl font-normal mt-1 text-emerald-200">
                    {prayerTimes ? prayerTimes[i] : "--:--"}
                  </p>
                </div>
              );
            })}
          </div>
        )}
        <p className="mt-8 text-emerald-200 text-sm text-center">
          {t("prayers.footnote")}
        </p>
      </div>
    </section>
  );
}
