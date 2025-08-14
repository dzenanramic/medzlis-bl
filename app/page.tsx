"use client";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Home() {
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <main className="bg-gradient-to-br from-white to-gray-50 text-gray-800">
      {/* Enhanced Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              transform: `translateY(${offset * 0.3}px)`,
              willChange: "transform",
            }}
          >
            <Image
              src="/hero-mosque2.jpg"
              alt="Ferhadija"
              fill
              className="object-cover object-bottom brightness-40"
              priority
            />
          </div>
          {/* <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 to-green-900/40" /> */}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl">
          <div className="mb-6">
            {/* <div className="w-20 h-1 bg-green-400 mx-auto mb-6 rounded-full"></div> */}
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 text-white drop-shadow-lg">
              Medžlis Islamske Zajednice Banja Luka
            </h1>
            <p className="text-lg md:text-xl text-gray-100 max-w-2xl mx-auto leading-relaxed">
              Dobrodošli na zvaničnu stranicu — informacije, događaji i
              aktivnosti naše zajednice.
            </p>
          </div>

          {/* <div className="mt-12 flex gap-4 justify-center">
            <button className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
              Aktuelnosti
            </button>
            <button className="px-8 py-3 bg-transparent border-2 border-green-500 text-green-100 hover:bg-green-900/40 font-medium rounded-full transition-all duration-300">
              Kontaktirajte nas
            </button>
          </div> */}
        </div>

        {/* Scrolling indicator */}
        {/* <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 rounded-full border-2 border-green-300 flex justify-center">
            <div className="w-1 h-3 bg-green-300 mt-2 rounded-full"></div>
          </div>
        </div> */}
      </section>

      {/* Enhanced News Section */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-3 relative inline-block">
            Najnovije Vijesti
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-green-500 rounded-full"></span>
          </h2>
          <p className="text-gray-600 max-w-xl mx-auto mt-4">
            Pratite najnovije dešavanja i aktivnosti u našoj zajednici
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl overflow-hidden border border-gray-100 transition-all duration-500 transform hover:-translate-y-2"
            >
              <div className="relative h-60 overflow-hidden">
                <Image
                  src={`/interior.png`}
                  alt="Vijest"
                  fill
                  className="object-cover w-full transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-green-600 text-white text-sm px-3 py-1 rounded-full">
                  Novost
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <span>15.08.2025</span>
                  {/* <span className="mx-2">•</span>
                  <span>3 min čitanja</span> */}
                </div>
                <h3 className="text-xl font-bold mb-3 group-hover:text-green-700 transition-colors">
                  Naslov vijesti {item}
                </h3>
                <p className="text-gray-600 mb-5">
                  Kratki opis događaja ili obavijesti koja se odnosi na našu
                  zajednicu...
                </p>
                <button className="text-green-700 font-semibold hover:underline flex items-center gap-2 group">
                  Pročitaj više
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Prayer Times with Gradient */}
      <section className="py-20 px-4 bg-gradient-to-r from-green-700 to-emerald-800 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-3">Vremena Namaza</h2>
            <p className="text-green-100 max-w-xl mx-auto">
              Trenutna vremena obavljanja dnevnih namaza za Banja Luku
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {[
              { name: "Zora", time: "05:12", icon: "🌅" },
              { name: "Sabah", time: "05:30", icon: "🌄" },
              { name: "Podne", time: "12:45", icon: "☀️" },
              { name: "Ikindija", time: "16:15", icon: "⛅" },
              { name: "Akšam", time: "19:45", icon: "🌇" },
              { name: "Jacija", time: "21:00", icon: "🌙" },
            ].map((prayer) => (
              <div
                key={prayer.name}
                className="bg-white/10 backdrop-blur-sm p-5 rounded-xl border border-white/20 flex flex-col items-center justify-center transition-all hover:bg-white/20 hover:border-white/40"
              >
                <span className="text-2xl mb-2">{prayer.icon}</span>
                <h3 className="font-semibold text-lg">{prayer.name}</h3>
                <p className="text-2xl font-light mt-2 text-green-300">
                  {prayer.time}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-green-200 text-sm">
              * Vremena se mijenjaju tokom godine
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section with Map */}
      <section className="py-20 px-4 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Kontaktirajte nas</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Imate pitanja ili želite saznati više o našim aktivnostima? Javite
              nam se!
            </p>

            <div className="space-y-5">
              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Telefon</h3>
                  <p className="text-gray-600 mt-1">+387 51 123 456</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Email</h3>
                  <p className="text-gray-600 mt-1">info@medzlis-bl.ba</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="bg-green-100 p-3 rounded-full mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-green-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Adresa</h3>
                  <p className="text-gray-600 mt-1">Ferhadija 77, Banja Luka</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-xl border border-gray-200 h-96">
            {/* Map placeholder */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3574.013574009538!2d17.1872272!3d44.767456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475e0318a3a01765%3A0x52529e0dcfb0278f!2sD%C5%BEamija%20Ferhadija!5e1!3m2!1shr!2sba!4v1755167738426!5m2!1shr!2sba"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">
                Medžlis Banja Luka
              </h3>
              <p className="text-gray-400">
                Centar islamske zajednice u Banja Luci. Promovišemo vrijednosti
                islama i služimo zajednici.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Brzi linkovi</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    O nama
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Vjerske službe
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Edukacija
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-green-400 transition-colors"
                  >
                    Humanitarni rad
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Radno vrijeme</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Ponedjeljak - Petak: 08h - 16h</li>
                <li>Subota: 09h - 13h</li>
                <li>Nedjelja: Zatvoreno</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Pratite nas</h4>
              <div className="flex space-x-4">
                {["Facebook", "Instagram", "YouTube"].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="bg-gray-800 hover:bg-green-600 p-2 rounded-full transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400"></div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
            <p>
              © {new Date().getFullYear()} Medžlis Islamske Zajednice Banja
              Luka. Sva prava zadržana.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
