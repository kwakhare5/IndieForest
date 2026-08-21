"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Sparkles, X, ChevronDown, Rocket } from "lucide-react";
import { sound } from "@/lib/sound";

interface SproutGuideProps {
  onOpenShipModal: () => void;
}

export function SproutGuide({ onOpenShipModal }: SproutGuideProps) {
  const completeSproutGuide = useForestStore(
    (s) => s.completeSproutGuide
  );
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const handleDismiss = () => {
    sound.playClick();
    setIsDismissed(true);
    completeSproutGuide();
  };

  const handleAction = () => {
    sound.playCoin();
    onOpenShipModal();
  };

  return (
    <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-30 pointer-events-auto flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-300 font-satoshi select-none max-w-sm sm:max-w-md w-full px-4">
      {/* Speech Bubble Enclosure */}
      <div className="p-1 rounded-2xl glass-dock shadow-2xl relative w-full">
        <div className="px-3.5 py-2.5 rounded-[calc(1rem-0.125rem)] porcelain-surface flex items-center justify-between gap-3 text-stone-900">
          
          {/* Left Icon & Text */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 animate-spin duration-3000" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-950 font-satoshi truncate">
                  Welcome to your Virgin Island
                </span>
                <Badge variant="pixel" size="sm" className="hidden sm:inline-flex shrink-0">
                  +150 XP FIRST SHIP
                </Badge>
              </div>
              <p className="text-[11px] text-stone-600 font-medium truncate mt-0.5">
                Log your first daily ship below to sprout trees!
              </p>
            </div>
          </div>

          {/* Right Action & Dismiss */}
          <div className="flex items-center gap-1.5 shrink-0">
            <Button
              variant="emerald"
              size="sm"
              onClick={handleAction}
              icon={Rocket}
              className="h-7 px-2.5 text-[11px]"
            >
              Start
            </Button>

            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
              title="Dismiss Guide"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Downward Pointer Triangle Centered toward LOG DAILY SHIP */}
      <div className="text-stone-300 -mt-1 drop-shadow-sm flex items-center justify-center">
        <ChevronDown className="w-5 h-5 animate-bounce text-emerald-700" />
      </div>
    </div>
  );
}
