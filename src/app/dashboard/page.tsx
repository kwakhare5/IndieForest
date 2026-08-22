"use client";

import React, { useState, useEffect } from "react";
import { IslandCanvas } from "@/components/canvas/IslandCanvas";
import { DashboardNav } from "@/components/hud/DashboardNav";
import { DashboardControls } from "@/components/hud/DashboardControls";
import { DashboardDock } from "@/components/hud/DashboardDock";
import { TreeCard } from "@/components/hud/TreeCard";
import { Button } from "@/components/ui/Button";
import { Github } from "lucide-react";

// Modals
import { FocusModal } from "@/components/hud/modals/FocusModal";
import { RestShieldModal } from "@/components/hud/modals/RestShieldModal";
import { OverviewModal } from "@/components/hud/modals/OverviewModal";
import { ShareModal } from "@/components/hud/modals/ShareModal";
import { AddProjectModal } from "@/components/hud/modals/AddProjectModal";
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
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isFocusModalOpen, setIsFocusModalOpen] = useState(false);
  const [isRestShieldModalOpen, setIsRestShieldModalOpen] = useState(false);
  const [isOverviewModalOpen, setIsOverviewModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [isHudHidden, setIsHudHidden] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkStreakExpiry();

    async function initDashboard() {
      if (isLoaded && isSignedIn && clerkUser) {
        const ghAccount = clerkUser.externalAccounts?.find(
          (a) => (a.provider as string).includes("github")
        );
        const resolvedUsername =
          ghAccount?.username ||
          clerkUser.username ||
          clerkUser.firstName?.toLowerCase() ||
          "builder";

        setUser({
          id: clerkUser.id,
          username: resolvedUsername,
          avatarUrl: clerkUser.imageUrl || `https://github.com/${resolvedUsername}.png`,
          isAuthenticated: true,
        });

        // Hydrate from Supabase PostgreSQL first
        const cloudLoaded = await loadCloudIsland(clerkUser.id);
        if (!cloudLoaded && resolvedUsername && resolvedUsername !== "builder") {
          // If no cloud profile exists, sync real public repos from GitHub
          await syncGitHubIsland(resolvedUsername);
        }

        // Auto-check commits for today (zero manual tracking)
        await autoCheckTodayCommits();
      }
    }

    initDashboard();
  }, [
    isLoaded,
    isSignedIn,
    clerkUser,
    setUser,
    syncGitHubIsland,
    checkStreakExpiry,
    autoCheckTodayCommits,
    loadCloudIsland,
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;

      switch (e.key.toLowerCase()) {
        case "s":
          sound.playClick();
          setIsShareModalOpen((prev) => !prev);
          break;
        case "h":
          sound.playClick();
          setIsHudHidden((prev) => !prev);
          break;
        case "t":
        case "l":
          sound.playClick();
          toggleTimeOfDay();
          break;
        case "z":
          sound.playClick();
          setZoomLevel((prev) => (prev === 1 ? 2 : 1));
          break;
        case "escape":
          setSelectedTree(null);
          setIsShareModalOpen(false);
          setIsAddProjectModalOpen(false);
          setIsSettingsModalOpen(false);
          setIsFocusModalOpen(false);
          setIsRestShieldModalOpen(false);
          setIsOverviewModalOpen(false);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [toggleTimeOfDay]);

  const handleDeleteTree = (id: string, name: string) => {
    if (confirm(`Are you sure you want to prune "${name}"?`)) {
      removeTree(id);
      setSelectedTree(null);
    }
  };

  const totalMrr = trees
    .filter((t: TreeData) => t.type === "revenue")
    .reduce((acc: number, t: TreeData) => acc + (t.mrr || 0), 0);

  const completedQuestsCount = dailyQuests.filter((q) => q.isCompleted).length;
  const unclaimedQuestsCount = dailyQuests.filter((q) => q.isCompleted && !q.isClaimed).length;

  if (!mounted) {
    return (
      <div className="w-screen h-screen bg-[#ece7de] flex items-center justify-center font-sans text-stone-600">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
          <span className="text-xs font-bold tracking-wider uppercase text-stone-500 font-pixel">
            Loading Island Diorama...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#ece7de] select-none font-sans">
      {/* 1. Fullscreen Living 3D Diorama Canvas */}
      <div className="absolute inset-0 z-0">
        <IslandCanvas
          trees={trees}
          level={level}
          streakDays={streakDays}
          streakShields={streakShields}
          drought={drought}
          timeOfDay={timeOfDay}
          zoomLevel={zoomLevel}
          selectedTreeId={selectedTree?.id}
          onSelectTree={(tree) => {
            sound.playClick();
            setSelectedTree(tree);
          }}
          onClickCampfire={() => setIsFocusModalOpen(true)}
          onClickTent={() => setIsRestShieldModalOpen(true)}
          onClickCabin={() => setIsOverviewModalOpen(true)}
          className="w-full h-full"
        />
      </div>

      {/* 2. Floating Game HUD Chrome */}
      {!isHudHidden && (
        <>
          {/* Top-Left: Navigation & Quests Capsule */}
          <DashboardNav
            backHref="/"
            backLabel="Home"
            unclaimedQuestsCount={unclaimedQuestsCount}
            completedQuestsCount={completedQuestsCount}
            totalQuestsCount={dailyQuests.length}
          />

          {/* Top-Right: World Ambience & Controls */}
          <DashboardControls
            trees={trees}
            timeOfDay={timeOfDay}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            onOpenAddProject={() => setIsAddProjectModalOpen(true)}
            onDeleteTree={handleDeleteTree}
            onToggleTimeOfDay={toggleTimeOfDay}
          />

          {/* Empty State Call to Action (When zero trees exist) */}
          {trees.length === 0 && (
            <div className="fixed bottom-24 inset-x-0 z-40 flex justify-center pointer-events-none px-4">
              <div className="pointer-events-auto p-1.5 rounded-2xl glass-dock shadow-xl max-w-sm w-full animate-in fade-in slide-in-from-bottom-3 duration-300">
                <div className="p-3.5 rounded-xl porcelain-surface text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-stone-900 font-sans">
                      Your Island is Ready to Sprout
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-500 font-sans leading-relaxed">
                    Connect your GitHub handle to sprout your public repositories into living pines automatically.
                  </p>
                  <div className="flex items-center justify-center pt-1">
                    <Button
                      variant="emerald"
                      size="sm"
                      onClick={() => setIsSettingsModalOpen(true)}
                      icon={Github}
                      className="text-xs font-bold"
                    >
                      Connect GitHub Handle
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom-Center: Command Dock */}
          <DashboardDock
            level={level}
            streakDays={streakDays}
            totalMrr={totalMrr}
            activeTreesCount={trees.length}
            onOpenShare={() => {
              triggerQuestProgress("build-in-public", 1);
              setIsShareModalOpen(true);
            }}
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

      {/* 3. In-World Tree Card */}
      <TreeCard
        tree={selectedTree}
        onClose={() => setSelectedTree(null)}
        onDelete={handleDeleteTree}
      />

      {/* 4. Campsite & Tool Modals */}
      <FocusModal
        isOpen={isFocusModalOpen}
        onClose={() => setIsFocusModalOpen(false)}
      />

      <RestShieldModal
        isOpen={isRestShieldModalOpen}
        onClose={() => setIsRestShieldModalOpen(false)}
      />

      <OverviewModal
        isOpen={isOverviewModalOpen}
        onClose={() => setIsOverviewModalOpen(false)}
        onOpenShare={() => {
          triggerQuestProgress("build-in-public", 1);
          setIsShareModalOpen(true);
        }}
        onOpenAddProject={() => setIsAddProjectModalOpen(true)}
      />

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}
