"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Download, Sparkles, Layers, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function LogosPage() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.origin + "/logos/indieforest_logo.svg");
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-satoshi py-12 px-4 sm:px-6 relative overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-300/80">
          <div className="space-y-1">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 mb-2 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
            </Link>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-normal text-stone-950 font-editorial">
                The Official IndieForest Logo
              </h1>
              <Badge variant="emerald" dot>
                Official Master SVG
              </Badge>
            </div>
            <p className="text-sm text-stone-600 max-w-xl font-satoshi">
              The isometric Tree Stump timeline featuring 4 concentric golden annual growth rings and a green sprout on radiant Apple green.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-full btn-specular-porcelain text-xs font-semibold text-stone-800 flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-xs"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>URL Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy SVG Link</span>
                </>
              )}
            </button>

            <a
              href="/logos/indieforest_logo.svg"
              download="indieforest_logo.svg"
              className="px-4 py-2 rounded-full btn-specular-emerald text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition active:scale-95 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Official SVG</span>
            </a>
          </div>
        </div>

        {/* Hero Presentation Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Main 512x512 Master Display Card */}
          <div className="md:col-span-6 p-8 rounded-[3rem] bg-white border border-stone-200 shadow-xl flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[2.5rem] p-2 bg-gradient-to-b from-[#f4f0e8] to-[#ece7de] border border-[#d6cfc5] shadow-inner flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logos/indieforest_logo.svg"
                alt="IndieForest Official Logo"
                className="w-full h-full object-contain drop-shadow-xl hover:scale-105 transition-transform duration-300"
              />
            </div>

            <div className="space-y-1">
              <h3 className="font-bold text-lg text-stone-900 font-satoshi">
                IndieForest Tree Stump Timeline
              </h3>
              <p className="text-xs text-stone-500 font-pixel">
                512x512px Vector SVG • Continuous Squircle (rx=112)
              </p>
            </div>
          </div>

          {/* Context Scales & Design Breakdown */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Scale Contexts (Favicon, Navbar, App Icon) */}
            <div className="p-6 rounded-[2.5rem] bg-white border border-stone-200 shadow-sm space-y-4">
              <span className="text-xs font-pixel font-bold uppercase tracking-wider text-emerald-800 block">
                Visual Scale Hierarchy
              </span>

              <div className="grid grid-cols-3 gap-3 text-center">
                {/* 1. App Icon (64px) */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center gap-2">
                  <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="App Icon" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] font-pixel text-stone-600">App Icon (64px)</span>
                </div>

                {/* 2. Navbar Pod (32px) */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center gap-2">
                  <div className="w-8 h-8 rounded-xl overflow-hidden shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="Navbar Icon" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] font-pixel text-stone-600">Navbar (32px)</span>
                </div>

                {/* 3. Favicon (16px) */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-col items-center justify-center gap-2">
                  <div className="w-5 h-5 rounded-md overflow-hidden shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="Favicon" className="w-full h-full" />
                  </div>
                  <span className="text-[11px] font-pixel text-stone-600">Favicon (16px)</span>
                </div>
              </div>
            </div>

            {/* Design DNA Breakdown */}
            <div className="p-6 rounded-[2.5rem] bg-white border border-stone-200 shadow-sm space-y-3 font-satoshi text-xs text-stone-600">
              <span className="text-xs font-pixel font-bold uppercase tracking-wider text-emerald-800 block">
                Brand Geometry &amp; Symbolism
              </span>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <Layers className="w-3 h-3" />
                  </div>
                  <span><strong>4 Concentric Growth Rings:</strong> Represents daily developer shipping streaks and longevity.</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span><strong>Fresh Heartwood Sprout:</strong> Symbolizes active revenue and continuous product shipping momentum.</span>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                  </div>
                  <span><strong>Radiant Apple Green:</strong> Vibrant, high-energy gradient (#4ADE80 &rarr; #22C55E &rarr; #16A34A).</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
