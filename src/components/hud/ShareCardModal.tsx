"use client";

import React, { useState } from "react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { Share2, Copy, Check, Flame, Download, ExternalLink } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { sound } from "@/lib/sound";

interface ShareCardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareCardModal({ isOpen, onClose }: ShareCardModalProps) {
  const user = useForestStore((s) => s.user);
  const level = useForestStore((s) => s.level);
  const streakDays = useForestStore((s) => s.streakDays);
  const trees = useForestStore((s) => s.trees);
  const shipHistory = useForestStore((s) => s.shipHistory);

  const [copied, setCopied] = useState(false);

  const { title, badge } = getRankTitle(level);
  const latestShip = shipHistory[0]?.message || "Building my indie hacker island diorama";
  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  const tweetText = `Day ${streakDays} of shipping daily on IndieForest.

Rank: Tier ${badge} — ${title} (Level ${level})
Trees: ${trees.length} Active | $${totalMrr}/mo MRR
Today's Ship: "${latestShip}"

Building in public @indieforest_app`;

  const handleCopy = () => {
    navigator.clipboard.writeText(tweetText);
    sound.playCoin();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank");
  };

  const handleDownloadSVG = () => {
    sound.playLevelUp();
    const svgContent = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#ece7de" />
  <rect x="60" y="60" width="1080" height="510" rx="32" fill="#ffffff" stroke="#d6cfc5" stroke-width="2" />
  
  <!-- Header -->
  <text x="110" y="140" font-family="sans-serif" font-size="28" font-weight="bold" fill="#047857">IndieForest • Daily Shipping Diorama</text>
  <text x="110" y="220" font-family="serif" font-size="52" font-weight="normal" fill="#1c1917">Day ${streakDays} of Daily Shipping</text>
  
  <!-- Stats Box -->
  <rect x="110" y="270" width="980" height="150" rx="20" fill="#f5f5f4" stroke="#e7e5e4" stroke-width="1.5" />
  <text x="140" y="320" font-family="monospace" font-size="20" font-weight="bold" fill="#57534e">DEVELOPER RANK</text>
  <text x="140" y="365" font-family="sans-serif" font-size="32" font-weight="bold" fill="#1c1917">Tier ${badge}: ${title} (Level ${level})</text>
  
  <text x="650" y="320" font-family="monospace" font-size="20" font-weight="bold" fill="#57534e">ISLAND METRICS</text>
  <text x="650" y="365" font-family="sans-serif" font-size="32" font-weight="bold" fill="#047857">${trees.length} Trees • $${totalMrr}/mo MRR</text>
  
  <!-- Latest Ship -->
  <text x="110" y="470" font-family="sans-serif" font-size="22" font-weight="600" fill="#44403c">Today: "${latestShip}"</text>
  
  <!-- Footer -->
  <text x="110" y="525" font-family="monospace" font-size="18" fill="#78716c">@${user.username} • indieforest.dev/u/${user.username}</text>
</svg>`.trim();

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `indieforest-day-${streakDays}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Daily Progress"
      badgeText="Build in Public"
      icon={Share2}
    >
      <div className="space-y-4 font-satoshi">
        {/* Preview Card */}
        <Card variant="subtle-inset" className="p-4 text-left font-satoshi rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center font-pixel text-xs font-bold text-stone-800 shadow-xs">
                {badge}
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 font-satoshi">{title}</h4>
                <span className="text-[10px] text-stone-500 font-pixel">LEVEL {level}</span>
              </div>
            </div>

            <Badge variant="amber" size="sm" icon={Flame}>
              {streakDays}d Streak
            </Badge>
          </div>

          <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-xs text-stone-700 my-2.5 shadow-xs">
            <span className="text-[10px] font-pixel uppercase font-semibold text-stone-500 block mb-1">
              Today's Ship:
            </span>
            <p className="line-clamp-2 text-xs text-stone-900 font-medium font-satoshi">
              "{latestShip}"
            </p>
          </div>

          <div className="flex items-center justify-between text-[10px] font-pixel text-stone-500 pt-1">
            <span>{trees.length} Trees • ${totalMrr}/mo MRR</span>
            <span className="font-semibold text-emerald-800 font-pixel">indieforest.dev/u/{user.username}</span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-satoshi">
          <Button
            onClick={handleCopy}
            variant="outline"
            size="md"
            icon={copied ? Check : Copy}
            className="justify-center"
          >
            {copied ? "Copied" : "Copy Text"}
          </Button>

          <Button
            onClick={handleDownloadSVG}
            variant="outline"
            size="md"
            icon={Download}
            className="justify-center"
          >
            Save Card
          </Button>

          <Button
            onClick={handleOpenTwitter}
            variant="dark"
            size="md"
            showArrow
            arrowType="up-right"
            className="justify-between"
          >
            POST TO X
          </Button>
        </div>
      </div>
    </Modal>
  );
}
