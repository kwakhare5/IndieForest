"use client";

import React, { use } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Flame, Trees, TrendingUp } from "lucide-react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#ece7de] text-stone-600 font-mono text-xs">
        <div className="w-8 h-8 border-2 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-2" />
        <span className="uppercase tracking-widest text-[11px] font-pixel">Loading 3D Diorama...</span>
      </div>
    ),
  }
);

interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const { username } = use(params);
  const level = useForestStore((s) => s.level);
  const streakDays = useForestStore((s) => s.streakDays);
  const trees = useForestStore((s) => s.trees);

  const { title, badge } = getRankTitle(level);
  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  return (
    <main className="relative w-full h-screen min-h-[100dvh] overflow-hidden font-satoshi bg-[#ece7de]">
      {/* Top Floating User Card with Canonical Double-Bezel Pod */}
      <header className="absolute top-4 left-4 right-4 z-30 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg">
          <div className="px-3.5 py-1.5 rounded-full porcelain-surface flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shadow-inner font-satoshi">
              {username.slice(0, 2).toUpperCase()}
            </div>
            <div className="pr-2">
              <div className="flex items-center gap-1.5">
                <h1 className="text-xs font-bold text-stone-900 tracking-tight font-satoshi">@{username}</h1>
                <Badge variant="pixel" size="sm">
                  Tier {badge}
                </Badge>
              </div>
              <span className="text-[10px] font-pixel text-stone-500">{title}</span>
            </div>
          </div>
        </div>

        <Link href="/" className="pointer-events-auto">
          <Button variant="outline" size="sm" showArrow arrowType="left">
            Claim Your Own Island
          </Button>
        </Link>
      </header>

      {/* 3D Diorama Canvas */}
      <ForestCanvas mode="profile" />

      {/* Bottom Floating Stats Pill with Double-Bezel Pod */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 pointer-events-auto p-1 rounded-full glass-dock shadow-xl">
        <div className="px-6 py-2 rounded-full porcelain-surface flex items-center gap-4 text-xs font-satoshi">
          <div className="flex items-center gap-1.5 text-amber-800 font-semibold font-pixel">
            <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
            <span>{streakDays}d Streak</span>
          </div>
          <div className="w-[1px] h-3.5 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-emerald-800 font-bold font-pixel">
            <Trees className="w-4 h-4 text-emerald-700" />
            <span>{trees.length} Active Trees</span>
          </div>
          <div className="w-[1px] h-3.5 bg-stone-200" />
          <div className="flex items-center gap-1.5 text-stone-800 font-bold font-pixel">
            <TrendingUp className="w-4 h-4 text-emerald-700" />
            <span>${totalMrr}/mo MRR</span>
          </div>
        </div>
      </div>
    </main>
  );
}
