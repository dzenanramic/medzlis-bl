import { useEffect, useState } from "react";
import i18n from "@/lib/i18n/client";

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
function formatReadableDate(rawDate: string, lang: string): string {
  const dateParts = rawDate.split("-"); // DD-MM-YYYY
  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);
  const dateObj = new Date(year, month, day);
  const locale = lang === "de" ? "de-DE" : "bs-BA";
  return dateObj.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

async function fetchPrayerTimesFromAlAdhan(): Promise<{
  times: string[];
  rawDate: string;
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

  // Return raw gregorian date string (DD-MM-YYYY)
  const greg = json.data.date.gregorian;

  return { times, rawDate: greg.date };
}

export function usePrayerTimes() {
  const [prayerTimes, setPrayerTimes] = useState<string[] | null>(null);
  const [rawDate, setRawDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Compute readable date based on current language
  const lang = i18n.language;
  const date = rawDate ? formatReadableDate(rawDate, lang) : null;

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
          if (!cancelled) {
            setPrayerTimes(data.times);
            setRawDate(data.rawDate);
            setLoading(false);
          }
          return;
        }
      }

      try {
        const { times, rawDate } = await fetchPrayerTimesFromAlAdhan();
        if (cancelled) return;

        setPrayerTimes(times);
        setRawDate(rawDate);

        localStorage.setItem(
          cacheKey,
          JSON.stringify({
            data: { times, rawDate },
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
