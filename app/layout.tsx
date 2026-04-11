import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import FooterSection from "../components/FooterSection";
import ConditionalHeader from "@/components/ConditionalHeader";
import BackToTopButton from "@/components/BackToTopButton";
import I18nProvider from "@/components/I18nProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Medžlis Islamske zajednice Berlin",
  description: "Medžlis Islamske zajednice Berlin",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <I18nProvider>
          <ConditionalHeader />
          {children}
          <BackToTopButton />
          <FooterSection />
        </I18nProvider>
      </body>
    </html>
  );
}
