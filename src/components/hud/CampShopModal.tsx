"use client";

import React from "react";
import { useForestStore, ShopItem } from "@/store/useForestStore";
import { X, ShoppingBag, Check, Lock, Sparkles } from "lucide-react";

interface CampShopModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CampShopModal({ isOpen, onClose }: CampShopModalProps) {
  const shopItems = useForestStore((s) => s.shopItems);
  const pinecones = useForestStore((s) => s.pinecones);
  const level = useForestStore((s) => s.level);
  const buyShopItem = useForestStore((s) => s.buyShopItem);
  const toggleEquipItem = useForestStore((s) => s.toggleEquipItem);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Shell (Double-Bezel) */}
      <div className="w-full max-w-lg p-1.5 rounded-[2rem] bg-emerald-950/40 ring-1 ring-emerald-500/30 shadow-2xl relative">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c1813] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/60 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 ring-1 ring-amber-500/40 flex items-center justify-center text-amber-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-amber-400 block mb-0.5">
                  Cosmetic Upgrades
                </span>
                <h2 className="text-base font-bold text-emerald-50 tracking-tight">Camp Shop</h2>
              </div>
            </div>

            <div className="px-3 py-1.5 rounded-full bg-amber-950/50 ring-1 ring-amber-500/30 flex items-center gap-1.5 text-amber-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
              <span className="text-xs">🌰</span>
              <span className="text-xs font-mono font-bold">{pinecones} Pinecones</span>
            </div>
          </div>

          {/* Shop Item Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
            {shopItems.map((item) => {
              const isLevelLocked = item.minLevel && level < item.minLevel;
              const canAfford = pinecones >= item.cost;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-[1.25rem] border transition flex flex-col justify-between ${
                    item.isUnlocked
                      ? "bg-emerald-950/30 border-emerald-500/30 ring-1 ring-emerald-500/10"
                      : isLevelLocked
                      ? "bg-black/40 border-slate-800/60 opacity-60"
                      : "bg-slate-950/60 border-amber-500/20 hover:border-amber-500/40"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl">{item.icon}</span>
                      {item.isUnlocked ? (
                        <span className="text-[10px] font-bold font-mono text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/80 ring-1 ring-emerald-800">
                          OWNED
                        </span>
                      ) : isLevelLocked ? (
                        <span className="text-[10px] font-bold font-mono text-slate-400 flex items-center gap-1">
                          <Lock className="w-3 h-3" /> LVL {item.minLevel}
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-amber-300 flex items-center gap-1">
                          🌰 {item.cost}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-emerald-100">{item.name}</h4>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="mt-4 pt-2.5 border-t border-slate-800/80">
                    {item.isUnlocked ? (
                      <button
                        onClick={() => toggleEquipItem(item.id)}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 active:scale-[0.98] ${
                          item.isEquipped
                            ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                            : "bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 ring-1 ring-emerald-800"
                        }`}
                      >
                        {item.isEquipped ? (
                          <>
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" /> Placed on Island
                          </>
                        ) : (
                          "Place on Island"
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => buyShopItem(item.id)}
                        disabled={!canAfford || !!isLevelLocked}
                        className={`w-full py-2 rounded-xl text-xs font-bold transition active:scale-[0.98] ${
                          canAfford && !isLevelLocked
                            ? "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20"
                            : "bg-slate-800/80 text-slate-500 cursor-not-allowed"
                        }`}
                      >
                        {isLevelLocked
                          ? `Unlocks at Level ${item.minLevel}`
                          : canAfford
                          ? `Buy for 🌰 ${item.cost}`
                          : "Need More 🌰"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
