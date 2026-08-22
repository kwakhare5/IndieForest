"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { LandingSectionHeader } from "./LandingSectionHeader";
import { LandingFeatureCard } from "./LandingFeatureCard";
import { Trees, TrendingUp } from "lucide-react";

export function LandingShowcase() {
  return (
    <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-sans">
      <LandingSectionHeader
        badge="Dual Groves"
        title="Momentum from Day 1, even at $0 MRR."
        description="Building takes months before making money. IndieForest separates code progress from revenue so pre-revenue founders always see their daily momentum."
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerald Shipping Grove */}
        <LandingFeatureCard
          icon={Trees}
          iconBg="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-700"
          title="West Grove: Code & Shipping"
          description="Evergreen pines grown purely through daily git commits. Sprout at 1 commit, expand to Young Pine at 8 commits, Mature at 25, and crown with a golden halo at 60+ commits."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-sans">
              <span>Automatic GitHub API tracking</span>
              <Badge variant="emerald" size="sm">Code Momentum</Badge>
            </div>
          }
          footerText="100% Pre-revenue friendly"
          footerColor="text-emerald-800"
        />

        {/* Golden Revenue Grove */}
        <LandingFeatureCard
          icon={TrendingUp}
          iconBg="bg-amber-50 border-amber-200"
          iconColor="text-amber-700"
          title="East Grove: Customers & Revenue"
          description="Golden oaks that sprout and grow from real customer payments ($10 → $50 → $500 → $2,000+ MRR). Verified directly via Stripe, Lemon Squeezy, or Polar webhooks."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-sans">
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
