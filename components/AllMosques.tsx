"use client";
import Image from "next/image";

import { mosques } from "@/lib/mosques";
import Link from "next/link";

export default function AllMosques() {
  return (
    <section className="py-10 px-2 max-w-7xl mx-auto">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
        Sve Džamije
      </h1>
      <div className="grid gap-8 grid-cols-1 md:grid-cols-2">
        {mosques.map((item) => (
          <Link
            key={item.id}
            href={`/mosques/${item.id}`}
            className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 focus:outline-none focus:ring-2 focus:ring-green-600"
          >
            {/* Images */}
            {item.image_old ? (
              <div className="flex w-full md:w-1/2">
                <div className="relative h-56 w-1/2 md:h-72 md:w-full">
                  <Image
                    src={item.image_old}
                    alt={item.name + " (stara)"}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105 border-r border-gray-200"
                  />
                </div>
                <div className="relative h-56 w-1/2 md:h-72 md:w-full">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
              </div>
            ) : (
              <div className="relative h-56 w-full md:h-72 md:w-1/2">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                />
              </div>
            )}
            {/* Info */}
            <div className="flex flex-col flex-1 p-6 justify-center">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-700 transition-colors">
                {item.name}
              </h3>
              {item.aliases.length > 0 && (
                <div className="text-gray-500 text-sm mb-2">
                  {item.aliases.join(", ")}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
