import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-2xl font-bold text-green-700">
        Medžlis Banja Luka
      </Link>
      <nav className="space-x-6">
        <Link href="/news" className="text-gray-700 hover:text-green-700">
          Vijesti
        </Link>
        <Link
          href="/prayer-times"
          className="text-gray-700 hover:text-green-700"
        >
          Vaktija
        </Link>
        <Link href="/contact" className="text-gray-700 hover:text-green-700">
          Kontakt
        </Link>
        {/* Add more links as needed */}
      </nav>
    </header>
  );
}
