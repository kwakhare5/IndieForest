"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import {
  Flame,
  Trees,
  TrendingUp,
  Sparkles,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Droplets,
} from "lucide-react";
import { getRankTitle } from "@/lib/gamification";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GuestbookModal } from "@/components/hud/modals/GuestbookModal";
import { ForestCanvas } from "@/components/canvas/ForestCanvas";
import { GitHubIslandProfile } from "@/lib/github";
import { GuestbookEntry } from "@/types/game";
import { sound } from "@/lib/sound";
import { loadProfileFromSupabase, fetchGuestbookEntries, saveGuestbookEntry } from "@/lib/supabase";

interface PublicProfileProps {
  params: Promise<{ username: string }>;
}

export default function PublicProfilePage({ params }: PublicProfileProps) {
  const { username } = use(params);

  const [profile, setProfile] = useState<GitHubIslandProfile | null>(null);
  const [isGuestbookOpen, setIsGuestbookOpen] = useState(false);
  const [isCheering, setIsCheering] = useState(false);
  const [cheerCount, setCheerCount] = useState(12);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  useEffect(() => {
    async function loadProfile() {
      // 1. Try loading registered builder profile from Supabase
      try {
        const cloudData = await loadProfileFromSupabase(username);
        if (cloudData && cloudData.profile) {
          setProfile({
            username: cloudData.profile.username,
            avatarUrl: cloudData.profile.avatar_url || `https://github.com/${username}.png`,
            streakDays: cloudData.profile.streak_days,
            totalCommits: cloudData.shipHistory.length * 10 || 25,
            level: cloudData.profile.level,
            xp: cloudData.profile.xp,
            activeReposCount: cloudData.trees.length || 1,
            lastActiveDate: cloudData.profile.last_ship_date || new Date().toISOString(),
            recentCommits: cloudData.shipHistory.map((s, idx) => ({
              id: s.id || `commit-${idx}`,
              repo: "main",
              message: s.message,
              date: s.date,
              author: cloudData.profile.username,
              diffUrl: s.proofUrl,
            })),
            trees: cloudData.trees,
          });
        } else {
          // 2. Fallback to live GitHub public stats generator
          const res = await fetch(`/api/github/preview?username=${encodeURIComponent(username)}`);
          if (res.ok) {
            const data: GitHubIslandProfile = await res.json();
            setProfile(data);
          }
        }
      } catch {
        // Silent fallback
      }

      // 3. Load persistent guestbook entries
      try {
        const gb = await fetchGuestbookEntries(username);
        setGuestbookEntries(gb);
      } catch {
        // Fallback
      }
    }
    loadProfile();
  }, [username]);

  const handleAddGuestbookNote = async (message: string, author: string) => {
    const cleanAuthor = author.trim() || "Anonymous Builder";
    const saved = await saveGuestbookEntry(username, cleanAuthor, message);
    const newEntry: GuestbookEntry = {
      id: saved?.id || `gb-${Date.now()}`,
      author: cleanAuthor,
      message,
      timestamp: new Date().toISOString(),
    };
    setGuestbookEntries((prev) => [newEntry, ...prev]);
  };

  const handleCheerWater = () => {
    sound.playShipSuccess();
    setIsCheering(true);
    setCheerCount((c) => c + 1);
    setTimeout(() => {
      setIsCheering(false);
    }, 4000);
  };

  const level = profile ? profile.level : 1;
  const streakDays = profile ? profile.streakDays : 1;
  const trees = profile ? profile.trees : [];
  const { title, badge } = getRankTitle(level);
  const totalCommits = profile ? profile.totalCommits : 5;

  return (
    <div className="min-h-screen bg-[#ece7de] text-stone-900 font-satoshi selection:bg-emerald-600 selection:text-white relative pb-16">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#ece7de] border-b border-stone-300/80 px-4 sm:px-8 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-stone-950 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCheerWater}
              icon={Droplets}
              className="text-cyan-800 border-cyan-300 bg-cyan-50/50"
            >
              Water Island ({cheerCount})
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                sound.playClick();
                setIsGuestbookOpen(true);
              }}
              icon={MessageSquare}
            >
              Guestbook ({guestbookEntries.length})
            </Button>

            <Link href="/">
              <Button
                variant="emerald"
                size="sm"
                showArrow
                arrowType="right"
                icon={Sparkles}
              >
                Create Mine
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* 3D Living Diorama Enclosure */}
        <Card
          variant="porcelain"
          className="p-2 sm:p-4 rounded-3xl overflow-hidden border border-stone-300/80 shadow-xl bg-gradient-to-b from-[#f5f0ea] to-[#ece7de] relative"
        >
          <div className="w-full h-[460px] rounded-2xl overflow-hidden relative">
            <ForestCanvas
              trees={trees}
              level={level}
              streakDays={streakDays}
              streakShields={1}
              isRaining={isCheering}
              className="w-full h-full"
            />

            {/* Public Diorama Tag */}
            <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/85 backdrop-blur-md border border-stone-200/70 text-[11px] font-semibold text-stone-700 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live 3D Proof-of-Work Diorama · @{username}</span>
            </div>
          </div>
        </Card>

        {/* Profile Identity Card */}
        <Card variant="porcelain" className="p-6 sm:p-8 rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {profile?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatarUrl}
                  alt={username}
                  className="w-16 h-16 rounded-2xl border-2 border-emerald-300 shadow-md"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-bold text-xl shadow-inner font-satoshi">
                  {username.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight font-satoshi">
                    @{username}
                  </h1>
                  <Badge variant="emerald" size="sm">
                    Tier {badge}
                  </Badge>
                </div>
                <p className="text-xs text-stone-600 font-pixel font-bold mt-1">
                  {title} · Level {level}
                </p>
              </div>
            </div>

            <Badge variant="stone" size="md">
              Verified Public Profile
            </Badge>
          </div>

          {/* Stats Metric Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
            <Card variant="subtle-inset" className="p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-stone-500 font-satoshi block">
                Active Consistency
              </span>
              <div className="text-xl font-bold text-amber-700 font-pixel flex items-center gap-1.5">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
                {streakDays} DAYS
              </div>
              <span className="text-[10px] text-stone-500">Unbroken streak</span>
            </Card>

            <Card variant="subtle-inset" className="p-4 rounded-2xl space-y-1">
              <span className="text-[11px] text-stone-500 font-satoshi block">
                Active Modules
              </span>
              <div className="text-xl font-bold text-emerald-800 font-pixel flex items-center gap-1.5">
                <Trees className="w-4 h-4 text-emerald-700" />
                {trees.length} MODULES
              </div>
              <span className="text-[10px] text-stone-500">Tracked projects</span>
            </Card>

            <Card
              variant="subtle-inset"
              className="p-4 rounded-2xl space-y-1 col-span-2 sm:col-span-1"
            >
              <span className="text-[11px] text-stone-500 font-satoshi block">
                Total Activity
              </span>
              <div className="text-xl font-bold text-stone-900 font-pixel flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-emerald-700" />
                {totalCommits} COMMITS
              </div>
              <span className="text-[10px] text-stone-500">Verified code pushes</span>
            </Card>
          </div>
        </Card>

        {/* Modules Section */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-stone-950 font-satoshi">
            Verified Project Modules
          </h2>
          {trees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {trees.map((tree) => (
                <Card
                  key={tree.id}
                  variant="porcelain"
                  className="p-5 rounded-2xl space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          tree.type === "revenue"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {tree.type === "revenue" ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <Trees className="w-4 h-4" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-stone-950 font-satoshi truncate max-w-[160px]">
                          {tree.name}
                        </h4>
                        <span className="text-[11px] text-stone-500 uppercase font-pixel">
                          {tree.tier} Tier
                        </span>
                      </div>
                    </div>
                    <Badge
                      variant={tree.type === "revenue" ? "amber" : "emerald"}
                      size="sm"
                    >
                      {tree.type === "revenue"
                        ? `$${tree.mrr || 0}/mo`
                        : `${tree.commits || 0} commits`}
                    </Badge>
                  </div>
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-satoshi">
                    <span>Planted {new Date(tree.plantedAt).toLocaleDateString()}</span>
                    <span className="text-emerald-800 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card
              variant="porcelain"
              className="p-8 text-center rounded-2xl text-stone-500 text-xs"
            >
              No active modules planted yet.
            </Card>
          )}
        </section>
      </main>

      {/* Guestbook Modal */}
      <GuestbookModal
        isOpen={isGuestbookOpen}
        onClose={() => setIsGuestbookOpen(false)}
        targetUsername={username}
        entries={guestbookEntries}
        onAddEntry={handleAddGuestbookNote}
      />
    </div>
  );
}
