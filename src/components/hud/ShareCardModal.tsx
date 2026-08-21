"use client";

import React, { useState } from "react";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { Share2, Check, Flame, Download, ImageIcon } from "lucide-react";
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

  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);

  const { title, badge } = getRankTitle(level);
  const latestShip = shipHistory[0]?.message || "Building my indie hacker island diorama";
  const totalMrr = trees.reduce((acc, t) => acc + (t.mrr || 0), 0);

  const tweetText = `Day ${streakDays} of shipping daily on IndieForest.

Rank: Tier ${badge} — ${title} (Level ${level})
Trees: ${trees.length} Active | $${totalMrr}/mo MRR
Today's Ship: "${latestShip}"

Building in public @indieforest_app`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(tweetText);
    sound.playCoin();
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleOpenTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(url, "_blank");
  };

  /**
   * Generates a composited high-resolution PNG image containing the 3D Canvas
   * and a clean stats overlay box.
   */
  const generateCompositeImage = async (): Promise<Blob | null> => {
    const canvasElement = document.getElementById("forest-3d-canvas") as HTMLCanvasElement | null;
    if (!canvasElement) {
      return null;
    }

    const outputWidth = 1200;
    const outputHeight = 630;
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

    // Bottom Stats Overlay Card
    const cardX = 40;
    const cardY = outputHeight - 160;
    const cardW = outputWidth - 80;
    const cardH = 120;

    // Outer Bezel
    ctx.fillStyle = "rgba(255, 255, 255, 0.75)";
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 24);
    ctx.fill();
    ctx.strokeStyle = "rgba(214, 207, 197, 0.8)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Inner Surface
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(cardX + 8, cardY + 8, cardW - 16, cardH - 16, 18);
    ctx.fill();

    // Text & Stats
    ctx.fillStyle = "#047857";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText("IndieForest • Daily Shipping Diorama", cardX + 32, cardY + 42);

    ctx.fillStyle = "#1c1917";
    ctx.font = "bold 32px sans-serif";
    ctx.fillText(`Day ${streakDays} Streak • Tier ${badge}: ${title}`, cardX + 32, cardY + 84);

    ctx.fillStyle = "#57534e";
    ctx.font = "18px monospace";
    ctx.fillText(`${trees.length} Active Trees • $${totalMrr}/mo MRR`, cardX + cardW - 360, cardY + 84);

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
        // Fallback to text copy
        handleCopyText();
      }
    } catch (err) {
      console.warn("Clipboard image copy not supported, falling back to text copy:", err);
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
        a.download = `indieforest-day-${streakDays}.png`;
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
                <span className="font-pixel text-xs font-bold text-stone-500">LVL {level}</span>
              </div>
            </div>

            <Badge variant="amber" size="sm" icon={Flame}>
              {streakDays}d Streak
            </Badge>
          </div>

          <div className="p-3 rounded-xl bg-white border border-stone-200/90 text-xs text-stone-700 my-2.5 shadow-xs">
            <span className="font-pixel text-xs uppercase font-bold text-stone-500 block mb-1">
              TODAY&apos;S SHIP:
            </span>
            <p className="line-clamp-2 text-xs text-stone-900 font-medium font-satoshi">
              &ldquo;{latestShip}&rdquo;
            </p>
          </div>

          <div className="flex items-center justify-between font-pixel text-xs font-bold text-stone-500 pt-1">
            <span>
              {trees.length} TREES • ${totalMrr}/MO MRR
            </span>
            <span className="text-emerald-800">
              indieforest.dev/u/{user.username}
            </span>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-satoshi">
          <Button
            onClick={handleCopyImage}
            variant="outline"
            size="md"
            icon={copiedImage ? Check : ImageIcon}
            className="justify-center"
            disabled={isGeneratingImage}
          >
            {copiedImage ? "Image Copied!" : "Copy 3D Image"}
          </Button>

          <Button
            onClick={handleDownloadPNG}
            variant="outline"
            size="md"
            icon={Download}
            className="justify-center"
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
            className="justify-between"
          >
            POST TO X
          </Button>
        </div>

        <div className="text-center">
          <button
            onClick={handleCopyText}
            className="text-[11px] font-satoshi font-medium text-stone-500 hover:text-stone-800 underline transition-colors"
          >
            {copiedText ? "✓ Text copied to clipboard" : "or copy plain tweet text"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
