"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  Trees,
  TrendingUp,
  Plus,
  Trash2,
  Calendar,
  X,
  Search,
  CheckCircle2,
  GitCommit,
  DollarSign,
} from "lucide-react";
import { TreeData } from "@/types/game";
import { sound } from "@/lib/sound";

interface ModuleInventoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  trees: TreeData[];
  onOpenAddModal: () => void;
  onDeleteTree: (id: string, name: string) => void;
}

export function ModuleInventoryDrawer({
  isOpen,
  onClose,
  trees,
  onOpenAddModal,
  onDeleteTree,
}: ModuleInventoryDrawerProps) {
  const [filter, setFilter] = useState<"all" | "shipping" | "revenue">("all");
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const filteredTrees = trees.filter((tree) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "shipping" && tree.type !== "revenue") ||
      (filter === "revenue" && tree.type === "revenue");
    const matchesSearch = tree.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalMrr = trees
    .filter((t) => t.type === "revenue")
    .reduce((acc, t) => acc + (t.mrr || 0), 0);
  const totalCommits = trees
    .filter((t) => t.type !== "revenue")
    .reduce((acc, t) => acc + (t.commits || 1), 0);

  return (
    <div className="fixed inset-0 z-50 flex justify-end font-satoshi animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/30 transition-opacity cursor-pointer"
        onClick={() => {
          sound.playClick();
          onClose();
        }}
      />

      {/* Slide-Over Drawer Container */}
      <div className="relative z-50 w-full max-w-md bg-white h-full border-l border-stone-300 shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                <Trees className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-stone-950 font-satoshi">
                  Module Inventory
                </h3>
                <p className="text-[11px] text-stone-500 font-pixel">
                  {trees.length} ACTIVE ISLAND MODULES
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition cursor-pointer"
              title="Close Drawer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Summary Row */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <Card variant="subtle-inset" className="p-2.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-600">
                <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                <span>Commits:</span>
              </div>
              <span className="font-bold font-pixel text-stone-900">{totalCommits}</span>
            </Card>

            <Card variant="subtle-inset" className="p-2.5 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-stone-600">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>MRR:</span>
              </div>
              <span className="font-bold font-pixel text-amber-800">${totalMrr}/mo</span>
            </Card>
          </div>

          {/* Search & Filter Controls */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search modules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 outline-none focus:border-emerald-600"
              />
            </div>

            <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 border border-stone-200">
              <button
                onClick={() => setFilter("all")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition text-center ${
                  filter === "all" ? "bg-white text-stone-950 shadow-xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                All ({trees.length})
              </button>
              <button
                onClick={() => setFilter("shipping")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition text-center ${
                  filter === "shipping" ? "bg-white text-stone-950 shadow-xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Shipping ({trees.filter((t) => t.type !== "revenue").length})
              </button>
              <button
                onClick={() => setFilter("revenue")}
                className={`flex-1 py-1 rounded-lg text-xs font-bold transition text-center ${
                  filter === "revenue" ? "bg-white text-stone-950 shadow-xs" : "text-stone-600 hover:text-stone-900"
                }`}
              >
                Revenue ({trees.filter((t) => t.type === "revenue").length})
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Tree Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredTrees.length > 0 ? (
            filteredTrees.map((tree) => (
              <Card key={tree.id} variant="porcelain" className="p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                        tree.type === "revenue"
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {tree.type === "revenue" ? <TrendingUp className="w-3.5 h-3.5" /> : <Trees className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-stone-950 font-satoshi truncate max-w-[170px]">
                        {tree.name}
                      </h4>
                      <span className="text-[10px] text-stone-500 font-pixel">
                        Tier {tree.tier} · {tree.type === "revenue" ? "Revenue" : "Shipping"}
                      </span>
                    </div>
                  </div>

                  <Badge variant={tree.type === "revenue" ? "amber" : "emerald"} size="sm">
                    {tree.type === "revenue" ? `$${tree.mrr || 0}/mo` : `${tree.commits || 1} commits`}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 font-satoshi pt-1 border-t border-stone-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    {new Date(tree.plantedAt).toLocaleDateString()}
                  </span>

                  <button
                    onClick={() => onDeleteTree(tree.id, tree.name)}
                    className="p-1 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded transition cursor-pointer"
                    title="Delete Module"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center py-12 space-y-3 text-stone-500">
              <Trees className="w-8 h-8 text-stone-300 mx-auto" />
              <p className="text-xs font-satoshi">No modules match your filter.</p>
            </div>
          )}
        </div>

        {/* Drawer Bottom Action */}
        <div className="p-4 border-t border-stone-200/80 bg-stone-50 flex items-center justify-between">
          <span className="text-xs text-stone-500 font-satoshi flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Auto-sync enabled
          </span>

          <Button
            variant="emerald"
            size="sm"
            icon={Plus}
            onClick={() => {
              sound.playClick();
              onOpenAddModal();
            }}
          >
            Add Module
          </Button>
        </div>
      </div>
    </div>
  );
}
