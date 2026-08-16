"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Target, Github, Send, ArrowRight, Check } from "lucide-react";
import { sound } from "@/lib/sound";

interface SproutGuideProps {
  onOpenShipModal: () => void;
}

export function SproutGuide({ onOpenShipModal }: SproutGuideProps) {
  const todayFocus = useForestStore((s) => s.todayFocus);
  const setTodayFocus = useForestStore((s) => s.setTodayFocus);
  const setGithubRepo = useForestStore((s) => s.setGithubRepo);
  const user = useForestStore((s) => s.user);

  const [focusInput, setFocusInput] = useState(todayFocus);
  const [repoInput, setRepoInput] = useState(user.githubRepo || "");
  const [step, setStep] = useState<1 | 2>(1);

  const handleSaveFocus = (e: React.FormEvent) => {
    e.preventDefault();
    if (focusInput.trim()) {
      setTodayFocus(focusInput.trim());
      sound.playCoin();
      setStep(2);
    }
  };

  const handleSaveRepoAndShip = (e: React.FormEvent) => {
    e.preventDefault();
    if (repoInput.trim()) {
      setGithubRepo(repoInput.trim());
    }
    sound.playLevelUp();
    onOpenShipModal();
  };

  return (
    <div className="absolute top-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-md px-4 pointer-events-auto animate-in fade-in slide-in-from-top-4 duration-300 font-satoshi">
      <div className="p-1 rounded-[2.25rem] glass-dock shadow-2xl">
        <div className="p-6 rounded-[calc(2.25rem-0.375rem)] porcelain-surface space-y-4 text-stone-900">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-stone-950 font-satoshi">Welcome to your Virgin Island</h3>
                <span className="text-[10px] text-stone-500 font-pixel">Step {step} of 2 • Sprout Guide</span>
              </div>
            </div>

            <Badge variant="pixel" size="sm">+150 XP First Ship</Badge>
          </div>

          {/* Step 1: Set Today's #1 Focus Task */}
          {step === 1 && (
            <form onSubmit={handleSaveFocus} className="space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed font-satoshi">
                What is the single most important task or feature you are coding today?
              </p>
              <div className="relative">
                <Target className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={focusInput}
                  onChange={(e) => setFocusInput(e.target.value)}
                  placeholder="e.g. Build Google OAuth & Clean HUD"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-satoshi font-medium"
                />
              </div>

              <Button
                type="submit"
                variant="emerald"
                size="md"
                showArrow
                arrowType="right"
                className="w-full"
              >
                Next: Connect GitHub
              </Button>
            </form>
          )}

          {/* Step 2: Link GitHub & Log First Ship */}
          {step === 2 && (
            <form onSubmit={handleSaveRepoAndShip} className="space-y-3">
              <p className="text-xs text-stone-600 leading-relaxed font-satoshi">
                Enter your public GitHub repo to auto-scan commits, or skip to ship manually:
              </p>
              <div className="relative">
                <Github className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={repoInput}
                  onChange={(e) => setRepoInput(e.target.value)}
                  placeholder="e.g. kwakhare5/IndieForest"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 font-mono placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="md"
                  onClick={() => onOpenShipModal()}
                >
                  Skip Repo
                </Button>
                <Button
                  type="submit"
                  variant="emerald"
                  size="md"
                  showArrow
                >
                  LOG FIRST SHIP
                </Button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
