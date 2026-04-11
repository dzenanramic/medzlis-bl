"use client";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import NewsSection from "@/components/NewsSection";
import PrayerTimesSection from "@/components/PrayerTimesSection";
import ContactSection from "@/components/ContactSection";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-white to-gray-50 text-gray-800 font-sans">
      <HeroSection />
      <AboutSection />
      <NewsSection />
      <PrayerTimesSection />
      <ContactSection />
    </main>
  );
}
