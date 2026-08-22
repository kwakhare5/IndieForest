"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TopStatusBar } from "@/components/hud/TopStatusBar";
import { FloatingDock } from "@/components/hud/FloatingDock";
import { SproutGuide } from "@/components/hud/SproutGuide";
import { ShipModal } from "@/components/hud/ShipModal";
import { ShareCardModal } from "@/components/hud/ShareCardModal";
import { AddTreeModal } from "@/components/hud/AddTreeModal";
import { CampShopModal } from "@/components/hud/CampShopModal";
import { SettingsModal } from "@/components/hud/SettingsModal";
import { TimelineScrubber } from "@/components/hud/TimelineScrubber";
import { useForestStore } from "@/store/useForestStore";
import { useUser } from "@clerk/nextjs";
import { TreeData } from "@/types/game";

// Dynamic import for Three.js Canvas to prevent SSR hydration mismatch
const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <span className="tracking-[0.2em] uppercase font-bold font-pixel text-sm">
          Loading 3D Island...
        </span>
      </div>
    ),
  }
);

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const checkStreakExpiry = useForestStore((s) => s.checkStreakExpiry);
  const hasCompletedSproutGuide = useForestStore((s) => s.hasCompletedSproutGuide);
  const trees = useForestStore((s) => s.trees);
  const setUser = useForestStore((s) => s.setUser);
  const syncGitHubIsland = useForestStore((s) => s.syncGitHubIsland);
  const autoCheckTodayCommits = useForestStore((s) => s.autoCheckTodayCommits);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  // Timeline Scrubber State
  const [scrubbedTrees, setScrubbedTrees] = useState<TreeData[] | null>(null);

  useEffect(() => {
    setMounted(true);
    checkStreakExpiry();

    let targetUsername = "kwakhare5";

    if (isLoaded && isSignedIn && clerkUser) {
      const username =
        clerkUser.username ||
        clerkUser.firstName ||
        clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
        "builder";

      targetUsername = username;
      setUser({
        id: clerkUser.id,
        email: clerkUser.primaryEmailAddress?.emailAddress,
        username,
        fullName: clerkUser.fullName || "Indie Builder",
        avatarUrl: clerkUser.imageUrl,
        isAuthenticated: true,
      });
    } else if (isLoaded && !isSignedIn) {
      setUser({
        id: "kwakhare5",
        username: "kwakhare5",
        avatarUrl: "https://github.com/kwakhare5.png",
        isAuthenticated: false,
      });
    }

    // Auto-Sync GitHub Repos if Island is empty
    if (trees.length === 0) {
      syncGitHubIsland(targetUsername);
    } else {
      autoCheckTodayCommits();
    }

    // Smart Tab-Focus Auto-Sync (Watches for commits when switching back to window)
    const handleWindowFocus = () => {
      autoCheckTodayCommits();
    };

    window.addEventListener("focus", handleWindowFocus);
    return () => {
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, [isLoaded, isSignedIn, clerkUser, checkStreakExpiry, setUser, syncGitHubIsland, autoCheckTodayCommits, trees.length]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <span className="tracking-[0.2em] uppercase font-bold font-pixel text-sm">
          Loading 3D Island...
        </span>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden font-satoshi bg-[#ece7de]">
      {/* Zone 1: Unified Top Status & Identity Bar */}
      <TopStatusBar
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenShipModal={() => setIsShipModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Zone 2: 3D Living Isometric Diorama Canvas */}
      <ForestCanvas mode="full" customTrees={scrubbedTrees || undefined} />

      {/* In-Game Onboarding Sprout Guide (Only on virgin island before first ship) */}
      {!hasCompletedSproutGuide && trees.length === 0 && (
        <SproutGuide onOpenShipModal={() => setIsShipModalOpen(true)} />
      )}

      {/* On-Demand 3D Timeline Scrubber (Only shows when toggled from bottom dock) */}
      {isTimelineOpen && trees.length > 0 && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-auto">
          <TimelineScrubber
            trees={trees}
            onClose={() => {
              setIsTimelineOpen(false);
              setScrubbedTrees(null);
            }}
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

      {/* Zone 3: Bottom Action Dock */}
      <FloatingDock
        onOpenShipModal={() => setIsShipModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAddTreeModal={() => setIsAddTreeModalOpen(true)}
        onOpenShopModal={() => setIsShopModalOpen(true)}
        isTimelineOpen={isTimelineOpen}
        onToggleTimeline={() => setIsTimelineOpen((prev) => !prev)}
      />

      {/* Double-Bezel Modals */}
      <ShipModal
        isOpen={isShipModalOpen}
        onClose={() => setIsShipModalOpen(false)}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={() => setIsAddTreeModalOpen(false)}
      />

      <CampShopModal
        isOpen={isShopModalOpen}
        onClose={() => setIsShopModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </main>
  );
}
