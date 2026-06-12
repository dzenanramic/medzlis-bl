/**
 * Prayer Times — AlAdhan API (server-safe)
 *
 * Two methods:
 *   1. getPrayerTimesByCoords() — primary, uses lat/lng
 *   2. getPrayerTimesByCity()   — fallback, uses city name
 *
 * Defaults to Landsberg am Lech, Germany.
 * Calculation method: Muslim World League (3) — configurable.
 *
 * AlAdhan docs: https://aladhan.com/prayer-times-api
 */

// ─── Types ──────────────────────────────────────────────────────────────────

export interface PrayerTimeEntry {
  /** i18n key or label, e.g. "Fajr" */
  name: string;
  /** 24‑hour time string, e.g. "04:32" */
  time: string;
  /** 12‑hour time string, e.g. "04:32 AM" */
  time12: string;
}

export interface PrayerTimesResult {
  /** Gregorian date, e.g. "12-06-2026" */
  date: string;
  /** Hijri date, e.g. "01-01-1448" */
  hijri: string;
  /** Readable weekday + date, e.g. "Friday, 12 Jun 2026" */
  readableDate: string;
  /** Ordered prayer times */
  times: PrayerTimeEntry[];
  /** Calculation method used */
  method: string;
  /** ISO timestamp of when this data was fetched */
  fetchedAt: string;
}

// ─── Constants ──────────────────────────────────────────────────────────────

const ALADHAN_BASE = "https://api.aladhan.com/v1";

/** Default coordinates: Landsberg am Lech, Germany */
export const DEFAULT_COORDS = {
  lat: 48.0481,
  lng: 10.8828,
};

export const DEFAULT_CITY = {
  city: "Landsberg am Lech",
  country: "Germany",
};

export const DEFAULT_TIMEZONE = "Europe/Berlin";

/**
 * Prayer names in the order AlAdhan returns them.
 * Only the five obligatory prayers are kept.
 */
const PRAYER_MAP: Record<string, string> = {
  Fajr: "Fajr",
  Dhuhr: "Dhuhr",
  Asr: "Asr",
  Maghrib: "Maghrib",
  Isha: "Isha",
};

// ─── Helpers ────────────────────────────────────────────────────────────────

/** Ensure date is in DD-MM-YYYY format for the API. */
function formatDate(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}-${m}-${y}`;
}

/** Convert 24h "HH:MM" to 12h "HH:MM AM/PM". */
function to12h(time24: string): string {
  const [h, m] = time24.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${String(h12).padStart(2, "0")}:${String(m).padStart(2, "0")} ${period}`;
}

/** Map raw AlAdhan timings object → PrayerTimeEntry[] (5 prayers only). */
function mapTimings(timings: Record<string, string>): PrayerTimeEntry[] {
  const entries: PrayerTimeEntry[] = [];
  for (const [key, time24] of Object.entries(timings)) {
    if (PRAYER_MAP[key]) {
      entries.push({
        name: PRAYER_MAP[key],
        time: time24,
        time12: to12h(time24),
      });
    }
  }
  return entries;
}

/** Build a readable date string like "Friday, 12 Jun 2026". */
function buildReadableDate(dateObj: {
  gregorian: { date: string; weekday?: { en?: string } };
  hijri: { date: string };
}): { date: string; hijri: string; readable: string } {
  const greg = dateObj.gregorian;
  const hij = dateObj.hijri;
  const weekday = greg.weekday?.en ?? "";
  return {
    date: greg.date,
    hijri: hij.date,
    readable: weekday ? `${weekday}, ${greg.date}` : greg.date,
  };
}

// ─── Fetch wrapper ──────────────────────────────────────────────────────────

async function fetchTimings(url: string): Promise<PrayerTimesResult> {
  const res = await fetch(url, {
    next: { revalidate: 86400 }, // 24 h — Next.js built‑in cache
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`AlAdhan API error (${res.status}): ${body}`);
  }

  const json = await res.json();
  const data = json.data;

  const { date, hijri, readable } = buildReadableDate(data.date);

  return {
    date,
    hijri,
    readableDate: readable,
    times: mapTimings(data.timings),
    method: data.meta?.method?.name ?? `Method ${data.meta?.method?.id ?? "?"}`,
    fetchedAt: new Date().toISOString(),
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────

/**
 * Fetch prayer times by geographic coordinates.
 *
 * @param lat      Latitude (default: Landsberg am Lech)
 * @param lng      Longitude (default: Landsberg am Lech)
 * @param method   AlAdhan calculation method (default: 3 = Muslim World League)
 * @param tz       Timezone string (default: Europe/Berlin)
 * @param date     Date object (default: today)
 */
export async function getPrayerTimesByCoords(
  lat: number = DEFAULT_COORDS.lat,
  lng: number = DEFAULT_COORDS.lng,
  method: number = 3,
  tz: string = DEFAULT_TIMEZONE,
  date: Date = new Date(),
): Promise<PrayerTimesResult> {
  const dateStr = formatDate(date);
  const url =
    `${ALADHAN_BASE}/timings/${dateStr}` +
    `?latitude=${lat}&longitude=${lng}` +
    `&method=${method}` +
    `&timezone=${encodeURIComponent(tz)}`;

  return fetchTimings(url);
}

/**
 * Fallback: fetch prayer times by city name.
 *
 * @param city     City name (default: "Landsberg am Lech")
 * @param country  Country name (default: "Germany")
 * @param method   AlAdhan calculation method (default: 3)
 * @param tz       Timezone string (default: Europe/Berlin)
 * @param date     Date object (default: today)
 */
export async function getPrayerTimesByCity(
  city: string = DEFAULT_CITY.city,
  country: string = DEFAULT_CITY.country,
  method: number = 3,
  tz: string = DEFAULT_TIMEZONE,
  date: Date = new Date(),
): Promise<PrayerTimesResult> {
  const dateStr = formatDate(date);
  const url =
    `${ALADHAN_BASE}/timingsByCity/${dateStr}` +
    `?city=${encodeURIComponent(city)}` +
    `&country=${encodeURIComponent(country)}` +
    `&method=${method}` +
    `&timezone=${encodeURIComponent(tz)}`;

  return fetchTimings(url);
}

/**
 * Smart fetch: tries coordinates first, falls back to city lookup.
 */
export async function getPrayerTimes(
  options: {
    lat?: number;
    lng?: number;
    method?: number;
    tz?: string;
    date?: Date;
    city?: string;
    country?: string;
  } = {},
): Promise<PrayerTimesResult> {
  const {
    lat = DEFAULT_COORDS.lat,
    lng = DEFAULT_COORDS.lng,
    method = 3,
    tz = DEFAULT_TIMEZONE,
    date,
    city,
    country,
  } = options;

  try {
    return await getPrayerTimesByCoords(lat, lng, method, tz, date);
  } catch {
    // Coordinate lookup failed — try city fallback
    return await getPrayerTimesByCity(
      city ?? DEFAULT_CITY.city,
      country ?? DEFAULT_CITY.country,
      method,
      tz,
      date,
    );
  }
}
