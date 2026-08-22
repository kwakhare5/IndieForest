"use client";

import React from "react";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingRitual } from "@/components/landing/LandingRitual";
import { LandingShowcase } from "@/components/landing/LandingShowcase";
import { LandingBento } from "@/components/landing/LandingBento";
import { LandingFaq } from "@/components/landing/LandingFaq";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-satoshi selection:bg-emerald-600 selection:text-white relative overflow-y-auto overflow-x-hidden">
      {/* 1. Universal Double-Bezel Navbar */}
      <LandingNavbar />

      {/* 2. Hero Section & Instant Preview */}
      <LandingHero />

      {/* 3. The 3-Step Feature Ritual */}
      <LandingRitual />

      {/* 4. Dual Module Showcase */}
      <LandingShowcase />

      {/* 5. Interactive Bento Showcase */}
      <LandingBento />

      {/* 6. Frequently Asked Questions */}
      <LandingFaq />

      {/* 7. Bottom CTA & Footer */}
      <LandingFooter />
    </div>
  );
}
