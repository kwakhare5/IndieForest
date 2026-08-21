"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { sound } from "@/lib/sound";
import { TreeData } from "@/types/game";

export interface TimelineScrubberProps {
  trees: TreeData[];
  onScrubChange: (activeTrees: TreeData[], activeDateStr: string | null) => void;
  className?: string;
}

export function TimelineScrubber({ trees, onScrubChange, className = "" }: TimelineScrubberProps) {
  // Sort trees by planted date to establish historical bounds
  const sortedDates = React.useMemo(() => {
    if (!trees.length) return [Date.now() - 86400000 * 30, Date.now()];
    const timestamps = trees.map((t) => new Date(t.plantedAt).getTime()).filter((t) => !isNaN(t));
    if (!timestamps.length) return [Date.now() - 86400000 * 30, Date.now()];
    const min = Math.min(...timestamps, Date.now() - 86400000 * 30);
    const max = Math.max(...timestamps, Date.now());
    return [min, max];
  }, [trees]);

  const minTime = sortedDates[0];
  const maxTime = sortedDates[1];
  const totalDaysSpan = Math.max(Math.ceil((maxTime - minTime) / (1000 * 3600 * 24)), 7);

  const [currentDayOffset, setCurrentDayOffset] = useState<number>(totalDaysSpan);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isScrubbingActive, setIsScrubbingActive] = useState(false);
  const playIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Compute active date from slider offset
  const currentTime = minTime + (currentDayOffset / totalDaysSpan) * (maxTime - minTime);
  const currentDate = new Date(currentTime);
  const currentDateStr = currentDate.toISOString().slice(0, 10);

  // Compute trees visible at this point in time
  const visibleTrees = React.useMemo(() => {
    if (!isScrubbingActive) return trees;
    return trees.filter((t) => new Date(t.plantedAt).getTime() <= currentTime);
  }, [trees, currentTime, isScrubbingActive]);

  // Notify parent on change
  useEffect(() => {
    if (isScrubbingActive) {
      onScrubChange(visibleTrees, currentDateStr);
    } else {
      onScrubChange(trees, null);
    }
  }, [visibleTrees, isScrubbingActive, currentDateStr, onScrubChange, trees]);

  // Automated 10-Second Time-Lapse Player
  const togglePlay = () => {
    sound.playClick();
    if (isPlaying) {
      setIsPlaying(false);
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    } else {
      setIsScrubbingActive(true);
      setIsPlaying(true);
      setCurrentDayOffset(1); // restart from day 1

      playIntervalRef.current = setInterval(() => {
        setCurrentDayOffset((prev) => {
          if (prev >= totalDaysSpan) {
            setIsPlaying(false);
            if (playIntervalRef.current) clearInterval(playIntervalRef.current);
            sound.playLevelUp();
            return totalDaysSpan;
          }
          return prev + 1;
        });
      }, 10000 / totalDaysSpan); // exactly 10s total duration
    }
  };

  useEffect(() => {
    return () => {
      if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    };
  }, []);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value);
    setIsScrubbingActive(true);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    setCurrentDayOffset(val);
  };

  const handleQuickJump = (daysBack: number) => {
    sound.playClick();
    setIsScrubbingActive(true);
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    const targetOffset = Math.max(totalDaysSpan - daysBack, 1);
    setCurrentDayOffset(targetOffset);
  };

  const handleResetLive = () => {
    sound.playClick();
    setIsPlaying(false);
    if (playIntervalRef.current) clearInterval(playIntervalRef.current);
    setIsScrubbingActive(false);
    setCurrentDayOffset(totalDaysSpan);
  };

  return (
    <div className={`pointer-events-auto p-1.5 rounded-full glass-dock shadow-xl font-satoshi ${className}`}>
      <div className="px-4 py-2.5 rounded-full porcelain-surface flex flex-wrap items-center gap-3 sm:gap-4">
        
        {/* Play/Pause Time-Lapse Button */}
        <Button
          variant={isPlaying ? "emerald" : "dark"}
          size="sm"
          onClick={togglePlay}
          className="rounded-full shrink-0 shadow-xs"
        >
          {isPlaying ? (
            <>
              <Pause className="w-3.5 h-3.5 mr-1" />
              <span className="text-xs font-bold">Pause Replay</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 mr-1 fill-current" />
              <span className="text-xs font-bold">Play 10s Time-Lapse</span>
            </>
          )}
        </Button>

        {/* Quick Jumps */}
        <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold text-stone-600">
          <button
            onClick={() => handleQuickJump(7)}
            className="px-2 py-0.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
          >
            7d
          </button>
          <button
            onClick={() => handleQuickJump(30)}
            className="px-2 py-0.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
          >
            30d
          </button>
          <button
            onClick={() => handleQuickJump(90)}
            className="px-2 py-0.5 rounded-full hover:bg-stone-100 transition cursor-pointer"
          >
            90d
          </button>
        </div>

        {/* Timeline Slider */}
        <div className="flex-1 min-w-[140px] sm:min-w-[200px] flex items-center gap-2">
          <span className="text-[10px] font-bold font-pixel text-stone-600 uppercase shrink-0">Day 1</span>
          <input
            type="range"
            min="1"
            max={totalDaysSpan}
            value={currentDayOffset}
            onChange={handleSliderChange}
            className="w-full accent-emerald-700 cursor-pointer h-1.5 bg-stone-200 rounded-lg"
          />
          <span className="text-[10px] font-bold font-pixel text-emerald-800 uppercase shrink-0">
            Day {currentDayOffset}
          </span>
        </div>

        {/* Historical Status Badge */}
        <div className="flex items-center gap-2 shrink-0">
          {isScrubbingActive ? (
            <div className="flex items-center gap-1.5">
              <Badge variant="amber" size="sm" dot>
                <Calendar className="w-3 h-3 mr-1" />
                {currentDateStr} ({visibleTrees.length} Trees)
              </Badge>
              <button
                onClick={handleResetLive}
                className="p-1 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-100 transition"
                title="Return to Live Island"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Badge variant="emerald" size="sm" dot>
              Live State
            </Badge>
          )}
        </div>

      </div>
    </div>
  );
}
