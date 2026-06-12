import { NextRequest, NextResponse } from "next/server";
import { getPrayerTimes } from "@/lib/prayerTimes";

/**
 * GET /api/prayer-times
 *
 * Query params (all optional):
 *   lat, lng     — coordinates (default: Landsberg am Lech)
 *   method       — AlAdhan method ID (default: 3 = Muslim World League)
 *   tz           — timezone (default: Europe/Berlin)
 *   city, country — fallback city lookup
 *
 * Example:
 *   /api/prayer-times?lat=48.0481&lng=10.8828&method=3
 *   /api/prayer-times?city=Landsberg+am+Lech&country=Germany
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const lat = searchParams.get("lat");
  const lng = searchParams.get("lng");
  const method = searchParams.get("method");
  const tz = searchParams.get("tz");
  const city = searchParams.get("city");
  const country = searchParams.get("country");

  try {
    const result = await getPrayerTimes({
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      method: method ? parseInt(method, 10) : undefined,
      tz: tz ?? undefined,
      city: city ?? undefined,
      country: country ?? undefined,
    });

    // Cache on CDN for 1 hour, allow stale for 1 hour
    return NextResponse.json(result, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch prayer times";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
