"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
    <Modal isOpen={isOpen} onClose={onClose} title="Milestone Campfire" maxWidth="md">
      <div className="space-y-5">
        {/* Campfire Header Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
              <Flame className="w-5 h-5 fill-orange-500" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 font-sans">
                Daily Focus Station
              </h4>
              <p className="text-xs text-stone-500 font-sans">
                Day {streakDays} Milestone Campfire
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={toggleCampfireAudio}
            icon={isAudioPlaying ? Volume2 : VolumeX}
            className={isAudioPlaying ? "border-orange-400 bg-orange-50 text-orange-800" : ""}
          >
            {isAudioPlaying ? "Lo-Fi Active" : "Play Lo-Fi"}
          </Button>
        </div>

        {/* 1 Atomic Thing Input */}
        <Card variant="porcelain" className="p-5 rounded-2xl space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-bold text-stone-900 font-sans block">
              What is the ONE atomic thing you are shipping today?
            </label>
            <p className="text-[11px] text-stone-500 font-sans">
              Eliminate morning decision paralysis. Pick one high-leverage task.
            </p>
          </div>

          {hasShippedToday ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>You logged today&apos;s daily focus! Keep the momentum alive.</span>
            </div>
          ) : (
            <form onSubmit={handleCommitGoal} className="space-y-3">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g. Ship billing checkout drawer & verify webhook"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300/80 bg-white text-xs font-sans text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition"
              />
              <Button
                type="submit"
                variant="emerald"
                size="sm"
                icon={Sparkles}
                disabled={!goal.trim()}
                className="w-full justify-center"
              >
                Log Atomic Ship (+25 XP)
              </Button>
            </form>
          )}
        </Card>

        {/* 25-Minute Deep Work Pomodoro Timer */}
        <Card variant="subtle-inset" className="p-4 rounded-2xl flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[11px] text-stone-500 font-sans font-medium block">
              Deep Work Sprint
            </span>
            <div className="text-2xl font-bold font-mono tracking-tight text-stone-900">
              {formatTime(timerSeconds)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="dark"
              size="sm"
              onClick={() => setIsTimerRunning(!isTimerRunning)}
              icon={isTimerRunning ? Pause : Play}
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
            >
              Reset
            </Button>
          </div>
        </Card>
      </div>
    </Modal>
  );
}
