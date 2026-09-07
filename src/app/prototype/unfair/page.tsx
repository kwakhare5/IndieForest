"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Twitter, Copy, Check, ShieldCheck, TrendingUp, TreePine } from "lucide-react";

type DesignConcept = "diorama-shadowbox" | "builder-passport" | "compound-ledger";

export default function IndieForestTastePrototype() {
  const [concept, setConcept] = useState<DesignConcept>("diorama-shadowbox");
  const [metricFocus, setMetricFocus] = useState<"streak" | "mrr">("streak");
  const [copied, setCopied] = useState(false);

  // Builder data state
  const streakDays = 42;
  const mrr = 1420;
  const treesCount = 14;
  const username = "kwakhare5";
  const displayName = "Karan Wakhare";
  const latestShip = "Added Supabase realtime tree sprouting engine";

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://indieforest.dev/u/${username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTweet = () => {
    const text = metricFocus === "streak"
      ? `Day ${streakDays} of shipping daily on @IndieForest.\n\n🌲 14 living pines · 384 verified commits\n✨ Today: "${latestShip}"\n\nInspect my 3D diorama: indieforest.dev/u/${username}`
      : `$${mrr}/mo MRR on @IndieForest across ${treesCount} active trees.\n\n🔥 ${streakDays}-day streak · Verified Stripe & GitHub\n\nLiving diorama: indieforest.dev/u/${username}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-[#ECE7DE] text-stone-900 font-sans selection:bg-emerald-600 selection:text-white pb-32">
      
      {/* Top Header */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[#ECE7DE]/90 border-b border-stone-300/80 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-mono font-medium text-stone-600 hover:text-stone-950 transition px-2.5 py-1 rounded-full border border-stone-300 bg-white/70 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
          <div className="h-4 w-px bg-stone-300" />
          <div className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icon.svg" alt="IndieForest" className="w-5 h-5 rounded-md" />
            <span className="font-editorial text-xl text-stone-900 tracking-tight font-medium">indieforest.dev</span>
            <span className="font-mono text-[10px] tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-full uppercase font-medium">
              Taste Specimen
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTweet}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-stone-900 text-white text-xs font-mono font-medium hover:bg-stone-800 transition shadow-xs"
          >
            <Twitter className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Post on X</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-stone-800 border border-stone-300 text-xs font-mono hover:border-stone-400 transition shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied" : "Copy Link"}</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* Concept Description Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-[11px] font-mono tracking-widest text-stone-500 uppercase">
            Taste & Art Direction Experiment
          </span>
          <h1 className="font-editorial text-4xl sm:text-5xl text-stone-950 mt-1 tracking-tight">
            Elevating IndieForest on X
          </h1>
          <p className="text-xs sm:text-sm font-mono text-stone-600 mt-2">
            Capturing unfair.so’s prestige, high negative space, and editorial typography while strictly preserving IndieForest’s living low-poly soul.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* CONCEPT 1: THE LIVING DIORAMA SHADOWBOX (Warm Studio Linen + 3D Island) */}
        {/* ========================================================================= */}
        {concept === "diorama-shadowbox" && (
          <div className="flex flex-col items-center">
            
            {/* 1:1 Social Graphic (1200x1200 style canvas in 580px frame) */}
            <div className="w-full max-w-[560px] aspect-square bg-[#FCFAF6] rounded-3xl p-8 sm:p-10 border border-[#DDD6CA] shadow-[0_24px_60px_rgba(40,30,20,0.08)] flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Row: Wordmark & Verified Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.svg" alt="IndieForest" className="w-6 h-6 rounded-md shadow-xs" />
                  <span className="font-editorial text-2xl text-stone-950 tracking-tight font-medium">indieforest.dev</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-[10px] font-mono font-medium text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>TIER V · SOVEREIGN</span>
                </div>
              </div>

              {/* Center Body: 3D Isometric Island Inset + Giant Pixel Metric */}
              <div className="flex items-center justify-between gap-6 my-auto pt-4">
                
                {/* 3D Diorama Floating Porcelain Shadowbox */}
                <div className="relative w-44 sm:w-48 shrink-0">
                  <div className="absolute inset-0 w-44 sm:w-48 h-56 rounded-2xl bg-emerald-950/5 border border-stone-300/60 -z-10 transform -rotate-6 translate-y-1.5 -translate-x-2" />
                  
                  <div className="w-44 sm:w-48 h-56 rounded-2xl bg-white p-2.5 border border-stone-300/80 shadow-[0_12px_28px_rgba(5,150,105,0.12)] flex flex-col justify-between transform rotate-2 hover:rotate-0 transition-transform duration-300">
                    
                    {/* Top Inset Bar */}
                    <div className="flex items-center justify-between text-[9px] font-mono text-stone-500 px-1">
                      <span>ISLAND DIORAMA</span>
                      <span className="text-emerald-700 font-medium">{treesCount} TREES</span>
                    </div>

                    {/* Low-Poly Diorama Render Snapshot Frame */}
                    <div className="w-full h-32 rounded-xl overflow-hidden bg-gradient-to-b from-[#E7F0EB] to-[#CBE2D4] border border-stone-200 relative flex items-center justify-center">
                      <div className="text-center">
                        <span className="text-4xl filter drop-shadow-md">🏝️</span>
                        <div className="font-editorial text-xs text-emerald-950 mt-1 font-medium">Emerald Haven</div>
                      </div>
                      <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 backdrop-blur-xs text-[8px] font-mono text-stone-700 border border-stone-200">
                        LAT 18.5m · GROVE
                      </div>
                    </div>

                    {/* Bottom User Strip */}
                    <div className="flex items-center justify-between px-1 pt-1">
                      <div>
                        <div className="font-editorial text-sm font-medium leading-none text-stone-950">Karan</div>
                        <div className="text-[9px] font-mono text-stone-500">@{username}</div>
                      </div>
                      <span className="text-xs">🌲</span>
                    </div>
                  </div>
                </div>

                {/* Right Column: Giant Pixel Number */}
                <div className="flex-1 pl-2">
                  <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                    {metricFocus === "streak" ? "CONTINUOUS STREAK" : "VERIFIED MRR"}
                  </div>
                  
                  {metricFocus === "streak" ? (
                    <div>
                      <div className="font-pixel text-6xl sm:text-7xl font-normal leading-none text-emerald-800">
                        {streakDays} DAYS
                      </div>
                      <div className="text-xs font-editorial italic text-stone-600 mt-2">
                        “Zero missed days since inception.”
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="font-pixel text-6xl sm:text-7xl font-normal leading-none text-amber-600">
                        ${mrr}
                      </div>
                      <div className="text-xs font-editorial italic text-stone-600 mt-2">
                        “Monthly recurring revenue planted.”
                      </div>
                    </div>
                  )}

                  <div className="inline-flex items-center gap-1.5 mt-3 text-[10px] font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                    <span>Rank:</span>
                    <span className="text-stone-900 font-medium">Top 2% of Indie Hackers</span>
                  </div>
                </div>

              </div>

              {/* Bottom Footer Bar */}
              <div className="pt-4 border-t border-[#DDD6CA] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-stone-600">Proof of consistency</span>
                  <span className="text-stone-300">·</span>
                  <span className="text-emerald-700 font-medium font-mono">100% On Time</span>
                </div>

                {/* Stepped Commit Grid Pips */}
                <div className="flex items-center justify-between gap-1 h-5 px-1 bg-stone-100/80 rounded-lg border border-stone-200/60">
                  {Array.from({ length: 30 }).map((_, i) => (
                    <div
                      key={i}
                      className={`flex-1 h-3 rounded-2xs ${
                        i > 25
                          ? "bg-emerald-600 shadow-2xs"
                          : i > 12
                          ? "bg-emerald-500/80"
                          : "bg-emerald-400/70"
                      }`}
                      title={`Day ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Footer: Keep Shipping + Action Pill */}
              <div className="pt-3.5 border-t border-stone-200/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">🌱</span>
                  <span className="font-editorial text-lg text-stone-950 font-medium">Keep shipping daily.</span>
                </div>

                <div className="px-3.5 py-1 rounded-full bg-emerald-800 text-white text-xs font-mono font-medium shadow-xs flex items-center gap-1.5 hover:bg-emerald-900 transition">
                  <span>indieforest.dev/u/{username}</span>
                  <span>↗</span>
                </div>
              </div>

            </div>

            <span className="text-xs font-mono text-stone-500 mt-4">
              Concept 1: Living Diorama Shadowbox · 100% IndieForest DNA with unfair.so-grade editorial polish
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONCEPT 2: THE SOVEREIGN BUILDER PASSPORT (Letterpress & Physical Seal) */}
        {/* ========================================================================= */}
        {concept === "builder-passport" && (
          <div className="flex flex-col items-center">
            
            <div className="w-full max-w-[560px] aspect-square bg-[#F7F4EE] rounded-3xl p-8 sm:p-10 border-2 border-[#D5CDBC] shadow-[0_24px_50px_rgba(0,0,0,0.07)] flex flex-col justify-between relative overflow-hidden">
              
              {/* Top Certificate Header */}
              <div className="flex items-start justify-between border-b border-stone-300 pb-4">
                <div>
                  <div className="font-editorial text-3xl text-stone-950 font-medium leading-none tracking-tight">
                    Indie Hacker Passport
                  </div>
                  <div className="text-[10px] font-mono text-stone-500 uppercase tracking-widest mt-1">
                    Verified Shipping Record · No. 00042-KW
                  </div>
                </div>

                <div className="w-10 h-10 rounded-full border-2 border-dashed border-emerald-700 flex items-center justify-center text-emerald-800 font-pixel text-xs transform rotate-12 bg-emerald-50">
                  VERIFIED
                </div>
              </div>

              {/* Main Body */}
              <div className="my-auto py-4 flex flex-col gap-5">
                
                {/* Builder Info Line */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase">BUILDER NAME</div>
                    <div className="font-editorial text-2xl text-stone-950 font-medium">{displayName}</div>
                    <div className="text-xs font-mono text-emerald-800">@{username}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-[10px] font-mono text-stone-500 uppercase">RANK TIER</div>
                    <div className="font-pixel text-2xl text-stone-900 leading-none font-normal">TIER V</div>
                    <div className="text-xs font-editorial italic text-stone-600">Sovereign Elder</div>
                  </div>
                </div>

                {/* Big Two-Column Number Flex */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-white/80 border border-stone-300 shadow-2xs">
                  <div>
                    <div className="text-[10px] font-mono text-stone-500 uppercase">CURRENT STREAK</div>
                    <div className="font-pixel text-5xl text-emerald-700 leading-none mt-1 font-normal">{streakDays} DAYS</div>
                    <div className="text-[10px] font-mono text-stone-500 mt-1">Zero missed days</div>
                  </div>

                  <div className="border-l border-stone-200 pl-4">
                    <div className="text-[10px] font-mono text-stone-500 uppercase">VERIFIED MRR</div>
                    <div className="font-pixel text-5xl text-amber-600 leading-none mt-1 font-normal">${mrr}</div>
                    <div className="text-[10px] font-mono text-stone-500 mt-1">Stripe customer revenue</div>
                  </div>
                </div>

                {/* Latest Ship Quotation */}
                <div className="p-3 rounded-xl bg-stone-100/70 border border-stone-200 text-xs font-mono text-stone-700">
                  <span className="text-stone-400">LATEST COMMIT: </span>
                  <span className="font-medium text-stone-900">"{latestShip}"</span>
                </div>

              </div>

              {/* Footer Stamp */}
              <div className="pt-4 border-t border-stone-300 flex items-center justify-between text-xs font-mono text-stone-600">
                <div className="flex items-center gap-2">
                  <span>🌲</span>
                  <span>14 low-poly pine trees thriving</span>
                </div>
                <div className="font-editorial text-sm font-medium text-stone-900">
                  indieforest.dev ↗
                </div>
              </div>

            </div>

            <span className="text-xs font-mono text-stone-500 mt-4">
              Concept 2: Sovereign Builder Passport · Tangible credential aesthetic for shipping consistency
            </span>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CONCEPT 3: THE COMPOUND LEDGER (Giant Pixel Matrix + Vector Sparkline) */}
        {/* ========================================================================= */}
        {concept === "compound-ledger" && (
          <div className="flex flex-col items-center">
            
            <div className="w-full max-w-[560px] aspect-square bg-[#FAF8F5] rounded-3xl p-8 sm:p-10 border border-[#DDD6CA] shadow-[0_24px_50px_rgba(0,0,0,0.06)] flex flex-col justify-between relative overflow-hidden">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/icon.svg" alt="IndieForest" className="w-5 h-5 rounded-md" />
                  <span className="font-editorial text-xl text-stone-900 font-medium">indieforest.dev</span>
                </div>
                <div className="text-xs font-mono text-stone-500">
                  Consistency Compounds
                </div>
              </div>

              {/* Middle Huge Metric & Statement */}
              <div className="my-auto py-2">
                <div className="text-xs font-mono uppercase tracking-widest text-stone-500 mb-1">
                  TOTAL COMPOUND MOMENTUM
                </div>
                
                {/* Massive Pixel Number */}
                <div className="font-pixel text-7xl sm:text-8xl text-emerald-700 font-normal leading-none tracking-tight">
                  {streakDays} DAYS
                </div>

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="font-editorial text-2xl text-stone-900 font-medium">{displayName}</span>
                  <span className="font-mono text-xs text-stone-500">@{username}</span>
                  <span className="font-mono text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ${mrr}/mo MRR
                  </span>
                </div>
              </div>

              {/* Vector Momentum Sparkline */}
              <div className="pt-4 border-t border-stone-200">
                <div className="flex items-center justify-between text-xs font-mono text-stone-500 mb-2">
                  <span>Growth curve</span>
                  <span className="text-emerald-700 font-medium font-mono">↗ +42% streak velocity</span>
                </div>

                <div className="h-16 w-full">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 70" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="ledgerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#059669" stopOpacity="0.22" />
                        <stop offset="100%" stopColor="#059669" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 0,62 L 0,58 Q 130,52 230,36 T 380,18 L 500,6 L 500,70 L 0,70 Z"
                      fill="url(#ledgerGrad)"
                    />
                    <path
                      d="M 0,58 Q 130,52 230,36 T 380,18 L 500,6"
                      fill="none"
                      stroke="#059669"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="0" cy="58" r="3.5" fill="#059669" />
                    <circle cx="230" cy="36" r="3.5" fill="#059669" />
                    <circle cx="500" cy="6" r="5" fill="#059669" stroke="#FFFFFF" strokeWidth="2" />
                  </svg>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <div className="font-editorial text-lg text-stone-900">
                  💖 Keep shipping.
                </div>
                <div className="px-3.5 py-1 rounded-full bg-stone-900 text-white text-xs font-mono font-medium">
                  indieforest.dev ↗
                </div>
              </div>

            </div>

            <span className="text-xs font-mono text-stone-500 mt-4">
              Concept 3: The Compound Ledger · Maximum contrast between editorial serif and giant pixel metrics
            </span>
          </div>
        )}

      </main>

      {/* Floating Bottom Control Bar for Switching Variations */}
      <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 p-1.5 rounded-full glass-dock shadow-xl flex items-center gap-1 border border-stone-300 bg-white/95 backdrop-blur-md">
        <button
          onClick={() => setConcept("diorama-shadowbox")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-medium transition ${
            concept === "diorama-shadowbox"
              ? "bg-emerald-800 text-white shadow-xs"
              : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
          }`}
        >
          <TreePine className="w-3.5 h-3.5" />
          <span>1. Diorama Shadowbox</span>
        </button>

        <button
          onClick={() => setConcept("builder-passport")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-medium transition ${
            concept === "builder-passport"
              ? "bg-emerald-800 text-white shadow-xs"
              : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. Builder Passport</span>
        </button>

        <button
          onClick={() => setConcept("compound-ledger")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-mono font-medium transition ${
            concept === "compound-ledger"
              ? "bg-emerald-800 text-white shadow-xs"
              : "text-stone-700 hover:text-stone-950 hover:bg-stone-100"
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>3. Compound Ledger</span>
        </button>

        <div className="h-4 w-px bg-stone-300 mx-1" />

        {/* Toggle between Streak and MRR */}
        <button
          onClick={() => setMetricFocus(metricFocus === "streak" ? "mrr" : "streak")}
          className="px-3 py-1.5 rounded-full text-xs font-mono bg-stone-100 hover:bg-stone-200 text-stone-800 transition"
        >
          Mode: <span className="text-emerald-800 uppercase font-medium">{metricFocus}</span>
        </button>
      </nav>

    </div>
  );
}
