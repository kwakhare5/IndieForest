"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Github,
  CheckCircle2,
  Sparkles,
  Loader2,
  Trees,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ForestCanvas } from "@/components/canvas/ForestCanvas";
import { SignInButton, useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";
import { GitHubIslandProfile } from "@/lib/github";
import { useForestStore } from "@/store/useForestStore";
import { FAMOUS_BUILDER_HANDLES, CURATED_FAMOUS_BUILDERS } from "@/lib/curatedBuilders";
import type { TreeData } from "@/types/game";

const DEFAULT_DEMO_TREES: TreeData[] = [
  {
    id: "hero-tree-1",
    name: "indieforest",
    type: "shipping",
    commits: 42,
    tier: "majestic",
    gridX: -1.8,
    gridZ: -1.0,
    plantedAt: new Date().toISOString(),
  },
  {
    id: "hero-tree-2",
    name: "pro-mrr",
    type: "revenue",
    mrr: 1250,
    tier: "mature",
    gridX: 1.8,
    gridZ: -1.0,
    plantedAt: new Date().toISOString(),
  },
  {
    id: "hero-tree-3",
    name: "side-quest",
    type: "shipping",
    commits: 12,
    tier: "young",
    gridX: -1.8,
    gridZ: 1.0,
    plantedAt: new Date().toISOString(),
  },
];

export function LandingHero() {
  const { isLoaded, isSignedIn } = useUser();
  const mergeCloudData = useForestStore((s) => s.mergeCloudData);

  const [searchUsername, setSearchUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeProfile, setActiveProfile] = useState<GitHubIslandProfile | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleInstantSprout = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = searchUsername.trim().replace(/^@/, "");
    if (!cleanUser) return;

    setIsSearching(true);
    setSearchError(null);
    sound.playClick();

    try {
      const res = await fetch(`/api/github/preview?username=${encodeURIComponent(cleanUser)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "User not found");
      }
      const data: GitHubIslandProfile = await res.json();
      setActiveProfile(data);
      sound.playShipSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load data";
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSproutFamous = (handle: string) => {
    sound.playClick();
    setSearchUsername(handle);
    const profile = CURATED_FAMOUS_BUILDERS[handle];
    if (profile) {
      setActiveProfile(profile);
      sound.playShipSuccess();
    }
  };

  const handleClaimData = () => {
    sound.playLevelUp();
    if (activeProfile) {
      mergeCloudData({
        trees: activeProfile.trees,
        streakDays: activeProfile.streakDays,
        level: activeProfile.level,
        xp: activeProfile.xp,
      });
    }
  };

  const displayedTrees = activeProfile?.trees && activeProfile.trees.length > 0
    ? activeProfile.trees
    : DEFAULT_DEMO_TREES;

  const displayStreak = activeProfile?.streakDays || 24;
  const displayLevel = activeProfile?.level || 12;

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 font-satoshi">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Hero Copy */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <Badge variant="emerald" dot size="md" className="mb-2 shadow-2xs">
            Zero-Touch 3D Living Diorama
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 leading-[1.06] tracking-tight font-editorial">
            Turn daily shipping into a <span className="italic font-normal text-emerald-800 underline decoration-emerald-500/30 underline-offset-8">living 3D world</span>.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-satoshi">
            Automatically grow stepped emerald pines from GitHub commits and golden pines from Stripe revenue. 100% zero manual check-ins, zero streak anxiety, and instant 1200×675 share cards.
          </p>

          {/* Instant Search Bar */}
          <div className="pt-1">
            <form onSubmit={handleInstantSprout} className="p-1.5 rounded-2xl glass-dock shadow-sm max-w-lg">
              <div className="p-1 rounded-xl porcelain-surface flex items-center gap-2">
                <div className="pl-3 text-stone-400">
                  <Github className="w-4 h-4 text-stone-600" />
                </div>
                <input
                  type="text"
                  placeholder="Type GitHub username (e.g. kwakhare5)"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden font-satoshi"
                />
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  disabled={isSearching || !searchUsername.trim()}
                  icon={isSearching ? Loader2 : Sparkles}
                  className="shrink-0"
                >
                  {isSearching ? "Sprouting..." : "Sprout Island"}
                </Button>
              </div>
            </form>

            {/* Quick Preview Chips */}
            <div className="flex items-center gap-1.5 pt-2 text-[11px] text-stone-500 font-satoshi flex-wrap">
              <span className="font-medium text-stone-400">Explore builders:</span>
              {FAMOUS_BUILDER_HANDLES.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleQuickSproutFamous(handle)}
                  className="px-2 py-0.5 rounded-full bg-white/70 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/80 hover:border-emerald-300 font-mono text-[10px] text-stone-600 transition shadow-2xs cursor-pointer"
                >
                  @{handle}
                </button>
              ))}
            </div>

            {searchError && (
              <p className="text-xs text-rose-600 mt-2 pl-2 font-medium">
                {searchError}
              </p>
            )}
          </div>

          {/* Active Profile Result Card */}
          {activeProfile ? (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs max-w-lg space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeProfile.avatarUrl}
                    alt={activeProfile.username}
                    className="w-8 h-8 rounded-full border border-emerald-300"
                  />
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-satoshi">
                      @{activeProfile.username}
                    </h4>
                    <p className="text-[11px] text-emerald-800 font-medium">
                      {activeProfile.totalCommits} commits · {activeProfile.activeReposCount} repos
                    </p>
                  </div>
                </div>
                <Badge variant="emerald" size="sm">
                  {activeProfile.streakDays}d Streak
                </Badge>
              </div>

              <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs text-stone-600 font-satoshi">
                  Level {activeProfile.level} · {activeProfile.xp} XP
                </span>

                {isLoaded && isSignedIn ? (
                  <Link href="/dashboard" onClick={handleClaimData}>
                    <Button variant="emerald" size="sm" showArrow arrowType="right">
                      Go to Dashboard
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="emerald"
                      size="sm"
                      showArrow
                      arrowType="right"
                      onClick={handleClaimData}
                    >
                      Claim My Island
                    </Button>
                  </SignInButton>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
              {isLoaded && isSignedIn ? (
                <Link href="/dashboard">
                  <Button variant="emerald" size="lg" showArrow arrowType="right" className="w-full sm:w-auto">
                    GO TO DASHBOARD
                  </Button>
                </Link>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="emerald"
                    size="lg"
                    showArrow
                    arrowType="right"
                    onClick={() => sound.playClick()}
                    className="w-full sm:w-auto"
                  >
                    START FREE ISLAND
                  </Button>
                </SignInButton>
              )}

              <Link href="/u/kwakhare5">
                <Button variant="outline" size="lg" showArrow arrowType="up-right" className="w-full sm:w-auto">
                  Live Public Preview
                </Button>
              </Link>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs font-satoshi text-stone-500 pt-1">
            <span className="flex items-center gap-1 font-semibold text-emerald-800 font-satoshi">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> 100% Zero-Touch
            </span>
            <span>•</span>
            <span className="font-satoshi">No Manual Friction</span>
            <span>•</span>
            <span className="font-satoshi">60fps Low-Poly Diorama</span>
          </div>
        </div>

        {/* Right Hero: Live 3D Diorama Showcase Card */}
        <div className="lg:col-span-6 w-full">
          <Card variant="porcelain" className="p-3 sm:p-4 rounded-[2.5rem] shadow-2xl space-y-3 bg-gradient-to-b from-[#f5f0ea] to-[#ece7de] border border-stone-300/80 overflow-hidden relative">
            <div className="flex items-center justify-between px-3 pt-2">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Trees className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-xs sm:text-sm font-satoshi">
                    Living Diorama Preview
                  </h3>
                  <span className="text-[10px] text-stone-500 font-satoshi">
                    Interactive Orthographic Parallax
                  </span>
                </div>
              </div>
              <Badge variant="emerald" size="sm" dot>
                {activeProfile ? `@${activeProfile.username}` : "Demo Island"}
              </Badge>
            </div>

            {/* 3D Canvas Box */}
            <div className="w-full h-[380px] sm:h-[420px] rounded-2xl overflow-hidden relative bg-stone-100/50">
              <ForestCanvas
                trees={displayedTrees}
                level={displayLevel}
                streakDays={displayStreak}
                streakShields={1}
                className="w-full h-full"
              />

              <div className="absolute bottom-3 left-3 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-stone-200/70 text-[10px] font-semibold text-stone-700">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                <span>Move mouse to tilt diorama</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
