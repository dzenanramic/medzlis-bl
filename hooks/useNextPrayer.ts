import { useEffect, useState } from "react";
import { usePrayerTimes } from "./usePrayerTimes";

const PRAYER_NAMES = [
  { name: "Zora", icon: "🌅" },
  { name: "Sabah", icon: "🌄" },
  { name: "Podne", icon: "☀️" },
  { name: "Ikindija", icon: "⛅" },
  { name: "Akšam", icon: "🌇" },
  { name: "Jacija", icon: "🌙" },
];

export function useNextPrayer() {
  const { prayerTimes } = usePrayerTimes();
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
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
          name: PRAYER_NAMES[i].name,
          time: prayerTimes[i],
          icon: PRAYER_NAMES[i].icon,
        });
        return;
      }
    }
    setNextPrayer({
      name: PRAYER_NAMES[0].name,
      time: prayerTimes[0],
      icon: PRAYER_NAMES[0].icon,
    });
  }, [prayerTimes]);

  return nextPrayer;
}
