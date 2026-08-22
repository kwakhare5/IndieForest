"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  Flame,
  Shield,
  Trees,
  TrendingUp,
  Github,
  CheckCircle2,
  CloudRain,
  Check,
  Copy,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SegmentedControl, SegmentedOption } from "@/components/ui/SegmentedControl";
import { TreeData } from "@/types/game";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { sound } from "@/lib/sound";
import { GitHubIslandProfile } from "@/lib/github";
import { useForestStore } from "@/store/useForestStore";
import { calculateTreeTier } from "@/lib/gamification";
import { FAMOUS_BUILDER_HANDLES, CURATED_FAMOUS_BUILDERS } from "@/lib/curatedBuilders";


// Dynamic import for the Island Canvas (Mode: Preview)
const ForestCanvas = dynamic(
  () => import("@/components/canvas/ForestCanvas").then((mod) => mod.ForestCanvas),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[460px] sm:h-[520px] rounded-[2.5rem] bg-[#f4f0e8] border border-[#d6cfc5] flex flex-col items-center justify-center text-stone-600 font-mono text-xs shadow-inner">
        <div className="w-8 h-8 border-2 border-emerald-600/20 border-t-emerald-700 rounded-full animate-spin mb-2" />
        <span className="uppercase tracking-widest text-sm font-bold font-pixel">Loading Island Preview...</span>
      </div>
    ),
  }
);

const DEFAULT_PREVIEW_TREES: TreeData[] = [
  {
    id: "preview-1",
    name: "Acme Corp (Pro Plan)",
    type: "revenue",
    tier: "mature",
    gridX: -1.2,
    gridZ: -1.2,
    plantedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    mrr: 79,
    isDemo: true,
  },
  {
    id: "preview-2",
    name: "Auth & Checkout Release",
    type: "shipping",
    tier: "young",
    gridX: 1.2,
    gridZ: -0.8,
    plantedAt: new Date(Date.now() - 86400000 * 8).toISOString(),
    mrr: 0,
    isDemo: true,
  },
  {
    id: "preview-3",
    name: "Enterprise Annual Customer",
    type: "revenue",
    tier: "majestic",
    gridX: -0.5,
    gridZ: 1.5,
    plantedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    mrr: 199,
    isDemo: true,
  },
  {
    id: "preview-4",
    name: "100 Beta Founders",
    type: "shipping",
    tier: "sapling",
    gridX: 1.5,
    gridZ: 1.2,
    plantedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    mrr: 0,
    isDemo: true,
  },
];

const MILESTONE_OPTIONS: SegmentedOption<3 | 7 | 14>[] = [
  { value: 3, label: "Day 3: Fire" },
  { value: 7, label: "Day 7: Tent" },
  { value: 14, label: "Day 14: Cabin" },
];

const SHIELD_OPTIONS: SegmentedOption<"armed" | "rest">[] = [
  { value: "armed", label: "Shield Armed" },
  { value: "rest", label: "Simulate Rest Day" },
];

