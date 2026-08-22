"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Flame, Volume2, VolumeX, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import { sound } from "@/lib/sound";
import { useForestStore } from "@/store/useForestStore";

interface CampfireFocusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampfireFocusModal({ isOpen, onClose }: CampfireFocusModalProps) {
  const [goal, setGoal] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [hasShippedToday, setHasShippedToday] = useState(false);

  const shipToday = useForestStore((s) => s.shipToday);
  const streakDays = useForestStore((s) => s.streakDays);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0 && isTimerRunning) {
      setIsTimerRunning(false);
      sound.playLevelUp();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timerSeconds]);

  const toggleCampfireAudio = () => {
    const active = sound.toggleCampfireAmbiance();
    setIsAudioPlaying(active);
  };

  const handleCommitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    shipToday(`Shipped focus goal: ${goal.trim()}`, "manual");
    setHasShippedToday(true);
    sound.playShipSuccess();
    setGoal("");
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Campsite Focus & Pomodoro"
      badgeText="Proof of Work"
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
                Daily Focus Milestone
              </span>
              <span className="text-[10px] text-stone-400 font-sans">
                Day {streakDays} Milestone Campfire
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleCampfireAudio}
            icon={isAudioPlaying ? Volume2 : VolumeX}
            className={`text-xs ${isAudioPlaying ? "border-orange-300 bg-orange-50 text-orange-800" : ""}`}
          >
            {isAudioPlaying ? "Lo-Fi Active" : "Play Lo-Fi"}
          </Button>
        </div>

        {/* 1 Atomic Thing Form */}
        <div className="space-y-2">
          <div>
            <label className="text-xs font-bold text-stone-900 font-sans block">
              What is the ONE atomic thing you are shipping today?
            </label>
            <p className="text-[11px] text-stone-400 font-sans">
              Eliminate morning decision paralysis. Pick one high-leverage task.
            </p>
          </div>

          {hasShippedToday ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You logged today&apos;s daily focus! Keep the momentum alive.</span>
            </div>
          ) : (
            <form onSubmit={handleCommitGoal} className="space-y-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Ship billing checkout drawer & verify webhook"
                className="w-full px-3 py-2 rounded-xl border border-stone-200 bg-stone-50 text-xs font-sans text-stone-900 placeholder:text-stone-400 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
              />
              <Button
                type="submit"
                variant="emerald"
                size="sm"
                icon={Sparkles}
                disabled={!goal.trim()}
                className="w-full justify-center text-xs font-bold"
              >
                Log Atomic Ship (+25 XP)
              </Button>
            </form>
          )}
        </div>

        {/* 25-Minute Deep Work Pomodoro Timer */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 font-sans font-medium block">
              Deep Work Sprint
            </span>
            <div className="text-xl font-bold font-mono tracking-tight text-stone-900">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="dark"
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              icon={isTimerRunning ? Pause : Play}
              className="text-xs"
            >
              {isTimerRunning ? "Pause" : "Start 25m"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsTimerRunning(false);
                setTimerSeconds(25 * 60);
              }}
              icon={RotateCcw}
              className="text-xs"
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
