"use client";

import React, { use, useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Flame, Trees, TrendingUp, Sparkles, Droplets, MessageSquare } from "lucide-react";
import { getRankTitle } from "@/lib/gamification";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TimelineScrubber } from "@/components/hud/TimelineScrubber";
import { GuestbookModal } from "@/components/hud/GuestbookModal";
import { GitHubIslandProfile } from "@/lib/github";
import { TreeData, GuestbookEntry } from "@/types/game";
import { sound } from "@/lib/sound";
import { useForestStore } from "@/store/useForestStore";

const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-2" />
        <span className="uppercase tracking-widest font-pixel text-sm">Loading 3D Diorama...</span>
      </div>
    ),
  }
);

interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const { username } = use(params);
  const triggerRain = useForestStore((s) => s.triggerRain);

  const [profile, setProfile] = useState<GitHubIslandProfile | null>(null);
  const [scrubbedTrees, setScrubbedTrees] = useState<TreeData[] | null>(null);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [wateredCount, setWateredCount] = useState(0);
  const [showWaterToast, setShowWaterToast] = useState(false);

  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([
    {
      id: "entry-1",
      author: "MarcLou",
      message: "Huge fan of this shipping momentum! Keep crushing it.",
      timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "entry-2",
      author: "Tibo",
      message: "Your island looks incredible. Love the 3D diorama diorama aesthetic!",
      timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ]);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch(`/api/github/preview?username=${encodeURIComponent(username)}`);
        if (res.ok) {
          const data: GitHubIslandProfile = await res.json();
          setProfile(data);
        }
      } catch {
        // Fallback
      }
    }
    loadProfile();
  }, [username]);

  const handleWaterTree = () => {
    sound.playShipSuccess();
    triggerRain(4500);
    setWateredCount((c) => c + 1);
    setShowWaterToast(true);
    setTimeout(() => setShowWaterToast(false), 3500);
  };

  const handleAddGuestbookNote = (message: string, author: string) => {
    const newEntry: GuestbookEntry = {
      id: `gb-${Date.now()}`,
      author,
      message,
      timestamp: new Date().toISOString(),
    };
    setGuestbookEntries([newEntry, ...guestbookEntries]);
  };

  const level = profile ? profile.level : 1;
  const streakDays = profile ? profile.streakDays : 1;
  const trees = profile ? profile.trees : [];
  const { title, badge } = getRankTitle(level);
  const totalCommits = profile ? profile.totalCommits : 5;

  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden font-satoshi bg-[#ece7de]">
      
      {/* Top Floating User Header Bar */}
      <header className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Profile Identity Capsule */}
        <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg">
          <div className="px-3.5 py-1.5 rounded-full porcelain-surface flex items-center gap-3">
            {profile?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatarUrl}
                alt={username}
                className="w-8 h-8 rounded-full border border-emerald-300 shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-inner font-satoshi">
                {username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs sm:text-sm font-bold text-stone-900 tracking-tight font-satoshi">
                  @{username}
                </h1>
                <Badge variant="emerald" size="sm">
                  Tier {badge}
                </Badge>
              </div>
              <span className="font-pixel text-xs text-stone-600 font-bold block mt-0.5">
                {title} (Level {level})
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Water Tree Cheer Button */}
          <Button
            variant="emerald"
            size="sm"
            onClick={handleWaterTree}
            icon={Droplets}
            className="shadow-md"
          >
            {wateredCount > 0 ? `Watered ${wateredCount}x (+5 XP)` : "Water Forest (+5 XP)"}
          </Button>

          {/* Campsite Guestbook */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsGuestbookOpen(true)}
            icon={MessageSquare}
            className="shadow-md"
          >
            Guestbook ({guestbookEntries.length})
          </Button>

          <Link href="/">
            <Button variant="dark" size="sm" showArrow arrowType="right" icon={Sparkles}>
              Build Mine
            </Button>
          </Link>
        </div>
      </header>

      {/* Watered Cheer Floating Toast */}
      {showWaterToast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 p-1 rounded-full glass-dock shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-2 rounded-full porcelain-surface bg-emerald-50 text-emerald-900 text-xs font-bold font-satoshi flex items-center gap-2">
            <Droplets className="w-4 h-4 text-emerald-600 fill-emerald-500 animate-bounce" />
            <span>You watered @{username}&apos;s forest! (+5 Cheer XP sent)</span>
          </div>
        </div>
      )}

      {/* 3D Diorama Canvas */}
      <ForestCanvas
        mode="profile"
        customTrees={scrubbedTrees || (trees.length ? trees : undefined)}
      />

      {/* Floating 3D Timeline Scrubber */}
      {trees.length > 0 && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 w-full max-w-xl px-4 pointer-events-none">
          <TimelineScrubber
            trees={trees}
            onScrubChange={(active, date) => {
              if (date === null) {
                setScrubbedTrees(null);
              } else {
                setScrubbedTrees(active);
              }
            }}
          />
        </div>
      )}

      {/* Bottom Floating Verified Stats Pill */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 pointer-events-auto p-1 rounded-full glass-dock shadow-xl">
        <div className="px-6 py-2 rounded-full porcelain-surface flex items-center gap-4 text-xs font-satoshi">
          <div className="flex items-center gap-1.5 text-amber-800 font-pixel text-sm font-bold">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>{streakDays}d Streak</span>
          </div>
          <div className="w-[1px] h-3.5 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-emerald-800 font-pixel text-sm font-bold">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>{trees.length} Active Groves</span>
          </div>
          <div className="w-[1px] h-3.5 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-stone-800 font-pixel text-sm font-bold">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>{totalCommits} Commits</span>
          </div>
        </div>
      </div>

      {/* Campsite Guestbook Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        targetUsername={username}
        entries={guestbookEntries}
        onAddEntry={handleAddGuestbookNote}
      />
    </main>
  );
}
