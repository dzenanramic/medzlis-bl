import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const handleScroll = () => setOffset(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 transition-transform duration-[600ms] ease-out"
        style={{
          transform: `translateY(${offset * 0.3}px)`,
          willChange: "transform",
        }}
      >
        <Image
          src="/hero-mosque2.jpg"
          alt="Ferhadija"
          fill
          className="hidden md:block object-cover object-bottom brightness-[0.45] scale-105"
          priority
        />
        <Image
          src="/hero-mosque-xs.jpeg"
          alt="Ferhadija"
          fill
          className="md:hidden object-cover object-bottom brightness-[0.45] scale-105"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
      <div className="relative z-10 text-center px-4 max-w-4xl animate-fadeIn">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-white drop-shadow-md leading-tight">
          <span className="block">{t("hero.title")}</span>
          <span className="block text-emerald-300 mt-2 md:mt-3">
            {t("hero.city")}
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
          {t("hero.subtitle")}
        </p>
      </div>
    </section>
  );
}
