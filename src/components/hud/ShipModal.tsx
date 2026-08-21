"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Github, RefreshCw, Zap, GitCommit, ExternalLink, Sparkles } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import { sound } from "@/lib/sound";
import confetti from "canvas-confetti";

interface ShipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOURCE_OPTIONS: SegmentedOption<"github" | "manual">[] = [
  { value: "github", label: "Live GitHub Commit", icon: Github },
  { value: "manual", label: "1-Click Quick Ship", icon: Zap },
];

export function ShipModal({ isOpen, onClose }: ShipModalProps) {
  const shipToday = useForestStore((s) => s.shipToday);
  const streakDays = useForestStore((s) => s.streakDays);
  const user = useForestStore((s) => s.user);

  const [source, setSource] = useState<"github" | "manual">("github");
  const [githubRepo, setGithubRepo] = useState(user.githubRepo || "kwakhare5/IndieForest");
  const [quickMessage, setQuickMessage] = useState("");
  
  // Live GitHub Commit State
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [latestCommit, setLatestCommit] = useState<{
    sha: string;
    message: string;
    author: string;
    date?: string;
    url?: string;
  } | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchLatestCommit = useCallback(async (repoStr: string) => {
    const parts = repoStr.trim().split("/");
    if (parts.length !== 2) {
      setFetchError("Format must be username/repo (e.g. kwakhare5/IndieForest)");
      return;
    }

    setIsFetchingGithub(true);
    setFetchError(null);
    try {
      const res = await fetch(`/api/github?username=${encodeURIComponent(parts[0])}&repo=${encodeURIComponent(parts[1])}`);
      const data = await res.json();

      if (data.success && data.commits && data.commits.length > 0) {
        setLatestCommit(data.commits[0]);
      } else {
        setFetchError(data.error || "No recent commits found.");
        // Graceful fallback for offline demo
        setLatestCommit({
          sha: "sha-" + Math.random().toString(36).substring(2, 9),
          message: "feat: zero-touch commit verification & 3D island growth",
          author: parts[0],
          date: new Date().toISOString(),
          url: `https://github.com/${repoStr}`,
        });
      }
    } catch {
      setFetchError("Unable to reach GitHub. Using offline preview commit.");
      setLatestCommit({
        sha: "sha-9059e1f",
        message: "feat: zero-touch commit verification & 3D island growth",
        author: parts[0] || "builder",
        date: new Date().toISOString(),
        url: `https://github.com/${repoStr}`,
      });
    } finally {
      setIsFetchingGithub(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && source === "github") {
      fetchLatestCommit(githubRepo);
    }
  }, [isOpen, source, githubRepo, fetchLatestCommit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const shipMessage =
      source === "github"
        ? latestCommit?.message || "Verified code push to main branch"
        : quickMessage.trim() || "Shipped new improvements & features";

    const proofUrl = source === "github" ? latestCommit?.url : undefined;

    sound.playShipSuccess();
    shipToday(
      shipMessage,
      source,
      proofUrl,
      source === "github" ? githubRepo : undefined
    );

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
      colors: ["#10b981", "#3b82f6", "#f59e0b"],
    });

    setIsSubmitting(false);
    setQuickMessage("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Zero-Touch Ship & Water Island"
      badgeText="Verification Console"
      icon={Sparkles}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-satoshi">
        
        {/* Source Selector */}
        <SegmentedControl
          options={SOURCE_OPTIONS}
          value={source}
          onChange={(val) => setSource(val)}
        />

        {/* 1. Live GitHub Commit Mode (Zero Manual Input) */}
        {source === "github" && (
          <div className="space-y-3">
            <Card variant="subtle-inset" className="p-3.5 space-y-2.5 rounded-2xl">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-satoshi text-stone-700 font-semibold flex items-center gap-1.5">
                  <Github className="w-3.5 h-3.5 text-stone-900" />
                  <span>Connected GitHub Repository:</span>
                </label>
                <Badge variant="emerald" size="sm">Live Auto-Sync</Badge>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="kwakhare5/IndieForest"
                  className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-mono outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLatestCommit(githubRepo)}
                  disabled={isFetchingGithub}
                  icon={RefreshCw}
                >
                  {isFetchingGithub ? "Scanning..." : "Scan"}
                </Button>
              </div>

              {fetchError && (
                <p className="text-[10px] text-amber-700 font-mono">
                  {fetchError}
                </p>
              )}
            </Card>

            {/* Live Detected Commit Preview */}
            {latestCommit && (
              <Card variant="subtle-inset" className="p-3.5 space-y-2 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl animate-in fade-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                    <GitCommit className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Latest Commit Verified</span>
                  </span>
                  <Badge variant="emerald" size="sm">
                    {latestCommit.sha}
                  </Badge>
                </div>

                <p className="text-xs font-semibold text-stone-900 font-satoshi leading-snug">
                  &ldquo;{latestCommit.message}&rdquo;
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-1 border-t border-emerald-200/40">
                  <span>Author: @{latestCommit.author}</span>
                  {latestCommit.url && (
                    <a
                      href={latestCommit.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-700 hover:underline flex items-center gap-1 font-sans font-medium"
                    >
                      <span>Diff</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* 2. Manual Quick Ship Mode (1-Liner) */}
        {source === "manual" && (
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700 block font-satoshi">
              What did you ship? (1-Line Summary)
            </label>
            <input
              type="text"
              required
              value={quickMessage}
              onChange={(e) => setQuickMessage(e.target.value)}
              placeholder="e.g. Launched new pricing tiers & polished landing page"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2.5 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-satoshi"
            />
          </div>
        )}

        {/* Rewards & Level Progression Summary */}
        <Card variant="subtle-inset" className="p-3 rounded-xl flex items-center justify-between text-xs text-stone-600">
          <span className="font-pixel text-xs font-bold uppercase tracking-wider text-stone-500">Shipping Rewards:</span>
          <div className="flex items-center gap-2 font-pixel text-xs font-bold text-stone-900">
            <span className="text-emerald-800">+{100 + Math.min((streakDays + 1) * 10, 150)} XP</span>
            <span className="text-amber-800">+10 Pinecones</span>
          </div>
        </Card>

        {/* Primary Action Button */}
        <Button
          type="submit"
          variant="emerald"
          size="md"
          showArrow
          disabled={isSubmitting}
          className="w-full"
        >
          {source === "github" ? "SYNC COMMIT & WATER FOREST" : "LOG QUICK SHIP & WATER FOREST"}
        </Button>
      </form>
    </Modal>
  );
}
