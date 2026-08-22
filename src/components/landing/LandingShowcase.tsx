"use client";

import React from "react";
import { Badge } from "@/components/ui/Badge";
import { LandingSectionHeader } from "./LandingSectionHeader";
import { LandingFeatureCard } from "./LandingFeatureCard";
import { Trees, TrendingUp } from "lucide-react";

export function LandingShowcase() {
  return (
    <section id="showcase" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-satoshi">
      <LandingSectionHeader
        badge="Dual-Grove Architecture"
        title="Progress from Day 1, even at $0 MRR."
        description="95% of builders spend months building before making their first dollar. IndieForest separates the grind from revenue so pre-revenue founders always feel progress."
        className="mb-12"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Emerald Shipping Grove */}
        <LandingFeatureCard
          icon={Trees}
          iconBg="bg-emerald-50 border-emerald-200"
          iconColor="text-emerald-700"
          title="West Grove: Emerald Shipping Pines"
          description="Stepped conifer pines grown purely through daily code commits. Sprout at 1 commit, expand to Young Pine at 8 commits, Mature at 25, and crown with a golden halo at 60+ commits."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-satoshi">
              <span>Powered by GitHub Events API</span>
              <Badge variant="emerald" size="sm">Pure Code Grind</Badge>
            </div>
          }
          footerText="100% Pre-Revenue Friendly"
          footerColor="text-emerald-800"
        />

        {/* Golden Revenue Grove */}
        <LandingFeatureCard
          icon={TrendingUp}
          iconBg="bg-amber-50 border-amber-200"
          iconColor="text-amber-700"
          title="East Grove: Golden Revenue Pines"
          description="Shimmering metallic gold pines sprouted and scaled by paying customer subscriptions ($10 → $50 → $500 → $2,000+ MRR). Verified via Stripe, Lemon Squeezy, or Polar webhooks."
          previewWidget={
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-satoshi">
              <span>Universal HMAC Webhook</span>
              <Badge variant="amber" size="sm">Verified MRR</Badge>
            </div>
          }
          footerText="Stripe · Polar · Lemon Squeezy"
          footerColor="text-amber-800"
        />
      </div>
    </section>
  );
}
