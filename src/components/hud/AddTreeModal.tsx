"use client";

import React, { useState } from "react";
import { useForestStore, GrowthTier, TreeType } from "@/store/useForestStore";
import { Trees, DollarSign, Zap, Check, TrendingUp } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TAB_OPTIONS: SegmentedOption<"manual" | "simulator">[] = [
  { value: "manual", label: "Plant Tree" },
  { value: "simulator", label: "Webhook Simulator", icon: Zap },
];

const TYPE_OPTIONS: SegmentedOption<TreeType>[] = [
  { value: "shipping", label: "Shipping Milestone", icon: Trees },
  { value: "revenue", label: "Paying Subscriber", icon: TrendingUp },
];

const TIER_OPTIONS: SegmentedOption<GrowthTier>[] = [
  { value: "sapling", label: "Sapling" },
  { value: "young", label: "Young" },
  { value: "mature", label: "Mature" },
  { value: "majestic", label: "Majestic" },
];

export function AddTreeModal({ isOpen, onClose }: AddTreeModalProps) {
  const addTree = useForestStore((s) => s.addTree);

  const [activeTab, setActiveTab] = useState<"manual" | "simulator">("manual");
  const [treeType, setTreeType] = useState<TreeType>("shipping");
  const [name, setName] = useState("");
  const [mrr, setMrr] = useState("29");
  const [tier, setTier] = useState<GrowthTier>("young");
  const [simSuccess, setSimSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTree(
      name.trim(),
      treeType === "revenue" ? parseInt(mrr) || 0 : 0,
      tier,
      treeType
    );

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: treeType === "revenue" ? ["#f59e0b", "#fbbf24"] : ["#10b981", "#34d399"],
    });

    setName("");
    onClose();
  };

  const handleSimulateWebhook = async (amount: number, customerName: string) => {
    addTree(customerName, amount, amount >= 100 ? "majestic" : amount >= 50 ? "mature" : "young", "revenue");

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
    }, 1500);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Grow Island Forest"
      badgeText="Dual-Grove Engine"
      icon={Trees}
    >
      <div className="space-y-4 font-satoshi">
        
        {/* Tab Switcher */}
        <SegmentedControl
          options={TAB_OPTIONS}
          value={activeTab}
          onChange={(val) => setActiveTab(val)}
        />

        {activeTab === "manual" && (
          <form onSubmit={handleSubmit} className="space-y-3.5 font-satoshi">
            
            {/* Tree Type Switcher */}
            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                Tree Category
              </label>
              <SegmentedControl
                options={TYPE_OPTIONS}
                value={treeType}
                onChange={(val) => setTreeType(val)}
                size="sm"
              />
            </div>

            {/* Tree Label / Customer Name */}
            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                {treeType === "revenue" ? "Customer or Company Name" : "Milestone or Feature Name"}
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={treeType === "revenue" ? "e.g. Acme Corp" : "e.g. 100 Beta Signups"}
                className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-satoshi"
              />
            </div>

            {/* MRR Field (If Revenue) */}
            {treeType === "revenue" && (
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
                    className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 font-pixel outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                  />
                </div>
              </div>
            )}

            {/* Growth Tier */}
            <div>
              <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
                Growth Stage
              </label>
              <SegmentedControl
                options={TIER_OPTIONS}
                value={tier}
                onChange={(val) => setTier(val)}
                size="sm"
              />
            </div>

            {/* Submit CTA */}
            <Button
              type="submit"
              variant={treeType === "revenue" ? "dark" : "emerald"}
              size="md"
              showArrow
              className="w-full mt-2"
            >
              {treeType === "revenue" ? "SPROUT REVENUE PINE" : "PLANT SHIPPING PINE"}
            </Button>
          </form>
        )}

        {activeTab === "simulator" && (
          <div className="space-y-3 font-satoshi">
            <p className="text-xs text-stone-600 leading-relaxed">
              Test how Stripe or Lemon Squeezy sales trigger real-time pine tree sprouts on your island:
            </p>

            {simSuccess && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-pixel font-bold flex items-center gap-1.5 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Simulated Sale Received: Revenue Pine Sprouted on Island!</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-2.5">
              <Card
                variant="subtle-inset"
                className="p-3.5 flex items-center justify-between hover:border-stone-300 transition cursor-pointer"
                onClick={() => handleSimulateWebhook(29, "Starter Subscriber")}
              >
                <div>
                  <div className="font-bold text-stone-900 text-xs">$29/mo Starter Plan</div>
                  <div className="text-[11px] text-stone-500">Sprouts a Young Golden Pine</div>
                </div>
                <Button variant="emerald" size="sm" icon={Zap}>
                  Test $29
                </Button>
              </Card>

              <Card
                variant="subtle-inset"
                className="p-3.5 flex items-center justify-between hover:border-stone-300 transition cursor-pointer"
                onClick={() => handleSimulateWebhook(99, "Pro Enterprise")}
              >
                <div>
                  <div className="font-bold text-stone-900 text-xs">$99/mo Pro Enterprise</div>
                  <div className="text-[11px] text-stone-500">Sprouts a Majestic Ancient Pine</div>
                </div>
                <Button variant="dark" size="sm" icon={Zap}>
                  Test $99
                </Button>
              </Card>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
}
