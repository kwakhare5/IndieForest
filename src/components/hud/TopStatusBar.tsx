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
      {/* 1. Left Pod: Master Brand Logo + User Identity & Rank */}
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg transition-all duration-150">
        <div className="px-3.5 py-1.5 rounded-full porcelain-surface flex items-center gap-2.5">
          {/* Official Tree Stump Master Logo */}
          <Link href="/" className="flex items-center gap-2 group" title="Return to Landing Page">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-stone-200 shadow-xs">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logos/indieforest_logo.svg" alt="IndieForest Logo" className="w-full h-full object-cover" />
            </div>
          </Link>

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Auth State */}
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2 text-left">
              <UserButton />
              <div className="hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900 leading-none">
                    @{user.username}
                  </span>
                  <Badge variant="pixel" size="sm">
                    Tier {badge}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 hover:opacity-80 transition cursor-pointer text-left"
              title="Sign in with Google / Email"
            >
              <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-bold shadow-inner">
                {user.username.slice(0, 1).toUpperCase()}
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-stone-900 leading-none">
                  Sign In
                </span>
                <Badge variant="pixel" size="sm">
                  Tier {badge}
                </Badge>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 2. Center Pod: XP Progress + Streaks & Shields */}
      <div className="pointer-events-auto hidden md:flex items-center p-1 rounded-full glass-dock shadow-lg">
        <div className="px-4 py-1.5 rounded-full porcelain-surface flex items-center gap-4 text-xs font-satoshi">
          {/* XP Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-pixel text-stone-500 font-semibold uppercase">
              Level {level}
            </span>
            <div className="w-24 h-2 rounded-full bg-stone-200/80 overflow-hidden relative shadow-inner">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <span className="text-[10px] font-pixel text-emerald-800 font-bold">
              {xpPercent}%
            </span>
          </div>

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Daily Streak Counter */}
          <div
            className="flex items-center gap-1.5 text-amber-800 font-semibold cursor-default"
            title="Current Shipping Streak"
          >
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" />
            <span className="font-pixel text-xs">{streakDays}d Streak</span>
          </div>

          {/* Burnout Streak Shields */}
          <div
            className="flex items-center gap-1 text-stone-600 font-medium cursor-default"
            title="Streak Shields protect your progress on rest days"
          >
            <Shield className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-pixel text-xs">x{streakShields}</span>
          </div>

          <div className="w-[1px] h-3.5 bg-stone-200" />

          {/* Pinecone Currency */}
          <div
            className="flex items-center gap-1.5 text-amber-900 font-semibold cursor-default"
            title="Pinecone balance for Camp Shop decor"
          >
            <Trees className="w-3.5 h-3.5 text-amber-700" />
            <span className="font-pixel text-xs">{pinecones}</span>
          </div>
        </div>
      </div>

      {/* 3. Right Pod: Atmosphere Controls & Settings */}
      <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg">
        <div className="px-2.5 py-1.5 rounded-full porcelain-surface flex items-center gap-1.5">
          {/* Day / Sunset / Night Toggle */}
          <button
            type="button"
            onClick={cycleTimeOfDay}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            title={`Current: ${timeOfDay}. Click to cycle lighting.`}
          >
            {timeOfDay === "day" && <Sun className="w-3.5 h-3.5 text-amber-600" />}
            {timeOfDay === "sunset" && <Sunset className="w-3.5 h-3.5 text-orange-600" />}
            {timeOfDay === "night" && <Moon className="w-3.5 h-3.5 text-slate-600" />}
          </button>

          {/* Synthesized Web Audio Mute Toggle */}
          <button
            type="button"
            onClick={toggleAudio}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            title={isMuted ? "Unmute Sound FX" : "Mute Sound FX"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-stone-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
            )}
          </button>

          <div className="w-[1px] h-3.5 bg-stone-200 mx-0.5" />

          {/* Settings Modal Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition-colors cursor-pointer"
            title="Settings & Webhook Keys"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
