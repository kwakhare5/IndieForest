"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Tent, Shield, Coffee, Info } from "lucide-react";
import { useForestStore } from "@/store/useForestStore";
import { sound } from "@/lib/sound";

interface TentSabbaticalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TentSabbaticalModal({ isOpen, onClose }: TentSabbaticalModalProps) {
  const streakShields = useForestStore((s) => s.streakShields);
  const [isSabbaticalActive, setIsSabbaticalActive] = useState(false);

  const handleToggleSabbatical = () => {
    sound.playClick();
    setIsSabbaticalActive(!isSabbaticalActive);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Campsite Rest & Sabbatical"
      badgeText="Anti-Burnout"
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
              <span className="font-bold text-xs text-stone-900 font-sans block">
                Streak Shield Vault
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Anti-Burnout & Rest Planner
              </span>
            </div>
          </div>

          <Badge variant={streakShields > 0 ? "emerald" : "stone"} size="md">
            {streakShields} / 2 Shields Active
          </Badge>
        </div>

        {/* Shield Inventory Slots */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className={`p-3.5 rounded-xl border text-center space-y-1.5 ${
              streakShields >= 1
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-stone-200 bg-stone-50/50 opacity-70"
            }`}
          >
            <div className="w-7 h-7 mx-auto rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700">
              <Shield className={`w-3.5 h-3.5 ${streakShields >= 1 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-bold text-stone-900 font-sans">Shield Slot I</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 1 ? "Active Protection" : "Earned at 7-day streak"}
            </span>
          </div>

          <div
            className={`p-3.5 rounded-xl border text-center space-y-1.5 ${
              streakShields >= 2
                ? "border-emerald-200 bg-emerald-50/50"
                : "border-stone-200 bg-stone-50/50 opacity-70"
            }`}
          >
            <div className="w-7 h-7 mx-auto rounded-full bg-white shadow-xs flex items-center justify-center text-emerald-700">
              <Shield className={`w-3.5 h-3.5 ${streakShields >= 2 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-bold text-stone-900 font-sans">Shield Slot II</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 2 ? "Active Protection" : "Earned at 14-day streak"}
            </span>
          </div>
        </div>

        {/* Sabbatical Action Row */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Coffee className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-stone-900 font-sans block">
                Sabbatical Rest Mode
              </span>
              <span className="text-[10px] text-stone-400">
                Pause without losing momentum
              </span>
            </div>
          </div>

          <Button
            variant={isSabbaticalActive ? "emerald" : "outline"}
            size="sm"
            onClick={handleToggleSabbatical}
            className="text-xs"
          >
            {isSabbaticalActive ? "Active (Resting)" : "Schedule Rest"}
          </Button>
        </div>

        {/* Helper Note */}
        <div className="flex items-start gap-1.5 pt-1 text-[11px] text-stone-400 font-sans">
          <Info className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
          <span>
            IndieForest uses a rolling 30-day health metric instead of punishing missed days. Sabbaticals protect your streaks.
          </span>
        </div>
      </div>
    </Modal>
  );
}
