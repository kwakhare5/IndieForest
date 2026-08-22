"use client";

import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Home, Trees, TrendingUp, Sparkles } from "lucide-react";
import { useForestStore } from "@/store/useForestStore";

interface CabinWarRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenShare?: () => void;
  onOpenAddTree?: () => void;
}

export function CabinWarRoomModal({
  isOpen,
  onClose,
  onOpenShare,
  onOpenAddTree,
}: CabinWarRoomModalProps) {
  const trees = useForestStore((s) => s.trees);
  const level = useForestStore((s) => s.level);
  const xp = useForestStore((s) => s.xp);
  const streakDays = useForestStore((s) => s.streakDays);

  const shippingTrees = trees.filter((t) => t.type !== "revenue");
  const revenueTrees = trees.filter((t) => t.type === "revenue");

  const totalCommits = shippingTrees.reduce((acc, t) => acc + (t.commits || 0), 0);
  const totalMrr = revenueTrees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Founder's War Room HQ" maxWidth="lg">
      <div className="space-y-5">
        {/* War Room Header */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-stone-100 to-amber-50 border border-stone-300/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-900 text-amber-100 flex items-center justify-center shadow-inner">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 font-satoshi">
                Multi-Repo Command Center
              </h4>
              <p className="text-xs text-stone-500 font-satoshi">
                Consolidated receipts across all active modules
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenShare?.();
              }}
              icon={Sparkles}
            >
              Export Proof
            </Button>
          </div>
        </div>

        {/* Dual-Grove Aggregate Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Card variant="porcelain" className="p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] text-stone-500 font-satoshi block">Emerald Grove</span>
            <div className="text-lg font-bold text-emerald-800 font-pixel flex items-center gap-1.5">
              <Trees className="w-4 h-4 text-emerald-600" />
              {shippingTrees.length} REPOS
            </div>
            <span className="text-[10px] text-stone-500">{totalCommits} total commits</span>
          </Card>

          <Card variant="porcelain" className="p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] text-stone-500 font-satoshi block">Golden Grove</span>
            <div className="text-lg font-bold text-amber-700 font-pixel flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-600" />
              ${totalMrr}/MO
            </div>
            <span className="text-[10px] text-stone-500">{revenueTrees.length} revenue trees</span>
          </Card>

          <Card variant="porcelain" className="p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] text-stone-500 font-satoshi block">Consistency</span>
            <div className="text-lg font-bold text-amber-800 font-pixel">
              {streakDays} DAYS
            </div>
            <span className="text-[10px] text-stone-500">Unbroken shipping</span>
          </Card>

          <Card variant="porcelain" className="p-3.5 rounded-2xl space-y-1">
            <span className="text-[11px] text-stone-500 font-satoshi block">Rank & XP</span>
            <div className="text-lg font-bold text-stone-900 font-pixel">
              LVL {level}
            </div>
            <span className="text-[10px] text-stone-500">{xp} earned XP</span>
          </Card>
        </div>

        {/* Active Modules Breakdown */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-bold text-stone-900 font-satoshi uppercase tracking-wider">
              Verified Module Inventory ({trees.length})
            </h5>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                onClose();
                onOpenAddTree?.();
              }}
            >
              + Add Module
            </Button>
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {trees.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white border border-stone-200/80 text-xs font-satoshi"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      t.type === "revenue"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {t.type === "revenue" ? <TrendingUp className="w-3.5 h-3.5" /> : <Trees className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">{t.name}</span>
                    <span className="text-[10px] text-stone-500 block uppercase font-pixel">
                      {t.tier} Tier
                    </span>
                  </div>
                </div>

                <Badge variant={t.type === "revenue" ? "amber" : "emerald"} size="sm">
                  {t.type === "revenue" ? `$${t.mrr || 0}/mo` : `${t.commits || 1} commits`}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
