"use client";

import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, Pause, RotateCcw, History } from "lucide-react";
import { sound } from "@/lib/sound";
import type { TreeData, ShipLog } from "@/types/game";

interface TimelineScrubberProps {
  trees: TreeData[];
  shipHistory?: ShipLog[];
  onScrubDate?: (dateOffset: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export function TimelineScrubber({
  trees,
  onScrubDate,
  isOpen,
  onClose,
}: TimelineScrubberProps) {
  const [currentDayOffset, setCurrentDayOffset] = useState(0); // 0 is today, -30 is 30 days ago
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentDayOffset((prev) => {
          if (prev >= 0) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          onScrubDate?.(next);
          sound.playClick();
          return next;
        });
      }, 300);
    }
    return () => clearInterval(timer);
  }, [isPlaying, onScrubDate]);

  if (!isOpen) return null;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setCurrentDayOffset(val);
    onScrubDate?.(val);
  };

  const handleStartPlayback = () => {
    sound.playClick();
    setCurrentDayOffset(-30);
    setIsPlaying(true);
    onScrubDate?.(-30);
  };

  const getDateLabel = (offset: number) => {
    if (offset === 0) return "Today (Live)";
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="fixed bottom-24 inset-x-0 z-30 flex justify-center px-4">
      <Card
        variant="porcelain"
        className="w-full max-w-2xl p-4 sm:p-5 rounded-3xl shadow-xl border border-stone-300 bg-white space-y-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-stone-900 font-satoshi">
                30-Day Growth Time Capsule
              </h4>
              <span className="text-[11px] text-stone-500 font-satoshi">
                Inspect past diorama states or auto-play time-lapse
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={currentDayOffset === 0 ? "emerald" : "stone"} size="sm">
              {getDateLabel(currentDayOffset)}
            </Badge>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>

        {/* Scrubber Slider */}
        <div className="space-y-2 pt-1">
          <input
            type="range"
            min={-30}
            max={0}
            value={currentDayOffset}
            onChange={handleSliderChange}
            className="w-full h-2 bg-stone-300 rounded-lg appearance-none cursor-pointer accent-emerald-600 focus:outline-none"
          />

          <div className="flex items-center justify-between text-[10px] text-stone-500 font-mono">
            <span>30 Days Ago</span>
            <span>15 Days Ago</span>
            <span>Today (Live)</span>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-stone-200/70">
          <div className="flex items-center gap-2">
            <Button
              variant="emerald"
              size="sm"
              onClick={() => {
                if (isPlaying) {
                  setIsPlaying(false);
                } else {
                  handleStartPlayback();
                }
              }}
              icon={isPlaying ? Pause : Play}
            >
              {isPlaying ? "Pause Timelapse" : "Play 10s Timelapse"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsPlaying(false);
                setCurrentDayOffset(0);
                onScrubDate?.(0);
              }}
              icon={RotateCcw}
            >
              Reset Live
            </Button>
          </div>

          <span className="text-[11px] text-stone-500 font-satoshi">
            {trees.length} Active Modules Tracked
          </span>
        </div>
      </Card>
    </div>
  );
}
