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
  getLocalDateString,
  calculateTreeTier,
} from "@/lib/gamification";

export type { GrowthTier, TreeType, TreeData, ShipLog, DailyQuest };
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
        set({
          user: {
            id: "local-user",
            username: "indie_builder",
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
        const updatedTrees = state.trees.map((t, idx) => {
          if (t.type === "shipping" && (t.name === repo || idx === 0 || state.trees.length === 1)) {
            const nextCommits = (t.commits || 0) + 1;
            const nextTier = calculateTreeTier("shipping", nextCommits, t.mrr).tier;
            return { ...t, commits: nextCommits, tier: nextTier };
          }
          return t;
        });

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
        const initialCommits = type === "shipping" ? 1 : 0;
        const computedTier = tier || calculateTreeTier(type, initialCommits, mrr).tier;

        const newTree: TreeData = {
          id: `tree-${Date.now()}`,
          name: name.trim() || (type === "shipping" ? "Project Repo" : "Subscriber"),
          type,
          commits: initialCommits,
          mrr,
          tier: computedTier,
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

        const todayStr = getLocalDateString();
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

      mergeCloudData: (cloudData) => {
        const state = get();
        // Merge trees keeping unique by ID
        const existingIds = new Set(state.trees.map((t) => t.id));
        const mergedTrees = [...state.trees];
        if (cloudData.trees) {
          for (const ct of cloudData.trees) {
            if (!existingIds.has(ct.id)) {
              mergedTrees.push(ct);
              existingIds.add(ct.id);
            }
          }
        }

        // Merge ship logs keeping unique by ID
        const existingLogIds = new Set(state.shipHistory.map((s) => s.id));
        const mergedLogs = [...state.shipHistory];
        if (cloudData.shipHistory) {
          for (const cl of cloudData.shipHistory) {
            if (!existingLogIds.has(cl.id)) {
              mergedLogs.push(cl);
              existingLogIds.add(cl.id);
            }
          }
        }

        // Merge unlocked decor
        const decorSet = new Set([...state.unlockedDecor, ...(cloudData.unlockedDecor || [])]);

        set({
          level: Math.max(state.level, cloudData.level || 1),
          xp: cloudData.xp !== undefined ? cloudData.xp : state.xp,
          totalXp: Math.max(state.totalXp, cloudData.totalXp || 0),
          pinecones: Math.max(state.pinecones, cloudData.pinecones || 20),
          streakDays: Math.max(state.streakDays, cloudData.streakDays || 0),
          bestStreak: Math.max(state.bestStreak, cloudData.bestStreak || 0),
          streakShields: Math.max(state.streakShields, cloudData.streakShields || 0),
          trees: mergedTrees,
          shipHistory: mergedLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
          unlockedDecor: Array.from(decorSet),
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
