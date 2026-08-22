"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Trees, TrendingUp, Sparkles, Building2 } from "lucide-react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import type { TreeData } from "@/types/game";

interface OverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: () => void;
  onOpenAddProject?: () => void;
}

export function OverviewModal({
  isOpen,
  onClose,
  onOpenShare,
  onOpenAddProject,
}: OverviewModalProps) {
  const user = useForestStore((s) => s.user);
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const streakDays = useForestStore((s) => s.streakDays);
  const trees = useForestStore((s) => s.trees);

  const { title, badge } = getRankTitle(level);
  const shippingTrees = trees.filter((t: TreeData) => t.type === "shipping");
  const revenueTrees = trees.filter((t: TreeData) => t.type === "revenue");
  const totalMrr = revenueTrees.reduce((acc: number, t: TreeData) => acc + (t.mrr || 0), 0);
  const totalCommits = shippingTrees.reduce((acc: number, t: TreeData) => acc + (t.commits || 0), 0);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Island Overview & Projects"
      badgeText="Dashboard Summary"
      icon={Building2}
      maxWidth="lg"
    >
      <div className="space-y-4 font-sans text-xs text-stone-700">
        {/* Profile Command Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              {badge}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-xs font-sans">
                  @{user.username || "builder"}
                </span>
                <Badge variant="emerald" size="sm">
                  Tier {badge} · {title}
                </Badge>
              </div>
              <span className="text-[10px] text-stone-400 font-sans block">
                Level {level} Builder · {xp} Earned XP
              </span>
            </div>
          </div>

          <Button
            variant="emerald"
            size="sm"
            onClick={() => {
              onClose();
              onOpenShare?.();
            }}
            icon={Sparkles}
            className="text-xs"
          >
            Export Proof
          </Button>
        </div>

        {/* Dual-Grove Aggregate Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
            <span className="text-[10px] text-stone-400 font-medium block">Code Grove</span>
            <div className="text-base font-bold text-emerald-800 font-pixel flex items-center gap-1">
              <Trees className="w-3.5 h-3.5 text-emerald-600" />
              {shippingTrees.length} REPOS
            </div>
            <span className="text-[10px] text-stone-400">{totalCommits} commits</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
            <span className="text-[10px] text-stone-400 font-medium block">Revenue Grove</span>
            <div className="text-base font-bold text-amber-700 font-pixel flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
              ${totalMrr}/MO
            </div>
            <span className="text-[10px] text-stone-400">{revenueTrees.length} oaks</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
            <span className="text-[10px] text-stone-400 font-medium block">Consistency</span>
            <div className="text-base font-bold text-stone-900 font-pixel">
              {streakDays} DAYS
            </div>
            <span className="text-[10px] text-stone-400">Unbroken streak</span>
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-100 space-y-0.5">
            <span className="text-[10px] text-stone-400 font-medium block">Rank Tier</span>
            <div className="text-base font-bold text-stone-900 font-pixel">
              LVL {level}
            </div>
            <span className="text-[10px] text-stone-400">{xp} earned XP</span>
          </div>
        </div>

        {/* Active Projects Breakdown */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-900 font-sans uppercase tracking-wider">
              Connected Projects ({trees.length})
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenAddProject?.();
              }}
              className="text-xs"
            >
              + Add Project
            </Button>
          </div>

          <div className="max-h-44 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {trees.map((t: TreeData) => (
              <div
                key={t.id}
                className="flex items-center justify-between pb-2 border-b border-stone-100 last:border-0 last:pb-0 text-xs font-sans"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className={`w-2 h-2 rounded-full ${t.type === "revenue" ? "bg-amber-500" : "bg-emerald-500"}`} />
                  <span className="font-semibold text-stone-900 truncate">{t.name}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 text-[11px] text-stone-500">
                  <span>{t.type === "revenue" ? `$${t.mrr || 0}/mo` : `${t.commits || 0} commits`}</span>
                  <Badge variant={t.type === "revenue" ? "amber" : "emerald"} size="sm">
                    {t.tier}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
