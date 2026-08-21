"use client";

import React, { useState } from "react";
import {
  Settings,
  Github,
  Copy,
  Check,
  ExternalLink,
  Link2,
  RefreshCw,
  LogIn,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { sound } from "@/lib/sound";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [copiedProfile, setCopiedProfile] = useState(false);
  const [copiedBadgeMd, setCopiedBadgeMd] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const user = useForestStore((s) => s.user);
  const level = useForestStore((s) => s.level);
  const syncGitHubIsland = useForestStore((s) => s.syncGitHubIsland);
  const resetIsland = useForestStore((s) => s.resetIsland);
  const { badge, title: rankTitle } = getRankTitle(level);

  const [githubInput, setGithubInput] = useState(user.username || "kwakhare5");
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();

  const userToken = user.id || "builder_token";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://indieforest.dev";
  const webhookUrl = `${origin}/api/webhooks/revenue?token=${userToken}`;
  const profileUrl = `${origin}/u/${user.username || "builder"}`;
  const badgeMarkdown = `[![IndieForest](${origin}/api/badge/${user.username || "builder"})](${origin}/u/${user.username || "builder"})`;

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookUrl);
    sound.playCoin();
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleCopyProfile = () => {
    navigator.clipboard.writeText(profileUrl);
    sound.playCoin();
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  const handleCopyBadgeMd = () => {
    navigator.clipboard.writeText(badgeMarkdown);
    sound.playCoin();
    setCopiedBadgeMd(true);
    setTimeout(() => setCopiedBadgeMd(false), 2000);
  };

  const handleSyncGitHub = async () => {
    if (!githubInput.trim()) return;
    setIsSyncing(true);
    setSyncSuccess(false);
    try {
      await syncGitHubIsland(githubInput.trim());
      sound.playLevelUp();
      setSyncSuccess(true);
      setTimeout(() => setSyncSuccess(false), 3000);
    } catch {
      sound.playClick();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleResetCache = () => {
    if (confirm("Reset island to fresh starter state?")) {
      sound.playClick();
      resetIsland();
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("indieforest_storage_v2");
        window.localStorage.removeItem("indieforest_storage_v3");
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Account"
      badgeText="Console"
      icon={Settings}
      maxWidth="lg"
    >
      <div className="space-y-4 font-satoshi text-xs text-stone-700">
        
        {/* 1. Account & Profile Section */}
        <Card variant="subtle-inset" className="p-3.5 flex items-center justify-between">
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-3">
              <UserButton />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 text-sm font-satoshi">
                    {clerkUser?.fullName || `@${user.username}`}
                  </span>
                  <Badge variant="emerald" size="sm">
                    Tier {badge} • {rankTitle}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-stone-500">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-stone-200 text-stone-600 flex items-center justify-center font-bold text-xs">
                  ?
                </div>
                <div>
                  <span className="font-bold text-stone-900 text-xs block">
                    Playing as Guest (@{user.username})
                  </span>
                  <span className="text-[10px] text-stone-500">
                    Sign in with Clerk to save across devices
                  </span>
                </div>
              </div>
              <SignInButton mode="modal">
                <Button variant="emerald" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}
        </Card>

        {/* 2. Zero-Touch GitHub Real-Time Island Sync */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Github className="w-3.5 h-3.5 text-stone-900" />
              <span>Sync GitHub Public Commits</span>
            </span>
            <Badge variant="emerald" size="sm">Zero-Touch</Badge>
          </div>

          <Card variant="subtle-inset" className="p-3 space-y-2">
            <p className="text-[11px] text-stone-600 leading-relaxed font-satoshi">
              Enter your GitHub username to automatically sprout living 3D trees from your active repositories.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={githubInput}
                onChange={(e) => setGithubInput(e.target.value)}
                placeholder="kwakhare5"
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-900 font-mono outline-none focus:border-emerald-600"
              />
              <Button
                variant="emerald"
                size="sm"
                onClick={handleSyncGitHub}
                disabled={isSyncing}
                icon={RefreshCw}
              >
                {isSyncing ? "Syncing..." : "Sync Island"}
              </Button>
            </div>
          </Card>
        </div>

        {syncSuccess && (
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-satoshi font-medium flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Island state successfully synced with GitHub!</span>
          </div>
        )}

        {/* 3. Dynamic GitHub Profile README SVG Badge */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span>GitHub README SVG Badge</span>
            </span>
            <Badge variant="stone" size="sm">Markdown Embed</Badge>
          </div>

          <Card variant="subtle-inset" className="p-3 space-y-2">
            <p className="text-[11px] text-stone-600 leading-relaxed font-satoshi">
              Copy this markdown snippet into your GitHub profile README.md for a live double-bezel diorama card:
            </p>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={badgeMarkdown}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-[11px] text-stone-800 font-mono outline-none select-all"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyBadgeMd}
                icon={copiedBadgeMd ? Check : Copy}
              >
                {copiedBadgeMd ? "Copied" : "Copy"}
              </Button>
            </div>
          </Card>
        </div>

        {/* 4. Public 3D Profile URL */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              <span>Public 3D Diorama Profile</span>
            </span>
            <Badge variant="stone" size="sm">Shareable Link</Badge>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={profileUrl}
              className="flex-1 bg-stone-50 border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-mono outline-none select-all"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyProfile}
              icon={copiedProfile ? Check : Copy}
            >
              {copiedProfile ? "Copied" : "Copy Link"}
            </Button>
          </div>
        </div>

        {/* 5. Universal Revenue Webhook */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Universal Revenue Webhook</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">Stripe • Lemon Squeezy • Polar</span>
          </div>

          <Card variant="subtle-inset" className="p-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-mono outline-none select-all"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyWebhook}
                icon={copiedWebhook ? Check : Copy}
              >
                {copiedWebhook ? "Copied" : "Copy"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-stone-200 flex items-center justify-between gap-3">
          <Button
            variant="danger"
            size="sm"
            onClick={handleResetCache}
            icon={RotateCcw}
          >
            Clear Cache / Reset
          </Button>

          <Button variant="emerald" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
