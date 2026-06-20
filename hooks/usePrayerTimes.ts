import { useEffect, useState } from "react";

export interface PrayerTimesData {
  vakat: string[];
  datum?: string[];
}

/** Ordered list of the 5 obligatory prayers as returned by AlAdhan */
const PRAYER_ORDER = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"];

/**
 * Fetch prayer times directly from the AlAdhan API (no Next.js proxy needed).
 * Defaults to Landsberg am Lech, Germany.
 */
async function fetchPrayerTimesFromAlAdhan(): Promise<{
  times: string[];
  readableDate: string;
}> {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, "0");
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const yyyy = now.getFullYear();
  const dateStr = `${dd}-${mm}-${yyyy}`;

  // Landsberg am Lech coordinates
  const lat = 48.0481;
  const lng = 10.8828;
  const method = 3; // Muslim World League
  const tz = "Europe/Berlin";

  const url =
    `https://api.aladhan.com/v1/timings/${dateStr}` +
    `?latitude=${lat}&longitude=${lng}` +
    `&method=${method}` +
    `&timezone=${encodeURIComponent(tz)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Greška pri dohvatanju podataka");

  const json = await res.json();
  const timings: Record<string, string> = json.data.timings;

  // Extract only the 5 obligatory prayers in order
  const times = PRAYER_ORDER.map((name) => timings[name]).filter(Boolean);

  // Build readable date
  const greg = json.data.date.gregorian;
  const weekday = greg.weekday?.en ?? "";
  const readableDate = weekday ? `${weekday}, ${greg.date}` : greg.date;

  return { times, readableDate };
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
        const { times, readableDate } = await fetchPrayerTimesFromAlAdhan();
        if (cancelled) return;

        setPrayerTimes(times);
        setDate(readableDate);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: { times, readableDate },
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
