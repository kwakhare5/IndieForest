// Core Domain Math & Algorithms for IndieForest

import type {
  GrowthTier,
  ShipRewardInput,
  ShipRewards,
  LevelProgressInput,
  LevelProgressOutput,
  StreakEvaluationInput,
  StreakEvaluationOutput,
  ForestHealth,
  Rank,
} from "@/types/game";

export const RANK_TIERS: Rank[] = [
  { title: "Sprout Planter", badge: "I" },
  { title: "Grove Cultivator", badge: "II" },
  { title: "Timber Craftsman", badge: "III" },
  { title: "Island Architect", badge: "IV" },
  { title: "Forest Sovereign", badge: "V" },
];

export function getRankTitle(level: number): Rank {
  if (level <= 3) return RANK_TIERS[0];
  if (level <= 7) return RANK_TIERS[1];
  if (level <= 12) return RANK_TIERS[2];
  if (level <= 19) return RANK_TIERS[3];
  return RANK_TIERS[4];
}

export function getXpForLevel(level: number): number {
  return 100 + (level - 1) * 50;
}

export function calculateTreeTier(
  type: "shipping" | "revenue",
  value: number,
  options?: { isChurn?: boolean; isArchived?: boolean; activeDays?: number }
): GrowthTier {
  if (options?.isChurn || options?.isArchived) {
    return "stump";
  }

  if (type === "shipping") {
    if (options?.activeDays && options.activeDays < 3 && value >= 25) {
      return "young";
    }
    if (value >= 60) return "majestic";
    if (value >= 25) return "mature";
    if (value >= 8) return "young";
    return "sapling";
  } else {
    if (value >= 2000) return "majestic";
    if (value >= 500) return "mature";
    if (value >= 50) return "young";
    return "sapling";
  }
}

export function calculateShipRewards(input: ShipRewardInput): ShipRewards {
  let xp = 100;
  let shields = 0;

  if (input.streakDays >= 30) {
    xp += 100;
  } else if (input.streakDays >= 14) {
    xp += 50;
  } else if (input.streakDays >= 7) {
    xp += 25;
  }

  if (input.hasProofUrl) {
    xp += 25;
  }

  if (input.isMilestoneDay && (input.currentShields ?? 0) < 2) {
    shields = 1;
  }

  return {
    xpGained: xp,
    shieldsGained: shields,
  };
}

export function evaluateLevelProgress(input: LevelProgressInput): LevelProgressOutput {
  let level = input.currentLevel;
  let xp = input.currentXp + input.earnedXp;
  let didLevelUp = false;

  while (true) {
    const requiredXp = getXpForLevel(level);
    if (xp >= requiredXp) {
      xp -= requiredXp;
      level += 1;
      didLevelUp = true;
    } else {
      break;
    }
  }

  return { level, xp, didLevelUp };
}

export function evaluateStreakState(input: StreakEvaluationInput): StreakEvaluationOutput {
  if (!input.lastShipDate) {
    return {
      streakDays: 0,
      streakShields: input.currentShields,
      drought: false,
    };
  }

  const last = new Date(input.lastShipDate);
  const today = new Date(input.todayDate);

  const lastUtc = Date.UTC(last.getUTCFullYear(), last.getUTCMonth(), last.getUTCDate());
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate());

  const diffDays = Math.floor((todayUtc - lastUtc) / (1000 * 60 * 60 * 24));

  if (diffDays <= 1) {
    return {
      streakDays: input.currentStreak,
      streakShields: input.currentShields,
      drought: false,
    };
  }

  const missedDays = diffDays - 1;

  if (missedDays <= input.currentShields) {
    return {
      streakDays: input.currentStreak,
      streakShields: input.currentShields - missedDays,
      drought: false,
    };
  }

  return {
    streakDays: 0,
    streakShields: 0,
    drought: true,
  };
}

export function calculateForestHealth(
  activeShippingDates: string[],
  evaluationDateStr?: string
): ForestHealth {
  const evalDate = evaluationDateStr ? new Date(evaluationDateStr) : new Date();
  const evalUtc = Date.UTC(evalDate.getUTCFullYear(), evalDate.getUTCMonth(), evalDate.getUTCDate());

  const uniquePast30Days = new Set<string>();

  for (const dateStr of activeShippingDates) {
    const d = new Date(dateStr);
    const dUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const diff = Math.floor((evalUtc - dUtc) / (1000 * 60 * 60 * 24));

    if (diff >= 0 && diff < 30) {
      uniquePast30Days.add(dateStr.slice(0, 10));
    }
  }

  const activeDaysCount = uniquePast30Days.size;
  const healthPercent = Math.min(100, Math.round((activeDaysCount / 30) * 100));

  let status: ForestHealth["status"] = "drought";
  let label = "Drought (<50%)";
  let badgeClass = "badge-drought";

  if (healthPercent >= 90) {
    status = "pristine";
    label = "Pristine";
    badgeClass = "badge-pristine";
  } else if (healthPercent >= 75) {
    status = "lush";
    label = "Lush";
    badgeClass = "badge-lush";
  } else if (healthPercent >= 50) {
    status = "dormant";
    label = "Dormant";
    badgeClass = "badge-dormant";
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

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getTreeSlotCoordinate(index: number): { gridX: number; gridZ: number } {
  const row = Math.floor(index / 4);
  const col = index % 4;
  return {
    gridX: (col - 1.5) * 2,
    gridZ: (row - 1.5) * 2,
  };
}
