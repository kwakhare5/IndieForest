"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, LayoutGrid, Settings, Volume2, VolumeX, Eye, EyeOff } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { sound } from "@/lib/sound";

interface DashboardGameControlsProps {
  isAutoSyncing: boolean;
  treeCount: number;
  onSync: () => void;
  onOpenInventory: () => void;
  onOpenSettings: () => void;
  isHudHidden?: boolean;
  onToggleHideHud?: () => void;
}

export function DashboardGameControls({
  isAutoSyncing,
  treeCount,
  onSync,
  onOpenInventory,
  onOpenSettings,
  isHudHidden = false,
  onToggleHideHud,
}: DashboardGameControlsProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);

  const toggleSound = () => {
    sound.playClick();
    const isPlaying = sound.toggleCampfireAmbiance();
    setIsAudioMuted(!isPlaying);
  };

  return (
    <div className="fixed top-5 right-5 z-40 flex items-center gap-2.5 font-satoshi pointer-events-auto select-none">
      {/* Immersive View / Hide HUD Toggle */}
      {onToggleHideHud && (
        <button
          onClick={onToggleHideHud}
          className="p-2 rounded-full bg-white border border-stone-300 shadow-xl shadow-stone-900/10 text-stone-600 hover:text-stone-950 transition cursor-pointer"
          title={isHudHidden ? "Show HUD" : "Hide HUD (Immersive Mode)"}
        >
          {isHudHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>
      )}

      {/* Main Control Capsule */}
      <div className="p-1.5 rounded-full bg-white border border-stone-300 shadow-xl shadow-stone-900/10 flex items-center gap-2">
        {/* Sync Button */}
        <Button
          variant="outline"
          size="sm"
          icon={RefreshCw}
          disabled={isAutoSyncing}
          onClick={() => {
            sound.playClick();
            onSync();
          }}
          className="hidden sm:inline-flex"
        >
          {isAutoSyncing ? "Syncing..." : "Sync"}
        </Button>

        {/* Ambient Sound Toggle */}
        <button
          onClick={toggleSound}
          className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
          title={isAudioMuted ? "Unmute Campfire Ambiance" : "Mute Campfire Ambiance"}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
        </button>

        {/* Inventory Drawer Trigger */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenInventory();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 border border-stone-200 text-xs font-bold text-stone-900 hover:bg-stone-200/80 transition cursor-pointer shadow-xs"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-stone-700" />
          <span>Modules</span>
          <Badge variant="stone" size="sm" className="ml-0.5 bg-white text-stone-800 border-stone-200">
            {treeCount}
          </Badge>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
          title="Open Settings & Webhook Config"
        >
          <Settings className="w-4 h-4" />
        </button>

        {/* Clerk User Avatar */}
        <div className="pl-1 pr-1">
          <UserButton />
        </div>
      </div>
    </div>
  );
}
