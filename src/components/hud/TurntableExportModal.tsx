"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Video, Download, Play, CheckCircle2, Sparkles, AlertCircle } from "lucide-react";
import { recordCanvasStream, downloadBlob } from "@/lib/videoExport";
import { sound } from "@/lib/sound";

interface TurntableExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

export function TurntableExportModal({
  isOpen,
  onClose,
  username = "builder",
}: TurntableExportModalProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleStartRecording = async () => {
    setError(null);
    setVideoBlob(null);
    setVideoUrl(null);
    setProgress(0);

    const canvas = document.querySelector("canvas") as HTMLCanvasElement | null;
    if (!canvas) {
      setError("No active 3D canvas found to record.");
      return;
    }

    try {
      setIsRecording(true);
      sound.playClick();

      const blob = await recordCanvasStream(canvas, 10000, (pct) => {
        setProgress(pct);
      });

      setVideoBlob(blob);
      setVideoUrl(URL.createObjectURL(blob));
      setIsRecording(false);
      sound.playLevelUp();
    } catch (err: unknown) {
      setIsRecording(false);
      setError((err as Error).message || "Recording failed in this browser environment.");
    }
  };

  const handleDownload = () => {
    if (!videoBlob) return;
    sound.playShipSuccess();
    downloadBlob(videoBlob, `indieforest-${username}-3d-orbit.webm`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="10-Second 3D Turntable Exporter" maxWidth="md">
      <div className="space-y-5">
        {/* Header Banner */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-stone-100 border border-stone-300/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-md">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-sm text-stone-900 font-satoshi">
                60fps 360° Orbit Video Reel
              </h4>
              <p className="text-xs text-stone-500 font-satoshi">
                Instant social proof video ready for X/Twitter
              </p>
            </div>
          </div>

          <Badge variant="emerald" size="sm">
            60 FPS HD
          </Badge>
        </div>

        {/* Video Preview or Capture Area */}
        <Card variant="porcelain" className="p-5 rounded-2xl space-y-4">
          {videoUrl ? (
            <div className="space-y-3">
              <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-stone-300">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  10s Reel Rendered Successfully
                </span>
                <Button variant="emerald" size="sm" onClick={handleDownload} icon={Download}>
                  Download Video
                </Button>
              </div>
            </div>
          ) : isRecording ? (
            <div className="py-8 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center animate-pulse">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <h5 className="text-sm font-bold text-stone-900 font-satoshi">
                  Recording 360° Orbit Time-Lapse...
                </h5>
                <p className="text-xs text-stone-500 font-mono mt-1">{progress}% Complete</p>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="py-6 space-y-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-stone-100 text-stone-700 flex items-center justify-center border border-stone-200">
                <Sparkles className="w-6 h-6 text-emerald-700" />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-stone-900 font-satoshi">
                  Capture 10-Second 3D Diorama Video
                </h5>
                <p className="text-xs text-stone-500 max-w-sm mx-auto font-satoshi">
                  Smoothly rotates your diorama 360 degrees and compiles a high-definition video in your browser.
                </p>
              </div>

              {error && (
                <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              <Button
                variant="emerald"
                size="md"
                onClick={handleStartRecording}
                icon={Play}
                className="w-full justify-center"
              >
                Start 10s Orbit Recording
              </Button>
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
}
