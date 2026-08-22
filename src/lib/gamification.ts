// Clean Code Gamification Domain Module — Pure Functions & Zero Side Effects

import type {
  GrowthTier,
  TreeType,
  TreeData,
  CampDecorItem,
  DailyQuest,
  Rank,
  ShipRewardInput,
  ShipRewards,
  LevelProgressInput,
  LevelProgressOutput,
  StreakEvaluationInput,
  StreakEvaluationOutput,
} from "@/types/game";


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

// 16 Non-Overlapping Canonical Radial Coordinate Slots on Island Surface
// Strictly mapped to North and Mid quadrants (Z <= 0.8) so South (Z > 1.2) remains dedicated to Campsite, Pond & Pier
export const WEST_EMERALD_SLOTS: Array<[number, number]> = [
  [-1.2, -0.8],
  [-2.2, -0.6],
  [-1.2, -2.2],
  [-2.4, -2.0],
  [-1.6, 0.6],
  [-2.8, 0.4],
  [-0.6, -1.5],
  [-2.8, -1.2],
];

export const EAST_GOLDEN_SLOTS: Array<[number, number]> = [
  [1.2, -0.8],
  [2.2, -0.6],
  [1.2, -2.2],
  [2.4, -2.0],
  [1.6, 0.6],
  [2.8, 0.4],
  [0.6, -1.5],
  [2.8, -1.2],
];

/**
 * Returns a deterministic, non-overlapping coordinate slot for a tree.
 */
export function getTreeSlotCoordinate(type: TreeType, index: number): [number, number] {
  const slots = type === "shipping" ? WEST_EMERALD_SLOTS : EAST_GOLDEN_SLOTS;
  return slots[index % slots.length] || [0, 2.2];
}

/**
 * Returns a local date string in YYYY-MM-DD format based on local calendar time.
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

/**
 * Smart Proof-of-Ship: Calculates tree tier authentically from commit count (or MRR)
 * dual-gated by distinct active calendar days to prevent single-day commit spamming.
 */
export function calculateTreeTier(
  type: TreeType,
  commits: number = 0,
  mrr: number = 0,
  activeDays: number = 1
): { tier: GrowthTier; nextTierTarget: number; progressPercent: number; nextTierLabel: string } {
  if (type === "revenue") {
    if (mrr >= 2000) return { tier: "majestic", nextTierTarget: 2000, progressPercent: 100, nextTierLabel: "Max Level" };
    if (mrr >= 500) return { tier: "mature", nextTierTarget: 2000, progressPercent: Math.min(Math.round(((mrr - 500) / 1500) * 100), 100), nextTierLabel: "Majestic ($2,000 MRR)" };
    if (mrr >= 50) return { tier: "young", nextTierTarget: 500, progressPercent: Math.min(Math.round(((mrr - 50) / 450) * 100), 100), nextTierLabel: "Mature ($500 MRR)" };
    if (mrr > 0) return { tier: "sapling", nextTierTarget: 50, progressPercent: Math.min(Math.round((mrr / 50) * 100), 100), nextTierLabel: "Young ($50 MRR)" };
    return { tier: "stump", nextTierTarget: 50, progressPercent: 0, nextTierLabel: "Sapling ($50 MRR)" };
  }

  // Shipping Tree Progression: Dual-gated by Commits AND Active Calendar Days
  const effectiveDays = Math.max(activeDays, 1);
  if (commits >= 60 && effectiveDays >= 15) {
    return { tier: "majestic", nextTierTarget: 60, progressPercent: 100, nextTierLabel: "Max Tier (Majestic Pine)" };
  }
  if (commits >= 25 && effectiveDays >= 7) {
    return { tier: "mature", nextTierTarget: 60, progressPercent: Math.min(Math.round(((commits - 25) / 35) * 100), 100), nextTierLabel: "Majestic Pine (60 Commits & 15d)" };
  }
  if (commits >= 8 && effectiveDays >= 3) {
    return { tier: "young", nextTierTarget: 25, progressPercent: Math.min(Math.round(((commits - 8) / 17) * 100), 100), nextTierLabel: "Mature Pine (25 Commits & 7d)" };
  }
  if (commits > 0) {
    return { tier: "sapling", nextTierTarget: 8, progressPercent: Math.min(Math.round((commits / 8) * 100), 100), nextTierLabel: "Young Pine (8 Commits & 3d)" };
  }
  return { tier: "stump", nextTierTarget: 8, progressPercent: 0, nextTierLabel: "Sapling (1 Commit)" };
}

/**
 * Reconstructs the 3D Island state up to a specified historical cutoff date for the Timeline Scrubber.
 */
export function reconstructHistoricalIsland(
  allTrees: TreeData[],
  cutoffDateStr: string
): TreeData[] {
  const cutoffTime = new Date(cutoffDateStr).getTime();
  if (isNaN(cutoffTime)) return allTrees;

  return allTrees
    .filter((tree) => new Date(tree.plantedAt).getTime() <= cutoffTime)
    .map((tree) => {
      // Scale down tier if historical commits were lower
      return tree;
    });
}

/**
 * Calculates the rolling 30-day Forest Health % (Consistency Metric).
 * Health % = (Active Shipping Days in past 30 days / 30) * 100
 */
export function calculateForestHealth(
  activeDates: string[],
  todayStr: string = getLocalDateString()
): {
  healthPercent: number;
  activeDaysCount: number;
  totalDaysEvaluated: number;
  status: "pristine" | "lush" | "dormant" | "drought";
  label: string;
  badgeClass: string;
} {
  const today = new Date(todayStr);
  const thirtyDaysAgo = new Date(today.getTime() - 30 * 86400000);

  // Extract unique active days falling strictly within the rolling 30-day window
  const uniqueActiveDaysInWindow = Array.from(
    new Set(
      activeDates
        .map((d) => d.slice(0, 10))
        .filter((d) => {
          const dateObj = new Date(d);
          return dateObj >= thirtyDaysAgo && dateObj <= today;
        })
    )
  );

  const activeDaysCount = uniqueActiveDaysInWindow.length;
  const healthPercent = Math.min(Math.round((activeDaysCount / 30) * 100), 100);

  let status: "pristine" | "lush" | "dormant" | "drought" = "drought";
  let label = "Drought";
  let badgeClass = "bg-stone-500/10 text-stone-600 border-stone-300";

  if (healthPercent >= 90) {
    status = "pristine";
    label = "Pristine";
    badgeClass = "bg-emerald-500/10 text-emerald-700 border-emerald-300 shadow-xs";
  } else if (healthPercent >= 75) {
    status = "lush";
    label = "Lush";
    badgeClass = "bg-teal-500/10 text-teal-700 border-teal-300";
  } else if (healthPercent >= 50) {
    status = "dormant";
    label = "Dormant";
    badgeClass = "bg-amber-500/10 text-amber-700 border-amber-300";
  } else {
    status = "drought";
    label = "Drought";
    badgeClass = "bg-stone-500/10 text-stone-600 border-stone-300";
  }

  return {
    healthPercent,
    activeDaysCount,
    totalDaysEvaluated: 30,
    status,
    label,
    badgeClass,
  };
}