export default function LandingPage() {

  const { isLoaded, isSignedIn } = useUser();
  const mergeCloudData = useForestStore((s) => s.mergeCloudData);

  // GitHub Instant Search & Preview State
  const [searchUsername, setSearchUsername] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [activeProfile, setActiveProfile] = useState<GitHubIslandProfile | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const [selectedMilestone, setSelectedMilestone] = useState<3 | 7 | 14>(7);
  const [shieldState, setShieldState] = useState<"armed" | "rest">("armed");
  const [demoMrr, setDemoMrr] = useState(79);
  const [copiedTweet, setCopiedTweet] = useState(false);

  const handleInstantSprout = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = searchUsername.trim().replace(/^@/, "");
    if (!cleanUser) return;

    setIsSearching(true);
    setSearchError(null);
    sound.playClick();

    try {
      const res = await fetch(`/api/github/preview?username=${encodeURIComponent(cleanUser)}`);
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "User not found");
      }
      const data: GitHubIslandProfile = await res.json();
      setActiveProfile(data);
      sound.playShipSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to load GitHub activity";
      setSearchError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleQuickSproutFamous = (handle: string) => {
    sound.playClick();
    setSearchUsername(handle);
    const profile = CURATED_FAMOUS_BUILDERS[handle];
    if (profile) {
      setActiveProfile(profile);
      sound.playShipSuccess();
    }
  };

  const handleClaimIsland = () => {
    sound.playLevelUp();
    if (activeProfile) {
      mergeCloudData({
        trees: activeProfile.trees,
        streakDays: activeProfile.streakDays,
        level: activeProfile.level,
        xp: activeProfile.xp,
        pinecones: activeProfile.pinecones,
      });
    }
  };

  const treeTierInfo = calculateTreeTier("revenue", 0, demoMrr);
  const currentTreeTier = {
    tier: `${treeTierInfo.tier.charAt(0).toUpperCase() + treeTierInfo.tier.slice(1)} Golden Pine`,
    desc: `Next Stage: ${treeTierInfo.nextTierLabel} (${treeTierInfo.progressPercent}%)`,
  };

  const handleCopyTweet = () => {
    navigator.clipboard.writeText(
      `Day 14 of shipping on IndieForest.\n\nRank: Tier IV — Island Architect (Level 12)\nRevenue Grove: $${demoMrr * 3}/mo\nStreak: 14d Active\n\nBuilding in public on my island.`
    );
    setCopiedTweet(true);
    setTimeout(() => setCopiedTweet(false), 2000);
  };


  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-satoshi selection:bg-emerald-600 selection:text-white relative overflow-y-auto overflow-x-hidden">
      
      {/* 1. Unified Double-Bezel Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-4xl px-3 pointer-events-none font-satoshi">
        <div className="pointer-events-auto p-1 rounded-full glass-dock shadow-lg transition-all duration-200">
          <div className="px-4 py-1.5 rounded-full porcelain-surface flex items-center justify-between">
            
            {/* Master Tree Stump Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded-lg overflow-hidden shadow-xs border border-stone-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/logos/indieforest_logo.svg" alt="IndieForest Logo" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-xs sm:text-sm text-stone-950 tracking-tight font-satoshi">
                IndieForest
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-xs font-semibold text-stone-600 font-satoshi">
              <a
                href="#how-it-works"
                className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
              >
                The Ritual
              </a>
              <a
                href="#revenue-grove"
                className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
              >
                Revenue Grove
              </a>
              <a
                href="#features"
                className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
              >
                Interactive Bento
              </a>
              <a
                href="#faq"
                className="px-2.5 py-1 rounded-full hover:bg-stone-100/90 hover:text-stone-950 transition"
              >
                FAQ
              </a>
            </nav>

            {/* Navbar Action Button */}
            <div className="flex items-center gap-2">
              {isLoaded && isSignedIn ? (
                <div className="flex items-center gap-2">
                  <Link href="/dashboard">
                    <Button variant="emerald" size="sm" showArrow arrowType="right">
                      OPEN DASHBOARD
                    </Button>
                  </Link>
                  <UserButton />
                </div>
              ) : (
                <SignInButton mode="modal">
                  <Button
                    variant="emerald"
                    size="sm"
                    showArrow
                    arrowType="right"
                    onClick={() => sound.playClick()}
                  >
                    SIGN IN
                  </Button>
                </SignInButton>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-24 max-w-7xl mx-auto px-4 sm:px-6 font-satoshi">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* Left Hero Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <Badge variant="stone" dot size="md" className="mb-2 shadow-2xs">
              Zero-Touch 3D Living Diorama
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-normal text-stone-950 leading-[1.06] tracking-tight font-editorial">
              Your daily shipping momentum on a <span className="italic font-normal text-emerald-800 underline decoration-emerald-500/30 underline-offset-8">living island</span>.
            </h1>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-xl font-satoshi">
              Zero manual logging. Connect GitHub once — every code push automatically waters your island and grows emerald pine trees. When revenue arrives via Stripe or Polar, golden groves sprout.
            </p>

            {/* Zero-Friction Instant Sprout Search Bar */}
            <div className="pt-1">
              <form onSubmit={handleInstantSprout} className="p-1.5 rounded-2xl glass-dock shadow-sm max-w-lg">
                <div className="p-1 rounded-xl porcelain-surface flex items-center gap-2">
                  <div className="pl-3 text-stone-400">
                    <Github className="w-4 h-4 text-stone-600" />
                  </div>
                  <input
                    type="text"
                    placeholder="GitHub username (e.g. kwakhare5)"
                    value={searchUsername}
                    onChange={(e) => setSearchUsername(e.target.value)}
                    className="w-full bg-transparent text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-hidden font-satoshi"
                  />
                  <Button
                    type="submit"
                    variant="emerald"
                    size="sm"
                    disabled={isSearching || !searchUsername.trim()}
                    icon={isSearching ? Loader2 : Sparkles}
                    className="shrink-0"
                  >
                    {isSearching ? "Searching..." : "Sprout Island"}
                  </Button>
                </div>
              </form>

              {/* 1-Click Famous Builders Preview Chips */}
              <div className="flex items-center gap-1.5 pt-2 text-[11px] text-stone-500 font-satoshi flex-wrap">
                <span className="font-medium text-stone-400">Try live:</span>
                {FAMOUS_BUILDER_HANDLES.map((handle) => (
                  <button
                    key={handle}
                    type="button"
                    onClick={() => handleQuickSproutFamous(handle)}
                    className="px-2 py-0.5 rounded-full bg-white/70 hover:bg-emerald-50 hover:text-emerald-800 border border-stone-200/80 hover:border-emerald-300 font-mono text-[10px] text-stone-600 transition shadow-2xs cursor-pointer"
                  >
                    @{handle}
                  </button>
                ))}
              </div>

              {searchError && (
                <p className="text-xs text-rose-600 mt-2 pl-2 font-medium">
                  {searchError}
                </p>
              )}
            </div>

            {/* Active Sprouted Profile Result Card */}
            {activeProfile ? (
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 shadow-xs max-w-lg space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeProfile.avatarUrl}
                      alt={activeProfile.username}
                      className="w-8 h-8 rounded-full border border-emerald-300"
                    />
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 font-satoshi">
                        @{activeProfile.username}&apos;s Live Island
                      </h4>
                      <p className="text-[11px] text-emerald-800 font-medium">
                        {activeProfile.totalCommits} commits across {activeProfile.activeReposCount} projects
                      </p>
                    </div>
                  </div>
                  <Badge variant="emerald" size="sm">
                    {activeProfile.streakDays}d Streak
                  </Badge>
                </div>

                <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between">
                  <span className="text-xs text-stone-600 font-satoshi">
                    Level {activeProfile.level} • {activeProfile.pinecones} Pinecones
                  </span>
                  
                  {isLoaded && isSignedIn ? (
                    <Link href="/dashboard" onClick={handleClaimIsland}>
                      <Button variant="emerald" size="sm" showArrow arrowType="right">
                        Claim &amp; Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <SignInButton mode="modal">
                      <Button
                        variant="emerald"
                        size="sm"
                        showArrow
                        arrowType="right"
                        onClick={handleClaimIsland}
                      >
                        Claim Island &amp; Auto-Sync
                      </Button>
                    </SignInButton>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                {isLoaded && isSignedIn ? (
                  <Link href="/dashboard">
                    <Button variant="emerald" size="lg" showArrow arrowType="right" className="w-full sm:w-auto">
                      GO TO MY ISLAND
                    </Button>
                  </Link>
                ) : (
                  <SignInButton mode="modal">
                    <Button
                      variant="emerald"
                      size="lg"
                      showArrow
                      arrowType="right"
                      onClick={() => sound.playClick()}
                      className="w-full sm:w-auto"
                    >
                      START FREE WITH GOOGLE
                    </Button>
                  </SignInButton>
                )}

                <Link href="/u/kwakhare5">
                  <Button variant="outline" size="lg" showArrow arrowType="up-right" className="w-full sm:w-auto">
                    View Live Public Profile
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex items-center gap-4 text-xs font-satoshi text-stone-500 pt-1">
              <span className="flex items-center gap-1 font-semibold text-emerald-800 font-satoshi">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> 100% Zero-Touch Sync
              </span>
              <span>•</span>
              <span className="font-satoshi">Zero Code Access</span>
              <span>•</span>
              <span className="font-satoshi">Stripe &amp; Polar Ready</span>
            </div>
          </div>

          {/* Right Hero Island Canvas */}
          <div className="lg:col-span-6 w-full">
            <ForestCanvas
              mode="preview"
              customTrees={activeProfile ? activeProfile.trees : DEFAULT_PREVIEW_TREES}
            />
          </div>
        </div>
      </section>

      {/* 3. The 3-Step Daily Shipping Ritual */}
      <section id="how-it-works" className="py-20 bg-[#e6e1d7] border-y border-stone-300/80 font-satoshi">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <Badge variant="stone" size="sm" className="mb-3">
            Zero Manual Effort
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 mb-3 font-editorial">
            How IndieForest Works Passively
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto mb-12 font-satoshi">
            A frictionless feedback loop engineered to make writing, pushing, and launching software deeply rewarding.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            
            {/* Step 1 Card */}
            <Card variant="porcelain" className="p-7 flex flex-col justify-between rounded-[2.5rem]">
              <div>
                <span className="font-pixel text-xs font-bold text-emerald-700 block mb-2">
                  01 / CODE &amp; PUSH
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-satoshi">
                  Code in your favorite editor
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 font-satoshi">
                  Work in VS Code, Cursor, or Antigravity. Push code to GitHub — IndieForest automatically detects your commits with zero manual logging.
                </p>
                <div className="p-3 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs flex items-center justify-between shadow-inner">
                  <span className="text-emerald-400">$ git push origin main</span>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-satoshi text-stone-500">
                <Github className="w-3.5 h-3.5 text-stone-700" />
                <span>Auto-scanned public commits</span>
              </div>
            </Card>

            {/* Step 2 Card */}
            <Card variant="porcelain" className="p-7 flex flex-col justify-between rounded-[2.5rem]">
              <div>
                <span className="font-pixel text-xs font-bold text-amber-700 block mb-2">
                  02 / PASSIVE WATERING
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-satoshi">
                  Rain Pours &amp; Pines Grow
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 font-satoshi">
                  Every commit triggers particle rain over your 3D diorama. Streaks advance, retro chimes ring, and your developer rank levels up.
                </p>
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-1.5 font-bold font-satoshi">
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-600" /> +100 XP &amp; Streak Bonus
                  </span>
                  <span className="text-stone-700 font-pixel text-xs font-bold">LVL II</span>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-satoshi text-amber-800">
                <CloudRain className="w-3.5 h-3.5 text-amber-700" />
                <span>Dynamic particle weather system</span>
              </div>
            </Card>

            {/* Step 3 Card */}
            <Card variant="porcelain" className="p-7 flex flex-col justify-between rounded-[2.5rem]">
              <div>
                <span className="font-pixel text-xs font-bold text-emerald-700 block mb-2">
                  03 / REVENUE GROVE
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 font-satoshi">
                  Sprout Golden Pines
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-5 font-satoshi">
                  Connect Stripe, Lemon Squeezy, or Polar. Every paying subscriber grows as a radiant golden pine tree near your oasis pond.
                </p>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between shadow-xs">
                  <span className="flex items-center gap-1.5 font-bold font-satoshi">
                    <Trees className="w-3.5 h-3.5 text-emerald-700" /> Acme Corp ($79/mo)
                  </span>
                  <Badge variant="emerald" size="sm">Mature</Badge>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center gap-2 text-xs font-satoshi text-emerald-800">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-700" />
                <span>Live MRR island visualizer</span>
              </div>
            </Card>

          </div>
        </div>
      </section>

      {/* 4. Revenue Grove Showcase */}
      <section id="revenue-grove" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-satoshi">
        <div className="text-center mb-12">
          <Badge variant="stone" size="sm" className="mb-2.5">
            Pre-Revenue to Ramen Profitable
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 font-editorial">
            Dual-Grove System: Rewarding from Day 1
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto mt-2 font-satoshi">
            Whether you are building your first MVP or scaling an established SaaS, your island stays green and thriving.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card variant="porcelain" className="p-8 rounded-[2.5rem] space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Trees className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-950 font-satoshi">Shipping Pines (Emerald Needles)</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
              Earned by automated git commits and shipping streaks. Keeps pre-revenue founders motivated during the hard building phase.
            </p>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-satoshi">
              <span>Trigger: Automated GitHub Commits</span>
              <Badge variant="emerald" size="sm">Emerald Foliage</Badge>
            </div>
          </Card>

          <Card variant="porcelain" className="p-8 rounded-[2.5rem] space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-950 font-satoshi">Revenue Pines (Golden Needles)</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
              Sprouted automatically when customer sales arrive from Stripe, Lemon Squeezy, or Polar. Displays floating recurring revenue ($/mo) badges.
            </p>
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 flex items-center justify-between font-satoshi">
              <span>Trigger: Stripe / Webhook Sale</span>
              <Badge variant="amber" size="sm">Golden Crown</Badge>
            </div>
          </Card>
        </div>
      </section>

      {/* 5. Interactive Feature Bento Grid */}
      <section id="features" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 font-satoshi">
        <div className="text-center mb-14">
          <Badge variant="stone" size="sm" className="mb-3">
            Tactile Builders&apos; Mechanics
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 mb-3 font-editorial">
            Interactive Bento Showcase
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto font-satoshi">
            Test the live mechanics below to see how IndieForest turns shipping momentum into a living island.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Bento 1: Milestone Camp Unlocks */}
          <Card variant="porcelain" className="md:col-span-7 p-8 rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <span className="font-pixel text-xs uppercase tracking-wider font-bold text-emerald-700 block mb-1">
                MILESTONE EVOLUTION
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1.5 font-satoshi">
                Camp Unlocks as You Build
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg font-satoshi">
                Cross shipping thresholds to expand your island diorama. Click below to preview each milestone:
              </p>
            </div>

            <div className="mt-5 space-y-3 font-satoshi">
              <SegmentedControl
                options={MILESTONE_OPTIONS}
                value={selectedMilestone}
                onChange={(val) => setSelectedMilestone(val)}
              />

              <Card variant="subtle-inset" className="p-3.5 flex items-center justify-between text-xs sm:text-sm font-satoshi rounded-xl">
                {selectedMilestone === 3 && (
                  <>
                    <span className="text-amber-800 font-bold">Campfire + Smoke Puffs Unlocked</span>
                    <span className="text-stone-700 font-pixel text-xs font-bold">+10 PINECONES</span>
                  </>
                )}
                {selectedMilestone === 7 && (
                  <>
                    <span className="text-emerald-800 font-bold">Canvas Tent Shelter Unlocked</span>
                    <span className="text-stone-700 font-pixel text-xs font-bold">+1 STREAK SHIELD</span>
                  </>
                )}
                {selectedMilestone === 14 && (
                  <>
                    <span className="text-indigo-800 font-bold">Wooden Log Cabin Home Unlocked</span>
                    <span className="text-stone-700 font-pixel text-xs font-bold">TIER IV ARCHITECT</span>
                  </>
                )}
              </Card>
            </div>

            <div className="pt-4 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-satoshi text-stone-500">
              <span>Automatic Island Placement</span>
              <span className="font-semibold text-emerald-800">Zero Configuration</span>
            </div>
          </Card>

          {/* Bento 2: Burnout Protection Shields */}
          <Card variant="porcelain" className="md:col-span-5 p-8 rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700 mb-3 shadow-xs">
                <Shield className="w-5 h-5 stroke-[1.75]" />
              </div>

              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-satoshi">
                Burnout Protection Shields
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
                Earn 1 Shield per 7-day streak (max 2). When you take a weekend off, your shield auto-consumes to protect your streak.
              </p>
            </div>

            <div className="mt-5 space-y-3 font-satoshi">
              <SegmentedControl
                options={SHIELD_OPTIONS}
                value={shieldState}
                onChange={(val) => setShieldState(val)}
                size="sm"
              />

              <Card variant="subtle-inset" className="p-3 rounded-xl text-xs text-stone-700 flex items-center justify-between font-satoshi">
                <span>Rest Day Status:</span>
                <span className={`font-bold ${shieldState === "armed" ? "text-emerald-700" : "text-amber-700"}`}>
                  {shieldState === "armed" ? "Streak 100% Protected" : "Drought Warning Triggered"}
                </span>
              </Card>
            </div>

            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-satoshi text-stone-600">
              <span>Automatic Rest Defense</span>
              <span className="font-bold text-sky-800 font-pixel text-xs">2 MAX CAPACITY</span>
            </div>
          </Card>

          {/* Bento 3: Customer Pine Tree Stages */}
          <Card variant="porcelain" className="md:col-span-5 p-8 rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="w-9 h-9 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mb-3 shadow-xs">
                <TrendingUp className="w-5 h-5 stroke-[1.75]" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-1.5 font-satoshi">
                MRR Revenue Grove Trees
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-3 font-satoshi">
                Watch paying customers scale visually based on recurring value:
              </p>
            </div>

            <Card variant="subtle-inset" className="p-4 space-y-2.5 font-satoshi rounded-2xl">
              <div className="flex items-center justify-between text-xs sm:text-sm font-satoshi">
                <span className="text-stone-500">Customer MRR:</span>
                <span className="font-bold text-emerald-800 text-sm font-pixel">${demoMrr}/mo</span>
              </div>
              <input
                type="range"
                min="10"
                max="200"
                step="5"
                value={demoMrr}
                onChange={(e) => setDemoMrr(parseInt(e.target.value))}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-xs font-satoshi shadow-xs">
                <div className="text-stone-900 font-bold">{currentTreeTier.tier}</div>
                <div className="text-stone-500 text-[11px]">{currentTreeTier.desc}</div>
              </div>
            </Card>

            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-satoshi text-emerald-800">
              <span>Stripe / Lemon Squeezy</span>
              <span className="font-bold">Instant Webhook</span>
            </div>
          </Card>

          {/* Bento 4: 1-Click Social Exporter */}
          <Card variant="porcelain" className="md:col-span-7 p-8 rounded-[2.5rem] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <Badge variant="stone" size="sm">
                  Build in Public
                </Badge>
                <span className="text-xs font-satoshi text-emerald-700 font-bold">Twitter / X Formatted</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-stone-900 mb-1.5 font-satoshi">
                1-Click Verified Social Exporter
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-lg font-satoshi">
                Generate high-signal progress posts engineered for the developer niche. Zero fake hype, pure shipping momentum:
              </p>
            </div>

            <Card variant="subtle-inset" className="p-4 font-satoshi text-xs sm:text-sm text-stone-800 space-y-2 mt-2 rounded-2xl">
              <p className="text-xs sm:text-sm text-stone-700 font-satoshi leading-relaxed">
                Day 14 of shipping on IndieForest.<br />
                Rank: Tier IV — Island Architect (Level 12)<br />
                Revenue Grove: ${demoMrr * 3}/mo | 14d Active Streak
              </p>
              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                <Button
                  onClick={handleCopyTweet}
                  variant="dark"
                  size="sm"
                  showArrow
                  discIcon={copiedTweet ? Check : Copy}
                >
                  {copiedTweet ? "Copied to Clipboard" : "Copy Formatted Post"}
                </Button>
                <span className="text-xs text-stone-500 font-pixel font-bold">280 CHAR COMPLIANT</span>
              </div>
            </Card>

            <div className="pt-3 mt-2 border-t border-stone-100 flex items-center justify-between text-xs font-satoshi text-stone-500">
              <span>Dynamic Island Cards</span>
              <span className="font-semibold text-emerald-800 font-pixel text-xs">indieforest.dev/u/kwakhare5</span>
            </div>
          </Card>
        </div>
      </section>

      {/* 6. Founder FAQ Section */}
      <section id="faq" className="py-20 bg-[#e6e1d7] border-t border-stone-300/80 font-satoshi">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <Badge variant="stone" size="sm" className="mb-2">
              Transparent &amp; Zero-Slop
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 font-editorial">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            <Card variant="porcelain" className="p-6 rounded-2xl">
              <h3 className="font-bold text-stone-950 text-sm mb-1.5 font-satoshi">
                Do you read or store my private GitHub source code?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
                Never. IndieForest only fetches public repository commit timestamps and author names to verify that you shipped code today. We never request private repo write permissions or read code contents.
              </p>
            </Card>

            <Card variant="porcelain" className="p-6 rounded-2xl">
              <h3 className="font-bold text-stone-950 text-sm mb-1.5 font-satoshi">
                How does Stripe or Lemon Squeezy integration work?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
                You simply paste your unique IndieForest Webhook URL into your Stripe, Lemon Squeezy, or Polar webhook settings. When a customer purchases a subscription, our webhook normalizer automatically sprouts a Golden Pine tree in your revenue grove with the customer&apos;s monthly recurring value.
              </p>
            </Card>

            <Card variant="porcelain" className="p-6 rounded-2xl">
              <h3 className="font-bold text-stone-950 text-sm mb-1.5 font-satoshi">
                What happens if I take a weekend off?
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-satoshi">
                We believe in sustainable coding, not burnout. For every 7 days of consecutive shipping, you earn 1 Burnout Shield (up to 2 maximum). When you take a rest day, a shield is automatically consumed to protect your streak from resetting to zero.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Bottom CTA */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 font-satoshi">
        <Card variant="elevated" className="p-8 sm:p-12 rounded-[3rem] text-center space-y-6 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 mx-auto shadow-xs">
            <Trees className="w-6 h-6 stroke-[1.75]" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl font-normal text-stone-950 tracking-tight font-editorial">
              Start growing your island today.
            </h2>
            <p className="text-sm sm:text-base text-stone-600 font-satoshi">
              Join indie builders turning daily commits and revenue momentum into a living island.
            </p>
          </div>

          <div className="pt-2 flex justify-center">
            {isLoaded && isSignedIn ? (
              <Link href="/dashboard">
                <Button variant="emerald" size="lg" showArrow arrowType="right">
                  OPEN DASHBOARD
                </Button>
              </Link>
            ) : (
              <SignInButton mode="modal">
                <Button
                  variant="emerald"
                  size="lg"
                  showArrow
                  arrowType="right"
                  onClick={() => sound.playClick()}
                >
                  START FREE WITH GOOGLE
                </Button>
              </SignInButton>
            )}
          </div>

          <p className="text-xs font-satoshi text-stone-500 pt-2">
            Free forever • Zero setup • 1-click Google sync
          </p>
        </Card>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-stone-300/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-satoshi text-stone-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-800 font-satoshi">IndieForest</span>
            <span>© {new Date().getFullYear()}</span>
          </div>
          <div className="flex items-center gap-6 font-satoshi">
            <a
              href="https://github.com/kwakhare5/IndieForest"
              target="_blank"
              rel="noreferrer"
              className="hover:text-stone-900 transition"
            >
              GitHub Repository
            </a>
            <Link href="/dashboard" className="hover:text-stone-900 transition">
              Open Dashboard
            </Link>
            <Link href="/u/kwakhare5" className="hover:text-stone-900 transition">
              Public Profile
            </Link>
          </div>
        </footer>
      </section>
    </div>
  );
}
