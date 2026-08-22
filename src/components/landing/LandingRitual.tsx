"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { LandingSectionHeader } from "./LandingSectionHeader";
import { LandingFeatureCard } from "./LandingFeatureCard";
import { Check, Github, Flame, CloudRain, Zap, TrendingUp } from "lucide-react";

export function LandingRitual() {
  return (
    <section id="overview" className="py-20 bg-[#e6e1d7] border-y border-stone-300/80 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <LandingSectionHeader
          badge="Daily Shipping Loop"
          title="Zero friction. Pure momentum."
          description="Traditional habit apps fail because logging feels like chores. IndieForest operates in the background with zero manual check-ins."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <LandingFeatureCard
            stepTag="01 / ZERO-TOUCH SYNC"
            stepTagColor="text-emerald-700"
            title="Push Code to GitHub"
            description="Write code and push to your repos. IndieForest automatically syncs your commit activity and waters your island."
            previewWidget={
              <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs flex items-center justify-between shadow-inner">
                <span className="text-emerald-400">$ git push origin main</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            }
            footerIcon={Github}
            footerText="Edge-cached API sync"
            footerColor="text-stone-500"
          />

          {/* Step 2 */}
          <LandingFeatureCard
            stepTag="02 / DUAL PROGRESSION"
            stepTagColor="text-amber-700"
            title="Sprout Pines & Level Up"
            description="Each active project grows an Emerald Shipping Pine. Stripe sales sprout Golden Revenue Pines. Collect streak shields as you build."
            previewWidget={
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> +100 XP
                </span>
                <span className="text-stone-700 font-sans text-[11px] font-bold uppercase tracking-wider">TIER II UNLOCKED</span>
              </div>
            }
            footerIcon={CloudRain}
            footerText="Rolling 30-Day Forest Health"
            footerColor="text-amber-800"
          />

          {/* Step 3 */}
          <LandingFeatureCard
            stepTag="03 / PROOF OF WORK"
            stepTagColor="text-emerald-700"
            title="1-Click Verified Social Cards"
            description="Export 1200×675 3D render cards and 10s turntable orbit video reels to share your verified progress on X/Twitter in seconds."
            previewWidget={
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Zap className="w-3.5 h-3.5 text-emerald-700" /> 1200×675 Card
                </span>
                <Badge variant="emerald" size="sm">60fps HD</Badge>
              </div>
            }
            footerIcon={TrendingUp}
            footerText="Numbers-led anti-slop copy"
            footerColor="text-emerald-800"
          />
        </div>
      </div>
    </section>
  );
}
