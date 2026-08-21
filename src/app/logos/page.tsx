"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sound } from "@/lib/sound";

export default function LogosPage() {
  const [copiedUrl, setCopiedUrl] = useState(false);

  const handleCopy = () => {
    sound.playCoin();
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              icon={copiedUrl ? Check : Copy}
            >
              {copiedUrl ? "URL Copied" : "Copy SVG Link"}
            </Button>

            <a href="/logos/indieforest_logo.svg" download="indieforest_logo.svg">
              <Button variant="emerald" size="sm" icon={Download}>
                Download SVG
              </Button>
            </a>
          </div>
        </div>

        {/* Hero Presentation Stage */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          
          {/* Main 512x512 Master Display Card */}
          <Card variant="porcelain" className="md:col-span-6 p-8 rounded-[3rem] shadow-xl flex flex-col items-center justify-center text-center space-y-6">
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
              <p className="font-pixel text-xs font-bold text-stone-500">
                512x512px Vector SVG • Continuous Squircle (rx=112)
              </p>
            </div>
          </Card>

          {/* Context Scales & Design Breakdown */}
          <div className="md:col-span-6 space-y-6">
            
            {/* Scale Contexts (Favicon, Navbar, App Icon) */}
            <Card variant="porcelain" className="p-6 rounded-[2.5rem] shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 font-pixel">
                Scalability Verification
              </h4>

              <div className="grid grid-cols-3 gap-3 text-center">
                <Card variant="subtle-inset" className="p-3 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-lg overflow-hidden border border-stone-300/80 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="32px Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-600">32×32 Navbar</span>
                </Card>

                <Card variant="subtle-inset" className="p-3 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-stone-300/80 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="48px Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-600">48×48 Dock</span>
                </Card>

                <Card variant="subtle-inset" className="p-3 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-300/80 shadow-xs">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logos/indieforest_logo.svg" alt="64px Icon" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-mono text-stone-600">64×64 Favicon</span>
                </Card>
              </div>
            </Card>

          </div>
        </div>

      </div>
    </div>
  );
}
