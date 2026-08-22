"use client";

import React, { useState, useEffect } from "react";
import { ForestCanvas } from "@/components/canvas/ForestCanvas";
import { DashboardTopLeftNav } from "@/components/hud/DashboardTopLeftNav";
import { DashboardGameControls } from "@/components/hud/DashboardGameControls";
import { FloatingDock } from "@/components/hud/FloatingDock";
import { TreeInspectorCard } from "@/components/hud/TreeInspectorCard";

// On-Demand Dialog Modals
import { CampfireFocusModal } from "@/components/hud/modals/CampfireFocusModal";
import { TentSabbaticalModal } from "@/components/hud/modals/TentSabbaticalModal";
import { CabinWarRoomModal } from "@/components/hud/modals/CabinWarRoomModal";
import { ShareCardModal } from "@/components/hud/modals/ShareCardModal";
import { AddTreeModal } from "@/components/hud/modals/AddTreeModal";
import { SettingsModal } from "@/components/hud/modals/SettingsModal";
import { useForestStore } from "@/store/useForestStore";
import { useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";
import type { TreeData } from "@/types/game";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const checkStreakExpiry = useForestStore((s) => s.checkStreakExpiry);
  const trees = useForestStore((s) => s.trees);
  const setUser = useForestStore((s) => s.setUser);
  const syncGitHubIsland = useForestStore((s) => s.syncGitHubIsland);
  const autoCheckTodayCommits = useForestStore((s) => s.autoCheckTodayCommits);
  const level = useForestStore((s) => s.level);
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);
  const shipHistory = useForestStore((s) => s.shipHistory);
  const drought = useForestStore((s) => s.drought);
  const removeTree = useForestStore((s) => s.removeTree);
  const timeOfDay = useForestStore((s) => s.timeOfDay);
  const toggleTimeOfDay = useForestStore((s) => s.toggleTimeOfDay);
  const dailyQuests = useForestStore((s) => s.dailyQuests);
  const triggerQuestProgress = useForestStore((s) => s.triggerQuestProgress);
  const loadCloudIsland = useForestStore((s) => s.loadCloudIsland);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Modals, HUD Overlays & 2-Step Isometric Zoom State
  const [zoomLevel, setZoomLevel] = useState<1 | 2>(1);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isCampfireModalOpen, setIsCampfireModalOpen] = useState(false);
  const [isTentModalOpen, setIsTentModalOpen] = useState(false);
  const [isCabinModalOpen, setIsCabinModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [isHudHidden, setIsHudHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkStreakExpiry();

    async function initDashboard() {
      let targetUsername = "kwakhare5";
      let targetUserId = "kwakhare5";

      if (isLoaded && isSignedIn && clerkUser) {
        const username =
          clerkUser.username ||
          clerkUser.firstName ||
          clerkUser.primaryEmailAddress?.emailAddress?.split("@")[0] ||
          "builder";

        targetUsername = username;
        targetUserId = clerkUser.id;

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

      // Try loading from Supabase first
      const hasCloudData = await loadCloudIsland(targetUserId);
      if (!hasCloudData) {
        if (trees.length === 0) {
          await syncGitHubIsland(targetUsername);
        } else {
          await autoCheckTodayCommits();
        }
      }
    }

    initDashboard();
  }, [
    isLoaded,
    isSignedIn,
    clerkUser,
    setUser,
    syncGitHubIsland,
    autoCheckTodayCommits,
    trees.length,
    checkStreakExpiry,
  ]);

  // Global Tactical Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const key = e.key.toLowerCase();

      if (key === "h") {
        e.preventDefault();
        setIsHudHidden((prev) => !prev);
      } else if (key === "z") {
        e.preventDefault();
        sound.playClick();
        setZoomLevel((prev) => (prev === 1 ? 2 : 1));
      } else if (key === "s") {
        e.preventDefault();
        triggerQuestProgress("build-in-public", 1);
        setIsShareModalOpen((prev) => !prev);
      } else if (key === "escape") {
        setIsShareModalOpen(false);
        setIsAddTreeModalOpen(false);
        setIsSettingsModalOpen(false);
        setIsCampfireModalOpen(false);
        setIsTentModalOpen(false);
        setIsCabinModalOpen(false);
        setSelectedTree(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [triggerQuestProgress]);


  const handleDeleteTree = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove "${name}" from your island?`)) {
      sound.playClick();
      removeTree(id);
      if (selectedTree?.id === id) {
        setSelectedTree(null);
      }
    }
  };

  if (!mounted) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <span className="tracking-[0.2em] uppercase font-bold font-sans text-xs text-stone-700">
          Loading 3D Living Diorama...
        </span>
      </div>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const hasShippedToday = shipHistory.some((s) => s.date.startsWith(todayStr));

  const unclaimedQuestsCount = dailyQuests.filter(
    (q) => q.isCompleted && !q.isClaimed
  ).length;
  const completedQuestsCount = dailyQuests.filter((q) => q.isCompleted).length;

  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  return (
    <div
      className={`fixed inset-0 w-screen h-screen overflow-hidden ${
        timeOfDay === "night"
          ? "bg-[#0b0f19]"
          : timeOfDay === "sunset"
          ? "bg-[#fef2f2]"
          : "bg-[#ece7de]"
      } text-stone-900 font-sans selection:bg-emerald-600 selection:text-white select-none transition-colors duration-700`}
    >
      {/* 1. Full-Screen Edge-to-Edge 3D Diorama Game Canvas (Locked to Isometric View) */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ForestCanvas
          trees={trees}
          level={level}
          streakDays={streakDays}
          streakShields={streakShields}
          drought={drought}
          timeOfDay={timeOfDay}
          zoomLevel={zoomLevel}
          selectedTreeId={selectedTree?.id}
          onSelectTree={(t) => {
            sound.playClick();
            setSelectedTree(t);
          }}
          onClickCampfire={() => setIsCampfireModalOpen(true)}
          onClickTent={() => setIsTentModalOpen(true)}
          onClickCabin={() => setIsCabinModalOpen(true)}
          className="w-full h-full"
        />
      </div>

      {/* 2. Floating Game HUD Chrome */}
      {!isHudHidden && (
        <>
          {/* Top-Left: Navigation & Quests Capsule */}
          <DashboardTopLeftNav
            backHref="/"
            backLabel="Home"
            unclaimedQuestsCount={unclaimedQuestsCount}
            completedQuestsCount={completedQuestsCount}
            totalQuestsCount={dailyQuests.length}
          />

          {/* Top-Right: World Ambience & Utilities */}
          <DashboardGameControls
            trees={trees}
            timeOfDay={timeOfDay}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenAddTree={() => setIsAddTreeModalOpen(true)}
            onDeleteTree={handleDeleteTree}
            onToggleTimeOfDay={toggleTimeOfDay}
          />

          {/* Bottom-Center: Command Center Resting Action Dock */}
          <FloatingDock
            level={level}
            streakDays={streakDays}
            totalMrr={totalMrr}
            activeTreesCount={trees.length}
            hasShippedToday={hasShippedToday}
            onOpenShip={() => setIsCampfireModalOpen(true)}
            onOpenShare={() => {
              triggerQuestProgress("build-in-public", 1);
              setIsShareModalOpen(true);
            }}
            onOpenAddTree={() => setIsAddTreeModalOpen(true)}
          />

        </>
      )}

      {/* Immersive HUD Restore Button (Visible when HUD is hidden) */}
      {isHudHidden && (
        <button
          onClick={() => setIsHudHidden(false)}
          className="fixed top-5 right-5 z-40 p-2.5 rounded-full bg-white border border-stone-300 shadow-2xl text-stone-700 hover:text-stone-950 transition cursor-pointer font-sans text-xs flex items-center gap-2"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-bold">Show HUD (Press H)</span>
        </button>
      )}

      {/* 3. In-World Tree Inspector Popup */}
      <TreeInspectorCard
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onDelete={handleDeleteTree}
      />

      {/* 4. Campsite & Tool Modals */}
      <CampfireFocusModal
        isOpen={isCampfireModalOpen}
        onClose={() => setIsCampfireModalOpen(false)}
      />

      <TentSabbaticalModal
        isOpen={isTentModalOpen}
        onClose={() => setIsTentModalOpen(false)}
      />

      <CabinWarRoomModal
        isOpen={isCabinModalOpen}
        onClose={() => setIsCabinModalOpen(false)}
        onOpenShare={() => {
          triggerQuestProgress("build-in-public", 1);
          setIsShareModalOpen(true);
        }}
        onOpenAddTree={() => setIsAddTreeModalOpen(true)}
      />

      <ShareCardModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddTreeModal
        isOpen={isAddTreeModalOpen}
        onClose={() => setIsAddTreeModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

