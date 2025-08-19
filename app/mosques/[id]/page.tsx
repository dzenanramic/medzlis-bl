import { ImageZoom } from "@/components/ui/shadcn-io/image-zoom";
import { mosques } from "@/lib/mosques";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function MosquePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const mosque = mosques.find((m) => m.id.toString() === id);
  if (!mosque) return notFound();

  // Helper function to check if image source is valid
  const hasValidImage = (src: string | undefined | null): src is string => {
    return Boolean(src && src.trim() !== "");
  };

  const hasOldImage = hasValidImage(mosque.image_old);
  const hasNewImage = hasValidImage(mosque.image);

  // Example: Add more historical facts to your mosque object in mosques.ts
  // mosque.facts = [
  //   { year: 1870, text: "Izgrađena na temeljima stare džamije iz osmanskog perioda." },
  //   { year: 1992, text: "Oštećena tokom rata, ali obnovljena 2001. godine." },
  //   { year: 2020, text: "Dodana nova munara i proširen harem." },
  // ];

  return (
    <section className="py-12 px-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      <div className="max-w-4xl mx-auto bg-white/90 rounded-3xl shadow-xl p-8 md:p-14">
        {/* Title */}
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-center text-gray-900 drop-shadow">
          {mosque.name}
        </h1>

        {/* Aliases */}
        {mosque.aliases.length > 0 && (
          <p className="mb-6 text-center text-gray-500 italic">
            Također poznata kao:{" "}
            <span className="font-semibold">{mosque.aliases.join(", ")}</span>
          </p>
        )}

        {/* Images */}
        <div className="mb-10">
          {hasOldImage && hasNewImage ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Image */}
              <figure className="relative rounded-2xl overflow-hidden shadow-lg group">
                <ImageZoom>
                  <Image
                    src={mosque.image_old!}
                    alt={mosque.name + " (stara)"}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-64 md:h-80 transition-transform duration-300 group-hover:scale-105"
                  />
                </ImageZoom>
                <figcaption className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  Stara
                </figcaption>
              </figure>
              {/* New Image */}
              <figure className="relative rounded-2xl overflow-hidden shadow-lg group">
                <ImageZoom>
                  <Image
                    src={mosque.image!}
                    alt={mosque.name}
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover w-full h-64 md:h-80 transition-transform duration-300 group-hover:scale-105"
                  />
                </ImageZoom>
                <figcaption className="absolute bottom-2 left-2 z-10 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
                  Nova
                </figcaption>
              </figure>
            </div>
          ) : hasNewImage ? (
            <figure className="relative rounded-2xl overflow-hidden shadow-lg group">
              <ImageZoom>
                <Image
                  src={mosque.image!}
                  alt={mosque.name}
                  width={1200}
                  height={800}
                  sizes="100vw"
                  className="object-cover w-full h-72 md:h-96 transition-transform duration-300 group-hover:scale-105"
                />
              </ImageZoom>
            </figure>
          ) : hasOldImage ? (
            <figure className="relative rounded-2xl overflow-hidden shadow-lg group">
              <ImageZoom>
                <Image
                  src={mosque.image_old!}
                  alt={mosque.name + " (stara)"}
                  width={1200}
                  height={800}
                  sizes="100vw"
                  className="object-cover w-full h-72 md:h-96 transition-transform duration-300 group-hover:scale-105"
                />
              </ImageZoom>
            </figure>
          ) : null}
        </div>

        {/* Details Section (optional, if you have more data) */}
        {/* 
        <div className="mb-8 flex flex-wrap justify-center gap-6">
          <div className="bg-gray-100 rounded-xl px-6 py-3 text-center">
            <span className="block text-gray-500 text-xs">Lokacija</span>
            <span className="font-semibold text-gray-800">{mosque.location}</span>
          </div>
          <div className="bg-gray-100 rounded-xl px-6 py-3 text-center">
            <span className="block text-gray-500 text-xs">Godina izgradnje</span>
            <span className="font-semibold text-gray-800">{mosque.year_built}</span>
          </div>
        </div>
        */}

        {/* History Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Historijat
          </h2>
          {mosque.history ? (
            <div className="prose prose-gray max-w-none text-lg leading-relaxed text-gray-700">
              {mosque.history}
            </div>
          ) : (
            <p className="text-gray-500 italic">
              Istorija ove džamije još nije dodana.
            </p>
          )}

          {/* Historical Facts Timeline */}
          {mosque.facts && mosque.facts.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-3 text-gray-700">
                Zanimljive činjenice
              </h3>
              <ul className="space-y-4 border-l-2 border-gray-300 pl-6">
                {mosque.facts.map(
                  (fact: { year: number; text: string }, idx: number) => (
                    <li key={idx} className="relative">
                      <span className="absolute -left-4 top-1.5 w-3 h-3 bg-blue-500 rounded-full border-2 border-white"></span>
                      <span className="font-semibold text-blue-700">
                        {fact.year}:
                      </span>{" "}
                      <span className="text-gray-700">{fact.text}</span>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
