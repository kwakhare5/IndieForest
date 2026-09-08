"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import { Tent, Shield, HeartHandshake, Info } from "lucide-react";
import { useForestStore } from "@/store/useForestStore";

interface RestShieldModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RestShieldModal({ isOpen, onClose }: RestShieldModalProps) {
  const streakShields = useForestStore((s) => s.streakShields);
  const streakDays = useForestStore((s) => s.streakDays);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Rest Shields & Streak Protection"
      badgeText="Tent Milestone"
      icon={Tent}
      maxWidth="md"
    >
      <div className="space-y-4 font-sans text-xs text-stone-700">
        {/* Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center justify-center">
              <Tent className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="font-medium text-xs text-stone-900 font-sans block">
                Rest Protection
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Day {streakDays} Milestone
              </span>
            </div>
          </div>

          <Badge variant={streakShields > 0 ? "emerald" : "stone"} size="md">
            {streakShields} / 2 Shields Banked
          </Badge>
        </div>

        {/* Shield Inventory Slots */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
              streakShields >= 1
                ? "border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-emerald-100/60 shadow-[0_2px_8px_-2px_rgba(5,150,105,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"
                : "border-stone-200/80 bg-stone-50/70 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] opacity-70"
            }`}
          >
            <div className="w-7 h-7 mx-auto rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700 border border-stone-200/80">
              <Shield className={`w-3.5 h-3.5 ${streakShields >= 1 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-medium text-stone-900 font-sans">Rest Shield I</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 1 ? "Active · Protects 1 Rest Day" : "Earned at 7-day streak"}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-2xl border text-center space-y-1.5 transition-all ${
              streakShields >= 2
                ? "border-emerald-300/80 bg-gradient-to-b from-emerald-50 to-emerald-100/60 shadow-[0_2px_8px_-2px_rgba(5,150,105,0.15),inset_0_1px_0_rgba(255,255,255,0.9)]"
                : "border-stone-200/80 bg-stone-50/70 shadow-[inset_0_1.5px_3px_rgba(0,0,0,0.04)] opacity-70"
            }`}
          >
            <div className="w-7 h-7 mx-auto rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700 border border-stone-200/80">
              <Shield className={`w-3.5 h-3.5 ${streakShields >= 2 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-medium text-stone-900 font-sans">Rest Shield II</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 2 ? "Active · Protects 1 Rest Day" : "Earned at 14-day streak"}
            </span>
          </div>
        </div>

        {/* Anti-Burnout Philosophy Card */}
        <div className="p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/80 shadow-[inset_0_2px_4px_rgba(28,25,23,0.05),inset_0_-1px_0_rgba(255,255,255,0.85)] flex items-start gap-2.5">
          <HeartHandshake className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
          <div className="space-y-1">
            <span className="text-xs font-medium text-stone-900 font-sans block">
              Sustainable Shipping
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
              IndieForest calculates consistency on a rolling 30-day health ratio. If you take a weekend off or take a break, your shields deploy automatically to protect your streak.
            </p>
          </div>
        </div>

        {/* Helper Note */}
        <div className="flex items-start gap-1.5 pt-1 text-[11px] text-stone-400 font-sans border-t border-stone-100">
          <Info className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
          <span>Rest shields replenish automatically as you maintain daily shipping momentum.</span>
        </div>
      </div>
    </Modal>
  );
}
