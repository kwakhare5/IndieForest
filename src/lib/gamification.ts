// Clean Code Gamification Domain Module — Pure Functions & Zero Side Effects

export type GrowthTier = "sapling" | "young" | "mature" | "majestic" | "stump";
export type TreeType = "shipping" | "revenue";

export interface TreeData {
  id: string;
  name: string;
  type?: TreeType; // "shipping" (emerald) or "revenue" (golden)
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

export interface CampDecorItem {
  id: string;
  name: string;
  icon: "flame" | "lamp" | "pier" | "tent";
  cost: number;
  description: string;
}

export const DEFAULT_CAMP_DECOR_CATALOG: CampDecorItem[] = [
  {
    id: "firepit_stone",
    name: "Stone Firepit",
    icon: "flame",
    cost: 50,
    description: "Hand-laid riverstone ring surrounding the milestone campfire.",
  },
  {
    id: "night_lanterns",
    name: "Night Lanterns",
    icon: "lamp",
    cost: 100,
    description: "Twin wooden lantern posts that glow softly during sunset and night mode.",
  },
  {
    id: "pond_pier",
    name: "Wooden Pond Pier",
    icon: "pier",
    cost: 150,
    description: "Stepped wooden dock extending into the central oasis pond.",
  },
  {
    id: "hammock",
    name: "Cozy Hammock",
    icon: "tent",
    cost: 200,
    description: "Woven canvas hammock hung between two mature pine trees.",
  },
];

export interface DailyQuest {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
}

export interface Rank {
  title: string;
  badge: string;
}

export interface ShipRewardInput {
  streakDays: number;
  hasProofUrl?: boolean;
  isMilestoneDay?: boolean;
  currentShields?: number;
}

export interface ShipRewards {
  xpGained: number;
  pineconesGained: number;
  shieldsGained: number;
}

export interface LevelProgressInput {
  currentLevel: number;
  currentXp: number;
  earnedXp: number;
}

export interface LevelProgressOutput {
  level: number;
  xp: number;
  didLevelUp: boolean;
}

export interface StreakEvaluationInput {
  lastShipDate: string | null;
  todayDate: string;
  currentStreak: number;
  currentShields: number;
}

export interface StreakEvaluationOutput {
  streakDays: number;
  streakShields: number;
  drought: boolean;
}

/**
 * Calculates XP required to advance from the given level.
 * Formula: 200 * (Level ^ 1.35)
 */
export function getXpForLevel(level: number): number {
  return Math.floor(200 * Math.pow(level, 1.35));
}

/**
 * Maps developer level to rank title without emoji slop.
 */
export function getRankTitle(level: number): Rank {
  if (level >= 50) return { title: "Forest Monarch", badge: "VI" };
  if (level >= 35) return { title: "Mountain Warden", badge: "V" };
  if (level >= 20) return { title: "Island Architect", badge: "IV" };
  if (level >= 10) return { title: "Shipwright", badge: "III" };
  if (level >= 5) return { title: "Code Forager", badge: "II" };
  return { title: "Seedling Scout", badge: "I" };
}

/**
 * Calculates XP, Pinecones, and Streak Shields earned on a daily ship.
 */
export function calculateShipRewards(input: ShipRewardInput): ShipRewards {
  const baseReward = 100;
  const streakBonus = Math.min(input.streakDays * 10, 150);
  const proofBonus = input.hasProofUrl ? 25 : 0;
  const totalXp = baseReward + streakBonus + proofBonus;

  let pinecones = 10;
  if (input.isMilestoneDay) {
    pinecones += 25;
  }

  let shieldsEarned = 0;
  if (input.isMilestoneDay && (input.currentShields ?? 0) < 2) {
    shieldsEarned = 1;
  }

  return {
    xpGained: totalXp,
    pineconesGained: pinecones,
    shieldsGained: shieldsEarned,
  };
}

/**
 * Evaluates level increases and excess XP remainder rollover.
 */
export function evaluateLevelProgress(input: LevelProgressInput): LevelProgressOutput {
  let level = input.currentLevel;
  let xp = input.currentXp + input.earnedXp;
  let didLevelUp = false;

  while (xp >= getXpForLevel(level)) {
    xp -= getXpForLevel(level);
    level += 1;
    didLevelUp = true;
  }

  return { level, xp, didLevelUp };
}

/**
 * Evaluates streak status, shield protection, and drought triggers over time.
 */
export function evaluateStreakState(input: StreakEvaluationInput): StreakEvaluationOutput {
  if (!input.lastShipDate) {
    return {
      streakDays: input.currentStreak,
      streakShields: input.currentShields,
      drought: false,
    };
  }

  const lastDate = new Date(input.lastShipDate);
  const today = new Date(input.todayDate);
  const diffDays = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));

  if (diffDays <= 1) {
    return {
      streakDays: input.currentStreak,
      streakShields: input.currentShields,
      drought: false,
    };
  }

  if (input.currentShields > 0) {
    return {
      streakDays: input.currentStreak,
      streakShields: input.currentShields - 1,
      drought: false,
    };
  }

  return {
    streakDays: 0,
    streakShields: 0,
    drought: true,
  };
}

/**
 * Completes a daily quest and computes awarded XP.
 */
export function completeDailyQuest(
  quests: DailyQuest[],
  questId: string
): { success: boolean; xpAwarded: number; updatedQuests: DailyQuest[] } {
  const questIndex = quests.findIndex((q) => q.id === questId);
  if (questIndex === -1 || quests[questIndex].completed) {
    return { success: false, xpAwarded: 0, updatedQuests: quests };
  }

  const updatedQuests = quests.map((q, idx) =>
    idx === questIndex ? { ...q, completed: true } : q
  );

  return {
    success: true,
    xpAwarded: quests[questIndex].xpReward,
    updatedQuests,
  };
}

/**
 * Pure function to purchase a cosmetic camp decor item.
 */
export function purchaseCampDecor(
  unlockedIds: string[],
  currentPinecones: number,
  itemId: string
): { success: boolean; remainingPinecones: number; unlockedIds: string[]; error?: string } {
  if (unlockedIds.includes(itemId)) {
    return { success: false, remainingPinecones: currentPinecones, unlockedIds, error: "Item already unlocked" };
  }

  const item = DEFAULT_CAMP_DECOR_CATALOG.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, remainingPinecones: currentPinecones, unlockedIds, error: "Item not found" };
  }

  if (currentPinecones < item.cost) {
    return { success: false, remainingPinecones: currentPinecones, unlockedIds, error: "Insufficient Pinecones" };
  }

  return {
    success: true,
    remainingPinecones: currentPinecones - item.cost,
    unlockedIds: [...unlockedIds, itemId],
  };
}
