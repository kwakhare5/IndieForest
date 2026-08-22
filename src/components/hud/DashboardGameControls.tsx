"use client";

import React, { useState } from "react";
import {
  LayoutGrid,
  Settings,
  Volume2,
  VolumeX,
  Sun,
  Sunset,
  Moon,
  X,
  Search,
  Trash2,
  Plus,
  GitCommit,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { UserButton } from "@clerk/nextjs";
import { sound } from "@/lib/sound";
import type { TimeOfDay, TreeData } from "@/types/game";

interface DashboardGameControlsProps {
  trees: TreeData[];
  timeOfDay?: TimeOfDay;
  onOpenSettings: () => void;
  onOpenAddTree: () => void;
  onDeleteTree: (id: string, name: string) => void;
  onToggleTimeOfDay?: () => void;
}

export function DashboardGameControls({
  trees = [],
  timeOfDay = "day",
  onOpenSettings,
  onOpenAddTree,
  onDeleteTree,
  onToggleTimeOfDay,
}: DashboardGameControlsProps) {
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isModulesPopoverOpen, setIsModulesPopoverOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "shipping" | "revenue">("all");

  const toggleSound = () => {
    sound.playClick();
    const isPlaying = sound.toggleCampfireAmbiance();
    setIsAudioMuted(!isPlaying);
  };

  const getTimeIcon = () => {
    switch (timeOfDay) {
      case "sunset":
        return <Sunset className="w-4 h-4 text-amber-600" />;
      case "night":
        return <Moon className="w-4 h-4 text-indigo-400" />;
      default:
        return <Sun className="w-4 h-4 text-amber-500" />;
    }
  };

  const filteredTrees = trees.filter((tree) => {
    const matchesSearch = tree.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === "all" || tree.type === filterType || (filterType === "revenue" && (tree.mrr || 0) > 0);
    return matchesSearch && matchesType;
  });

  return (
    <div className="fixed top-4 right-5 z-40 flex flex-col items-end font-sans pointer-events-auto select-none">
      {/* 1. Universal Double-Bezel Landing Page Capsule */}
      <div className="p-1 rounded-full glass-dock shadow-lg transition-all duration-200">
        <div className="px-2 py-1 rounded-full porcelain-surface flex items-center gap-1.5 sm:gap-2">
          
          {/* Lighting Mode Toggle */}
          {onToggleTimeOfDay && (
            <button
              onClick={() => {
                sound.playClick();
                onToggleTimeOfDay();
              }}
              className="p-2 rounded-full text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition cursor-pointer active:scale-95"
              title={`Lighting: ${timeOfDay.toUpperCase()}`}
            >
              {getTimeIcon()}
            </button>
          )}

          {/* Lo-Fi Ambient Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-full text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition cursor-pointer active:scale-95"
            title={isAudioMuted ? "Unmute Campfire Lo-Fi" : "Mute Campfire Lo-Fi"}
          >
            {isAudioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
          </button>

          {/* Modules Inventory Trigger */}
          <Button
            variant={isModulesPopoverOpen ? "dark" : "outline"}
            size="sm"
            onClick={() => {
              sound.playClick();
              setIsModulesPopoverOpen((prev) => !prev);
            }}
            icon={LayoutGrid}
            className="shadow-xs active:scale-95 transition-transform text-xs"
            title="Connected Repos & Modules Popover (Press M / I)"
          >
            <span>Modules</span>
            <span className={`text-xs font-pixel ml-0.5 px-1.5 py-0.2 rounded-full ${isModulesPopoverOpen ? "bg-white/20 text-white" : "bg-stone-100 text-stone-700"}`}>
              {trees.length}
            </span>
          </Button>

          {/* Settings Modal Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="p-2 rounded-full text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition cursor-pointer active:scale-95"
            title="Settings & Webhook Config"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Clerk User Avatar */}
          <div className="pl-0.5 pr-0.5">
            <UserButton />
          </div>
        </div>
      </div>

      {/* 2. Floating Tactile Porcelain Modules Popover (Flat, Breathable, Zero Box-Soup) */}
      {isModulesPopoverOpen && (
        <div className="mt-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm p-1.5 rounded-[2rem] glass-dock shadow-2xl origin-top-right animate-in fade-in zoom-in-95 duration-150 z-50">
          <div className="p-4 sm:p-5 rounded-[calc(2rem-0.375rem)] porcelain-surface flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-stone-100 text-stone-800 border border-stone-200/80 flex items-center justify-center">
                  <LayoutGrid className="w-3.5 h-3.5 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-950 font-sans">Active Modules</h3>
                  <span className="text-[10px] text-stone-500 font-sans block">{trees.length} Island Projects</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="emerald"
                  size="sm"
                  onClick={() => {
                    sound.playClick();
                    setIsModulesPopoverOpen(false);
                    onOpenAddTree();
                  }}
                  icon={Plus}
                  className="text-[10px] py-1 px-2.5 shadow-xs"
                >
                  + Add Project
                </Button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsModulesPopoverOpen(false);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                  title="Close Modules"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col gap-2 my-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-950 placeholder-stone-400 outline-none focus:border-emerald-500 focus:bg-white transition font-sans"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium font-sans">
                {(["all", "shipping", "revenue"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      sound.playClick();
                      setFilterType(t);
                    }}
                    className={`px-2.5 py-0.5 rounded-lg capitalize transition cursor-pointer ${
                      filterType === t ? "bg-stone-900 text-white font-bold shadow-2xs" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Flat Module Items List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 custom-scrollbar">
              {filteredTrees.length > 0 ? (
                filteredTrees.map((tree) => (
                  <div key={tree.id} className="pb-2.5 border-b border-stone-100 last:border-0 last:pb-0 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center ${tree.type === "revenue" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {tree.type === "revenue" ? <TrendingUp className="w-3.5 h-3.5" /> : <GitCommit className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-xs text-stone-950 truncate font-sans">{tree.name}</span>
                        <span className="text-[10px] text-stone-500 uppercase font-sans font-medium tracking-wider">
                          {tree.type === "revenue" ? `$${tree.mrr || 0}/mo` : `${tree.commits || 0} commits`} · {tree.tier}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTree(tree.id, tree.name)}
                      className="p-1 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Prune / Delete Tree"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-400 font-sans">
                  No matching modules found.
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
