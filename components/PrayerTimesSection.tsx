import { useEffect, useState } from "react";

const PRAYER_NAMES = [
  { name: "Zora", icon: "🌅" },
  { name: "Sabah", icon: "🌄" },
  { name: "Podne", icon: "☀️" },
  { name: "Ikindija", icon: "⛅" },
  { name: "Akšam", icon: "🌇" },
  { name: "Jacija", icon: "🌙" },
];

export default function PrayerTimesSection() {
  const [prayerTimes, setPrayerTimes] = useState<string[] | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPrayerTimes() {
      setLoading(true);
      setError(null);
      try {
        // 1 = Banja Luka
        const res = await fetch("https://api.vaktija.ba/vaktija/v1/1");
        if (!res.ok) throw new Error("Greška pri dohvatanju podataka");
        const data = await res.json();
        setPrayerTimes(data.vakat);
        setDate(data.datum?.[1] || null);
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

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3">Vremena Namaza</h2>
          <p className="text-green-100 max-w-xl mx-auto">
            Trenutna vremena obavljanja dnevnih namaza za Banja Luku
          </p>
          {date && <p className="text-green-200 mt-2 text-sm">{date}</p>}
        </div>
        {loading ? (
          <div className="text-center text-green-200">Učitavanje...</div>
        ) : error ? (
          <div className="text-center text-red-300">{error}</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {PRAYER_NAMES.map((prayer, i) => (
              <div
                key={prayer.name}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 hover:border-white/40 transition-all"
              >
                <span className="text-3xl mb-2">{prayer.icon}</span>
                <h3 className="font-semibold text-lg">{prayer.name}</h3>
                <p className="text-2xl font-light mt-1 text-green-200">
                  {prayerTimes ? prayerTimes[i] : "--:--"}
                </p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-10 text-green-200 text-sm text-center">
          * Vremena se mijenjaju tokom godine
        </p>
      </div>
    </section>
  );
}
