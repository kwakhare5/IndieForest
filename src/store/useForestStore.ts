import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sound } from "@/lib/sound";
import type {
  GrowthTier,
  TreeType,
  TreeData,
  ShipLog,
  TimeOfDay,
  DailyQuest,
  QuestId,
  CampShopItem,
} from "@/types/game";
import {
  getRankTitle,
  getXpForLevel,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  getLocalDateString,
  calculateTreeTier,
  getTreeSlotCoordinate,
  DEFAULT_DAILY_QUESTS,
  CAMP_SHOP_CATALOG,
} from "@/lib/gamification";

export type { GrowthTier, TreeType, TreeData, ShipLog, TimeOfDay, DailyQuest, QuestId, CampShopItem };
export { getRankTitle, getXpForLevel, getLocalDateString };

export interface ForestState {
  user: {
    id: string;
    email?: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    githubRepo?: string;
    isAuthenticated: boolean;
  };

  level: number;
  xp: number;
  totalXp: number;

  pinecones: number;
  streakDays: number;
  bestStreak: number;
  streakShields: number;
  lastShipDate: string | null;
  drought: boolean;

  timeOfDay: TimeOfDay;
  dailyQuests: DailyQuest[];
  shopItems: CampShopItem[];

  trees: TreeData[];
  shipHistory: ShipLog[];

  isAutoSyncing: boolean;
  lastSyncTime: string | null;

  setUser: (userData: Partial<ForestState["user"]>) => void;
  loginUser: (userData: Partial<ForestState["user"]>) => void;
  logoutUser: () => void;
  setGithubRepo: (repo: string) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleTimeOfDay: () => void;
  addPinecones: (amount: number) => void;
  claimQuestReward: (questId: QuestId) => void;
  triggerQuestProgress: (questId: QuestId, amount?: number) => void;
  buyShopItem: (itemId: string) => boolean;
  shipToday: (message: string, source?: "github" | "manual", proofUrl?: string, repo?: string) => void;
  addTree: (name: string, mrr?: number, tier?: GrowthTier, type?: TreeType) => void;
  removeTree: (id: string) => void;
  updateTreeTier: (id: string, tier: GrowthTier) => void;
  checkStreakExpiry: () => void;
  resetIsland: () => void;
  syncGitHubIsland: (username: string) => Promise<void>;
  autoCheckTodayCommits: () => Promise<boolean>;
  mergeCloudData: (data: {
    level?: number;
    xp?: number;
    totalXp?: number;
    pinecones?: number;
    streakDays?: number;
    bestStreak?: number;
    streakShields?: number;
    trees?: TreeData[];
    shipHistory?: ShipLog[];
  }) => void;
}

