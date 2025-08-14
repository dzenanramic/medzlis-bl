"use client";
import HeroSection from "@/components/HeroSection";
import NewsSection from "@/components/NewsSection";
import PrayerTimesSection from "@/components/PrayerTimesSection";
import ContactSection from "@/components/ContactSection";
import FooterSection from "@/components/FooterSection";

export default function Home() {
  return (
    <main className="bg-gradient-to-br from-white to-gray-50 text-gray-800 font-sans">
      <HeroSection />
      <NewsSection />
      <PrayerTimesSection />
      <ContactSection />
      <FooterSection />
    </main>
  );
}
