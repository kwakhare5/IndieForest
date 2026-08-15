import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sound } from "@/lib/sound";

export type GrowthTier = "sapling" | "young" | "mature" | "majestic" | "stump";

export interface TreeData {
  id: string;
  name: string;
  mrr?: number;
  tier: GrowthTier;
  gridX: number;
  gridZ: number;
  plantedAt: string;
  isDemo?: boolean;
}

export interface ShipLog {
  id: string;
  date: string;
  message: string;
  source: "github" | "manual";
  xpGained: number;
  proofUrl?: string;
  repo?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  icon: string;
  cost: number;
  description: string;
  isUnlocked: boolean;
  isEquipped: boolean;
  minLevel?: number;
}

export interface DailyQuest {
  text: string;
  completed: boolean;
  date: string;
}

export interface ForestState {
  // Developer Level & XP
  level: number;
  xp: number;
  totalXp: number;
  pinecones: number; // Spendable currency

  // Streaks & Shields
  streakDays: number;
  bestStreak: number;
  streakShields: number; // Max 2
  lastShipDate: string | null;
  drought: boolean;

  // Daily #1 Focus Quest
  todayQuest: DailyQuest;

  // Dynamic Island Entities
  trees: TreeData[];
  shipHistory: ShipLog[];
  shopItems: ShopItem[];

  // 3D Weather & Atmosphere
  weather: "sunny" | "rain" | "golden_hour" | "night" | "drought";
  isRaining: boolean;
  timeOfDay: "day" | "sunset" | "night";

  // Actions
  shipToday: (message: string, source?: "github" | "manual", proofUrl?: string, repo?: string) => void;
  setTodayQuest: (text: string) => void;
  completeTodayQuest: () => void;
  buyShopItem: (itemId: string) => boolean;
  toggleEquipItem: (itemId: string) => void;
  addTree: (name: string, mrr?: number, tier?: GrowthTier) => void;
  removeTree: (id: string) => void;
  updateTreeTier: (id: string, tier: GrowthTier) => void;
  setTimeOfDay: (time: "day" | "sunset" | "night") => void;
  triggerRain: (durationMs?: number) => void;
  checkStreakExpiry: () => void;
  resetDemoData: () => void;
}

export function getRankTitle(level: number): { title: string; badge: string } {
  if (level >= 50) return { title: "Forest Monarch", badge: "👑" };
  if (level >= 35) return { title: "Mountain Warden", badge: "🏮" };
  if (level >= 20) return { title: "Island Architect", badge: "🏡" };
  if (level >= 10) return { title: "Shipwright", badge: "🛶" };
  if (level >= 5) return { title: "Code Forager", badge: "🏕️" };
  return { title: "Seedling Scout", badge: "🌲" };
}

export function getXpForLevel(level: number): number {
  return Math.floor(200 * Math.pow(level, 1.35));
}

const DEFAULT_SHOP_ITEMS: ShopItem[] = [
  { id: "campfire", name: "Campfire 🔥", icon: "🔥", cost: 0, description: "Warm cozy fire pit that smokes & glows", isUnlocked: true, isEquipped: true },
  { id: "tent", name: "Camping Tent ⛺", icon: "⛺", cost: 50, description: "Canvas tent for all-night coding sessions", isUnlocked: false, isEquipped: false, minLevel: 5 },
  { id: "lantern", name: "Solar Lantern 🏮", icon: "🏮", cost: 35, description: "Rustic iron lantern post to light the path", isUnlocked: false, isEquipped: false },
  { id: "stone_path", name: "Cobblestone Path 🪨", icon: "🪨", cost: 30, description: "Neat stone pavers winding to the pond", isUnlocked: false, isEquipped: false },
  { id: "cabin", name: "Log Cabin 🏡", icon: "🏡", cost: 120, description: "Rustic timber cabin with smoking chimney", isUnlocked: false, isEquipped: false, minLevel: 10 },
  { id: "pet_fox", name: "Forest Fox 🦊", icon: "🦊", cost: 80, description: "Playful low-poly fox resting by the trees", isUnlocked: false, isEquipped: false },
  { id: "rainbow", name: "Rainbow Arc 🌈", icon: "🌈", cost: 100, description: "Shimmering rainbow over the island pond", isUnlocked: false, isEquipped: false, minLevel: 7 },
];

