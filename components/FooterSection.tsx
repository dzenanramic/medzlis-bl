import Link from "next/link";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function FooterSection() {
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-black text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-green-400">
              Medžlis Banja Luka
            </h3>
            <p className="text-gray-400 leading-relaxed">
              Centar islamske zajednice u Banja Luci. Promovišemo vrijednosti
              islama i služimo zajednici.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Brzi linkovi</h4>
            <ul className="space-y-2 text-gray-400">
              {[
                { label: "O nama", href: "/about-us" },
                // { label: "Vjerske službe", href: "/vjerske-sluzbe" },
                { label: "Vijesti", href: "/news" },
                { label: "Humanitarni rad", href: "/humanitarian-work" },
                { label: "Članarina", href: "/membership" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="hover:text-green-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Radno vrijeme</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Pon - Pet: 08h - 16h</li>
              <li>Sub: 09h - 13h</li>
              <li>Ned: Zatvoreno</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Pratite nas</h4>
            <div className="flex space-x-4">
              <a
                key="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.facebook.com/profile.php?id=100079529330378"
                className="bg-gray-800 hover:bg-blue-600 p-2 rounded-full transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-5 h-5" />
              </a>
              <a
                key="Instagram"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.instagram.com/medzlisbl/"
                className="bg-gray-800 hover:bg-pink-500 p-2 rounded-full transition-colors"
                aria-label="Instagram"
              >
                <FaInstagram className="w-5 h-5" />
              </a>
              <a
                key="YouTube"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/@medzlisbl"
                className="bg-gray-800 hover:bg-red-600 p-2 rounded-full transition-colors"
                aria-label="YouTube"
              >
                <FaYoutube className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-500 text-sm">
          © {new Date().getFullYear()} Medžlis Islamske Zajednice Banja Luka.
          Sva prava zadržana.
        </div>
      </div>
    </footer>
  );
}
