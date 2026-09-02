// Core Domain Math & Algorithms for IndieForest

import type {
  GrowthTier,
  TreeType,
  TreeData,
  ShipRewardInput,
  ShipRewards,
  LevelProgressInput,
  LevelProgressOutput,
  StreakEvaluationInput,
  StreakEvaluationOutput,
  ForestHealth,
  Rank,
  DailyQuest,
} from "@/types/game";

export const RANK_TIERS: Rank[] = [
  { title: "Sprout Planter", badge: "I" },
  { title: "Grove Cultivator", badge: "II" },
  { title: "Timber Craftsman", badge: "III" },
  { title: "Island Architect", badge: "IV" },
  { title: "Forest Sovereign", badge: "V" },
];

export const DEFAULT_DAILY_QUESTS: DailyQuest[] = [
  {
    id: "atomic-commit",
    title: "Daily Git Push",
    description: "Push at least 1 verified commit to grow your shipping pines.",
    category: "shipping",
    xpReward: 100,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: "build-in-public",
    title: "Share Proof of Work",
    description: "Export your 1200×675 3D share card or copy your progress tweet.",
    category: "distribution",
    xpReward: 50,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: "customer-touchpoint",
    title: "Revenue Milestone",
    description: "Receive a Stripe/Lemon Squeezy sale or add a revenue project.",
    category: "revenue",
    xpReward: 75,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
  {
    id: "grove-stewardship",
    title: "Deep Work & Focus",
    description: "Play campfire ambient audio or explore a peer builder's island.",
    category: "social",
    xpReward: 30,
    progress: 0,
    target: 1,
    isCompleted: false,
    isClaimed: false,
  },
];

// Deterministic String Hash for Multi-User Jitter & Organic Yaw Variation
export function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Compute Deterministic 360° Yaw Angle from Seed (Project ID or Name)
export function getTreeYawRotation(seedId?: string): number {
  if (!seedId) return 0;
  const hash = hashString(seedId);
  return ((hash % 360) * Math.PI) / 180;
}

// =============================================================================
// Discrete 1-to-1 Isometric Tile Grid System (Single Source of Truth)
// =============================================================================
export const CELL_SIZE = 1.65;         // Fixed 1.65m x 1.65m square per tile
export const RIVER_HALF_WIDTH = 0.75;   // 1.50m total river canal down X = 0
export const RIVER_BANK_MARGIN = 0.35;  // 0.35m stone pebble bank on each side
export const GROVE_FRONT_Z = -0.70;     // Front boundary of tree groves (campsite is Z >= 0.2)

// Single Source of Truth for Island Dimensions across 5 tiers: 12x12, 15x15, 18.5x18.5, 21.5x21.5, 25x25
// Calibrated for a generous 1.55m+ natural lawn perimeter buffer all around
export function calculateIslandSize(level: number = 1, treeCount: number = 0): number {
  const levelSize = level >= 50 ? 25.0 : level >= 30 ? 21.5 : level >= 10 ? 18.5 : level >= 5 ? 15.0 : 12.0;
  // Bilateral groves: treeCount is split across West (Shipping) & East (Revenue) groves
  const countSize = treeCount >= 40 ? 25.0 : treeCount >= 28 ? 21.5 : treeCount >= 16 ? 18.5 : treeCount >= 8 ? 15.0 : 12.0;
  return Math.max(levelSize, countSize);
}

// Grid Capacity & Geometric Bounds per Island Level
export function getGroveCapacity(
  level: number = 1,
  _treeCount: number = 0
): { cols: number; rows: number; totalPerGrove: number } {
  const islandSize = calculateIslandSize(level, _treeCount);
  const cols = islandSize >= 25.0 ? 5 : islandSize >= 21.5 ? 4 : islandSize >= 18.5 ? 4 : islandSize >= 15.0 ? 3 : 2;
  const rows = islandSize >= 25.0 ? 6 : islandSize >= 21.5 ? 5 : islandSize >= 18.5 ? 4 : islandSize >= 15.0 ? 3 : 2;

  return {
    cols,
    rows,
    totalPerGrove: cols * rows,
  };
}

// Precision Grove Boundaries for rendering ground seams and tile beds
export function getGroveTileBounds(level: number = 1, treeCount: number = 0) {
  const { cols, rows } = getGroveCapacity(level, treeCount);
  const bankX = RIVER_HALF_WIDTH + RIVER_BANK_MARGIN; // 1.10m
  const groveWidth = cols * CELL_SIZE;
  const groveLength = rows * CELL_SIZE;

  return {
    cols,
    rows,
    cellSize: CELL_SIZE,
    west: {
      minX: -bankX - groveWidth,
      maxX: -bankX,
      minZ: GROVE_FRONT_Z - groveLength,
      maxZ: GROVE_FRONT_Z,
    },
    east: {
      minX: bankX,
      maxX: bankX + groveWidth,
      minZ: GROVE_FRONT_Z - groveLength,
      maxZ: GROVE_FRONT_Z,
    },
  };
}

// Discrete 1-to-1 Tile Grid Engine: Guaranteed Immutable Slot Coordinates
export function getTreeSlotCoordinate(
  index: number,
  type: "shipping" | "revenue",
  level: number = 1,
  _seedId?: string,
  _treeCount: number = 0
): { gridX: number; gridZ: number } {
  const { cols } = getGroveCapacity(level, _treeCount);
  const col = index % cols;
  const row = Math.floor(index / cols);

  const bankX = RIVER_HALF_WIDTH + RIVER_BANK_MARGIN; // 1.10m
  const sign = type === "revenue" ? 1 : -1;

  // Exact center of cell (row, col)
  const cellCenterX = sign * (bankX + (col + 0.5) * CELL_SIZE);
  const cellCenterZ = GROVE_FRONT_Z - (row + 0.5) * CELL_SIZE;

  return {
    gridX: Number(cellCenterX.toFixed(3)),
    gridZ: Number(cellCenterZ.toFixed(3)),
  };
}

// Precision Cell Bounding Box: Returns the 4 perimeter segments for a tree's tile
export function getTreeCellBoundingBox(
  gridX: number,
  gridZ: number,
  cellSize: number = CELL_SIZE
): Array<{ x1: number; z1: number; x2: number; z2: number }> {
  const half = cellSize / 2;
  const minX = Number((gridX - half).toFixed(3));
  const maxX = Number((gridX + half).toFixed(3));
  const minZ = Number((gridZ - half).toFixed(3));
  const maxZ = Number((gridZ + half).toFixed(3));

  return [
    { x1: minX, z1: minZ, x2: maxX, z2: minZ },
    { x1: maxX, z1: minZ, x2: maxX, z2: maxZ },
    { x1: maxX, z1: maxZ, x2: minX, z2: maxZ },
    { x1: minX, z1: maxZ, x2: minX, z2: minZ },
  ];
}

// Camera-Z Depth Sorting: Ascending order (small to large, front to back)
export function sortTreesByGrowthTier(trees: TreeData[]): TreeData[] {
  const TIER_ORDER: Record<GrowthTier, number> = {
    stump: 0,
    sapling: 1,
    young: 2,
    mature: 3,
    majestic: 4,
    elder: 5,
  };

  return [...trees].sort((a, b) => {
    const tierA = a.tier || "sapling";
    const tierB = b.tier || "sapling";
    const tierDiff = (TIER_ORDER[tierA] ?? 1) - (TIER_ORDER[tierB] ?? 1);
    if (tierDiff !== 0) return tierDiff;
    const metricA = (a.commits || 0) + (a.mrr || 0);
    const metricB = (b.commits || 0) + (b.mrr || 0);
    return metricA - metricB;
  });
}


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
    if (value >= 150) return "elder";
    if (value >= 60) return "majestic";
    if (value >= 25) return "mature";
    if (value >= 8) return "young";
    return "sapling";
  } else {
    if (value >= 5000) return "elder";
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

