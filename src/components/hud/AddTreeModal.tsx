"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Trees, DollarSign, Zap, Check, TrendingUp, GitBranch, Copy, Terminal } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAB_OPTIONS: SegmentedOption<"shipping" | "revenue" | "webhooks">[] = [
  { value: "shipping", label: "Shipping Project", icon: GitBranch },
  { value: "revenue", label: "Revenue Stream", icon: TrendingUp },
  { value: "webhooks", label: "Live Webhooks", icon: Zap },
];

export function AddTreeModal({ isOpen, onClose }: AddTreeModalProps) {
  const addTree = useForestStore((s) => s.addTree);
  const user = useForestStore((s) => s.user);

  const [activeTab, setActiveTab] = useState<"shipping" | "revenue" | "webhooks">("shipping");
  const [name, setName] = useState("");
  const [mrr, setMrr] = useState("29");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [simSuccess, setSimSuccess] = useState(false);

  const webhookBaseUrl = typeof window !== "undefined" ? window.location.origin : "https://indieforest.app";
  const revenueWebhookUrl = `${webhookBaseUrl}/api/webhooks/revenue?userId=${user.id || "usr_builder"}`;
  const githubWebhookUrl = `${webhookBaseUrl}/api/github?userId=${user.id || "usr_builder"}`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlantShippingTree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTree(name.trim(), 0, "sapling", "shipping");

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#10b981", "#34d399", "#059669"],
    });

    setName("");
    onClose();
  };

  const handlePlantRevenueTree = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const parsedMrr = parseInt(mrr) || 29;
    addTree(name.trim(), parsedMrr, "sapling", "revenue");

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ["#f59e0b", "#fbbf24", "#d97706"],
    });

    setName("");
    onClose();
  };

  const handleSimulateWebhook = async (amount: number, customerName: string) => {
    addTree(customerName, amount, amount >= 500 ? "mature" : amount >= 50 ? "young" : "sapling", "revenue");

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#f59e0b", "#10b981", "#3b82f6"],
    });

    setSimSuccess(true);
    setTimeout(() => {
      setSimSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Plant Island Tree & Sync Webhooks"
      badgeText="Sovereign Progression"
      icon={Trees}
    >
      <div className="space-y-4 font-satoshi">
        
        {/* Independent 3-Way Tab Switcher */}
        <SegmentedControl
          options={TAB_OPTIONS}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
        />

        {/* 1. Shipping Project Track (Independent of Revenue) */}
        {activeTab === "shipping" && (
          <form onSubmit={handlePlantShippingTree} className="space-y-3.5 font-satoshi">
            <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-950 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <Trees className="w-3.5 h-3.5 text-emerald-700" /> Emerald Shipping Grove (Pre-Revenue Friendly)
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                Plant a dedicated pine tree for your code repository or feature milestone. It sprouts as a Sapling and automatically grows into a Majestic Pine with every commit and daily ship.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                Project or Repository Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. IndieForest Core / Auth MVP"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-satoshi"
              />
            </div>

            <Button
              type="submit"
              variant="emerald"
              size="md"
              showArrow
              className="w-full mt-2"
            >
              SPROUT SHIPPING PINE
            </Button>
          </form>
        )}

        {/* 2. Revenue Stream Track (Independent of Commits) */}
        {activeTab === "revenue" && (
          <form onSubmit={handlePlantRevenueTree} className="space-y-3.5 font-satoshi">
            <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1">
              <span className="font-bold block flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-amber-700" /> Golden Revenue Grove (Monetization Track)
              </span>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Plant a Golden Pine for a paying subscriber, customer cohort, or Stripe MRR milestone. Expands in size as subscription value grows.
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                Customer, Tier, or Business Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp / Pro Plan"
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20 font-satoshi"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                Monthly Recurring Revenue ($/mo)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-stone-400 absolute left-3.5 top-2.5" />
                <input
                  type="number"
                  min="1"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  placeholder="29"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 font-mono font-bold outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/20"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="dark"
              size="md"
              showArrow
              className="w-full mt-2"
            >
              SPROUT GOLDEN REVENUE PINE
            </Button>
          </form>
        )}

        {/* 3. Live Webhooks & Developer Sandbox */}
        {activeTab === "webhooks" && (
          <div className="space-y-3.5 font-satoshi">
            <p className="text-xs text-stone-600 leading-relaxed">
              Connect your live payment gateway or GitHub repository to automate tree planting:
            </p>

            {/* Live Endpoints */}
            <div className="space-y-2">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-600" /> Stripe / Polar / LemonSqueezy Webhook
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(revenueWebhookUrl, "revenue")}
                    className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-[11px] font-semibold transition"
                  >
                    {copiedKey === "revenue" ? (
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy className="w-3 h-3" /> Copy URL
                      </span>
                    )}
                  </button>
                </div>
                <code className="text-[11px] font-mono text-stone-600 bg-white px-2 py-1 rounded border border-stone-200 block truncate">
                  {revenueWebhookUrl}
                </code>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-900 flex items-center gap-1.5">
                    <GitBranch className="w-3.5 h-3.5 text-emerald-600" /> GitHub Push Webhook
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(githubWebhookUrl, "github")}
                    className="text-stone-500 hover:text-stone-900 flex items-center gap-1 text-[11px] font-semibold transition"
                  >
                    {copiedKey === "github" ? (
                      <span className="text-emerald-700 flex items-center gap-0.5">
                        <Check className="w-3 h-3" /> Copied
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5">
                        <Copy className="w-3 h-3" /> Copy URL
                      </span>
                    )}
                  </button>
                </div>
                <code className="text-[11px] font-mono text-stone-600 bg-white px-2 py-1 rounded border border-stone-200 block truncate">
                  {githubWebhookUrl}
                </code>
              </div>
            </div>

            {/* Collapsible Sandbox for Testing */}
            <details className="pt-2 border-t border-stone-100 group">
              <summary className="text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer flex items-center justify-between select-none">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-stone-500" /> Developer Sandbox (Test Sprouting)
                </span>
                <span className="text-[10px] text-stone-400 group-open:rotate-180 transition-transform">▾</span>
              </summary>
              
              <div className="pt-2.5 space-y-2">
                {simSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-medium flex items-center gap-1.5 animate-in fade-in">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Simulated Webhook Delivered: Pine Sprouted!</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSimulateWebhook(29, "Starter User")}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-left transition cursor-pointer"
                  >
                    <div className="font-bold text-stone-900 text-xs">$29 Subscriber</div>
                    <div className="text-[10px] text-stone-500">Test Webhook</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSimulateWebhook(99, "Pro Subscriber")}
                    className="p-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-left transition cursor-pointer"
                  >
                    <div className="font-bold text-stone-900 text-xs">$99 Enterprise</div>
                    <div className="text-[10px] text-stone-500">Test Webhook</div>
                  </button>
                </div>
              </div>
            </details>

          </div>
        )}

      </div>
    </Modal>
  );
}
