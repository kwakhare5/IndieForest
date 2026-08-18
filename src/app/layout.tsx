import type { Metadata } from "next";
import { Geist_Mono, Instrument_Serif, Plus_Jakarta_Sans, VT323 } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-editorial",
  weight: ["400"],
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-satoshi",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const vt323 = VT323({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IndieForest — Gamified 3D Daily Shipping Dashboard for Indie Hackers",
  description:
    "Turn daily coding momentum and SaaS customer growth into a living 3D low-poly island diorama. 1-click GitHub commit sync, streak shields, and MRR pine trees.",
  keywords: ["indie hacker", "github streak", "gamified coding", "3d diorama", "habit tracker", "build in public"],
  icons: {
    icon: "/logos/indieforest_logo.svg",
    apple: "/logos/indieforest_logo.svg",
  },
  openGraph: {
    title: "IndieForest — 3D Daily Shipping Dashboard",
    description: "Turn daily git commits and revenue momentum into a living 3D island diorama.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${instrumentSerif.variable} ${jakartaSans.variable} ${vt323.variable} ${geistMono.variable} antialiased bg-[#ece7de] text-stone-900 overflow-y-auto overflow-x-hidden min-h-screen`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
