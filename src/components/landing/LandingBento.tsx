"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import { LandingSectionHeader } from "./LandingSectionHeader";
import { Shield, TrendingUp, Check, Copy } from "lucide-react";

const SHIELD_OPTIONS: SegmentedOption<"armed" | "rest">[] = [
  { value: "armed", label: "Shields Armed" },
  { value: "rest", label: "Sabbatical Mode" },
];

export function LandingBento() {
  const [shieldState, setShieldState] = useState<"armed" | "rest">("armed");
  const [demoHealth, setDemoHealth] = useState<number>(85);
  const [copiedText, setCopiedText] = useState(false);

  const getHealthStatus = (pct: number) => {
    if (pct >= 90) return { label: "Pristine (90%+)", color: "text-emerald-700" };
    if (pct >= 75) return { label: "Lush (75-89%)", color: "text-emerald-600" };
    if (pct >= 50) return { label: "Dormant (50-74%)", color: "text-amber-600" };
    return { label: "Drought (<50%)", color: "text-stone-500" };
  };

  const currentHealth = getHealthStatus(demoHealth);

  const handleCopyText = () => {
    navigator.clipboard.writeText(
      `Day 14 of shipping daily on IndieForest.\n• Tier IV (Island Architect · Lvl 12)\n• 4 Active Projects | $1,250/mo MRR\n• 30-Day Forest Health: ${demoHealth}%\n\nLiving diorama: indieforest.dev/u/builder`
    );
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  return (
    <section id="bento" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-sans">
      <LandingSectionHeader
        badge="Anti-Burnout & Distribution"
        title="Engineered for sustainable discipline."
        description="Traditional streak apps induce anxiety and guilt. IndieForest is built around healthy momentum, rest protection, and frictionless social proof."
        className="mb-14"
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Bento 1: Rolling 30-Day Forest Health */}
        <Card variant="porcelain" className="md:col-span-7 p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <span className="font-sans text-[11px] uppercase tracking-wider font-bold text-emerald-700 block mb-1">
              ANTI-GUILT RETENTION
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1.5 font-sans">
              Rolling 30-Day Forest Health %
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg font-sans">
              Missed a day? Your past work is never erased. Your island health reflects active shipping days in the past 30 days, allowing quick recovery.
            </p>
          </div>

          <div className="mt-5 space-y-3 font-sans">
            <Card variant="subtle-inset" className="p-4 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
                <span className="text-stone-600 font-medium">Simulate 30-Day Activity:</span>
                <span className={`font-bold font-pixel ${currentHealth.color}`}>
                  {demoHealth}% ({currentHealth.label})
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={demoHealth}
                onChange={(e) => setDemoHealth(parseInt(e.target.value, 10))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </Card>
          </div>

          <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
            <span>Welcome-Back Rain triggers upon return</span>
            <span className="font-semibold text-emerald-800">Zero broken-streak shaming</span>
          </div>
        </Card>

        {/* Bento 2: Streak Shield Vault */}
        <Card variant="porcelain" className="md:col-span-5 p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-3 shadow-xs">
              <Shield className="w-5 h-5 stroke-[1.75]" />
            </div>

            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-sans">
              Streak Shield Vault &amp; Rest Mode
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
              Earn 1 shield every 7 days (max 2). Sabbatical mode lets you schedule guilt-free offline breaks without losing momentum.
            </p>
          </div>

          <div className="mt-5 space-y-3 font-sans">
            <SegmentedControl
              options={SHIELD_OPTIONS}
              value={shieldState}
              onChange={(val) => setShieldState(val)}
              size="sm"
            />

            <Card variant="subtle-inset" className="p-3 rounded-xl text-xs text-stone-700 flex items-center justify-between font-sans">
              <span>Status:</span>
              <span className={`font-bold ${shieldState === "armed" ? "text-emerald-700" : "text-amber-700"}`}>
                {shieldState === "armed" ? "2 Shields Armed (Auto-Protect)" : "Rest Mode Active (No Anxiety)"}
              </span>
            </Card>
          </div>

          <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-600">
            <span>Burnout Prevention</span>
            <span className="font-bold text-sky-800 font-sans text-xs uppercase tracking-wider">2 MAX CAPACITY</span>
          </div>
        </Card>

        {/* Bento 3: Revenue Webhook Pipeline */}
        <Card variant="porcelain" className="md:col-span-5 p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
              <TrendingUp className="w-5 h-5 stroke-[1.75]" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-sans">
              Universal Revenue Webhooks
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3 font-sans">
              Connect Stripe, Lemon Squeezy, or Polar in 1 click. New subscribers instantly sprout Golden Pines on your island:
            </p>
          </div>

          <Card variant="subtle-inset" className="p-4 space-y-2.5 font-sans rounded-2xl">
            <div className="flex items-center justify-between text-xs sm:text-sm font-sans">
              <span className="text-stone-500">Tracked Revenue:</span>
              <span className="font-bold text-emerald-800 text-sm font-pixel">$2,450/mo MRR</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs font-sans shadow-xs flex items-center justify-between">
              <span className="text-stone-900 font-bold">Pro Plan · Golden Pine IV</span>
              <Badge variant="amber" size="sm">Verified Stripe</Badge>
            </div>
          </Card>

          <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-emerald-800">
            <span>Stripe · Polar · Lemon Squeezy</span>
            <span className="font-bold">Instant Normalizer</span>
          </div>
        </Card>

        {/* Bento 4: 1-Click Social Exporter */}
        <Card variant="porcelain" className="md:col-span-7 p-8 rounded-[2.5rem] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="stone" size="sm">
                Build in Public
              </Badge>
              <span className="text-xs font-sans text-emerald-700 font-bold">Twitter / X Formatted</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1.5 font-sans">
              1-Click 3D Share Card &amp; Tweet Drafter
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg font-sans">
              Generate numbers-led progress cards with direct WebGL canvas rendering in &lt;10 seconds. Zero AI slop:
            </p>
          </div>

          <Card variant="subtle-inset" className="p-4 font-sans text-xs sm:text-sm text-stone-800 space-y-2 mt-2 rounded-2xl">
            <p className="text-xs sm:text-sm text-stone-700 font-sans leading-relaxed">
              Day 14 of shipping daily on IndieForest.<br />
              • Tier IV (Island Architect · Lvl 12)<br />
              • 4 Active Projects | $1,250/mo MRR | 30d Health: {demoHealth}%
            </p>
            <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
              <Button
                onClick={handleCopyText}
                variant="dark"
                size="sm"
                showArrow
                discIcon={copiedText ? Check : Copy}
              >
                {copiedText ? "Copied" : "Copy Formatted Post"}
              </Button>
              <span className="text-[11px] text-stone-500 font-sans font-semibold uppercase tracking-wider">280 CHAR COMPLIANT</span>
            </div>
          </Card>

          <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-sans text-stone-500">
            <span>Direct WebGL Compositor</span>
            <span className="font-mono text-xs font-semibold text-emerald-800">indieforest.dev/u/builder</span>
          </div>
        </Card>
      </div>
    </section>
  );
}
