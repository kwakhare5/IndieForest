"use client";

import React, { useState, useEffect } from "react";
import { ForestCanvas } from "@/components/canvas/ForestCanvas";
import { DashboardBuilderCapsule } from "@/components/hud/DashboardBuilderCapsule";
import { DashboardGameControls } from "@/components/hud/DashboardGameControls";
import { FloatingDock } from "@/components/hud/FloatingDock";
import { TimelineScrubber } from "@/components/hud/TimelineScrubber";
import { TreeInspectorCard } from "@/components/hud/TreeInspectorCard";
import { ModuleInventoryDrawer } from "@/components/hud/ModuleInventoryDrawer";
import { TurntableExportModal } from "@/components/hud/TurntableExportModal";
import { CampfireFocusModal } from "@/components/hud/CampfireFocusModal";
import { TentSabbaticalModal } from "@/components/hud/TentSabbaticalModal";
import { CabinWarRoomModal } from "@/components/hud/CabinWarRoomModal";
import { ShareCardModal } from "@/components/hud/ShareCardModal";
import { AddTreeModal } from "@/components/hud/AddTreeModal";
import { SettingsModal } from "@/components/hud/SettingsModal";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { calculateForestHealth } from "@/lib/gamification";
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
  const isAutoSyncing = useForestStore((s) => s.isAutoSyncing);
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const streakDays = useForestStore((s) => s.streakDays);
  const streakShields = useForestStore((s) => s.streakShields);
  const shipHistory = useForestStore((s) => s.shipHistory);
  const drought = useForestStore((s) => s.drought);
  const user = useForestStore((s) => s.user);
  const removeTree = useForestStore((s) => s.removeTree);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  // Modals & HUD Overlays
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isCampfireModalOpen, setIsCampfireModalOpen] = useState(false);
  const [isTentModalOpen, setIsTentModalOpen] = useState(false);
  const [isCabinModalOpen, setIsCabinModalOpen] = useState(false);
  const [selectedTree, setSelectedTree] = useState<TreeData | null>(null);
  const [isHudHidden, setIsHudHidden] = useState(false);

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

    if (trees.length === 0) {
      syncGitHubIsland(targetUsername);
    } else {
      autoCheckTodayCommits();
    }
  }, [
    isLoaded,
    isSignedIn,
    clerkUser,
    checkStreakExpiry,
    setUser,
    syncGitHubIsland,
    autoCheckTodayCommits,
    trees.length,
  ]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "h" && !e.metaKey && !e.ctrlKey) {
        // Prevent toggle if inside an input or modal
        if (
          document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA"
        ) {
          return;
        }
        setIsHudHidden((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        <span className="tracking-[0.2em] uppercase font-bold font-pixel text-sm">
          Loading 3D Living Diorama...
        </span>
      </div>
    );
  }

  const { badge: rankBadge, title: rankTitle } = getRankTitle(level);
  const activeDates = shipHistory.map((s) => s.date);
  const forestHealth = calculateForestHealth(activeDates);
  const todayStr = new Date().toISOString().split("T")[0];
  const hasShippedToday = shipHistory.some((s) => s.date.startsWith(todayStr));

  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#ece7de] text-stone-900 font-satoshi selection:bg-emerald-600 selection:text-white select-none">
      
      {/* 1. Full-Screen Edge-to-Edge 3D Diorama Game Canvas */}
      <div className="absolute inset-0 w-full h-full z-0">
        <ForestCanvas
          trees={trees}
          level={level}
          streakDays={streakDays}
          streakShields={streakShields}
          drought={drought}
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
          {/* Top-Left: Builder Level, XP & Consistency Capsule */}
          <DashboardBuilderCapsule
            username={user.username || "builder"}
            avatarUrl={user.avatarUrl}
            rankBadge={rankBadge}
            rankTitle={rankTitle}
            level={level}
            xp={xp}
            streakDays={streakDays}
            streakShields={streakShields}
            forestHealthPercent={forestHealth.healthPercent}
            forestHealthLabel={forestHealth.label}
          />

          {/* Top-Right: Game Controls, Audio & Inventory Drawer Trigger */}
          <DashboardGameControls
            isAutoSyncing={isAutoSyncing}
            treeCount={trees.length}
            onSync={() => autoCheckTodayCommits()}
            onOpenInventory={() => setIsInventoryOpen(true)}
            onOpenSettings={() => setIsSettingsModalOpen(true)}
            isHudHidden={isHudHidden}
            onToggleHideHud={() => setIsHudHidden(true)}
          />

          {/* Bottom-Center: Tactical Porcelain Action Dock */}
          <FloatingDock
            streakDays={streakDays}
            hasShippedToday={hasShippedToday}
            onOpenShip={() => setIsCampfireModalOpen(true)}
            onOpenAddTree={() => setIsAddTreeModalOpen(true)}
            onOpenShare={() => setIsShareModalOpen(true)}
            onOpenTimeline={() => setIsTimelineOpen(!isTimelineOpen)}
            onOpenVideo={() => setIsVideoModalOpen(true)}
            onOpenTent={() => setIsTentModalOpen(true)}
            isTimelineActive={isTimelineOpen}
          />
        </>
      )}

      {/* Immersive HUD Restore Button (Visible when HUD is hidden) */}
      {isHudHidden && (
        <button
          onClick={() => setIsHudHidden(false)}
          className="fixed top-5 right-5 z-40 p-2.5 rounded-full bg-white border border-stone-300 shadow-2xl text-stone-700 hover:text-stone-950 transition cursor-pointer font-satoshi text-xs flex items-center gap-2"
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

      {/* 4. Slide-Over Module Inventory Tactical Drawer */}
      <ModuleInventoryDrawer
        isOpen={isInventoryOpen}
        onClose={() => setIsInventoryOpen(false)}
        trees={trees}
        onOpenAddModal={() => {
          setIsInventoryOpen(false);
          setIsAddTreeModalOpen(true);
        }}
        onDeleteTree={handleDeleteTree}
      />

      {/* 5. 30-Day Timeline Growth Scrubber */}
      <TimelineScrubber
        isOpen={isTimelineOpen}
        onClose={() => setIsTimelineOpen(false)}
        trees={trees}
        shipHistory={shipHistory}
      />

      {/* 6. Campsite & Tool Modals */}
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
        onOpenShare={() => setIsShareModalOpen(true)}
        onOpenAddTree={() => setIsAddTreeModalOpen(true)}
      />

      <TurntableExportModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        username={user.username}
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
