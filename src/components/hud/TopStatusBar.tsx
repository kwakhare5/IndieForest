"use client";

import React from "react";
import Link from "next/link";
import { useForestStore, getRankTitle, getXpForLevel } from "@/store/useForestStore";
import { Flame, Shield, Sun, Sunset, Moon, Volume2, VolumeX, Settings, Trees } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { sound } from "@/lib/sound";
import { useUser, UserButton } from "@clerk/nextjs";

interface TopStatusBarProps {
  onOpenSettings: () => void;
  onOpenAuth: () => void;
}

export function TopStatusBar({ onOpenSettings, onOpenAuth }: TopStatusBarProps) {
  const user = useForestStore((s) => s.user);
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const pinecones = useForestStore((s) => s.pinecones);
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const setTimeOfDay = useForestStore((s) => s.setTimeOfDay);
  const setUser = useForestStore((s) => s.setUser);

  const { isSignedIn, isLoaded, user: clerkUser } = useUser();
  const [isMuted, setIsMuted] = React.useState(sound.getMuted());

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

  const { badge } = getRankTitle(level);
  const xpNeeded = getXpForLevel(level);
  const xpPercent = Math.min(Math.round((xp / xpNeeded) * 100), 100);

  const toggleAudio = () => {
    const nextMuted = !isMuted;
    sound.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) sound.playClick();
  };

  const cycleTimeOfDay = () => {
    sound.playClick();
    if (timeOfDay === "day") setTimeOfDay("sunset");
    else if (timeOfDay === "sunset") setTimeOfDay("night");
    else setTimeOfDay("day");
  };

  return (
    <header className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between pointer-events-none font-satoshi">
      {/* 1. Left Pod: Master Brand Logo + User Identity & Streak */}
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg transition-all duration-150">
        <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-2 sm:gap-2.5">
          {/* Official Tree Stump Master Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0" title="Return to Landing Page">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/indieforest_logo.svg" alt="IndieForest Logo" className="w-full h-full object-cover" />
            </div>
          </Link>

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Auth State & Username */}
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2 text-left">
              <UserButton />
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900 leading-none truncate max-w-[90px] sm:max-w-[120px]">
                  @{user.username}
                </span>
                <Badge variant="pixel" size="sm" className="hidden sm:inline-flex">
                  Tier {badge}
                </Badge>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 hover:opacity-80 transition cursor-pointer text-left"
              title="Sign in with Google / Email"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-inner">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-stone-900 leading-none">
                Sign In
              </span>
            </button>
          )}

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Daily Streak Flame Counter */}
          <div
            className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-amber-50/80 border border-amber-200/80 text-amber-900 font-semibold cursor-default shrink-0"
            title={`${streakDays}-day active shipping streak`}
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600 shrink-0" />
            <span className="font-pixel text-[11px] font-bold">{streakDays}d</span>
          </div>
        </div>
      </div>

      {/* 2. Right Pod: Level XP + Pinecones + Shields + Atmosphere & Audio Controls */}
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg transition-all duration-150">
        <div className="px-3 py-1.5 rounded-full porcelain-surface flex items-center gap-2 sm:gap-3 text-xs font-satoshi">
          {/* Level & XP Mini Bar */}
          <div className="hidden sm:flex items-center gap-1.5" title={`Level ${level} • ${xpPercent}% to next rank`}>
            <span className="text-[10px] font-pixel text-stone-500 font-bold uppercase">
              L{level}
            </span>
            <div className="w-12 h-1.5 rounded-full bg-stone-200 overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-pixel text-emerald-800 font-bold">
              {xpPercent}%
            </span>
          </div>

          <div className="hidden sm:block w-[1px] h-3.5 bg-stone-200" />

          {/* Burnout Streak Shields */}
          <div
            className="flex items-center gap-1 text-emerald-800 font-medium cursor-default"
            title={`${streakShields} Streak Shield(s) protecting rest days`}
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-pixel text-xs font-bold">x{streakShields}</span>
          </div>

          {/* Pinecone Currency */}
          <div
            className="flex items-center gap-1 text-amber-900 font-semibold cursor-default"
            title={`${pinecones} Pinecones available for camp decor`}
          >
            <Trees className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-pixel text-xs font-bold">{pinecones}</span>
          </div>

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Day / Sunset / Night Toggle */}
          <button
            type="button"
            onClick={cycleTimeOfDay}
            className="p-1 rounded-full hover:bg-stone-100/90 text-stone-600 hover:text-stone-900 transition active:scale-95 cursor-pointer"
            title={`Lighting: ${timeOfDay.toUpperCase()} (Click to cycle)`}
          >
            {timeOfDay === "day" && <Sun className="w-3.5 h-3.5 text-amber-500" />}
            {timeOfDay === "sunset" && <Sunset className="w-3.5 h-3.5 text-orange-500" />}
            {timeOfDay === "night" && <Moon className="w-3.5 h-3.5 text-indigo-500" />}
          </button>

          {/* Audio Chime Mute/Unmute */}
          <button
            type="button"
            onClick={toggleAudio}
            className="p-1 rounded-full hover:bg-stone-100/90 text-stone-600 hover:text-stone-900 transition active:scale-95 cursor-pointer"
            title={isMuted ? "Unmute Retro Chimes" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            )}
          </button>

          {/* Webhook & Settings Modal */}
          <button
            type="button"
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-1 rounded-full hover:bg-stone-100/90 text-stone-600 hover:text-stone-900 transition active:scale-95 cursor-pointer"
            title="Settings & Webhook API Token"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
