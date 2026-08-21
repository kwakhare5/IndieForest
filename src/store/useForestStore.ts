import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sound } from "@/lib/sound";
import {
  GrowthTier,
  TreeType,
  TreeData,
  ShipLog,
  DailyQuest,
  getRankTitle,
  getXpForLevel,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  completeDailyQuest,
  purchaseCampDecor,
} from "@/lib/gamification";

export type { GrowthTier, TreeType, TreeData, ShipLog, DailyQuest };
export { getRankTitle, getXpForLevel };

export interface ForestState {
  // User Profile & Identity
  user: {
    id: string;
    email?: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
    githubRepo?: string;
    isAuthenticated: boolean;
  };

  // Developer Level & XP Progression
  level: number;
  xp: number;
  totalXp: number;
  pinecones: number;

  // Streaks & Burnout Shields
  streakDays: number;
  bestStreak: number;
  streakShields: number;
  lastShipDate: string | null;
  drought: boolean;

  // Daily Quests
  quests: DailyQuest[];
  todayFocus: string;

  // Onboarding Status
  hasCompletedSproutGuide: boolean;

  // Dynamic Island Entities
  trees: TreeData[];
  shipHistory: ShipLog[];
  unlockedDecor: string[]; // IDs of cosmetic items bought from Pinecone Camp Shop

  // 3D Weather & Atmosphere
  weather: "sunny" | "rain" | "golden_hour" | "night" | "drought";
  isRaining: boolean;
  timeOfDay: "day" | "sunset" | "night";

  // Actions
  setUser: (userData: Partial<ForestState["user"]>) => void;
  loginUser: (userData: Partial<ForestState["user"]>) => void;
  logoutUser: () => void;
  setGithubRepo: (repo: string) => void;
  setTodayFocus: (focus: string) => void;
  completeSproutGuide: () => void;
  shipToday: (message: string, source?: "github" | "manual", proofUrl?: string, repo?: string) => void;
  checkOffQuest: (questId: string) => void;
  buyDecor: (itemId: string) => boolean;
  addTree: (name: string, mrr?: number, tier?: GrowthTier, type?: TreeType) => void;
  removeTree: (id: string) => void;
  updateTreeTier: (id: string, tier: GrowthTier) => void;
  setTimeOfDay: (time: "day" | "sunset" | "night") => void;
  triggerRain: (durationMs?: number) => void;
  checkStreakExpiry: () => void;
  resetIsland: () => void;
}

const DEFAULT_QUESTS: DailyQuest[] = [
  { id: "focus_ship", title: "Ship today's #1 focus task", xpReward: 100, completed: false },
  { id: "github_commit", title: "Push code to GitHub", xpReward: 50, completed: false },
  { id: "share_x", title: "Post progress to X", xpReward: 25, completed: false },
];

