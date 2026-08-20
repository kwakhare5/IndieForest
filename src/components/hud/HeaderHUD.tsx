"use client";

import React, { useState } from "react";
import {
  useForestStore,
  getRankTitle,
  getXpForLevel,
} from "@/store/useForestStore";
import {
  Flame,
  Shield,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  ShoppingBag,
  Share2,
  PlusCircle,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { sound } from "@/lib/sound";

interface HeaderHUDProps {
  onOpenShipModal: () => void;
  onOpenShopModal: () => void;
  onOpenShareModal: () => void;
  onOpenAddTreeModal: () => void;
}

export function HeaderHUD({
  onOpenShipModal,
  onOpenShopModal,
  onOpenShareModal,
  onOpenAddTreeModal,
}: HeaderHUDProps) {
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const pinecones = useForestStore((s) => s.pinecones);
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const setTimeOfDay = useForestStore((s) => s.setTimeOfDay);

  const [isMuted, setIsMuted] = useState(sound.getMuted());

  const { title, badge } = getRankTitle(level);
  const maxXp = getXpForLevel(level);
  const xpPercent = Math.min(Math.round((xp / maxXp) * 100), 100);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 pointer-events-none flex items-center justify-between gap-4">
      {/* Left: Player Profile & Level (Double-Bezel Architecture) */}
      <div className="pointer-events-auto group">
        <div className="p-1 rounded-[1.75rem] bg-emerald-950/40 ring-1 ring-emerald-500/20 backdrop-blur-2xl shadow-2xl transition-all duration-300 hover:ring-emerald-500/40">
          <div className="px-4 py-2.5 rounded-[calc(1.75rem-0.25rem)] bg-[#0d1c16]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] flex items-center gap-3.5">
            {/* Avatar Badge */}
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-400/30 flex items-center justify-center text-xl shadow-inner">
              {badge}
            </div>

            {/* Rank Title & Level */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-xs text-emerald-100 tracking-tight">
                  {title}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-400/30 uppercase tracking-widest">
                  LVL {level}
                </span>
              </div>

              {/* High-End XP Progress Bar */}
              <div className="flex items-center gap-2.5 mt-1.5">
                <div className="w-32 h-1.5 bg-black/60 rounded-full overflow-hidden ring-1 ring-emerald-900/50">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full transition-all duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                    style={{ width: `${xpPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-mono text-emerald-400/70 font-medium">
                  {xp}/{maxXp} XP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Controls & Actions */}
      <div className="pointer-events-auto flex items-center gap-2 sm:gap-2.5">
        {/* Streak Flame Pill */}
        <div className="p-1 rounded-2xl bg-amber-950/40 ring-1 ring-amber-500/20 backdrop-blur-xl hidden sm:block">
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#1a1409]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-2">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-400 animate-pulse" />
            <span className="text-xs font-bold text-amber-100 font-mono tracking-tight">
              {streakDays}d Streak
            </span>
          </div>
        </div>

        {/* Streak Shield Badge */}
        <div className="p-1 rounded-2xl bg-sky-950/40 ring-1 ring-sky-500/20 backdrop-blur-xl hidden md:block">
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#0c1924]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-xs font-mono font-bold text-sky-200">
              {streakShields}/2 Shields
            </span>
          </div>
        </div>

        {/* Pinecones Currency */}
        <div className="p-1 rounded-2xl bg-amber-950/40 ring-1 ring-amber-500/20 backdrop-blur-xl">
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#1a1409]/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-1.5">
            <span className="text-xs">🌰</span>
            <span className="text-xs font-mono font-bold text-amber-200">{pinecones}</span>
          </div>
        </div>

        {/* Shop Button */}
        <button
          onClick={onOpenShopModal}
          className="p-1 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 hover:ring-emerald-500/40 backdrop-blur-xl transition active:scale-[0.97]"
          title="Camp Cosmetic Shop"
        >
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#0d1c16]/90 hover:bg-[#132820] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-1.5 text-emerald-300 hover:text-white transition">
            <ShoppingBag className="w-4 h-4" />
            <span className="text-xs font-semibold hidden lg:inline">Shop</span>
          </div>
        </button>

        {/* Add Tree Button */}
        <button
          onClick={onOpenAddTreeModal}
          className="p-1 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 hover:ring-emerald-500/40 backdrop-blur-xl transition active:scale-[0.97]"
          title="Add Customer Tree"
        >
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#0d1c16]/90 hover:bg-[#132820] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-1.5 text-emerald-300 hover:text-white transition">
            <PlusCircle className="w-4 h-4" />
            <span className="text-xs font-semibold hidden lg:inline">Tree</span>
          </div>
        </button>

        {/* Time of Day Switcher */}
        <div className="p-1 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 backdrop-blur-xl flex items-center gap-0.5">
          <button
            onClick={() => setTimeOfDay("day")}
            className={`p-1.5 rounded-xl transition ${
              timeOfDay === "day"
                ? "bg-amber-500/20 text-amber-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                : "text-slate-400 hover:text-white"
            }`}
            title="Daytime"
          >
            <Sun className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("sunset")}
            className={`p-1.5 rounded-xl transition ${
              timeOfDay === "sunset"
                ? "bg-amber-500/20 text-amber-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                : "text-slate-400 hover:text-white"
            }`}
            title="Sunset Golden Hour"
          >
            <Sunset className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTimeOfDay("night")}
            className={`p-1.5 rounded-xl transition ${
              timeOfDay === "night"
                ? "bg-sky-500/20 text-sky-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                : "text-slate-400 hover:text-white"
            }`}
            title="Night & Fireflies"
          >
            <Moon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Audio Mute Toggle */}
        <button
          onClick={toggleSound}
          className="p-2.5 rounded-2xl bg-emerald-950/40 ring-1 ring-emerald-500/20 hover:ring-emerald-500/40 text-slate-400 hover:text-white backdrop-blur-xl transition active:scale-[0.97]"
          title={isMuted ? "Unmute Sound" : "Mute Sound"}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {/* Share to X Button */}
        <button
          onClick={onOpenShareModal}
          className="p-1 rounded-2xl bg-sky-950/40 ring-1 ring-sky-500/20 hover:ring-sky-500/40 backdrop-blur-xl transition active:scale-[0.97]"
          title="Share to X"
        >
          <div className="px-3 py-1.5 rounded-[calc(1rem-0.125rem)] bg-[#0c1924]/90 text-sky-400 hover:text-sky-200 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center gap-1.5 transition">
            <Share2 className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold hidden md:inline">Share</span>
          </div>
        </button>

        {/* Primary CTA: "Button-in-Button" Island Architecture */}
        <button
          onClick={onOpenShipModal}
          className="group relative inline-flex items-center gap-2.5 pl-4 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500 text-slate-950 font-extrabold text-xs tracking-wider shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:shadow-emerald-500/40 hover:scale-[1.03] active:scale-[0.97]"
        >
          <span className="font-mono">SHIP IT</span>
          {/* Nested Circular Icon Enclosure */}
          <div className="w-7 h-7 rounded-full bg-slate-950/20 flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110">
            <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </button>
      </div>
    </header>
  );
}
