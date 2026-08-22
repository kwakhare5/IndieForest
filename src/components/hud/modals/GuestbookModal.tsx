"use client";

import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { sound } from "@/lib/sound";
import { GuestbookEntry } from "@/types/game";

interface GuestbookModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUsername: string;
  entries: GuestbookEntry[];
  onAddEntry: (message: string, author: string) => void;
}

export function GuestbookModal({
  isOpen,
  onClose,
  targetUsername,
  entries,
  onAddEntry,
}: GuestbookModalProps) {
  const [authorName, setAuthorName] = useState("");
  const [noteMessage, setNoteMessage] = useState("");
  const [hasPosted, setHasPosted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteMessage.trim()) return;

    sound.playLevelUp();
    onAddEntry(noteMessage.trim(), authorName.trim() || "Anonymous Builder");
    setNoteMessage("");
    setHasPosted(true);
    setTimeout(() => setHasPosted(false), 3000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`@${targetUsername}'s Guestbook`}
      badgeText="Campsite Bulletin"
      icon={Send}
      maxWidth="md"
    >
      <div className="space-y-4 font-sans">
        
        {/* Header Description */}
        <p className="text-xs text-stone-600 leading-relaxed font-sans">
          Leave an encouraging 1-line note on @{targetUsername}&apos;s campsite bulletin board.
        </p>

        {/* Existing Notes Feed */}
        <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
          {entries.length === 0 ? (
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-center text-xs text-stone-500 font-sans">
              No notes pinned yet. Be the first builder to leave encouragement! 🌲
            </div>
          ) : (
            entries.map((entry) => (
              <Card key={entry.id} variant="subtle-inset" className="p-3 rounded-xl space-y-1 text-xs font-sans">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 font-sans">{entry.author}</span>
                  <span className="text-[10px] text-stone-500 font-mono">
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-stone-700 font-sans leading-normal">{entry.message}</p>
              </Card>
            ))
          )}
        </div>

        {/* Post Form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-stone-200/80 space-y-2.5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Your Name / @handle"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition font-sans"
            />
            <input
              type="text"
              placeholder="Write a 1-line note (e.g. Keep shipping!)"
              value={noteMessage}
              onChange={(e) => setNoteMessage(e.target.value)}
              maxLength={120}
              className="sm:col-span-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-hidden focus:bg-white focus:border-emerald-500 transition font-sans"
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[10px] text-stone-500 font-sans font-semibold tracking-wider uppercase">MAX 120 CHARACTERS</span>
            
            <Button
              type="submit"
              variant="emerald"
              size="sm"
              disabled={!noteMessage.trim()}
              icon={hasPosted ? Check : Send}
            >
              {hasPosted ? "Pinned to Campsite!" : "Pin Note to Campsite"}
            </Button>
          </div>
        </form>

      </div>
    </Modal>
  );
}
