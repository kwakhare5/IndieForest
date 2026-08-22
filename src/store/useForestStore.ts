"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  getLocalDateString,
  getTreeSlotCoordinate,
  DEFAULT_DAILY_QUESTS,
} from "@/lib/gamification";
import { islandSyncEngine } from "@/lib/syncEngine";
import { sound } from "@/lib/sound";
import type {
  ForestState,
  GrowthTier,
  QuestId,
  ShipLog,
  TimeOfDay,
  TreeData,
  TreeType,
} from "@/types/game";

export type { QuestId, DailyQuest } from "@/types/game";
export { getRankTitle, getXpForLevel } from "@/lib/gamification";

export const useForestStore = create<ForestState>()(
  persist(
    (set, get) => ({
      user: {
        id: "",
        username: "",
        avatarUrl: "",
        isAuthenticated: false,
      },

      level: 1,
      xp: 0,
      totalXp: 0,

      streakDays: 0,
      bestStreak: 0,
      streakShields: 0,
      lastShipDate: null,
      drought: false,

      timeOfDay: "day",
      dailyQuests: DEFAULT_DAILY_QUESTS,

      trees: [],
      shipHistory: [],

      isAutoSyncing: false,
      lastSyncTime: null,

      setUser: (userData: Partial<ForestState["user"]>) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      loginUser: (userData: Partial<ForestState["user"]>) =>
        set((state) => ({
          user: { ...state.user, ...userData, isAuthenticated: true },
        })),

      logoutUser: () =>
        set({
          user: {
            id: "",
            username: "guest",
            avatarUrl: "",
            isAuthenticated: false,
          },
        }),

      setGithubRepo: (repo: string) => {
        set((state) => ({ user: { ...state.user, githubRepo: repo } }));
      },

      setTimeOfDay: (time: TimeOfDay) => set({ timeOfDay: time }),

      toggleTimeOfDay: () => {
        const current = get().timeOfDay;
        const next: TimeOfDay =
          current === "day" ? "sunset" : current === "sunset" ? "night" : "day";
        set({ timeOfDay: next });
      },

      triggerQuestProgress: (questId: QuestId, amount = 1) => {
        set((s) => ({
          dailyQuests: s.dailyQuests.map((q) => {
            if (q.id !== questId) return q;
            const newProg = Math.min(q.target, q.progress + amount);
            return {
              ...q,
              progress: newProg,
              isCompleted: newProg >= q.target,
            };
          }),
        }));
      },

      claimQuestReward: (questId: QuestId) => {
        const quest = get().dailyQuests.find((q) => q.id === questId);
        if (!quest || !quest.isCompleted || quest.isClaimed) return;

        const { level: newLevel, xp: newXp } = evaluateLevelProgress({
          currentLevel: get().level,
          currentXp: get().xp,
          earnedXp: quest.xpReward,
        });

        set((s) => ({
          level: newLevel,
          xp: newXp,
          totalXp: s.totalXp + quest.xpReward,
          dailyQuests: s.dailyQuests.map((q) =>
            q.id === questId ? { ...q, isClaimed: true } : q
          ),
        }));

        sound.playLevelUp();
        get().syncCloudIsland();
      },

      shipToday: (
        message: string,
        source: "github" | "manual" = "manual",
        proofUrl?: string,
        repo?: string
      ) => {
        const state = get();
        const todayStr = getLocalDateString();

        if (state.lastShipDate === todayStr) {
          return;
        }

        const newStreakDays = state.streakDays + 1;
        const isMilestone = newStreakDays % 7 === 0;

        const rewards = calculateShipRewards({
          streakDays: newStreakDays,
          hasProofUrl: Boolean(proofUrl),
          isMilestoneDay: isMilestone,
          currentShields: state.streakShields,
        });

        const newShipLog: ShipLog = {
          id: `ship-${Date.now()}`,
          date: new Date().toISOString(),
          message,
          source,
          xpGained: rewards.xpGained,
          proofUrl,
          repo,
        };

        const { level: newLevel, xp: newXp } = evaluateLevelProgress({
          currentLevel: state.level,
          currentXp: state.xp,
          earnedXp: rewards.xpGained,
        });

        const newShields = Math.min(
          2,
          state.streakShields + rewards.shieldsGained
        );

        set((s) => ({
          level: newLevel,
          xp: newXp,
          totalXp: s.totalXp + rewards.xpGained,
          streakDays: newStreakDays,
          bestStreak: Math.max(s.bestStreak, newStreakDays),
          streakShields: newShields,
          lastShipDate: todayStr,
          drought: false,
          shipHistory: [newShipLog, ...s.shipHistory],
          dailyQuests: s.dailyQuests.map((q) =>
            q.id === "atomic-commit"
              ? {
                  ...q,
                  progress: Math.min(q.target, q.progress + 1),
                  isCompleted: true,
                }
              : q
          ),
        }));

        sound.playShipSuccess();
        get().syncCloudIsland();
      },

      addTree: (
        name: string,
        mrr = 0,
        customTier?: GrowthTier,
        customType?: TreeType
      ) => {
        const state = get();
        const treeType: TreeType =
          customType || (mrr > 0 ? "revenue" : "shipping");
        const countInGrove = state.trees.filter(
          (t) =>
            (t.type || (t.mrr && t.mrr > 0 ? "revenue" : "shipping")) ===
            treeType
        ).length;
        const coord = getTreeSlotCoordinate(countInGrove, treeType);

        const newTree: TreeData = {
          id: `tree-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name,
          tier: customTier || "sapling",
          gridX: coord.gridX,
          gridZ: coord.gridZ,
          plantedAt: new Date().toISOString(),
          type: treeType,
          mrr: mrr > 0 ? mrr : undefined,
          commits: treeType === "shipping" ? 1 : undefined,
        };

        set((s) => ({ trees: [...s.trees, newTree] }));
        get().syncCloudIsland();
      },

      removeTree: (id: string) => {
        set((state) => ({
          trees: state.trees.filter((tree) => tree.id !== id),
        }));
        get().syncCloudIsland();
      },

      updateTreeTier: (id: string, tier: GrowthTier) => {
        set((state) => ({
          trees: state.trees.map((tree) =>
            tree.id === id ? { ...tree, tier } : tree
          ),
        }));
        get().syncCloudIsland();
      },

      checkStreakExpiry: () => {
        const state = get();
        const todayStr = getLocalDateString();

        const result = evaluateStreakState({
          lastShipDate: state.lastShipDate,
          todayDate: todayStr,
          currentStreak: state.streakDays,
          currentShields: state.streakShields,
        });

        if (
          result.streakDays !== state.streakDays ||
          result.streakShields !== state.streakShields ||
          result.drought !== state.drought
        ) {
          set({
            streakDays: result.streakDays,
            streakShields: result.streakShields,
            drought: result.drought,
          });
          get().syncCloudIsland();
        }
      },

      resetIsland: () => {
        set({
          level: 1,
          xp: 0,
          totalXp: 0,
          streakDays: 0,
          bestStreak: 0,
          streakShields: 0,
          lastShipDate: null,
          drought: false,
          trees: [],
          shipHistory: [],
          dailyQuests: DEFAULT_DAILY_QUESTS,
        });
      },

      syncGitHubIsland: async (username: string) => {
        if (!username || username === "builder" || username === "guest") return;
        try {
          const res = await fetch(`/api/island/${username}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.profile && data.profile.trees) {
            set({
              trees: data.profile.trees,
              level: data.profile.level || 1,
              streakDays: data.profile.streakDays || 1,
            });
            get().syncCloudIsland();
          }
        } catch (err) {
          console.warn("GitHub sync non-blocking error:", err);
        }
      },

      autoCheckTodayCommits: async () => {
        const state = get();
        const username = state.user.username;
        if (!username || username === "builder" || username === "guest")
          return false;

        const todayStr = getLocalDateString();
        if (state.lastShipDate === todayStr) {
          return false;
        }

        try {
          const res = await fetch(`/api/island/${username}`);
          if (!res.ok) return false;
          const data = await res.json();

          const todayLog = data.profile?.shipHistory?.find((s: ShipLog) =>
            s.date.startsWith(todayStr)
          );

          if (todayLog) {
            get().shipToday(
              todayLog.message || "Shipped to GitHub",
              "github",
              todayLog.proofUrl,
              todayLog.repo
            );
            get().triggerQuestProgress("atomic-commit", 1);
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      syncCloudIsland: async () => {
        const state = get();
        if (!state.user.id || state.user.id === "guest") return;

        set({ isAutoSyncing: true });
        try {
          const success = await islandSyncEngine.dispatch({
            userId: state.user.id,
            username: state.user.username,
            level: state.level,
            xp: state.xp,
            streakDays: state.streakDays,
            streakShields: state.streakShields,
            pinecones: 0,
            lastShipDate: state.lastShipDate,
            drought: state.drought,
            trees: state.trees,
            shipHistory: state.shipHistory,
          });
          if (success) {
            set({ lastSyncTime: new Date().toISOString() });
          }
        } finally {
          set({ isAutoSyncing: false });
        }
      },

      loadCloudIsland: async (userId: string) => {
        if (!userId || userId === "guest") return false;
        try {
          const cloudData = await islandSyncEngine.hydrate(userId);
          if (cloudData && cloudData.profile) {
            set((s) => ({
              level: cloudData.profile.level || s.level,
              xp: cloudData.profile.xp || s.xp,
              streakDays: cloudData.profile.streak_days || s.streakDays,
              streakShields: cloudData.profile.streak_shields || s.streakShields,
              drought: Boolean(cloudData.profile.drought),
              lastShipDate: cloudData.profile.last_ship_date || s.lastShipDate,
              trees: cloudData.trees.length > 0 ? cloudData.trees : s.trees,
              shipHistory:
                cloudData.shipHistory.length > 0
                  ? cloudData.shipHistory
                  : s.shipHistory,
              lastSyncTime: new Date().toISOString(),
            }));
            return true;
          }
          return false;
        } catch {
          return false;
        }
      },

      mergeCloudData: (data) => {
        set((s) => ({
          level: data.level ?? s.level,
          xp: data.xp ?? s.xp,
          totalXp: data.totalXp ?? s.totalXp,
          streakDays: data.streakDays ?? s.streakDays,
          bestStreak: data.bestStreak ?? s.bestStreak,
          streakShields: data.streakShields ?? s.streakShields,
          trees: data.trees ?? s.trees,
          shipHistory: data.shipHistory ?? s.shipHistory,
        }));
      },
    }),
    {
      name: "indieforest-storage-v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
