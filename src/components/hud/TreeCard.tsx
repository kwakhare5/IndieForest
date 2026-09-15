"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trees, TrendingUp, X, Calendar, GitCommit, DollarSign, Trash2 } from "lucide-react";
import { TreeData, toPlainEnglishTier } from "@/types/game";
import { sound } from "@/lib/sound";
import { getNextTierProgress } from "@/lib/gamification";
import { useForestStore } from "@/store/useForestStore";

interface TreeCardProps {
  tree: TreeData | null;
  onClose: () => void;
  onDelete?: (id: string, name: string) => void;
}

export function TreeCard({ tree, onClose, onDelete }: TreeCardProps) {
  const shipToProject = useForestStore((s) => s.shipToProject);

  if (!tree) return null;

  const isRevenue = tree.type === "revenue";
  const progress = getNextTierProgress(
    tree.type || "shipping",
    isRevenue ? tree.mrr || 0 : tree.commits || 1
  );

  return (
    <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:left-6 z-40 origin-bottom-left animate-in slide-in-from-bottom-3 fade-in duration-150 font-sans max-w-sm w-full mx-auto sm:mx-0">
      <Card
        doubleBezel
        rounded="2xl"
        className="shadow-2xl"
        innerClassName="p-4 sm:p-5 space-y-3.5 relative"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full btn-specular-porcelain text-stone-400 hover:text-stone-800 transition active:scale-95 cursor-pointer"
          title="Close Card"
        >
          <X className="w-3.5 h-3.5 stroke-[2]" />
        </button>

        {/* Tree Header */}
        <div className="flex items-center gap-3 pr-8">
          <div
            className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-[inset_0_1.5px_2px_rgba(0,0,0,0.06),inset_0_-1px_0_rgba(255,255,255,0.8)] border ${
              isRevenue
                ? "bg-amber-100/80 text-amber-800 border-amber-300/80"
                : "bg-emerald-100/80 text-emerald-800 border-emerald-300/80"
            }`}
          >
            {isRevenue ? <TrendingUp className="w-4.5 h-4.5" /> : <Trees className="w-4.5 h-4.5" />}
          </div>
          <div>
            <span className="font-sans text-[10px] uppercase tracking-wider font-medium text-stone-400 block mb-0.5">
              {isRevenue ? "Revenue Tree" : "Code Tree"}
            </span>
            <h3 className="text-sm font-medium text-stone-950 font-sans truncate max-w-[200px]">
              {tree.name}
            </h3>
          </div>
        </div>

        {/* Stat Metrics Row — Debossed Tactile Groove */}
        <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50/90 border border-stone-200/80 shadow-[inset_0_2px_4px_rgba(28,25,23,0.05),inset_0_-1px_0_rgba(255,255,255,0.85)]">
          <div>
            <span className="text-[10px] text-stone-400 font-medium block mb-0.5">
              {isRevenue ? "Monthly Revenue" : "Total Commits"}
            </span>
            <div className="flex items-center gap-1 font-medium text-xs text-stone-900">
              {isRevenue ? (
                <>
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span className="font-pixel text-sm">${tree.mrr || 0}/mo</span>
                </>
              ) : (
                <>
                  <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-pixel text-sm">{tree.commits || 1} Commits</span>
                </>
              )}
            </div>
          </div>

          <div>
            <span className="text-[10px] text-stone-400 font-medium block mb-0.5">
              Growth Stage
            </span>
            <Badge variant={isRevenue ? "amber" : "emerald"} size="sm" className="uppercase font-medium">
              {toPlainEnglishTier(tree.tier)}
            </Badge>
          </div>
        </div>

        {/* Milestone Progress Bar Container */}
        <div className="space-y-1.5 p-3 rounded-2xl bg-stone-50/90 border border-stone-200/80 shadow-[inset_0_1.5px_3px_rgba(28,25,23,0.04)]">
          <div className="flex items-center justify-between text-[11px] font-sans">
            <span className="text-stone-500 font-medium">Growth to Next Stage</span>
            <span className="font-mono text-stone-700 font-medium">
              {progress.nextTier === "max"
                ? "Max Stage Reached"
                : `${progress.currentValue} / ${progress.targetValue} ${isRevenue ? "MRR" : "Commits"} (${progress.progressPercent}%)`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-200/80 overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ${isRevenue ? "bg-amber-500" : "bg-emerald-600"}`}
              style={{ width: `${progress.progressPercent}%` }}
            />
          </div>
        </div>

        {/* 1-Click Ship to This Project Action */}
        <Button
          variant={isRevenue ? "amber" : "emerald"}
          size="sm"
          onClick={() => {
            sound.playShipSuccess();
            shipToProject(tree.id, `Shipped update to ${tree.name}`);
          }}
          icon={isRevenue ? DollarSign : GitCommit}
          className="w-full text-xs justify-center shadow-xs"
        >
          {isRevenue ? "Log Revenue to Project" : "Log Commit / Ship to Project"}
        </Button>

        {/* Date & External Link / Delete Footer */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-sans pt-2 border-t border-stone-100">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-stone-400" />
            Planted {new Date(tree.plantedAt).toLocaleDateString()}
          </span>
          <button
            onClick={() => {
              if (confirm(`Remove project "${tree.name}" from your island?`)) {
                sound.playClick();
                onDelete?.(tree.id, tree.name);
                onClose();
              }
            }}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] text-stone-500 hover:text-red-700 hover:bg-red-50/80 transition cursor-pointer active:scale-95"
            title="Remove Project"
          >
            <Trash2 className="w-3 h-3" />
            <span>Remove</span>
          </button>
        </div>
      </Card>
    </div>
  );
}
