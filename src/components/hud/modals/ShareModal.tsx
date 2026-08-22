"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Share2, Download, Copy, Check, Twitter, Flame } from "lucide-react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { sound } from "@/lib/sound";
import type { TreeData } from "@/types/game";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ShareModal({ isOpen, onClose }: ShareModalProps) {
  const user = useForestStore((s) => s.user);
  const streakDays = useForestStore((s) => s.streakDays);
  const level = useForestStore((s) => s.level);
  const trees = useForestStore((s) => s.trees);
  const shipHistory = useForestStore((s) => s.shipHistory);

  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { title, badge } = getRankTitle(level);
  const latestShip = shipHistory[0]?.message || "Building my indie hacker living diorama";
  const totalMrr = trees.reduce((acc: number, t: TreeData) => acc + (t.mrr || 0), 0);
  const totalCommits = trees.reduce((acc: number, t: TreeData) => acc + (t.commits || 0), 0);
  const profileUrl = `indieforest.dev/u/${user.username || "builder"}`;

  // 3 Human Tweet Templates (Zero AI Slop)
  const tweetTemplates = [
    // Template 1: Numbers-Led Milestone
    `Day ${streakDays} of shipping daily on IndieForest.

• Tier ${badge} (${title} · Lvl ${level})
• ${trees.length} Active Projects | ${totalCommits} Commits | $${totalMrr}/mo MRR
• Today's Ship: "${latestShip}"

Living diorama: ${profileUrl}`,

    // Template 2: Short & Punchy
    `Zero manual trackers. Just pure shipping.

Day ${streakDays} streak on @IndieForest.
${trees.length} trees grown from verified commits & Stripe webhooks.

Inspect my island: ${profileUrl}`,

    // Template 3: Builder Reflection
    `Consistency compounds.

Day ${streakDays} of building in public.
Current status: Tier ${badge} (${title}) with ${trees.length} active projects.

Living 3D world: ${profileUrl}`,
  ];

  const activeTweetText = tweetTemplates[selectedTemplateIndex];

  const handleCopyText = () => {
    navigator.clipboard.writeText(activeTweetText);
    sound.playCoin();
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleOpenTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(activeTweetText)}`;
    window.open(url, "_blank");
  };

  const generateCompositeImage = async (): Promise<Blob | null> => {
    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) return null;

    const targetWidth = 1200;
    const targetHeight = 675;
    const offscreen = document.createElement("canvas");
    offscreen.width = targetWidth;
    offscreen.height = targetHeight;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return null;

    // Background Warm Linen
    ctx.fillStyle = "#ece7de";
    ctx.fillRect(0, 0, targetWidth, targetHeight);

    // Subtle border
    ctx.strokeStyle = "rgba(120, 113, 108, 0.25)";
    ctx.lineWidth = 4;
    ctx.strokeRect(16, 16, targetWidth - 32, targetHeight - 32);

    // Draw Three.js WebGL canvas onto 2D canvas
    ctx.drawImage(canvas, 60, 60, targetWidth - 120, targetHeight - 170);

    // Header Title
    ctx.fillStyle = "#0c0a09";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText("IndieForest", 60, 64);

    ctx.fillStyle = "#78716c";
    ctx.font = "18px sans-serif";
    ctx.fillText(`@${user.username || "builder"} · Day ${streakDays} Streak`, 260, 64);

    // Bottom Stats Porcelain Bezel Card
    const cardX = 60;
    const cardY = targetHeight - 110;
    const cardW = targetWidth - 120;
    const cardH = 75;

    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(228, 228, 231, 0.9)";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 24px sans-serif";
    ctx.fillText(`Day ${streakDays} Streak • Tier ${badge}: ${title}`, cardX + 24, cardY + 46);

    ctx.fillStyle = "#57534e";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${trees.length} Projects • $${totalMrr}/mo MRR`, cardX + cardW - 280, cardY + 46);

    return new Promise((resolve) => {
      offscreen.toBlob((blob) => resolve(blob), "image/png");
    });
  };

  const handleCopyImage = async () => {
    setIsGeneratingImage(true);
    try {
      const blob = await generateCompositeImage();
      if (blob && navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
        sound.playLevelUp();
        setCopiedImage(true);
        setTimeout(() => setCopiedImage(false), 2500);
      } else {
        handleCopyText();
      }
    } catch {
      handleCopyText();
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleDownloadPNG = async () => {
    setIsGeneratingImage(true);
    try {
      const blob = await generateCompositeImage();
      if (blob) {
        sound.playLevelUp();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `indieforest-${user.username || "builder"}-day-${streakDays}.png`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export 3D Social Card & Proof"
      badgeText="Build in Public"
      icon={Share2}
      maxWidth="md"
      position="bottom-center"
    >
      <div className="space-y-3.5 font-sans">
        {/* Template Selector */}
        <SegmentedControl
          value={selectedTemplateIndex}
          onChange={(val) => setSelectedTemplateIndex(Number(val))}
          size="sm"
          options={[
            { value: 0, label: "Milestone" },
            { value: 1, label: "Punchy" },
            { value: 2, label: "Story" },
          ]}
        />

        {/* Live Tweet Preview */}
        <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left font-sans space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {badge}
              </div>
              <div>
                <span className="text-xs font-bold text-stone-900 font-sans block leading-none">
                  @{user.username || "builder"}
                </span>
                <span className="text-[10px] text-stone-400 font-sans font-medium">
                  {title} · Level {level}
                </span>
              </div>
            </div>

            <Badge variant="amber" size="sm" icon={Flame}>
              {streakDays}d Streak
            </Badge>
          </div>

          <pre className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-800 font-sans whitespace-pre-wrap leading-relaxed">
            {activeTweetText}
          </pre>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
          <Button
            onClick={handleCopyText}
            variant="outline"
            size="md"
            icon={copiedText ? Check : Copy}
            className="w-full justify-center text-xs font-bold"
          >
            {copiedText ? "Text Copied!" : "Copy Post Text"}
          </Button>

          <Button
            onClick={handleOpenTwitter}
            variant="dark"
            size="md"
            icon={Twitter}
            className="w-full justify-center text-xs font-bold"
          >
            Open in X / Twitter
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-stone-100">
          <Button
            onClick={handleCopyImage}
            disabled={isGeneratingImage}
            variant="emerald"
            size="md"
            icon={copiedImage ? Check : Copy}
            className="w-full justify-center text-xs font-bold"
          >
            {copiedImage ? "Image Copied!" : "Copy 3D Card Image"}
          </Button>

          <Button
            onClick={handleDownloadPNG}
            disabled={isGeneratingImage}
            variant="outline"
            size="md"
            icon={Download}
            className="w-full justify-center text-xs font-bold"
          >
            Download HD PNG
          </Button>
        </div>
      </div>
    </Modal>
  );
}
