"use client";

import React, { useState } from "react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { Share2, Check, Flame, Download, ImageIcon } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
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

  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  const { title, badge } = getRankTitle(level);
  const latestShip = shipHistory[0]?.message || "Building my indie hacker living diorama";
  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);
  const totalCommits = trees.reduce((acc, t) => acc + (t.commits || 0), 0);
  const profileUrl = `indieforest.dev/u/${user.username || "builder"}`;

  // 3 Human Indie Hacker Tweet Templates (Anti-AI Slop)
  const tweetTemplates = [
    // Template 1: Numbers-Led Milestone
    `Day ${streakDays} of shipping daily on IndieForest.

• Tier ${badge} (${title} · Lvl ${level})
• ${trees.length} Active Modules | ${totalCommits} Commits | $${totalMrr}/mo MRR
• Today's Ship: "${latestShip}"

Living diorama: ${profileUrl}`,

    // Template 2: Short & Punchy Proof-of-Work
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

  /**
   * Generates a 1200x675 composited PNG image containing the 3D Canvas
   * and a porcelain stats overlay box.
   */
  const generateCompositeImage = async (): Promise<Blob | null> => {
    const canvasElement = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvasElement) {
      return null;
    }

    const outputWidth = 1200;
    const outputHeight = 675;
    const offscreen = document.createElement("canvas");
    offscreen.width = outputWidth;
    offscreen.height = outputHeight;
    const ctx = offscreen.getContext("2d");
    if (!ctx) return null;

    // Background Studio Linen
    ctx.fillStyle = "#ece7de";
    ctx.fillRect(0, 0, outputWidth, outputHeight);

    // Draw the 3D Canvas centered
    const canvasAspect = canvasElement.width / canvasElement.height;
    let drawW = outputWidth;
    let drawH = outputWidth / canvasAspect;
    let drawX = 0;
    let drawY = (outputHeight - drawH) / 2;

    if (drawH < outputHeight) {
      drawH = outputHeight;
      drawW = outputHeight * canvasAspect;
      drawX = (outputWidth - drawW) / 2;
      drawY = 0;
    }

    ctx.drawImage(canvasElement, drawX, drawY, drawW, drawH);

    // Bottom Stats Double-Bezel Overlay Card
    const cardX = 40;
    const cardY = outputHeight - 140;
    const cardW = outputWidth - 80;
    const cardH = 105;

    // Outer Bezel
    ctx.fillStyle = "rgba(236, 231, 222, 0.85)";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(168, 162, 158, 0.7)";
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Inner Porcelain Surface
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(cardX + 6, cardY + 6, cardW - 12, cardH - 12, 16);
    ctx.fill();

    // Text & Stats
    ctx.fillStyle = "#047857";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("IndieForest • Living Proof-of-Work Diorama", cardX + 24, cardY + 36);

    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 26px sans-serif";
    ctx.fillText(`Day ${streakDays} Streak • Tier ${badge}: ${title}`, cardX + 24, cardY + 74);

    ctx.fillStyle = "#57534e";
    ctx.font = "bold 16px monospace";
    ctx.fillText(`${trees.length} Trees • $${totalMrr}/mo MRR`, cardX + cardW - 320, cardY + 74);

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
            { value: 0, label: "Numbers-Led" },
            { value: 1, label: "Short & Punchy" },
            { value: 2, label: "Reflection" },
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

        {/* Action Buttons Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-sans">
          <Button
            onClick={handleCopyImage}
            variant="outline"
            size="md"
            icon={copiedImage ? Check : ImageIcon}
            className="justify-center text-xs"
            disabled={isGeneratingImage}
          >
            {copiedImage ? "Copied Image!" : "Copy 3D Card"}
          </Button>

          <Button
            onClick={handleDownloadPNG}
            variant="outline"
            size="md"
            icon={Download}
            className="justify-center text-xs"
            disabled={isGeneratingImage}
          >
            Download PNG
          </Button>

          <Button
            onClick={handleOpenTwitter}
            variant="dark"
            size="md"
            showArrow
            arrowType="up-right"
            className="justify-between text-xs"
          >
            POST TO X
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={handleCopyText}
            className="text-[11px] font-sans font-medium text-stone-400 hover:text-stone-700 underline transition-colors cursor-pointer"
          >
            {copiedText ? "✓ Text copied to clipboard" : "or copy plain tweet text"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
