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
import { Card } from "@/components/ui/Card";
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
    <div className="fixed top-4 right-5 z-40 flex flex-col items-end font-satoshi pointer-events-auto select-none">
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

          {/* Subtle Porcelain Modules Inventory Popover Trigger */}
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
            <span className="text-xs font-pixel ml-0.5 px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
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

      {/* 2. Floating Tactile Porcelain Modules Popover (Spring Animated) */}
      {isModulesPopoverOpen && (
        <div className="mt-3 w-[calc(100vw-2.5rem)] sm:w-96 max-w-sm p-1 rounded-3xl glass-dock shadow-2xl animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 z-50">
          <div className="p-4 rounded-[22px] porcelain-surface flex flex-col max-h-[75vh] overflow-hidden">
            
            {/* Popover Header */}
            <div className="flex items-center justify-between pb-3 border-b border-stone-200/80">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 shadow-2xs">
                  <LayoutGrid className="w-4 h-4 text-emerald-700" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-stone-950">Active Modules</h3>
                  <span className="text-[10px] text-stone-500 font-mono">{trees.length} Connected Island Trees</span>
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
                  Plant
                </Button>

                <button
                  onClick={() => {
                    sound.playClick();
                    setIsModulesPopoverOpen(false);
                  }}
                  className="p-1 rounded-full text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
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
                  placeholder="Search repos or revenue..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-950 placeholder-stone-400 outline-none focus:border-emerald-500 focus:bg-white transition"
                />
              </div>

              <div className="flex items-center gap-1 text-[11px] font-medium">
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

            {/* Module Items Scrollable List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredTrees.length > 0 ? (
                filteredTrees.map((tree) => (
                  <Card key={tree.id} variant="subtle-inset" className="p-2.5 rounded-xl flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className={`p-1.5 rounded-lg shrink-0 ${tree.type === "revenue" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
                        {tree.type === "revenue" ? <TrendingUp className="w-3.5 h-3.5" /> : <GitCommit className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="font-bold text-xs text-stone-950 truncate">{tree.name}</span>
                        <span className="text-xs text-stone-500 uppercase font-pixel">
                          {tree.type === "revenue" ? `$${tree.mrr || 0}/mo` : `${tree.commits || 0} commits`} · {tree.tier}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteTree(tree.id, tree.name)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Prune / Delete Tree"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </Card>
                ))
              ) : (
                <div className="text-center py-6 text-xs text-stone-400">
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
