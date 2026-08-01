import { useEffect, useState } from "react";
import i18n from "@/lib/i18n/client";
import { supabase } from "@/lib/supabaseClient";

export interface PrayerTimesData {
  vakat: string[];
  datum?: string[];
}

/** Ordered list of the 5 obligatory prayers */
const PRAYER_ORDER = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const DEFAULT_SLUG = "landsberg-am-lech";

/**
 * Format ISO date string (YYYY-MM-DD) → readable locale date.
 */
function formatReadableDate(isoDate: string, lang: string): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const dateObj = new Date(y, m - 1, d);
  const locale = lang === "de" ? "de-DE" : "bs-BA";
  return dateObj.toLocaleDateString(locale, {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Fetch prayer times from Supabase (synced daily from vaktija.eu).
 * Falls back to an empty state if Supabase is not configured.
 */
async function fetchPrayerTimesFromSupabase(): Promise<{
  times: string[];
  rawDate: string;
}> {
  if (!supabase) {
    throw new Error("Supabase not configured");
  }

  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  const { data, error } = await supabase
    .from("prayer_times")
    .select("fajr, dhuhr, asr, maghrib, isha, date")
    .eq("slug", DEFAULT_SLUG)
    .eq("date", today)
    .maybeSingle();

  if (error) throw new Error(error.message);
  if (!data) throw new Error(`No prayer times for ${today}`);

  const times = PRAYER_ORDER.map((key) => {
    const val = (data as Record<string, string>)[key];
    // Strip seconds: "04:01:00" → "04:01"
    return val ? val.slice(0, 5) : "";
  }).filter(Boolean);

  return { times, rawDate: (data as Record<string, string>).date };
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

      const today = new Date().toISOString().split("T")[0];
      const cacheKey = `prayerTimes_v2_${today}`;

      // Check localStorage cache (valid until midnight)
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        try {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          // Cache valid until next midnight
          const midnight = new Date(today + "T23:59:59").getTime();
          if (now < midnight && now - timestamp < 60 * 60 * 1000) {
            if (!cancelled) {
              setPrayerTimes(data.times);
              setRawDate(data.rawDate);
              setLoading(false);
            }
            return;
          }
        } catch {
          // Invalid cache, refetch
        }
      }

      try {
        const { times, rawDate } = await fetchPrayerTimesFromSupabase();
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