export const useForestStore = create<ForestState>()(
  persist(
    (set, get) => ({
      user: {
        id: "local-user",
        username: "indie_builder",
        isAuthenticated: false,
      },

      level: 1,
      xp: 0,
      totalXp: 0,
      pinecones: 20, // Starter pinecone stash

      streakDays: 0,
      bestStreak: 0,
      streakShields: 0,
      lastShipDate: null,
      drought: false,

      quests: DEFAULT_QUESTS,
      todayFocus: "Build MVP & ship first release",
      hasCompletedSproutGuide: false,

      trees: [], // Fresh virgin island with 0 fake trees
      shipHistory: [],
      unlockedDecor: [],

      weather: "sunny",
      isRaining: false,
      timeOfDay: "day",

      setUser: (userData) => {
        set((state) => ({
          user: { ...state.user, ...userData },
        }));
      },

      loginUser: (userData) => {
        sound.playLevelUp();
        set((state) => ({
          user: {
            ...state.user,
            ...userData,
            isAuthenticated: true,
          },
        }));
      },

      logoutUser: () => {
        sound.playClick();
        set((state) => ({
          user: {
            id: "local-user",
            username: "indie_builder",
            isAuthenticated: false,
          },
        }));
      },

      setGithubRepo: (repo) => {
        set((state) => ({
          user: { ...state.user, githubRepo: repo.trim() },
        }));
      },

      setTodayFocus: (focus) => {
        set((state) => ({
          todayFocus: focus.trim(),
          quests: state.quests.map((q) =>
            q.id === "focus_ship" ? { ...q, title: `Ship: "${focus.trim()}"` } : q
          ),
        }));
      },

      completeSproutGuide: () => {
        set({ hasCompletedSproutGuide: true });
      },

      shipToday: (message, source = "manual", proofUrl, repo) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const state = get();

        const alreadyShippedToday = state.lastShipDate === todayStr;
        const newStreak = alreadyShippedToday ? state.streakDays : state.streakDays + 1;
        const isMilestone = newStreak > 0 && newStreak % 7 === 0 && !alreadyShippedToday;

        const rewards = calculateShipRewards({
          streakDays: newStreak,
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
          message: message.trim() || "Pushed code update to GitHub",
          source,
          xpGained: rewards.xpGained,
          proofUrl: proofUrl?.trim(),
          repo: repo || state.user.githubRepo,
        };

        if (progress.didLevelUp) {
          sound.playLevelUp();
        } else {
          sound.playShipSuccess();
        }

        // Auto-complete the focus quest on ship
        const updatedQuests = state.quests.map((q) =>
          q.id === "focus_ship" ? { ...q, completed: true } : q
        );

        set({
          xp: progress.xp,
          totalXp: state.totalXp + rewards.xpGained,
          level: progress.level,
          pinecones: state.pinecones + rewards.pineconesGained + (progress.didLevelUp ? 50 : 0),
          streakDays: newStreak,
          bestStreak: Math.max(newStreak, state.bestStreak),
          streakShields: state.streakShields + rewards.shieldsGained,
          lastShipDate: todayStr,
          drought: false,
          quests: updatedQuests,
          shipHistory: [newShipLog, ...state.shipHistory].slice(0, 50),
          isRaining: true,
          hasCompletedSproutGuide: true,
        });

        setTimeout(() => {
          set({ isRaining: false });
        }, 4500);
      },

      checkOffQuest: (questId) => {
        const state = get();
        const result = completeDailyQuest(state.quests, questId);
        if (!result.success) return;

        const progress = evaluateLevelProgress({
          currentLevel: state.level,
          currentXp: state.xp,
          earnedXp: result.xpAwarded,
        });

        if (progress.didLevelUp) {
          sound.playLevelUp();
        } else {
          sound.playCoin();
        }

        set({
          quests: result.updatedQuests,
          xp: progress.xp,
          totalXp: state.totalXp + result.xpAwarded,
          level: progress.level,
          pinecones: state.pinecones + 5 + (progress.didLevelUp ? 50 : 0),
        });
      },

      buyDecor: (itemId) => {
        const state = get();
        const result = purchaseCampDecor(state.unlockedDecor, state.pinecones, itemId);
        if (!result.success) {
          return false;
        }

        sound.playLevelUp();
        set({
          pinecones: result.remainingPinecones,
          unlockedDecor: result.unlockedIds,
        });
        return true;
      },

      addTree: (name, mrr = 0, tier = "young", type = "revenue") => {
        const state = get();
        const coords = [
          [-2.2, -1.2],
          [2.2, -1.2],
          [-1.2, -2.5],
          [1.2, -2.5],
          [-2.5, 1.2],
          [2.5, 1.2],
          [-1.8, 1.8],
          [1.8, -1.8],
        ];
        const nextCoord = coords[state.trees.length % coords.length] || [0, 2.5];

        const newTree: TreeData = {
          id: `tree-${Date.now()}`,
          name: name.trim() || "Customer",
          type,
          mrr,
          tier,
          gridX: nextCoord[0],
          gridZ: nextCoord[1],
          plantedAt: new Date().toISOString(),
          isDemo: false,
        };

        sound.playCoin();
        set({
          trees: [...state.trees, newTree],
        });
      },

      removeTree: (id) => {
        const state = get();
        sound.playClick();
        set({
          trees: state.trees.filter((t) => t.id !== id),
        });
      },

      updateTreeTier: (id, tier) => {
        const state = get();
        set({
          trees: state.trees.map((t) => (t.id === id ? { ...t, tier } : t)),
        });
      },

      setTimeOfDay: (timeOfDay) => set({ timeOfDay }),

      triggerRain: (durationMs = 4000) => {
        sound.playShipSuccess();
        set({ isRaining: true });
        setTimeout(() => {
          set({ isRaining: false });
        }, durationMs);
      },

      checkStreakExpiry: () => {
        const state = get();
        if (!state.lastShipDate) return;

        const todayStr = new Date().toISOString().split("T")[0];
        const result = evaluateStreakState({
          lastShipDate: state.lastShipDate,
          todayDate: todayStr,
          currentStreak: state.streakDays,
          currentShields: state.streakShields,
        });

        set({
          streakDays: result.streakDays,
          streakShields: result.streakShields,
          drought: result.drought,
        });
      },

      resetIsland: () => {
        set({
          level: 1,
          xp: 0,
          totalXp: 0,
          pinecones: 20,
          streakDays: 0,
          bestStreak: 0,
          streakShields: 0,
          lastShipDate: null,
          drought: false,
          quests: DEFAULT_QUESTS,
          hasCompletedSproutGuide: false,
          trees: [],
          shipHistory: [],
          unlockedDecor: [],
        });
      },
    }),
    {
      name: "indieforest_storage_v2",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
