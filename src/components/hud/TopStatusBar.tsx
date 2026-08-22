"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useForestStore, getRankTitle, getXpForLevel } from "@/store/useForestStore";
import { calculateForestHealth } from "@/lib/gamification";
import {
  ArrowLeft,
  Sun,
  Sunset,
  Moon,
  Volume2,
  VolumeX,
  Settings,
  Trees,
  Target,
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  User,
  Sliders,
  Flame,
  Shield,
  RefreshCw,
} from "lucide-react";
import { sound } from "@/lib/sound";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

interface TopStatusBarProps {
  onOpenSettings: () => void;
  onOpenShipModal?: () => void;
  onOpenShareModal?: () => void;
}

export function TopStatusBar({
  onOpenSettings,
  onOpenShipModal,
  onOpenShareModal,
}: TopStatusBarProps) {
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const pinecones = useForestStore((s) => s.pinecones);
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);
  const shipHistory = useForestStore((s) => s.shipHistory);
  const isAutoSyncing = useForestStore((s) => s.isAutoSyncing);
  const syncGitHubIsland = useForestStore((s) => s.syncGitHubIsland);
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const setTimeOfDay = useForestStore((s) => s.setTimeOfDay);
  const setUser = useForestStore((s) => s.setUser);
  const user = useForestStore((s) => s.user);
  const quests = useForestStore((s) => s.quests);
  const checkOffQuest = useForestStore((s) => s.checkOffQuest);

  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());
  const [isQuestOpen, setIsQuestOpen] = useState(false);
  const [isControlsOpen, setIsControlsOpen] = useState(false);

  const questDropdownRef = useRef<HTMLDivElement>(null);
  const controlsDropdownRef = useRef<HTMLDivElement>(null);

  const completedQuestCount = quests.filter((q) => q.completed).length;
  const isAllQuestsComplete =
    completedQuestCount === quests.length && quests.length > 0;

  const { badge, title: rankTitle } = getRankTitle(level);

  // Calculate 30-day Forest Health %
  const activeDates = shipHistory.map((s) => s.date);
  if (activeDates.length === 0 && streakDays > 0) {
    const base = new Date();
    for (let i = 0; i < Math.min(streakDays, 30); i++) {
      activeDates.push(new Date(base.getTime() - i * 86400000).toISOString().slice(0, 10));
    }
  }
  const forestHealth = calculateForestHealth(activeDates);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        questDropdownRef.current &&
        !questDropdownRef.current.contains(event.target as Node)
      ) {
        setIsQuestOpen(false);
      }
      if (
        controlsDropdownRef.current &&
        !controlsDropdownRef.current.contains(event.target as Node)
      ) {
        setIsControlsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  React.useEffect(() => {
    if (isLoaded && isSignedIn && clerkUser) {
      setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        username:
          clerkUser.username ||
          clerkUser.firstName ||
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "builder",
        fullName: clerkUser.fullName || "Indie Builder",
        avatarUrl: clerkUser.imageUrl,
        isAuthenticated: true,
      });
    } else if (isLoaded && !isSignedIn) {
      setUser({
        id: "local-user",
        username: "indie_builder",
        isAuthenticated: false,
      });
    }
  }, [isLoaded, isSignedIn, clerkUser, setUser]);

  const xpNeeded = getXpForLevel(level);
  const xpPercent = Math.min(Math.round((xp / xpNeeded) * 100), 100);

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  const handleQuestClick = (questId: string) => {
    sound.playClick();
    if (questId === "focus_ship" && onOpenShipModal) {
      setIsQuestOpen(false);
      onOpenShipModal();
    } else if (questId === "share_x" && onOpenShareModal) {
      setIsQuestOpen(false);
      onOpenShareModal();
    } else {
      checkOffQuest(questId);
    }
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none font-satoshi select-none">
      
      {/* 1. Left Capsule: Back Button + Daily Focus Quests Pill */}
      <div className="pointer-events-auto relative" ref={questDropdownRef}>
        <div className="p-1 rounded-full glass-dock shadow-xl">
          <div className="h-9 px-2.5 rounded-full porcelain-surface bg-white flex items-center gap-2">
            
            {/* Minimal Back Button to Landing Page */}
            <Link
              href="/"
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-950 transition active:scale-95 group shrink-0 px-1 py-0.5 rounded-full hover:bg-stone-100/90"
              title="Return to Landing Page"
            >
              <div className="w-5 h-5 rounded-md overflow-hidden border border-stone-200 shadow-2xs group-hover:scale-105 transition-transform">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logos/indieforest_logo.svg"
                  alt="IndieForest"
                  className="w-full h-full object-cover"
                />
              </div>
              <ArrowLeft className="w-3.5 h-3.5 text-stone-400 group-hover:text-stone-700 transition" />
            </Link>

            <div className="w-[1px] h-3.5 bg-stone-200" />

            {/* Daily Quests Trigger Button */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsQuestOpen(!isQuestOpen);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full transition-all duration-150 cursor-pointer active:scale-95 shrink-0 ${
                isQuestOpen
                  ? "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-300/80 font-bold"
                  : "hover:bg-stone-100/90 text-stone-800"
              }`}
              title={isQuestOpen ? "Close Quests" : "View Today's Focus Quests"}
            >
              {isAllQuestsComplete ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100 shrink-0" />
              ) : (
                <Target className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              )}
              <span className="text-xs font-bold text-stone-800 font-satoshi">
                Quests
              </span>
              <span className="font-pixel text-sm font-normal px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 border border-stone-200/90 leading-none">
                {completedQuestCount}/{quests.length}
              </span>
              <div className="text-stone-400">
                {isQuestOpen ? (
                  <ChevronUp className="w-3 h-3 text-stone-700" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-stone-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Floating Quest Popover Card */}
        {isQuestOpen && (
          <div className="absolute top-12 left-0 w-72 max-w-[calc(100vw-2rem)] p-1 rounded-2xl glass-dock shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3.5 rounded-[calc(1rem-0.125rem)] porcelain-surface bg-white space-y-3">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-700" />
                  <span className="font-pixel text-sm font-normal uppercase tracking-wider text-stone-600">
                    TODAY&apos;S FOCUS
                  </span>
                </div>
                <span className="font-pixel text-sm font-normal text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80 whitespace-nowrap">
                  {completedQuestCount}/{quests.length} DONE
                </span>
              </div>

              {/* Checklist Items */}
              <div className="space-y-1.5 pt-1 border-t border-stone-100">
                {quests.map((quest) => (
                  <button
                    key={quest.id}
                    type="button"
                    onClick={() => handleQuestClick(quest.id)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-start gap-2.5 transition-all duration-150 cursor-pointer border ${
                      quest.completed
                        ? "bg-emerald-50/80 border-emerald-200 text-emerald-950"
                        : "bg-stone-50/80 hover:bg-stone-100 border-stone-200/80 text-stone-800 hover:border-stone-300"
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      {quest.completed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-stone-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold leading-snug text-stone-900 font-satoshi">
                        {quest.title}
                      </div>
                      <div className="font-pixel text-sm font-normal text-emerald-700 mt-0.5">
                        +{quest.xpReward} XP REWARD
                      </div>
                    </div>
                  </button>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>

      {/* 2. Right Capsule: Level Progress + Pinecones + Expandable Controls (⚙️) */}
      <div className="pointer-events-auto relative" ref={controlsDropdownRef}>
        <div className="p-1 rounded-full glass-dock shadow-xl">
          <div className="h-9 px-3 rounded-full porcelain-surface bg-white flex items-center gap-2.5 text-xs">
            
            {/* Level & XP Mini Bar */}
            <div
              className="flex items-center gap-1.5"
              title={`Level ${level} • ${xpPercent}% towards Level ${level + 1}`}
            >
              <span className="font-pixel text-sm font-normal text-stone-600 uppercase">
                LVL {level}
              </span>
              <div className="w-12 sm:w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden relative shadow-inner">
                <div
                  className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="font-pixel text-sm font-normal text-emerald-800">
                {xpPercent}%
              </span>
            </div>

            <div className="w-[1px] h-3.5 bg-stone-200" />

            {/* Streak & Burnout Shield */}
            <div
              className="flex items-center gap-1.5 text-stone-800 font-semibold cursor-default"
              title={`Active Streak: ${streakDays} days • ${streakShields} Burnout Shields active`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500/20" />
              <span className="font-pixel text-sm font-normal">{streakDays}d</span>
              {streakShields > 0 && (
                <div className="flex items-center gap-0.5 text-teal-700 bg-teal-50 px-1 py-0.2 rounded border border-teal-200 text-[10px]">
                  <Shield className="w-2.5 h-2.5" />
                  <span>{streakShields}</span>
                </div>
              )}
            </div>

            <div className="w-[1px] h-3.5 bg-stone-200" />

            {/* 30-Day Forest Health % */}
            <div
              className={`hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-bold ${forestHealth.badgeClass}`}
              title={`30-Day Forest Health: ${forestHealth.healthPercent}% (${forestHealth.activeDaysCount}/30 days) • Status: ${forestHealth.label}`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="font-pixel text-xs">{forestHealth.healthPercent}% HEALTH</span>
            </div>

            <div className="hidden sm:block w-[1px] h-3.5 bg-stone-200" />

            {/* Live Auto-Sync Status Indicator */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                syncGitHubIsland(user.username || "kwakhare5");
              }}
              className="p-1 rounded-full hover:bg-emerald-50 text-stone-500 hover:text-emerald-700 transition cursor-pointer"
              title={isAutoSyncing ? "Auto-Syncing GitHub..." : "Click to Force Sync GitHub"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoSyncing ? "animate-spin text-emerald-600" : ""}`} />
            </button>

            <div className="w-[1px] h-3.5 bg-stone-200" />

            {/* Pinecone Balance */}
            <div
              className="flex items-center gap-1 text-amber-900 font-semibold cursor-default"
              title={`${pinecones} Pinecones available for camp decor`}
            >
              <Trees className="w-3.5 h-3.5 text-amber-700" />
              <span className="font-pixel text-sm font-normal">{pinecones}</span>
            </div>

            <div className="w-[1px] h-3.5 bg-stone-200" />

            {/* Controls & Settings Trigger */}
            <button
              type="button"
              onClick={() => {
                sound.playClick();
                setIsControlsOpen(!isControlsOpen);
              }}
              className={`p-1.5 rounded-full transition-all duration-150 active:scale-95 cursor-pointer flex items-center gap-0.5 ${
                isControlsOpen
                  ? "bg-stone-200/90 text-stone-950"
                  : "hover:bg-stone-100 text-stone-600 hover:text-stone-900"
              }`}
              title="Island Mood & Controls"
            >
              <Settings className="w-3.5 h-3.5" />
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>
          </div>
        </div>

        {/* Floating Controls Popover Card */}
        {isControlsOpen && (
          <div className="absolute top-12 right-0 w-72 max-w-[calc(100vw-2rem)] p-1 rounded-2xl glass-dock shadow-2xl z-50 animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="p-3.5 rounded-[calc(1rem-0.125rem)] porcelain-surface bg-white space-y-3">
              
              {/* Account / User Chip */}
              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200/80 flex items-center justify-between">
                {isLoaded && isSignedIn ? (
                  <div className="flex items-center gap-2.5">
                    <UserButton />
                    <div>
                      <span className="text-xs font-bold text-stone-900 block leading-tight font-satoshi">
                        @{user.username}
                      </span>
                      <span className="font-pixel text-sm font-normal text-emerald-800 block">
                        TIER {badge} • {rankTitle.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span className="text-xs font-semibold text-stone-700 font-satoshi">
                        Guest (@{user.username})
                      </span>
                    </div>
                    <SignInButton mode="modal">
                      <button
                        type="button"
                        className="font-pixel text-sm font-normal text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 hover:bg-emerald-100 transition cursor-pointer"
                      >
                        SIGN IN
                      </button>
                    </SignInButton>
                  </div>
                )}
              </div>

              {/* Atmosphere / Lighting Selector */}
              <div className="space-y-1.5">
                <span className="font-pixel text-sm uppercase tracking-wider text-stone-500 font-normal block">
                  ISLAND ATMOSPHERE
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 rounded-xl bg-stone-100/90 border border-stone-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeOfDay("day");
                    }}
                    className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      timeOfDay === "day"
                        ? "bg-white text-stone-950 shadow-2xs font-bold border border-stone-200/70"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Sun className="w-3 h-3 text-amber-500" />
                    <span>Day</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeOfDay("sunset");
                    }}
                    className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      timeOfDay === "sunset"
                        ? "bg-white text-stone-950 shadow-2xs font-bold border border-stone-200/70"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Sunset className="w-3 h-3 text-orange-500" />
                    <span>Sunset</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setTimeOfDay("night");
                    }}
                    className={`py-1.5 px-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer ${
                      timeOfDay === "night"
                        ? "bg-white text-stone-950 shadow-2xs font-bold border border-stone-200/70"
                        : "text-stone-600 hover:text-stone-900"
                    }`}
                  >
                    <Moon className="w-3 h-3 text-indigo-500" />
                    <span>Night</span>
                  </button>
                </div>
              </div>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                <span className="text-xs font-semibold text-stone-800 flex items-center gap-2 font-satoshi">
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
                  )}
                  <span>Retro Chimes</span>
                </span>
                <button
                  type="button"
                  onClick={toggleAudio}
                  className={`font-pixel text-xs font-normal px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                    isMuted
                      ? "bg-stone-100 text-stone-500 border-stone-200"
                      : "bg-emerald-50 text-emerald-800 border-emerald-200/80"
                  }`}
                >
                  {isMuted ? "MUTED" : "ACTIVE"}
                </button>
              </div>

              {/* Full Settings & Integrations Modal Link */}
              <div className="pt-1.5 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsControlsOpen(false);
                    onOpenSettings();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200/80 text-stone-800 font-semibold text-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer shadow-2xs font-satoshi"
                >
                  <Sliders className="w-3.5 h-3.5 text-stone-500" />
                  <span>Backend & Webhooks</span>
                </button>
              </div>

            </div>
          </div>
        )}
      </div>

    </header>
  );
}
