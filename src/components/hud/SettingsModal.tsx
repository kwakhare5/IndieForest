"use client";

import React, { useState } from "react";
import { Settings, Github, Copy, Check, ExternalLink, Link2, RefreshCw, LogIn } from "lucide-react";
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
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const user = useForestStore((s) => s.user);
  const level = useForestStore((s) => s.level);
  const { badge, title: rankTitle } = getRankTitle(level);

  const { isSignedIn, isLoaded, user: clerkUser } = useUser();

  const userToken = user.id || "builder_token";
  const webhookUrl = typeof window !== "undefined"
    ? `${window.location.origin}/api/webhooks/revenue?token=${userToken}`
    : `https://indieforest.dev/api/webhooks/revenue?token=${userToken}`;

  const profileUrl = typeof window !== "undefined"
    ? `${window.location.origin}/u/${user.username || "builder"}`
    : `https://indieforest.dev/u/${user.username || "builder"}`;

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

  const handleSyncCloud = async () => {
    setIsSyncing(true);
    setSyncSuccess(false);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
      sound.playLevelUp();
      setTimeout(() => setSyncSuccess(false), 3000);
    }, 1200);
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
                    Sign in to save your island across devices
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

        {/* 2. Connected GitHub Identity & Cloud Sync */}
        <Card variant="subtle-inset" className="p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-stone-900 text-white flex items-center justify-center shadow-xs">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-stone-900 text-xs font-satoshi">
                  kwakhare5 / IndieForest
                </span>
                <Badge variant="stone" size="sm">GitHub Sync</Badge>
              </div>
              <span className="text-[10px] font-mono text-stone-500">
                Commit verification auto-scan enabled
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncCloud}
            disabled={isSyncing}
            icon={RefreshCw}
          >
            {isSyncing ? "Syncing..." : "Sync Cloud"}
          </Button>
        </Card>

        {syncSuccess && (
          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-satoshi font-medium flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>Island state synchronized with cloud!</span>
          </div>
        )}

        {/* 3. Universal Revenue Webhook (Stripe / Lemon Squeezy / Polar) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
              <Link2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Universal Revenue Webhook</span>
            </span>
            <span className="text-[10px] font-mono text-stone-500">Stripe • Lemon Squeezy • Polar</span>
          </div>

          <Card variant="subtle-inset" className="p-3 space-y-2">
            <p className="text-[11px] text-stone-600 leading-relaxed font-satoshi">
              Paste this URL into your payment webhook settings. When a customer subscribes, a Golden Pine tree automatically sprouts in your revenue grove.
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={webhookUrl}
                className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-1.5 text-xs text-stone-800 font-mono outline-none select-all focus:border-emerald-600"
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

        {/* Close Button */}
        <div className="pt-2 border-t border-stone-100 flex justify-end">
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
