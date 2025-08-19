const MembershipInstructions: React.FC = () => (
  <section className="py-10 px-2 max-w-4xl mx-auto">
    <div className="text-center mb-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-2 text-black-700">
        Upute za članarinu
      </h1>
      <p className="text-gray-500 italic">(plaćanje iz Bosne i Hercegovine)</p>
      {/* <div className="w-20 h-1 bg-green-400 rounded-full mx-auto mt-4"></div> */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Identitet Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            1. Identitet
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Puni pravni naziv (poslovni naziv):
            </span>
            <span className="block text-gray-900 font-medium">
              ISLAMSKA ZAJEDNICA U BOSNI I HERCEGOVINI
            </span>
            <span className="block text-gray-900 font-medium">
              MEDŽLIS ISLAMSKE ZAJEDNICE BANJA LUKA
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Pravni status:
            </span>
            <span className="block text-gray-900">
              Vjerska zajednica sa svojstvom pravnog lica
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Poreski broj organizacije:
            </span>
            <span className="block text-gray-900 font-mono">
              JIB - 4401638160004
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Zvanična adresa:
            </span>
            <span className="block text-gray-900">
              UL. KRALJA P. I KARAĐORĐEVIĆA 46
            </span>
            <span className="block text-gray-900">
              78000 BANJA LUKA, BOSNA I HERCEGOVINA
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Poštanska adresa:
            </span>
            <span className="block text-gray-900">
              UL. KRALJA P. I KARAĐORĐEVIĆA 46
            </span>
            <span className="block text-gray-900">
              78000 BANJA LUKA, BOSNA I HERCEGOVINA
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Kontakt osoba:
            </span>
            <span className="block text-gray-900">
              ISMIR HUSEDŽINOVIĆ, PREDSJEDNIK IZVRŠNOG ODBORA MEDŽLISA
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
                Broj telefona:
              </span>
              <span className="block text-gray-900">+387 (0)51 211 840</span>
            </div>
            <div>
              <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
                Broj mob:
              </span>
              <span className="block text-gray-900">+387 (0)62 763-904</span>
            </div>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              E-mail adresa:
            </span>
            <a
              href="mailto:medzlisbanjaluka@gmail.com"
              className="text-green-700 hover:text-green-900 font-medium inline-flex items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
              medzlisbanjaluka@gmail.com
            </a>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Web stranica:
            </span>
            <a
              href="https://www.medzlis-bl.ba"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:text-green-900 font-medium inline-flex items-center transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
              www.medzlis-bl.ba
            </a>
          </div>
        </div>
      </div>
      {/* Bankovne instrukcije Section */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            2. Bankovne instrukcije za plaćanje u KM
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Nosilac računa:
            </span>
            <span className="block text-gray-900 font-medium">
              MEDŽLIS ISLAMSKE ZAJEDNICE BANJA LUKA
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Broj bankovnog računa:
            </span>
            <span className="block text-gray-900 font-mono text-lg tracking-wider bg-gray-50 p-2 rounded-lg">
              141 555 53200135 82
            </span>
          </div>
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Ime banke:
            </span>
            <span className="block text-gray-900">
              BOSNA BANK INTERNATIONAL D.D. SARAJEVO
            </span>
          </div>
          <div className="mt-6 p-3 bg-green-50 rounded-lg border border-green-200">
            <span className="block text-green-800 font-semibold mb-1">
              Važno pri plaćanju:
            </span>
            <ul className="text-sm text-green-700 list-disc pl-5 space-y-1">
              <li>U svrhu uplate navedite Članarina</li>
              <li>Provjerite tačnost podataka prije slanja uplate</li>
              <li>Sačuvajte potvrdu o uplati</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    {/* EUR Payment Instructions Section */}
    <div className="mt-10">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 flex flex-col gap-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-xl flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-7 w-7 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">
            3. Bankovne instrukcije za plaćanje u EUR
          </h2>
        </div>
        <div className="space-y-3">
          <div>
            <span className="block text-xs text-gray-500 uppercase font-semibold tracking-wide">
              Instrukcije za platitelje iz inostranstva:
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-gray-200 rounded-lg bg-gray-50">
              <tbody>
                <tr>
                  <td className="font-semibold p-2 align-top w-1/3">
                    56A: Intermediary Institution
                  </td>
                  <td className="p-2">
                    <span className="block">
                      BKAUATWW (UNICREDIT BANK AUSTRIA)
                    </span>
                    <span className="block">ili</span>
                    <span className="block">
                      KTAGDEFF (KT BANK AG, GERMANY)
                    </span>
                    <span className="block">ili</span>
                    <span className="block">
                      PBZGHR2X (PRIVREDNA BANKA ZAGREB, CROATIA)
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 align-top w-1/3">
                    57A: Account with institution
                  </td>
                  <td className="p-2">
                    <span className="block font-mono">BBIBBA22XXX</span>
                    <span className="block">
                      BOSNA BANK INTERNATIONAL DD SARAJEVO
                    </span>
                    <span className="block">SARAJEVO, BOSNA I HERCEGOVINA</span>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 align-top w-1/3">
                    59A: Beneficiary customer
                  </td>
                  <td className="p-2">
                    <span className="block font-medium">
                      MEDŽLIS ISLAMSKE ZAJEDNICE BANJA LUKA
                    </span>
                    <span className="block">
                      KRALJA PETRA I KARAĐORĐEVIĆA 46
                    </span>
                    <span className="block">
                      BANJA LUKA, BOSNA I HERCEGOVINA
                    </span>
                    <span className="block font-mono bg-gray-100 rounded px-1 mt-1">
                      IBAN: BA39141555541100288
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="font-semibold p-2 align-top w-1/3">
                    70: Remittance Information
                  </td>
                  <td className="p-2">
                    <span className="block">Purpose of payment: Članarina</span>
                    <span className="block">
                      Obavezno navesti svrhu uplate.
                    </span>
                    <span className="block">
                      Korištenje polja 56A, 57A, 59A i 70 je obavezno.
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <span className="block text-blue-800 font-semibold mb-1">
              Važno pri plaćanju:
            </span>
            <ul className="text-sm text-blue-700 list-disc pl-5 space-y-1">
              <li>Platitelj snosi sve troškove prema instrukcijama banke</li>
              <li>Provjerite tačnost podataka prije slanja uplate</li>
              <li>Sačuvajte potvrdu o uplati</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div className="mt-10 pt-8 border-t border-gray-200 text-center">
      <p className="text-gray-500 text-sm">
        Hvala na podršci! Za dodatne informacije možete nas kontaktirati putem
        telefona ili e-maila.
      </p>
    </div>
  </section>
);

export default MembershipInstructions;
