export default function PrayerTimesSection() {
  const prayers = [
    { name: "Zora", time: "05:12", icon: "🌅" },
    { name: "Sabah", time: "05:30", icon: "🌄" },
    { name: "Podne", time: "12:45", icon: "☀️" },
    { name: "Ikindija", time: "16:15", icon: "⛅" },
    { name: "Akšam", time: "19:45", icon: "🌇" },
    { name: "Jacija", time: "21:00", icon: "🌙" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-r from-green-700 via-emerald-700 to-green-800 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3">Vremena Namaza</h2>
          <p className="text-green-100 max-w-xl mx-auto">
            Trenutna vremena obavljanja dnevnih namaza za Banja Luku
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {prayers.map((prayer) => (
            <div
              key={prayer.name}
              className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 flex flex-col items-center hover:bg-white/20 hover:border-white/40 transition-all"
            >
              <span className="text-3xl mb-2">{prayer.icon}</span>
              <h3 className="font-semibold text-lg">{prayer.name}</h3>
              <p className="text-2xl font-light mt-1 text-green-200">
                {prayer.time}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-10 text-green-200 text-sm text-center">
          * Vremena se mijenjaju tokom godine
        </p>
      </div>
    </section>
  );
}
