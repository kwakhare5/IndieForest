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
          badge="How It Works"
          title="Zero manual tracking. Just code and ship."
          description="You already write code and push to GitHub. IndieForest runs in the background and turns your daily shipping into a living 3D diorama."
          className="mb-12"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Step 1 */}
          <LandingFeatureCard
            stepTag="01 / WRITE CODE"
            stepTagColor="text-emerald-700"
            title="Push to GitHub"
            description="Push commits to your repositories from your terminal. IndieForest automatically syncs your commit activity in the background."
            previewWidget={
              <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs flex items-center justify-between shadow-inner">
                <span className="text-emerald-400">$ git push origin main</span>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            }
            footerIcon={Github}
            footerText="Auto-syncs via GitHub API"
            footerColor="text-stone-500"
          />

          {/* Step 2 */}
          <LandingFeatureCard
            stepTag="02 / WATCH IT GROW"
            stepTagColor="text-amber-700"
            title="Pines Grow with Commits"
            description="Every repository becomes an evergreen pine. More commits make it taller. Stripe sales sprout golden revenue oaks."
            previewWidget={
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> +100 XP
                </span>
                <Badge variant="amber" size="sm">Tier II (Young)</Badge>
              </div>
            }
            footerIcon={CloudRain}
            footerText="Rolling 30-day health ratio"
            footerColor="text-amber-800"
          />

          {/* Step 3 */}
          <LandingFeatureCard
            stepTag="03 / PROOF OF WORK"
            stepTagColor="text-emerald-700"
            title="1-Click Social Proof"
            description="Export verified 1200×675 3D cards and human tweets to share on X, LinkedIn, or embed in your GitHub README."
            previewWidget={
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
                <span className="flex items-center gap-1.5 font-bold font-sans">
                  <Zap className="w-3.5 h-3.5 text-emerald-700" /> 1200×675 Card
                </span>
                <Badge variant="emerald" size="sm">HD Export</Badge>
              </div>
            }
            footerIcon={TrendingUp}
            footerText="Authentic proof with real stats"
            footerColor="text-emerald-800"
          />
        </div>
      </div>
    </section>
  );
}
