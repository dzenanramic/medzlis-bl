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

  return (
    <section className="py-10 px-4 max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-3xl md:text-5xl font-bold mb-8 text-center text-gray-900">
        {mosque.name}
      </h1>

      {/* Images */}
      {hasOldImage && hasNewImage ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Old Image */}
          <figure className="relative w-full h-auto rounded-2xl overflow-hidden">
            <ImageZoom>
              <Image
                src={mosque.image_old!}
                alt={mosque.name + " (stara)"}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain w-full h-auto"
              />
            </ImageZoom>
            <figcaption className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              Stara
            </figcaption>
          </figure>
          {/* New Image */}
          <figure className="relative w-full h-auto rounded-2xl overflow-hidden">
            <ImageZoom>
              <Image
                src={mosque.image!}
                alt={mosque.name}
                width={1200}
                height={800}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-contain w-full h-auto"
              />
            </ImageZoom>
            <figcaption className="absolute bottom-2 left-2 z-10 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
              Nova
            </figcaption>
          </figure>
        </div>
      ) : hasNewImage ? (
        <figure className="relative w-full h-auto rounded-2xl overflow-hidden">
          <ImageZoom>
            <Image
              src={mosque.image!}
              alt={mosque.name}
              width={1200}
              height={800}
              sizes="100vw"
              className="object-contain w-full h-auto"
            />
          </ImageZoom>
        </figure>
      ) : hasOldImage ? (
        <figure className="relative w-full h-auto rounded-2xl overflow-hidden">
          <ImageZoom>
            <Image
              src={mosque.image_old!}
              alt={mosque.name + " (stara)"}
              width={1200}
              height={800}
              sizes="100vw"
              className="object-contain w-full h-auto"
            />
          </ImageZoom>
        </figure>
      ) : null}

      {/* Aliases */}
      {mosque.aliases.length > 0 && (
        <p className="mt-4 text-center text-gray-500 italic">
          Također poznata kao:{" "}
          <span className="font-medium">{mosque.aliases.join(", ")}</span>
        </p>
      )}

      {/* History Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
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
      </div>
    </section>
  );
}
