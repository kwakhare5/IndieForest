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
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SignInButton, useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";
import { GitHubIslandProfile } from "@/lib/github";
import { useForestStore } from "@/store/useForestStore";
import type { TreeData } from "@/types/game";

const IslandCanvas = dynamic(
  () => import("@/components/canvas/IslandCanvas").then((mod) => mod.IslandCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex flex-col items-center justify-center bg-[#ece7de] rounded-[2rem] gap-2">
        <div className="w-6 h-6 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <span className="text-[11px] font-bold text-stone-500 font-sans">
          Loading 3D Diorama...
        </span>
      </div>
    ),
  }
);

const FAMOUS_BUILDER_HANDLES = ["shadcn", "antfu", "torvalds"] as const;

const INITIAL_STARTER_TREES: TreeData[] = [
  {
    id: "initial-tree-1",
    name: "indieforest",
    type: "shipping",
    commits: 1,
    tier: "sapling",
    gridX: -1.8,
    gridZ: -1.0,
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

  const handleFetchProfile = async (username: string) => {
    const cleanUser = username.trim().replace(/^@/, "");
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

  const handleInstantSprout = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleFetchProfile(searchUsername);
  };

  const handleQuickSproutFamous = async (handle: string) => {
    setSearchUsername(handle);
    await handleFetchProfile(handle);
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
    : INITIAL_STARTER_TREES;

  const displayStreak = activeProfile?.streakDays || 1;
  const displayLevel = activeProfile?.level || 1;

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 font-sans">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
        {/* Left Hero Copy */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <Badge variant="emerald" dot size="md" className="mb-2 shadow-2xs">
            Automated 3D Shipping Diorama
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 leading-[1.06] tracking-tight font-editorial">
            Your code and revenue, <span className="italic font-normal text-emerald-800 underline decoration-emerald-500/30 underline-offset-8">living in 3D</span>.
          </h1>

          <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-sans">
            Connect your GitHub. Your repositories sprout as evergreen trees. Daily commits make them grow taller. Stripe sales turn them gold. 100% automated with zero manual logging.
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
                  placeholder="Enter your GitHub handle"
                  value={searchUsername}
                  onChange={(e) => setSearchUsername(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden font-sans"
                />
                <Button
                  type="submit"
                  variant="emerald"
                  size="sm"
                  disabled={isSearching || !searchUsername.trim()}
                  icon={isSearching ? Loader2 : Sparkles}
                  className="shrink-0"
                >
                  {isSearching ? "Loading..." : "Preview Island"}
                </Button>
              </div>
            </form>

            {/* Quick Preview Chips */}
            <div className="flex items-center gap-1.5 pt-2 text-[11px] text-stone-500 font-sans flex-wrap">
              <span className="text-stone-400">Try previewing:</span>
              {FAMOUS_BUILDER_HANDLES.map((handle) => (
                <button
                  key={handle}
                  type="button"
                  onClick={() => handleQuickSproutFamous(handle)}
                  className="px-2 py-0.5 rounded-md bg-stone-200/60 hover:bg-stone-200 text-stone-700 font-medium transition cursor-pointer"
                >
                  @{handle}
                </button>
              ))}
            </div>

            {searchError && (
              <p className="text-xs text-red-600 font-sans mt-2">
                {searchError}
              </p>
            )}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button
                  variant="emerald"
                  size="lg"
                  showArrow
                  className="w-full sm:w-auto justify-between"
                  onClick={() => sound.playLevelUp()}
                >
                  Launch Dashboard
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <div className="w-full sm:w-auto">
                  <Button
                    variant="emerald"
                    size="lg"
                    showArrow
                    className="w-full sm:w-auto justify-between"
                    onClick={() => sound.playLevelUp()}
                  >
                    Start Your Island Free
                  </Button>
                </div>
              </SignInButton>
            )}

            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto text-stone-800"
                onClick={() => sound.playClick()}
              >
                Explore Live Demo
              </Button>
            </Link>
          </div>

          {/* Social Proof Trust Metrics */}
          <div className="pt-2 flex items-center gap-6 text-xs text-stone-500 font-sans">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Zero manual check-ins</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Free Forever</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Supabase Cloud Sync</span>
            </div>
          </div>
        </div>

        {/* Right 3D Diorama Showcase */}
        <div className="lg:col-span-6 relative">
          <div className="relative w-full aspect-square max-w-lg mx-auto p-2 rounded-[2.5rem] glass-dock shadow-2xl overflow-hidden">
            <div className="w-full h-full rounded-[2rem] porcelain-surface overflow-hidden relative">
              <IslandCanvas
                trees={displayedTrees}
                level={displayLevel}
                streakDays={displayStreak}
                streakShields={1}
                drought={false}
                timeOfDay="day"
                zoomLevel={1}
                className="w-full h-full"
              />

              {/* Floating Diorama Badge */}
              <div className="absolute top-4 left-4 pointer-events-none">
                <Card variant="porcelain" className="px-3 py-1.5 rounded-full shadow-md flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-stone-900 font-sans">
                    {activeProfile ? `@${activeProfile.username}'s Island` : "Live 3D Diorama"}
                  </span>
                </Card>
              </div>

              {/* Instant Claim Button overlay if searched */}
              {activeProfile && (
                <div className="absolute bottom-4 inset-x-4 flex items-center justify-between p-2 rounded-2xl bg-white/90 backdrop-blur-md border border-stone-200 shadow-xl">
                  <div className="flex items-center gap-2 pl-2">
                    <Trees className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      {activeProfile.trees.length} Repos Found
                    </span>
                  </div>
                  {isLoaded && isSignedIn ? (
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={handleClaimData}
                      icon={Sparkles}
                    >
                      Save to My Island
                    </Button>
                  ) : (
                    <SignInButton mode="modal">
                      <div>
                        <Button
                          variant="emerald"
                          size="sm"
                          onClick={handleClaimData}
                          icon={Sparkles}
                        >
                          Save to My Island
                        </Button>
                      </div>
                    </SignInButton>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
