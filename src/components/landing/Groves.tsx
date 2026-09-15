"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "./SectionHeader";
import { FeatureCard } from "./FeatureCard";
import { Trees, TrendingUp } from "lucide-react";

export function Groves() {
  return (
    <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-sans">
      <SectionHeader
        badge="Code & Revenue"
        title="Progress from Day 1, even before your first dollar."
        description="Building takes time before making money. IndieForest separates code progress from revenue so you always see your daily momentum."
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerald Shipping Grove */}
        <FeatureCard
          doubleBezel
          icon={Trees}
          iconBg="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-700"
          title="Green Trees: Code & Commits"
          description="Green trees grown through your daily git commits. They start as sprouts and grow taller as you ship code."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50/90 border border-stone-200/90 shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.04),inset_0_-1px_0_rgba(255,255,255,0.85)] text-xs text-stone-700 flex items-center justify-between font-sans">
              <span>Automatic GitHub API tracking</span>
              <Badge variant="emerald" size="sm">Code Momentum</Badge>
            </div>
          }
          footerText="100% Pre-revenue friendly"
          footerColor="text-emerald-800"
        />

        {/* Golden Revenue Grove */}
        <FeatureCard
          doubleBezel
          icon={TrendingUp}
          iconBg="bg-amber-50 border-amber-200"
          iconColor="text-amber-700"
          title="Gold Trees: Sales & Revenue"
          description="Golden trees that sprout and grow from customer payments ($10 to $2,000+ MRR). Verified through Stripe, Lemon Squeezy, or Polar webhooks."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50/90 border border-stone-200/90 shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.04),inset_0_-1px_0_rgba(255,255,255,0.85)] text-xs text-stone-700 flex items-center justify-between font-sans">
              <span>Direct webhook verification</span>
              <Badge variant="amber" size="sm">Verified MRR</Badge>
            </div>
          }
          footerText="Stripe · Lemon Squeezy · Polar"
          footerColor="text-amber-800"
        />
      </div>
    </section>
  );
}

