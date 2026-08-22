"use client";

import React from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Trees, TrendingUp, X, Calendar, GitCommit, DollarSign } from "lucide-react";
import { TreeData } from "@/types/game";
import { sound } from "@/lib/sound";

interface TreeInspectorCardProps {
  tree: TreeData | null;
  onClose: () => void;
  onDelete: (id: string, name: string) => void;
}

export function TreeInspectorCard({ tree, onClose }: TreeInspectorCardProps) {
  if (!tree) return null;

  const isRevenue = tree.type === "revenue";

  return (
    <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:left-6 z-40 animate-in slide-in-from-bottom-4 sm:slide-in-from-left-4 fade-in duration-200 font-satoshi max-w-sm w-full mx-auto sm:mx-0">
      <Card
        variant="porcelain"
        className="p-4 sm:p-5 rounded-3xl shadow-2xl border border-stone-300 bg-white/98 backdrop-blur-md space-y-3 relative"
      >
        {/* Close button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Tree Header */}
        <div className="flex items-center gap-3 pr-6">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center border shadow-xs ${
              isRevenue
                ? "bg-amber-50 text-amber-700 border-amber-200"
                : "bg-emerald-50 text-emerald-700 border-emerald-200"
            }`}
          >
            {isRevenue ? <TrendingUp className="w-5 h-5" /> : <Trees className="w-5 h-5" />}
          </div>
          <div>
            <span className="font-satoshi text-[10px] uppercase tracking-wider font-bold text-stone-500 block">
              {isRevenue ? "EAST REVENUE GROVE" : "WEST SHIPPING GROVE"}
            </span>
            <h3 className="text-base font-bold text-stone-950 font-satoshi truncate max-w-[200px]">
              {tree.name}
            </h3>
          </div>
        </div>

        {/* Metric & Tier Pills */}
        <div className="grid grid-cols-2 gap-2">
          <Card variant="subtle-inset" className="p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-stone-500 font-semibold font-satoshi block">
              {isRevenue ? "Monthly Value" : "Commit Count"}
            </span>
            <div className="flex items-center gap-1 font-bold text-sm font-pixel text-stone-900">
              {isRevenue ? (
                <>
                  <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                  <span>${tree.mrr || 0}/mo</span>
                </>
              ) : (
                <>
                  <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{tree.commits || 1} Commits</span>
                </>
              )}
            </div>
          </Card>

          <Card variant="subtle-inset" className="p-2.5 rounded-xl space-y-0.5">
            <span className="text-[10px] text-stone-500 font-semibold font-satoshi block">
              Canopy Stage
            </span>
            <div className="flex items-center gap-1">
              <Badge variant={isRevenue ? "amber" : "emerald"} size="sm">
                Stage {tree.tier}
              </Badge>
            </div>
          </Card>
        </div>

        {/* Date & Plot Location */}
        <div className="flex items-center justify-between text-xs text-stone-500 font-satoshi pt-0.5">
          <span className="flex items-center gap-1 text-[11px]">
            <Calendar className="w-3 h-3 text-stone-400" />
            Planted {new Date(tree.plantedAt).toLocaleDateString()}
          </span>
          <span className="text-[11px] font-mono text-stone-400">
            [{tree.gridX.toFixed(1)}, {tree.gridZ.toFixed(1)}]
          </span>
        </div>
      </Card>
    </div>
  );
}
