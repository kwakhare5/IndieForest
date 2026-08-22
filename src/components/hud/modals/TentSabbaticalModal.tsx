"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <Modal isOpen={isOpen} onClose={onClose} title="Campsite Rest Vault" maxWidth="md">
      <div className="space-y-5">
        {/* Tent Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-50 to-emerald-50 border border-amber-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
              <Tent className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 font-sans">
                Streak Shield Vault & Rest Planner
              </h4>
              <p className="text-xs text-stone-500 font-sans">
                Anti-Burnout & Sabbatical Mode
              </p>
            </div>
          </div>

          <Badge variant={streakShields > 0 ? "emerald" : "stone"} size="md">
            {streakShields} / 2 Shields
          </Badge>
        </div>

        {/* Shield Inventory Cards */}
        <div className="grid grid-cols-2 gap-3">
          <Card
            variant="porcelain"
            className={`p-4 rounded-2xl border text-center space-y-2 ${
              streakShields >= 1
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-stone-200 bg-stone-50/40 opacity-70"
            }`}
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700">
              <Shield className={`w-4 h-4 ${streakShields >= 1 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-bold text-stone-900 font-sans">Shield Slot I</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 1 ? "Active Protection" : "Earned at 7-day streak"}
            </span>
          </Card>

          <Card
            variant="porcelain"
            className={`p-4 rounded-2xl border text-center space-y-2 ${
              streakShields >= 2
                ? "border-emerald-300 bg-emerald-50/40"
                : "border-stone-200 bg-stone-50/40 opacity-70"
            }`}
          >
            <div className="w-8 h-8 mx-auto rounded-full bg-white shadow-sm flex items-center justify-center text-emerald-700">
              <Shield className={`w-4 h-4 ${streakShields >= 2 ? "fill-emerald-600" : "text-stone-400"}`} />
            </div>
            <div className="text-xs font-bold text-stone-900 font-sans">Shield Slot II</div>
            <span className="text-[10px] text-stone-500 block">
              {streakShields >= 2 ? "Active Protection" : "Earned at 14-day streak"}
            </span>
          </Card>
        </div>

        {/* Sabbatical / Touch Grass Mode Action */}
        <Card variant="subtle-inset" className="p-4 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-stone-900 font-sans">
                  Touch Grass / Sabbatical Mode
                </h5>
                <span className="text-[11px] text-stone-500">
                  Take planned rest without guilt or losing past work
                </span>
              </div>
            </div>

            <Button
              variant={isSabbaticalActive ? "emerald" : "outline"}
              size="sm"
              onClick={handleToggleSabbatical}
            >
              {isSabbaticalActive ? "Active (Resting)" : "Schedule Rest"}
            </Button>
          </div>

          <div className="flex items-start gap-2 pt-2 text-[11px] text-stone-500 border-t border-stone-200/80 font-sans">
            <Info className="w-3.5 h-3.5 text-stone-400 mt-0.5 shrink-0" />
            <span>
              IndieForest uses a rolling 30-day health ratio instead of punishing missed days. Sabbaticals preserve your momentum.
            </span>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
