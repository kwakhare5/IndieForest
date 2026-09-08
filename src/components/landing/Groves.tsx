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
        badge="Dual Groves"
        title="Momentum from Day 1, even at $0 MRR."
        description="Building takes months before making money. IndieForest separates code progress from revenue so pre-revenue founders always see their daily momentum."
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerald Shipping Grove */}
        <FeatureCard
          doubleBezel
          icon={Trees}
          iconBg="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-700"
          title="West Grove: Code & Shipping"
          description="Evergreen pines grown purely through daily git commits. Sprout at 1 commit, expand to Small Pine at 8 commits, Tall at 25, and crown with a golden star at 60+ commits."
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
          title="East Grove: Customers & Revenue"
          description="Golden cash pines that sprout and grow from real customer payments ($10 → $50 → $500 → $2,000+ MRR). Verified directly via Stripe, Lemon Squeezy, or Polar webhooks."
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

