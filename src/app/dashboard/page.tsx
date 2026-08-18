"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { TopStatusBar } from "@/components/hud/TopStatusBar";
import { DailyQuestPanel } from "@/components/hud/DailyQuestPanel";
import { FloatingDock } from "@/components/hud/FloatingDock";
import { SproutGuide } from "@/components/hud/SproutGuide";
import { ShipModal } from "@/components/hud/ShipModal";
import { ShareCardModal } from "@/components/hud/ShareCardModal";
import { AddTreeModal } from "@/components/hud/AddTreeModal";
import { CampShopModal } from "@/components/hud/CampShopModal";
import { SettingsModal } from "@/components/hud/SettingsModal";
import { AuthModal } from "@/components/hud/AuthModal";
import { useForestStore } from "@/store/useForestStore";
import { useUser } from "@clerk/nextjs";

// Dynamic import for Three.js Canvas to prevent SSR hydration mismatch
const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <span className="tracking-[0.2em] uppercase font-semibold font-pixel text-xs">
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
  const setUser = useForestStore((s) => s.setUser);

  const { isLoaded, isSignedIn, user: clerkUser } = useUser();

  const [isShipModalOpen, setIsShipModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isAddTreeModalOpen, setIsAddTreeModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkStreakExpiry();

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
    }
  }, [isLoaded, isSignedIn, clerkUser, checkStreakExpiry, setUser]);

  if (!mounted) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-10 h-10 border-3 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-3" />
        <span className="tracking-[0.2em] uppercase font-semibold font-pixel text-xs">
          Loading 3D Island...
        </span>
      </div>
    );
  }

  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden font-satoshi bg-[#ece7de]">
      {/* Zone 1: Top Status & Identity Bar */}
      <TopStatusBar
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Zone 2: Left Daily Quests Panel */}
      <DailyQuestPanel
        onOpenShipModal={() => setIsShipModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
      />

      {/* Zone 4: 3D Living Isometric Diorama Canvas */}
      <ForestCanvas mode="full" />

      {/* In-Game Onboarding Sprout Guide (Only on virgin island before first ship) */}
      {!hasCompletedSproutGuide && (
        <SproutGuide onOpenShipModal={() => setIsShipModalOpen(true)} />
      )}

      {/* Zone 3: Bottom Action Dock */}
      <FloatingDock
        onOpenShipModal={() => setIsShipModalOpen(true)}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onOpenAddTreeModal={() => setIsAddTreeModalOpen(true)}
        onOpenShopModal={() => setIsShopModalOpen(true)}
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

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </main>
  );
}
