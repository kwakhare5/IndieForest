import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sound } from "@/lib/sound";
import type {
  GrowthTier,
  TreeType,
  TreeData,
  ShipLog,
  DailyQuest,
  WeatherType,
} from "@/types/game";
import {
  getRankTitle,
  getXpForLevel,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  completeDailyQuest,
  purchaseCampDecor,
  getLocalDateString,
  calculateTreeTier,
  getTreeSlotCoordinate,
} from "@/lib/gamification";

export type { GrowthTier, TreeType, TreeData, ShipLog, DailyQuest, WeatherType };
export { getRankTitle, getXpForLevel, getLocalDateString };


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
  weatherType: WeatherType;
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
  setWeatherType: (weather: WeatherType) => void;
  triggerRain: (durationMs?: number) => void;
  checkStreakExpiry: () => void;
  resetIsland: () => void;
  syncGitHubIsland: (username: string) => Promise<void>;
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
    unlockedDecor?: string[];
  }) => void;
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
        id: "kwakhare5",
        username: "kwakhare5",
        avatarUrl: "https://github.com/kwakhare5.png",
        isAuthenticated: false,
      },

      level: 1,
      xp: 0,
      totalXp: 0,
      pinecones: 20, // Starter pinecones

      streakDays: 0,
      bestStreak: 0,
      streakShields: 0,
      lastShipDate: null,
      drought: false,

      quests: DEFAULT_QUESTS,
      todayFocus: "Build MVP & ship first release",
      hasCompletedSproutGuide: false,

      trees: [], // Clean virgin island
      shipHistory: [],
      unlockedDecor: [],

      weather: "sunny",
      weatherType: "clear",
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
        set({
          user: {
            id: "kwakhare5",
            username: "kwakhare5",
            avatarUrl: "https://github.com/kwakhare5.png",
            isAuthenticated: false,
          },
        });
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

      syncGitHubIsland: async (username: string) => {
        try {
          const res = await fetch(`/api/github/preview?username=${encodeURIComponent(username)}`);
          if (!res.ok) return;
          const data = await res.json();
          if (data.trees && data.trees.length > 0) {
            set((state) => ({
              trees: data.trees,
              streakDays: Math.max(data.streakDays, state.streakDays),
              level: Math.max(data.level, state.level),
              pinecones: Math.max(data.pinecones, state.pinecones),
              user: { ...state.user, username: data.username, avatarUrl: data.avatarUrl },
              hasCompletedSproutGuide: true,
            }));
          }
        } catch {
          // ignore
        }
      },

      shipToday: (message, source = "manual", proofUrl, repo) => {
        const todayStr = getLocalDateString();
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

        // Water and grow the most active or matching shipping tree
        let updatedTrees = state.trees.map((t, idx) => {
          if (t.type === "shipping" && (t.name === repo || idx === 0 || state.trees.length === 1)) {
            const nextCommits = (t.commits || 0) + 1;
            const nextTier = calculateTreeTier("shipping", nextCommits, t.mrr, (t.activeDays || 1) + 1).tier;
            return { ...t, commits: nextCommits, tier: nextTier };
          }
          return t;
        });

        // If no trees exist yet, plant first shipping sapling
        if (updatedTrees.length === 0) {
          const starterCoord = getTreeSlotCoordinate("shipping", 0);
          updatedTrees = [
            {
              id: `tree-${Date.now()}`,
              name: repo || "First Project",
              type: "shipping",
              commits: 1,
              activeDays: 1,
              mrr: 0,
              tier: "sapling",
              gridX: starterCoord[0],
              gridZ: starterCoord[1],
              plantedAt: new Date().toISOString(),
              isDemo: false,
            },
          ];
        }

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
          trees: updatedTrees,
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

        sound.playCoin();
        const progress = evaluateLevelProgress({
          currentLevel: state.level,
          currentXp: state.xp,
          earnedXp: result.xpAwarded,
        });

        set({
          quests: result.updatedQuests,
          xp: progress.xp,
          totalXp: state.totalXp + result.xpAwarded,
          level: progress.level,
          pinecones: state.pinecones + 5,
        });
      },

      buyDecor: (itemId) => {
        const state = get();
        const result = purchaseCampDecor(state.unlockedDecor, state.pinecones, itemId);
        if (!result.success) return false;

        sound.playCoin();
        set({
          pinecones: result.remainingPinecones,
          unlockedDecor: result.unlockedIds,
        });
        return true;
      },

      addTree: (name, mrr = 0, tier = "sapling", type) => {
        const state = get();
        const treeType = type || (mrr > 0 ? "revenue" : "shipping");
        
        // Count existing trees of same type to pick non-overlapping coordinate slot
        const existingCount = state.trees.filter((t) => (t.type || "shipping") === treeType).length;
        const coord = getTreeSlotCoordinate(treeType, existingCount);

        const newTree: TreeData = {
          id: `tree-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          name: name.trim() || (treeType === "revenue" ? "Paying Customer" : "New Feature"),
          type: treeType,
          mrr,
          commits: treeType === "shipping" ? 1 : 0,
          activeDays: 1,
          tier,
          gridX: coord[0],
          gridZ: coord[1],
          plantedAt: new Date().toISOString(),
          isDemo: false,
        };

        sound.playShipSuccess();
        set({
          trees: [...state.trees, newTree],
          hasCompletedSproutGuide: true,
        });
      },

      removeTree: (id) => {
        sound.playClick();
        set((state) => ({
          trees: state.trees.filter((t) => t.id !== id),
        }));
      },

      updateTreeTier: (id, tier) => {
        set((state) => ({
          trees: state.trees.map((t) => (t.id === id ? { ...t, tier } : t)),
        }));
      },

      setTimeOfDay: (time) => {
        set({ timeOfDay: time });
      },

      setWeatherType: (weatherType) => {
        set({ weatherType });
      },

      triggerRain: (durationMs = 4500) => {
        set({ isRaining: true, weatherType: "rain_emerald" });
        setTimeout(() => {
          set({ isRaining: false, weatherType: "clear" });
        }, durationMs);
      },


      checkStreakExpiry: () => {
        const state = get();
        const todayStr = getLocalDateString();
        const streakResult = evaluateStreakState({
          lastShipDate: state.lastShipDate,
          todayDate: todayStr,
          currentStreak: state.streakDays,
          currentShields: state.streakShields,
        });

        set({
          streakDays: streakResult.streakDays,
          streakShields: streakResult.streakShields,
          drought: streakResult.drought,
        });
      },

      mergeCloudData: (data) => {
        set((state) => {
          const mergedTrees = [...state.trees];
          if (data.trees) {
            for (const t of data.trees) {
              if (!mergedTrees.some((existing) => existing.id === t.id)) {
                mergedTrees.push(t);
              }
            }
          }
          return {
            level: data.level ?? state.level,
            xp: data.xp ?? state.xp,
            totalXp: data.totalXp ?? state.totalXp,
            pinecones: data.pinecones ?? state.pinecones,
            streakDays: data.streakDays ?? state.streakDays,
            bestStreak: data.bestStreak ?? state.bestStreak,
            streakShields: data.streakShields ?? state.streakShields,
            trees: mergedTrees,
            shipHistory: data.shipHistory ?? state.shipHistory,
            unlockedDecor: data.unlockedDecor ?? state.unlockedDecor,
          };
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
      name: "indieforest_storage_v4",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" && window.localStorage
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
    }
  )
);

