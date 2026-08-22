"use client";

import React, { useState } from "react";
import {
  Settings,
  Github,
  Check,
  ExternalLink,
  RefreshCw,
  LogIn,
  RotateCcw,
  Sparkles,
  CreditCard,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { sound } from "@/lib/sound";
import { useForestStore, getRankTitle } from "@/store/useForestStore";
import { useUser, UserButton, SignInButton } from "@clerk/nextjs";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = "github" | "revenue" | "badge";

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>("github");
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

  const [githubInput, setGithubInput] = useState(user.username || "");
  const { isSignedIn, isLoaded, user: clerkUser } = useUser();

  const activeHandle = user.username || clerkUser?.username || "builder";
  const userToken = user.id || "builder_token";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://indieforest.vercel.app";
  const webhookUrl = `${origin}/api/webhooks/revenue?token=${userToken}&userId=${user.id || activeHandle}`;
  const profileUrl = `${origin}/u/${activeHandle}`;
  const badgeMarkdown = `[![IndieForest](${origin}/api/badge/${activeHandle})](${origin}/u/${activeHandle})`;

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
        window.localStorage.removeItem("indieforest-storage-v2");
        window.localStorage.removeItem("indieforest-storage-v3");
      }
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings & Integrations"
      badgeText="Developer Console"
      icon={Settings}
      maxWidth="md"
      position="top-right"
    >
      <div className="space-y-4 font-sans text-xs text-stone-700">
        
        {/* Account Row */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2.5">
              <UserButton />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-stone-900 text-xs font-sans">
                    {clerkUser?.fullName || `@${user.username}`}
                  </span>
                  <Badge variant="emerald" size="sm">
                    Tier {badge} · {rankTitle}
                  </Badge>
                </div>
                <span className="text-[10px] font-mono text-stone-500 block">
                  {clerkUser?.primaryEmailAddress?.emailAddress}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <div>
                <span className="font-bold text-stone-900 text-xs block">
                  Guest Mode (@{user.username})
                </span>
                <span className="text-[10px] text-stone-500">
                  Sign in to persist your island across devices
                </span>
              </div>
              <SignInButton mode="modal">
                <Button variant="emerald" size="sm" icon={LogIn}>
                  Sign In
                </Button>
              </SignInButton>
            </div>
          )}
        </div>

        {/* Tab Selector */}
        <SegmentedControl
          value={activeTab}
          onChange={(val) => setActiveTab(val as TabType)}
          size="sm"
          options={[
            { value: "github", label: "GitHub", icon: Github },
            { value: "revenue", label: "Webhooks", icon: CreditCard },
            { value: "badge", label: "Badges", icon: Sparkles },
          ]}
        />

        {/* Stable Tab Content Container (Zero Height Jump) */}
        <div className="min-h-[195px] flex flex-col justify-start">
          {/* TAB 1: GITHUB SYNC */}
          {activeTab === "github" && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-stone-800 text-xs block mb-1">
                  GitHub Username / Handle
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-2.5 text-stone-400 font-mono text-xs select-none">
                      github.com/
                    </span>
                    <input
                      type="text"
                      value={githubInput}
                      onChange={(e) => setGithubInput(e.target.value)}
                      placeholder="octocat"
                      className="w-full pl-24 pr-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-stone-900 text-xs font-mono focus:outline-hidden focus:border-emerald-600 focus:bg-white transition"
                    />
                  </div>
                  <Button
                    onClick={handleSyncGitHub}
                    variant="emerald"
                    size="sm"
                    disabled={isSyncing || !githubInput.trim()}
                    icon={isSyncing ? RefreshCw : Check}
                  >
                    {isSyncing ? "Syncing..." : syncSuccess ? "Synced!" : "Sync"}
                  </Button>
                </div>
                <p className="text-[11px] text-stone-500 mt-1.5 leading-relaxed">
                  Sprouts an Evergreen Pine for each repository. Commits pushed to your main branch level up tree tiers.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: REVENUE WEBHOOKS */}
          {activeTab === "revenue" && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-stone-800 text-xs block mb-1">
                  Universal Ingestion Endpoint
                </label>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <input
                    type="text"
                    readOnly
                    value={webhookUrl}
                    className="bg-transparent font-mono text-[11px] text-stone-800 w-full focus:outline-hidden select-all"
                  />
                  <button
                    onClick={handleCopyWebhook}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 font-semibold text-[11px] transition shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedWebhook ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-[11px] text-stone-600 leading-relaxed">
                <span className="font-bold text-stone-900 block text-xs">Setup in 30 seconds:</span>
                <p>1. Open Stripe / Polar / Lemon Squeezy $\rightarrow$ <strong>Developers $\rightarrow$ Webhooks</strong>.</p>
                <p>2. Paste this URL and listen for <code>payment_intent.succeeded</code> or <code>subscription.created</code>.</p>
                <p>3. Every sale will sprout a Golden Revenue Oak on your East grove.</p>
              </div>
            </div>
          )}

          {/* TAB 3: BADGES & SOCIAL LINKS */}
          {activeTab === "badge" && (
            <div className="space-y-3.5 pt-1 animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-stone-800 text-xs block mb-1">
                  GitHub Profile README Embed
                </label>
                <div className="flex items-center gap-1.5 p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <input
                    type="text"
                    readOnly
                    value={badgeMarkdown}
                    className="bg-transparent font-mono text-[11px] text-stone-800 w-full focus:outline-hidden select-all"
                  />
                  <button
                    onClick={handleCopyBadgeMd}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 font-semibold text-[11px] transition shrink-0 cursor-pointer shadow-xs"
                  >
                    {copiedBadgeMd ? "Copied!" : "Copy"}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-800 text-xs block mb-1">
                  Public Island Showcase Link
                </label>
                <div className="flex items-center justify-between p-2 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="font-mono text-[11px] text-stone-800 truncate pr-2">
                    {profileUrl}
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={handleCopyProfile}
                      className="px-2.5 py-1 rounded-lg bg-white border border-stone-200 text-stone-700 hover:text-stone-950 font-semibold text-[11px] transition cursor-pointer shadow-xs"
                    >
                      {copiedProfile ? "Copied!" : "Copy"}
                    </button>
                    <a
                      href={profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded-lg text-stone-500 hover:text-stone-900 transition"
                      title="Open public island"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Footer Action */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>IndieForest v1.0 · Zero-Touch Ingestion</span>
          <button
            onClick={handleResetCache}
            className="text-stone-400 hover:text-rose-600 transition cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" /> Reset Cache
          </button>
        </div>

      </div>
    </Modal>
  );
}
