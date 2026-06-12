import { useEffect, useState } from "react";
import { usePrayerTimes } from "./usePrayerTimes";

const PRAYER_NAMES = [
  { key: "prayers.names.fajr", icon: "🌄" },
  { key: "prayers.names.dhuhr", icon: "☀️" },
  { key: "prayers.names.asr", icon: "⛅" },
  { key: "prayers.names.maghrib", icon: "🌇" },
  { key: "prayers.names.isha", icon: "🌙" },
];

export function useNextPrayer() {
  const { prayerTimes } = usePrayerTimes();
  const [nextPrayer, setNextPrayer] = useState<{
    key: string;
    time: string;
    icon: string;
  } | null>(null);

  useEffect(() => {
    if (!prayerTimes) return;

    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    for (let i = 0; i < prayerTimes.length; i++) {
      //   const [h, m] = prayerTimes[i].split(":").map(Number);
      const prayerTime = new Date(today + "T" + prayerTimes[i] + ":00");
      if (now < prayerTime) {
        setNextPrayer({
          key: PRAYER_NAMES[i].key,
          time: prayerTimes[i],
          icon: PRAYER_NAMES[i].icon,
        });
        return;
      }
    }
    setNextPrayer({
      key: PRAYER_NAMES[0].key,
      time: prayerTimes[0],
      icon: PRAYER_NAMES[0].icon,
    });
  }, [prayerTimes]);

  return nextPrayer;
}
