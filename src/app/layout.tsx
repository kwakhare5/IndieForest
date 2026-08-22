import type { Metadata } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

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
  const clerkPubKey =
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    "pk_test_Y2xlcmsuaW5kaWVmb3Jlc3QuZGV2JA";

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <html lang="en" className="scroll-smooth">
        <body
          className={`${geist.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased bg-[#ece7de] text-stone-900 font-sans selection:bg-emerald-600 selection:text-white`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