const INITIAL_TREES: TreeData[] = [
  { id: "tree-1", name: "Demo User (Starter)", mrr: 19, tier: "young", gridX: -2.8, gridZ: -2.8, plantedAt: new Date().toISOString(), isDemo: true },
  { id: "tree-2", name: "Pro Plan Customer", mrr: 49, tier: "mature", gridX: -2.8, gridZ: 2.8, plantedAt: new Date().toISOString(), isDemo: true },
  { id: "tree-3", name: "SaaS Believer", mrr: 99, tier: "majestic", gridX: 2.8, gridZ: -2.8, plantedAt: new Date().toISOString(), isDemo: true },
  { id: "tree-4", name: "New Early Adopter", mrr: 15, tier: "sapling", gridX: 2.8, gridZ: 2.8, plantedAt: new Date().toISOString(), isDemo: true },
];

export const useForestStore = create<ForestState>()(
  persist(
    (set, get) => ({
      level: 1,
      xp: 0,
      totalXp: 0,
      pinecones: 50, // Starter bonus

      streakDays: 1,
      bestStreak: 1,
      streakShields: 1,
      lastShipDate: null,
      drought: false,

      todayQuest: {
        text: "Launch 3D isometric IndieForest canvas & core game loop",
        completed: false,
        date: new Date().toISOString().split("T")[0],
      },

      trees: INITIAL_TREES,
      shipHistory: [],
      shopItems: DEFAULT_SHOP_ITEMS,

      weather: "sunny",
      isRaining: false,
      timeOfDay: "day",

      shipToday: (message, source = "manual", proofUrl, repo) => {
        const todayStr = new Date().toISOString().split("T")[0];
        const state = get();

        // Prevent duplicate daily streak counter if already shipped today
        const alreadyShippedToday = state.lastShipDate === todayStr;
        const newStreak = alreadyShippedToday ? state.streakDays : state.streakDays + 1;
        const newBestStreak = Math.max(newStreak, state.bestStreak);

        // XP Calculation: Base 100 XP + streak bonus + proof bonus
        const streakBonus = Math.min(newStreak * 10, 150);
        const proofBonus = proofUrl ? 25 : 0;
        const xpEarned = 100 + streakBonus + proofBonus;

        // Pinecone Currency: +10 base, +25 on 7-day milestone
        let earnedPinecones = 10;
        if (newStreak > 0 && newStreak % 7 === 0 && !alreadyShippedToday) {
          earnedPinecones += 25;
        }

        // Streak Shield Bonus: 1 free shield every 7-day streak (capped at 2)
        let newShields = state.streakShields;
        if (newStreak > 0 && newStreak % 7 === 0 && !alreadyShippedToday) {
          newShields = Math.min(newShields + 1, 2);
        }

        // Calculate Level Up
        let currentXp = state.xp + xpEarned;
        let currentLevel = state.level;
        let didLevelUp = false;

        while (currentXp >= getXpForLevel(currentLevel)) {
          currentXp -= getXpForLevel(currentLevel);
          currentLevel += 1;
          earnedPinecones += 50; // Level up reward!
          didLevelUp = true;
        }

        const newShipLog: ShipLog = {
          id: `ship-${Date.now()}`,
          date: new Date().toISOString(),
          message: message.trim() || "Pushed code update to GitHub",
          source,
          xpGained: xpEarned,
          proofUrl: proofUrl?.trim(),
          repo,
        };

        // Sound trigger
        if (didLevelUp) {
          sound.playLevelUp();
        } else {
          sound.playShipSuccess();
        }

        set({
          xp: currentXp,
          totalXp: state.totalXp + xpEarned,
          level: currentLevel,
          pinecones: state.pinecones + earnedPinecones,
          streakDays: newStreak,
          bestStreak: newBestStreak,
          streakShields: newShields,
          lastShipDate: todayStr,
          drought: false,
          shipHistory: [newShipLog, ...state.shipHistory].slice(0, 50),
          isRaining: true,
        });

        // Turn off rain after 4.5s
        setTimeout(() => {
          set({ isRaining: false });
        }, 4500);
      },

      setTodayQuest: (text) => {
        set({
          todayQuest: {
            text: text.trim(),
            completed: false,
            date: new Date().toISOString().split("T")[0],
          },
        });
      },

      completeTodayQuest: () => {
        const state = get();
        if (state.todayQuest.completed) return;

        const xpEarned = 50;
        let currentXp = state.xp + xpEarned;
        let currentLevel = state.level;
        let didLevelUp = false;
        let earnedPinecones = 10;

        while (currentXp >= getXpForLevel(currentLevel)) {
          currentXp -= getXpForLevel(currentLevel);
          currentLevel += 1;
          earnedPinecones += 50;
          didLevelUp = true;
        }

        if (didLevelUp) {
          sound.playLevelUp();
        } else {
          sound.playCoin();
        }

        set({
          todayQuest: {
            ...state.todayQuest,
            completed: true,
          },
          xp: currentXp,
          totalXp: state.totalXp + xpEarned,
          level: currentLevel,
          pinecones: state.pinecones + earnedPinecones,
        });
      },

      buyShopItem: (itemId) => {
        const state = get();
        const item = state.shopItems.find((i) => i.id === itemId);
        if (!item || item.isUnlocked || state.pinecones < item.cost) {
          return false;
        }

        sound.playCoin();

        set({
          pinecones: state.pinecones - item.cost,
          shopItems: state.shopItems.map((i) => (i.id === itemId ? { ...i, isUnlocked: true, isEquipped: true } : i)),
        });
        return true;
      },

      toggleEquipItem: (itemId) => {
        const state = get();
        sound.playClick();
        set({
          shopItems: state.shopItems.map((i) => (i.id === itemId && i.isUnlocked ? { ...i, isEquipped: !i.isEquipped } : i)),
        });
      },

      addTree: (name, mrr = 15, tier = "sapling") => {
        const state = get();
        const coords = [
          [-2.2, -1.2],
          [2.2, -1.2],
          [-1.2, -2.5],
          [1.2, -2.5],
          [-2.5, 1.2],
          [2.5, 1.2],
        ];
        const nextCoord = coords[state.trees.length % coords.length] || [0, 2.5];

        const newTree: TreeData = {
          id: `tree-${Date.now()}`,
          name: name.trim() || "Customer",
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

        const today = new Date();
        const lastShip = new Date(state.lastShipDate);
        const diffDays = Math.floor((today.getTime() - lastShip.getTime()) / (1000 * 3600 * 24));

        if (diffDays > 1) {
          // Missed at least 1 full day!
          if (state.streakShields > 0) {
            // Shield protects streak!
            set({
              streakShields: state.streakShields - 1,
              lastShipDate: new Date(today.getTime() - 1000 * 3600 * 24).toISOString().split("T")[0],
            });
          } else {
            // Drought mode activated! Streak resets
            set({
              streakDays: 0,
              drought: true,
            });
          }
        }
      },

      resetDemoData: () => {
        set({
          level: 1,
          xp: 0,
          totalXp: 0,
          pinecones: 50,
          streakDays: 1,
          bestStreak: 1,
          streakShields: 1,
          lastShipDate: null,
          drought: false,
          trees: INITIAL_TREES,
          shipHistory: [],
          shopItems: DEFAULT_SHOP_ITEMS,
        });
      },
    }),
    {
      name: "indieforest_storage_v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
