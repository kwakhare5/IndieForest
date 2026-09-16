"use client";

import React from "react";
import Link from "next/link";
import { WorldViewport } from "../../../spikes/sunnyside/WorldViewport";

export default function SunnysideSpikePage() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-stone-100">
      {/* 2D Base Terrain & River Viewport */}
      <WorldViewport />

      {/* Header Bar */}
      <div className="absolute top-4 left-4 z-40 flex items-center gap-3">
        <div className="px-3.5 py-2 rounded-xl bg-stone-900/90 border border-stone-800 shadow-xl backdrop-blur-md flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-wide uppercase text-stone-200">
            Living 2D Farmstead • All Layers Active
          </span>
          <span className="text-[11px] text-stone-400 font-mono">
            Click to Inspect • Pan: Drag • Zoom: Wheel
          </span>
        </div>

        <Link
          href="/dashboard"
          className="px-3 py-2 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-xs font-mono text-stone-300 transition-colors"
        >
          ← Back to 3D Dashboard
        </Link>
      </div>
    </div>
  );
}
