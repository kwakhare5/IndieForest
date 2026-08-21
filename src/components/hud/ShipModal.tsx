"use client";

import React, { useState } from "react";
import { useForestStore } from "@/store/useForestStore";
import { Github, Link as LinkIcon, RefreshCw, CheckCircle2, Send, Zap } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import confetti from "canvas-confetti";

interface ShipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SOURCE_OPTIONS: SegmentedOption<"manual" | "github">[] = [
  { value: "manual", label: "1-Click Ship", icon: Zap },
  { value: "github", label: "GitHub Commit", icon: Github },
];

export function ShipModal({ isOpen, onClose }: ShipModalProps) {
  const shipToday = useForestStore((s) => s.shipToday);
  const streakDays = useForestStore((s) => s.streakDays);

  const [message, setMessage] = useState("");
  const [proofUrl, setProofUrl] = useState("");
  const [source, setSource] = useState<"manual" | "github">("manual");
  const [githubRepo, setGithubRepo] = useState("kwakhare5/IndieForest");
  const [isFetchingGithub, setIsFetchingGithub] = useState(false);
  const [githubSuccess, setGithubSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFetchGithub = async () => {
    const parts = githubRepo.trim().split("/");
    if (parts.length !== 2) {
      alert("Please enter username/repo format (e.g. kwakhare5/IndieForest)");
      return;
    }

    setIsFetchingGithub(true);
    try {
      const res = await fetch(`/api/github?username=${parts[0]}&repo=${parts[1]}`);
      const data = await res.json();

      if (data.success && data.commits && data.commits.length > 0) {
        const latest = data.commits[0];
        setMessage(latest.message);
        setProofUrl(latest.url);
        setGithubSuccess(true);
      } else {
        alert(data.error || "No commits found for this repository.");
      }
    } catch {
      alert("Failed to connect to GitHub API.");
    } finally {
      setIsFetchingGithub(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    shipToday(
      message || "Pushed updates and improvements",
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
    setMessage("");
    setProofUrl("");
    setGithubSuccess(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Log Daily Ship"
      badgeText="Daily Verification"
      icon={Send}
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-satoshi">
        
        {/* Canonical Segmented Control for Source Selection */}
        <SegmentedControl
          options={SOURCE_OPTIONS}
          value={source}
          onChange={(val) => {
            setSource(val);
            if (val === "manual") setGithubSuccess(false);
          }}
        />

        {/* GitHub Fetch Block */}
        {source === "github" && (
          <Card variant="subtle-inset" className="p-3.5 space-y-2 rounded-2xl">
            <label className="text-[11px] font-satoshi text-stone-700 font-semibold block">
              GitHub Public Repo (username/repo):
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={githubRepo}
                onChange={(e) => setGithubRepo(e.target.value)}
                placeholder="kwakhare5/IndieForest"
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3.5 py-1.5 text-xs text-stone-900 font-mono outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFetchGithub}
                disabled={isFetchingGithub}
                icon={RefreshCw}
              >
                {isFetchingGithub ? "Fetching" : "Fetch"}
              </Button>
            </div>
            {githubSuccess && (
              <p className="text-[11px] text-emerald-700 flex items-center gap-1 font-medium font-satoshi">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Commit loaded successfully
              </p>
            )}
          </Card>
        )}

        {/* Ship Summary */}
        <div>
          <label className="text-xs font-semibold text-stone-700 mb-1.5 block font-satoshi">
            What did you ship today?
          </label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. Built low-poly tree shader and optimized game loop..."
            className="w-full bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 resize-none font-satoshi"
          />
        </div>

        {/* Proof URL */}
        <div>
          <label className="text-xs font-semibold text-stone-700 mb-1.5 flex items-center justify-between font-satoshi">
            <span>Proof URL (Optional)</span>
            <Badge variant="emerald" size="sm">+25 XP</Badge>
          </label>
          <div className="relative">
            <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="url"
              value={proofUrl}
              onChange={(e) => setProofUrl(e.target.value)}
              placeholder="https://github.com/... or live link"
              className="w-full bg-stone-50 border border-stone-200 rounded-xl pl-9 pr-3 py-2 text-xs text-stone-900 placeholder-stone-400 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/20 font-satoshi"
            />
          </div>
        </div>

        {/* Rewards Pill */}
        <Card variant="subtle-inset" className="p-3 rounded-xl flex items-center justify-between text-xs text-stone-600">
          <span className="font-pixel text-xs font-bold uppercase tracking-wider text-stone-500">Rewards:</span>
          <div className="flex items-center gap-2 font-pixel text-xs font-bold text-stone-900">
            <span className="text-emerald-800">+{100 + Math.min((streakDays + 1) * 10, 150) + (proofUrl ? 25 : 0)} XP</span>
            <span className="text-amber-800">+10 Pinecones</span>
          </div>
        </Card>

        {/* Unified Button Component */}
        <Button
          type="submit"
          variant="emerald"
          size="md"
          showArrow
          disabled={isSubmitting}
          className="w-full"
        >
          CONFIRM & SHIP IT
        </Button>
      </form>
    </Modal>
  );
}
