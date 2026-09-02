"use client";

import React from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Groves } from "@/components/landing/Groves";
import { Features } from "@/components/landing/Features";
import { Faq } from "@/components/landing/Faq";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-sans selection:bg-emerald-600 selection:text-white relative overflow-y-auto overflow-x-hidden">
      {/* 1. Universal Double-Bezel Navbar */}
      <Navbar />

      {/* 2. Hero Section & Instant Preview */}
      <Hero />

      {/* 3. The 3-Step How It Works Guide */}
      <HowItWorks />

      {/* 4. Code & Cash Groves Showcase */}
      <Groves />

      {/* 5. Interactive Features Grid */}
      <Features />

      {/* 6. Frequently Asked Questions */}
      <Faq />

      {/* 7. Bottom CTA & Footer */}
      <Footer />
    </div>
  );
}
