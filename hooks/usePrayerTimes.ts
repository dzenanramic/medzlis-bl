import { useEffect, useState } from "react";

export interface PrayerTimesData {
  vakat: string[];
  datum?: string[];
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<string[] | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchPrayerTimes() {
      setLoading(true);
      setError(null);

      const cacheKey = "prayerTimesAlAdhan";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          // 1 hour cache
          if (!cancelled) {
            setPrayerTimes(data.times);
            setDate(data.readableDate ?? data.date);
            setLoading(false);
          }
          return;
        }
      }

      try {
        const res = await fetch("/api/prayer-times?method=3");
        if (!res.ok) throw new Error("Greška pri dohvatanju podataka");

        const json = await res.json();
        if (cancelled) return;

        // Map AlAdhan response to the array format the component expects:
        // [Fajr, Dhuhr, Asr, Maghrib, Isha]
        const times = json.times.map((t: { time: string }) => t.time);

        setPrayerTimes(times);
        setDate(json.readableDate ?? json.date);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: { times, readableDate: json.readableDate, date: json.date },
            timestamp: Date.now(),
          }),
        );
      } catch (e: unknown) {
        if (!cancelled) {
          if (typeof e === "object" && e && "message" in e) {
            setError((e as { message?: string }).message || "Nepoznata greška");
          } else {
            setError("Nepoznata greška");
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPrayerTimes();

    return () => {
      cancelled = true;
    };
  }, []);

  return { prayerTimes, date, loading, error };
}