export const useForestStore = create<ForestState>()(
  persist(
    (set, get) => ({
      user: {
        id: "kwakhare5",
        username: "kwakhare5",
        avatarUrl: "https://github.com/kwakhare5.png",
        isAuthenticated: false,
      },

      level: 1,
      xp: 0,
      totalXp: 0,

      pinecones: 75, // Starting starter bounty
      streakDays: 0,
      bestStreak: 0,
      streakShields: 0,
      lastShipDate: null,
      drought: false,

      timeOfDay: "day",
      dailyQuests: DEFAULT_DAILY_QUESTS,
      shopItems: CAMP_SHOP_CATALOG,

      trees: [],
      shipHistory: [],

      isAutoSyncing: false,
      lastSyncTime: null,


      setUser: (userData) =>
        set((state) => ({ user: { ...state.user, ...userData } })),

      loginUser: (userData) =>
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

      setGithubRepo: (repo: string) =>
        set((state) => ({ user: { ...state.user, githubRepo: repo } })),

      setTimeOfDay: (time) => set({ timeOfDay: time }),

      toggleTimeOfDay: () =>
        set((s) => {
          const nextTime: TimeOfDay =
            s.timeOfDay === "day"
              ? "sunset"
              : s.timeOfDay === "sunset"
              ? "night"
              : "day";
          return { timeOfDay: nextTime };
        }),

      addPinecones: (amount) =>
        set((s) => ({ pinecones: Math.max(0, s.pinecones + amount) })),

      triggerQuestProgress: (questId, amount = 1) => {
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

      claimQuestReward: (questId) => {
        const state = get();
        const quest = state.dailyQuests.find((q) => q.id === questId);
        if (!quest || !quest.isCompleted || quest.isClaimed) return;

        const progress = evaluateLevelProgress({
          currentLevel: state.level,
          currentXp: state.xp,
          earnedXp: quest.xpReward,
        });

        set((s) => ({
          level: progress.level,
          xp: progress.xp,
          totalXp: s.totalXp + quest.xpReward,
          pinecones: s.pinecones + quest.pineconeReward,
          dailyQuests: s.dailyQuests.map((q) =>
            q.id === questId ? { ...q, isClaimed: true } : q
          ),
        }));

        sound.playShipSuccess();
      },

      buyShopItem: (itemId) => {
        const state = get();
        const item = state.shopItems.find((i) => i.id === itemId);
        if (!item || item.isUnlocked || state.pinecones < item.price) {
          return false;
        }

        // Special handling for emergency streak shield
        if (itemId === "emergency-shield") {
          if (state.streakShields >= 2) return false;
          set((s) => ({
            pinecones: s.pinecones - item.price,
            streakShields: Math.min(2, s.streakShields + 1),
          }));
          sound.playChime();
          return true;
        }

        set((s) => ({
          pinecones: s.pinecones - item.price,
          shopItems: s.shopItems.map((i) =>
            i.id === itemId ? { ...i, isUnlocked: true } : i
          ),
        }));
        sound.playChime();
        return true;
      },

      shipToday: (message, source = "manual", proofUrl, repo) => {
        const state = get();
        const todayStr = getLocalDateString();

        // Mark atomic commit quest as complete
        state.triggerQuestProgress("atomic-commit", 1);

        if (state.lastShipDate === todayStr) {
          const log: ShipLog = {
            id: `ship-${Date.now()}`,
            date: new Date().toISOString(),
            message,
            source,
            xpGained: 25,
            proofUrl,
            repo,
          };
          set((s) => ({ shipHistory: [log, ...s.shipHistory] }));
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

        const progress = evaluateLevelProgress({
          currentLevel: state.level,
          currentXp: state.xp,
          earnedXp: rewards.xpGained,
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

        set((s) => ({
          level: progress.level,
          xp: progress.xp,
          totalXp: s.totalXp + rewards.xpGained,
          streakDays: newStreakDays,
          bestStreak: Math.max(s.bestStreak, newStreakDays),
          streakShields: Math.min(2, s.streakShields + rewards.shieldsGained),
          lastShipDate: todayStr,
          drought: false,
          shipHistory: [newShipLog, ...s.shipHistory],
        }));

        sound.playShipSuccess();
      },

      addTree: (name, mrr = 0, customTier, customType) => {
        const state = get();
        const treeType: TreeType = customType || (mrr > 0 ? "revenue" : "shipping");
        const countInGrove = state.trees.filter(
          (t) => (t.type || (t.mrr && t.mrr > 0 ? "revenue" : "shipping")) === treeType
        ).length;
        const coord = getTreeSlotCoordinate(countInGrove, treeType);

        const tier = customTier || calculateTreeTier(treeType, mrr > 0 ? mrr : 1);

        const newTree: TreeData = {
          id: `tree-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          name,
          type: treeType,
          commits: treeType === "shipping" ? 1 : undefined,
          mrr: treeType === "revenue" ? mrr : undefined,
          tier,
          gridX: coord.gridX,
          gridZ: coord.gridZ,
          plantedAt: new Date().toISOString(),
        };

        if (treeType === "revenue") {
          state.triggerQuestProgress("customer-touchpoint", 1);
        }

        set((s) => ({ trees: [...s.trees, newTree] }));
        sound.playPlantTree();
      },


      removeTree: (id) =>
        set((s) => ({ trees: s.trees.filter((t) => t.id !== id) })),

      updateTreeTier: (id, tier) =>
        set((s) => ({
          trees: s.trees.map((t) => (t.id === id ? { ...t, tier } : t)),
        })),

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
        });
      },

      syncGitHubIsland: async (username: string) => {
        set({ isAutoSyncing: true });
        try {
          const res = await fetch(`/api/github/preview?username=${encodeURIComponent(username)}`);
          if (!res.ok) throw new Error("Failed to fetch GitHub profile");
          const data = await res.json();

          set((s) => ({
            trees: data.trees || s.trees,
            streakDays: data.streakDays || s.streakDays,
            bestStreak: Math.max(s.bestStreak, data.streakDays || 0),
            level: data.level || s.level,
            xp: data.xp || s.xp,
            lastSyncTime: new Date().toISOString(),
          }));
        } catch {
          // Keep local fallback
        } finally {
          set({ isAutoSyncing: false });
        }
      },

      autoCheckTodayCommits: async () => {
        const state = get();
        const username = state.user.username;
        if (!username || username === "guest") return false;

        try {
          const res = await fetch(`/api/github?username=${encodeURIComponent(username)}`);
          if (!res.ok) return false;
          const data = await res.json();

          if (data.todayActive) {
            state.shipToday(
              data.latestCommit?.message || "Auto-detected GitHub commit",
              "github",
              data.latestCommit?.diffUrl,
              data.latestCommit?.repo
            );
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
          pinecones: data.pinecones ?? s.pinecones,
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
