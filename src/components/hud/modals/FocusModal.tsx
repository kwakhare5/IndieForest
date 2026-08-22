"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Flame, Volume2, VolumeX, Sparkles, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { useForestStore } from "@/store/useForestStore";
import type { ShipLog } from "@/types/game";

interface FocusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FocusModal({ isOpen, onClose }: FocusModalProps) {
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const streakDays = useForestStore((s) => s.streakDays);
  const shipHistory = useForestStore((s) => s.shipHistory);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayShip = shipHistory.find((s: ShipLog) => s.date.startsWith(todayStr));

  const toggleCampfireAudio = () => {
    const active = sound.toggleCampfireAmbiance();
    setIsAudioPlaying(active);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Focus Station & Ambiance"
      badgeText="Campfire Milestone"
      icon={Flame}
      maxWidth="md"
    >
      <div className="space-y-4 font-sans text-xs text-stone-700">
        {/* Campfire Header Row */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-600 border border-orange-200/80 flex items-center justify-center">
              <Flame className="w-4.5 h-4.5 fill-orange-500" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 font-sans block">
                Campfire Focus
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                {streakDays > 0 ? `${streakDays}-day streak active` : "Deep work station"}
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleCampfireAudio}
            icon={isAudioPlaying ? Volume2 : VolumeX}
            className={`text-xs ${isAudioPlaying ? "border-orange-300 bg-orange-50 text-orange-800 font-bold" : ""}`}
          >
            {isAudioPlaying ? "Lo-Fi Playing" : "Play Lo-Fi Ambiance"}
          </Button>
        </div>

        {/* Automated Daily Shipping Status Card */}
        <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-stone-900 font-sans">
              Today&apos;s Shipping Status
            </span>
            {todayShip ? (
              <span className="flex items-center gap-1 text-emerald-700 text-[11px] font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Shipped Today
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-700 text-[11px] font-bold">
                <Sparkles className="w-3.5 h-3.5" /> Awaiting Git Push
              </span>
            )}
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed font-sans">
            {todayShip
              ? `Auto-detected from git: "${todayShip.message}"`
              : "When you push commits to GitHub, IndieForest automatically detects your activity, grows your trees, and extends your streak."}
          </p>
        </div>
      </div>
    </Modal>
  );
}
