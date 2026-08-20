"use client";

import React, { useState } from "react";
import { useForestStore, GrowthTier } from "@/store/useForestStore";
import { X, PlusCircle, Trees, DollarSign, ArrowRight } from "lucide-react";

interface AddTreeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddTreeModal({ isOpen, onClose }: AddTreeModalProps) {
  const addTree = useForestStore((s) => s.addTree);

  const [name, setName] = useState("");
  const [mrr, setMrr] = useState("29");
  const [tier, setTier] = useState<GrowthTier>("young");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addTree(name.trim(), parseInt(mrr) || 0, tier);
    setName("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      {/* Outer Shell (Double-Bezel) */}
      <div className="w-full max-w-md p-1.5 rounded-[2rem] bg-emerald-950/40 ring-1 ring-emerald-500/30 shadow-2xl relative">
        {/* Inner Core */}
        <div className="rounded-[calc(2rem-0.375rem)] bg-[#0c1813] p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)] text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 ring-1 ring-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Trees className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] font-bold text-emerald-400 block mb-0.5">
                Revenue & Subscribers
              </span>
              <h2 className="text-base font-bold text-emerald-50 tracking-tight">
                Plant Customer Tree
              </h2>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Customer / Goal Name */}
            <div>
              <label className="text-xs font-semibold text-emerald-300 mb-1.5 block">
                Customer / Subscriber Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Acme Corp (Pro Tier)"
                className="w-full bg-black/60 border border-emerald-500/25 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-100 placeholder-slate-500 outline-none focus:ring-1 focus:ring-emerald-400 font-sans"
              />
            </div>

            {/* MRR Contribution */}
            <div>
              <label className="text-xs font-semibold text-emerald-300 mb-1.5 block">
                Monthly Revenue (MRR $)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-emerald-400 absolute left-3.5 top-2.5" />
                <input
                  type="number"
                  min="0"
                  value={mrr}
                  onChange={(e) => setMrr(e.target.value)}
                  placeholder="29"
                  className="w-full bg-black/60 border border-emerald-500/25 rounded-2xl pl-9 pr-3 py-2.5 text-xs text-emerald-100 font-mono outline-none focus:ring-1 focus:ring-emerald-400"
                />
              </div>
            </div>

            {/* Growth Tier Select */}
            <div>
              <label className="text-xs font-semibold text-emerald-300 mb-1.5 block">
                Initial Tree Stage
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(["sapling", "young", "mature", "majestic"] as GrowthTier[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTier(t)}
                    className={`py-2 rounded-xl capitalize font-semibold transition ${
                      tier === t
                        ? "bg-emerald-500 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.4)]"
                        : "bg-black/40 ring-1 ring-emerald-900/60 text-emerald-300 hover:bg-emerald-950/60"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit with Button-in-Button */}
            <button
              type="submit"
              className="group w-full pl-5 pr-2 py-2 mt-2 rounded-full font-bold bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-slate-950 shadow-lg shadow-emerald-500/25 transition-all duration-300 flex items-center justify-between text-xs tracking-wider active:scale-[0.98]"
            >
              <span className="font-mono font-extrabold">PLANT TREE ON ISLAND</span>
              <div className="w-8 h-8 rounded-full bg-slate-950/20 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
