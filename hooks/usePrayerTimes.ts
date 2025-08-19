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
    async function fetchPrayerTimes() {
      setLoading(true);
      setError(null);

      const cacheKey = "prayerTimesCache";
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          setPrayerTimes(data.vakat);
          setDate(data.datum?.[1] || null);
          setLoading(false);
          return;
        }
      }

      try {
        const res = await fetch("https://api.vaktija.ba/vaktija/v1/1");
        if (!res.ok) throw new Error("Greška pri dohvatanju podataka");
        const data = await res.json();
        setPrayerTimes(data.vakat);
        setDate(data.datum?.[1] || null);
        localStorage.setItem(
          cacheKey,
          JSON.stringify({ data, timestamp: Date.now() })
        );
      } catch (e: unknown) {
        if (typeof e === "object" && e && "message" in e) {
          setError((e as { message?: string }).message || "Nepoznata greška");
        } else {
          setError("Nepoznata greška");
        }
      } finally {
        setLoading(false);
      }
    }
    fetchPrayerTimes();
  }, []);

  return { prayerTimes, date, loading, error };
}
