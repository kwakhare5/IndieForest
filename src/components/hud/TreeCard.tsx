"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trees, TrendingUp, X, Calendar, GitCommit, DollarSign } from "lucide-react";
import { TreeData } from "@/types/game";
import { sound } from "@/lib/sound";

interface TreeCardProps {
  tree: TreeData | null;
  onClose: () => void;
  onDelete: (id: string, name: string) => void;
}

export function TreeCard({ tree, onClose }: TreeCardProps) {
  if (!tree) return null;

  const isRevenue = tree.type === "revenue";

  return (
    <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:left-6 z-40 origin-bottom-left animate-in slide-in-from-bottom-3 fade-in duration-150 font-sans max-w-sm w-full mx-auto sm:mx-0">
      <Card
        variant="porcelain"
        className="p-4 sm:p-5 rounded-[2rem] shadow-2xl border border-stone-200/90 bg-white/98 backdrop-blur-md space-y-3.5 relative"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          title="Close Card"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tree Header */}
        <div className="flex items-center gap-3 pr-8">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
              isRevenue
                ? "bg-amber-50 text-amber-700 border border-amber-200/80"
                : "bg-emerald-50 text-emerald-700 border border-emerald-200/80"
            }`}
          >
            {isRevenue ? <TrendingUp className="w-4.5 h-4.5" /> : <Trees className="w-4.5 h-4.5" />}
          </div>
          <div>
            <span className="font-sans text-[10px] uppercase tracking-wider font-bold text-stone-400 block mb-0.5">
              {isRevenue ? "Revenue Grove" : "Code Grove"}
            </span>
            <h3 className="text-sm font-bold text-stone-950 font-sans truncate max-w-[200px]">
              {tree.name}
            </h3>
          </div>
        </div>

        {/* Stat Metrics Row */}
        <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-stone-50 border border-stone-100">
          <div>
            <span className="text-[10px] text-stone-400 font-medium block mb-0.5">
              {isRevenue ? "Tracked MRR" : "Commit Activity"}
            </span>
            <div className="flex items-center gap-1 font-bold text-xs text-stone-900">
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
              Growth Tier
            </span>
            <Badge variant={isRevenue ? "amber" : "emerald"} size="sm">
              Tier {tree.tier}
            </Badge>
          </div>
        </div>

        {/* Date & Coordinates Footer */}
        <div className="flex items-center justify-between text-xs text-stone-400 font-sans pt-0.5 border-t border-stone-100">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-stone-400" />
            Planted {new Date(tree.plantedAt).toLocaleDateString()}
          </span>
          <span className="text-[10px] font-mono text-stone-400">
            [{tree.gridX.toFixed(1)}, {tree.gridZ.toFixed(1)}]
          </span>
        </div>
      </Card>
    </div>
  );
}
