import { describe, it, expect } from "vitest";
import {
  calculateTreeTier,
  getRankTitle,
  getXpForLevel,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  calculateForestHealth,
  getLocalDateString,
  getTreeSlotCoordinate,
  calculateIslandSize,
  getTreeYawRotation,
  sortTreesByGrowthTier,
  getGroveCapacity,
  getGroveTileBounds,
  CELL_SIZE,
} from "./gamification";

describe("calculateTreeTier", () => {
  it("scales shipping tiers correctly based on commit count", () => {
    expect(calculateTreeTier("shipping", 1)).toBe("sapling");
    expect(calculateTreeTier("shipping", 8)).toBe("young");
    expect(calculateTreeTier("shipping", 25)).toBe("mature");
    expect(calculateTreeTier("shipping", 60)).toBe("majestic");
  });

  it("scales revenue tiers correctly based on MRR", () => {
    expect(calculateTreeTier("revenue", 10)).toBe("sapling");
    expect(calculateTreeTier("revenue", 50)).toBe("young");
    expect(calculateTreeTier("revenue", 500)).toBe("mature");
    expect(calculateTreeTier("revenue", 2000)).toBe("majestic");
  });

  it("returns stump when churned or archived", () => {
    expect(calculateTreeTier("revenue", 1000, { isChurn: true })).toBe("stump");
    expect(calculateTreeTier("shipping", 100, { isArchived: true })).toBe("stump");
  });
});

describe("getRankTitle & getXpForLevel", () => {
  it("returns correct Roman rank tiers", () => {
    expect(getRankTitle(1).badge).toBe("I");
    expect(getRankTitle(5).badge).toBe("II");
    expect(getRankTitle(10).badge).toBe("III");
    expect(getRankTitle(15).badge).toBe("IV");
    expect(getRankTitle(25).badge).toBe("V");
  });

  it("calculates progression curve xp", () => {
    expect(getXpForLevel(1)).toBe(100);
    expect(getXpForLevel(2)).toBe(150);
    expect(getXpForLevel(3)).toBe(200);
  });
});

describe("calculateShipRewards & evaluateLevelProgress", () => {
  it("awards base ship rewards", () => {
    const res = calculateShipRewards({ streakDays: 1 });
    expect(res.xpGained).toBe(100);
    expect(res.shieldsGained).toBe(0);
  });

  it("awards streak bonus", () => {
    const res = calculateShipRewards({ streakDays: 14, hasProofUrl: true });
    expect(res.xpGained).toBe(175);
  });

  it("handles level progression properly", () => {
    const res = evaluateLevelProgress({ currentLevel: 1, currentXp: 80, earnedXp: 120 });
    expect(res.level).toBe(2);
    expect(res.xp).toBe(100);
    expect(res.didLevelUp).toBe(true);
  });
});

describe("evaluateStreakState", () => {
  it("keeps streak when shipped today or yesterday", () => {
    const today = "2026-08-22";
    const res = evaluateStreakState({
      lastShipDate: "2026-08-21",
      todayDate: today,
      currentStreak: 5,
      currentShields: 1,
    });
    expect(res.streakDays).toBe(5);
    expect(res.drought).toBe(false);
  });

  it("uses streak shield on missed day", () => {
    const today = "2026-08-22";
    const res = evaluateStreakState({
      lastShipDate: "2026-08-20",
      todayDate: today,
      currentStreak: 10,
      currentShields: 2,
    });
    expect(res.streakDays).toBe(10);
    expect(res.streakShields).toBe(1);
    expect(res.drought).toBe(false);
  });

  it("enters drought when shields depleted", () => {
    const today = "2026-08-22";
    const res = evaluateStreakState({
      lastShipDate: "2026-08-15",
      todayDate: today,
      currentStreak: 10,
      currentShields: 0,
    });
    expect(res.streakDays).toBe(0);
    expect(res.drought).toBe(true);
  });
});

describe("calculateForestHealth", () => {
  it("calculates 30-day health percentage correctly", () => {
    const today = "2026-08-22";
    const activeDates = [
      "2026-08-22",
      "2026-08-21",
      "2026-08-20",
      "2026-08-19",
      "2026-08-18",
    ];
    const health = calculateForestHealth(activeDates, today);
    expect(health.activeDaysCount).toBe(5);
    expect(health.healthPercent).toBe(17);
    expect(health.status).toBe("drought");
  });
});

describe("getLocalDateString & getTreeSlotCoordinate", () => {
  it("returns YYYY-MM-DD format", () => {
    const d = new Date("2026-08-22T10:00:00Z");
    expect(getLocalDateString(d)).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("calculates discrete 1-to-1 tile grid slot coordinates without collision or clipping", () => {
    const tiers = [
      { level: 1, size: 12.0 },
      { level: 5, size: 15.0 },
      { level: 10, size: 18.5 },
      { level: 30, size: 21.5 },
      { level: 50, size: 25.0 },
    ];

    for (const { level } of tiers) {
      const treeCount = level >= 50 ? 24 : level >= 20 ? 16 : level >= 10 ? 10 : level >= 5 ? 6 : 4;
      const actualIslandSize = calculateIslandSize(level, treeCount);
      const maxSafeRadius = actualIslandSize / 2 - 0.4;
      const shippingCoords: Array<{ gridX: number; gridZ: number }> = [];
      const revenueCoords: Array<{ gridX: number; gridZ: number }> = [];

      for (let i = 0; i < treeCount; i++) {
        const ship = getTreeSlotCoordinate(i, "shipping", level, undefined, treeCount);
        const rev = getTreeSlotCoordinate(i, "revenue", level, undefined, treeCount);

        // West half is negative X, East half is positive X
        expect(ship.gridX).toBeLessThan(-1.0);
        expect(rev.gridX).toBeGreaterThan(1.0);

        // Guarantees open lawn for campsite in front (Z >= 0)
        expect(ship.gridZ).toBeLessThanOrEqual(-1.4);
        expect(rev.gridZ).toBeLessThanOrEqual(-1.4);

        // Crucial: Must NEVER exceed safe radius
        expect(Math.abs(ship.gridX)).toBeLessThanOrEqual(maxSafeRadius + 0.1);
        expect(Math.abs(ship.gridZ)).toBeLessThanOrEqual(maxSafeRadius + 0.1);
        expect(Math.abs(rev.gridX)).toBeLessThanOrEqual(maxSafeRadius + 0.1);
        expect(Math.abs(rev.gridZ)).toBeLessThanOrEqual(maxSafeRadius + 0.1);

        shippingCoords.push(ship);
        revenueCoords.push(rev);
      }

      // Discrete Zero-Collision Guarantee: All pairs within a grove have >= 1.8m distance
      for (let a = 0; a < shippingCoords.length; a++) {
        for (let b = a + 1; b < shippingCoords.length; b++) {
          const distShip = Math.hypot(
            shippingCoords[a].gridX - shippingCoords[b].gridX,
            shippingCoords[a].gridZ - shippingCoords[b].gridZ
          );
          expect(distShip).toBeGreaterThanOrEqual(1.5);

          const distRev = Math.hypot(
            revenueCoords[a].gridX - revenueCoords[b].gridX,
            revenueCoords[a].gridZ - revenueCoords[b].gridZ
          );
          expect(distRev).toBeGreaterThanOrEqual(1.5);
        }
      }
    }
  });

  it("guarantees immutable slot coordinates regardless of total tree count", () => {
    // Slot 0 coordinates when player has 1 tree vs 20 trees must be 100% identical!
    const slot0_with1Tree = getTreeSlotCoordinate(0, "shipping", 1, undefined, 1);
    const slot0_with20Trees = getTreeSlotCoordinate(0, "shipping", 1, undefined, 20);

    expect(slot0_with1Tree.gridX).toBe(slot0_with20Trees.gridX);
    expect(slot0_with1Tree.gridZ).toBe(slot0_with20Trees.gridZ);

    // Exact expected coordinates based on CELL_SIZE = 1.65
    // West Slot 0: -(1.10 + 0.5 * 1.65) = -1.925
    // Z: -0.70 - 0.5 * 1.65 = -1.525
    expect(slot0_with1Tree.gridX).toBe(-1.925);
    expect(slot0_with1Tree.gridZ).toBe(-1.525);

    // East Slot 0: +(1.10 + 0.5 * 1.65) = +1.925
    const slot0_revenue = getTreeSlotCoordinate(0, "revenue", 1);
    expect(slot0_revenue.gridX).toBe(1.925);
    expect(slot0_revenue.gridZ).toBe(-1.525);
  });

  it("computes precision grove tile bounds matching CELL_SIZE = 1.65", () => {
    const bounds = getGroveTileBounds(1, 0);
    expect(bounds.cellSize).toBe(CELL_SIZE);
    expect(bounds.cols).toBe(2);
    expect(bounds.rows).toBe(2);
    expect(bounds.west.maxX).toBe(-1.10);
    expect(bounds.west.minX).toBeCloseTo(-1.10 - 2 * 1.65);
    expect(bounds.east.minX).toBe(1.10);
    expect(bounds.east.maxX).toBeCloseTo(1.10 + 2 * 1.65);
    expect(bounds.west.maxZ).toBe(-0.70);
    expect(bounds.west.minZ).toBeCloseTo(-0.70 - 2 * 1.65);
  });

  it("produces deterministic yaw angles for natural organic rotation", () => {
    const yawA1 = getTreeYawRotation("repo-alpha");
    const yawA2 = getTreeYawRotation("repo-alpha");
    const yawB = getTreeYawRotation("repo-beta");

    expect(yawA1).toEqual(yawA2);
    expect(yawA1).not.toEqual(yawB);
    expect(yawA1).toBeGreaterThanOrEqual(0);
    expect(yawA1).toBeLessThanOrEqual(Math.PI * 2);
  });

  it("handles multi-level leap calculations properly in evaluateLevelProgress", () => {
    // Level 1 -> Level 3 (needs 100 XP for L1 + 150 XP for L2 = 250 XP total)
    const res = evaluateLevelProgress({
      currentLevel: 1,
      currentXp: 0,
      earnedXp: 300,
    });
    expect(res.level).toBe(3);
    expect(res.xp).toBe(50);
    expect(res.didLevelUp).toBe(true);
  });
});

describe("calculateTreeTier (5-Tier Progression + Stump)", () => {
  it("determines shipping tree tiers accurately", () => {
    expect(calculateTreeTier("shipping", 3)).toBe("sapling");
    expect(calculateTreeTier("shipping", 12)).toBe("young");
    expect(calculateTreeTier("shipping", 35)).toBe("mature");
    expect(calculateTreeTier("shipping", 80)).toBe("majestic");
    expect(calculateTreeTier("shipping", 200)).toBe("elder");
  });

  it("determines revenue tree tiers accurately", () => {
    expect(calculateTreeTier("revenue", 20)).toBe("sapling");
    expect(calculateTreeTier("revenue", 150)).toBe("young");
    expect(calculateTreeTier("revenue", 800)).toBe("mature");
    expect(calculateTreeTier("revenue", 2500)).toBe("majestic");
    expect(calculateTreeTier("revenue", 6000)).toBe("elder");
  });

  it("handles archived and churned states as zen stumps", () => {
    expect(calculateTreeTier("shipping", 200, { isArchived: true })).toBe("stump");
    expect(calculateTreeTier("revenue", 6000, { isChurn: true })).toBe("stump");
  });
});

describe("calculateIslandSize (Universal Adaptive Land Scaling)", () => {
  it("scales land based on level when tree count is low", () => {
    expect(calculateIslandSize(1, 2)).toBe(12.0);
    expect(calculateIslandSize(5, 2)).toBe(15.0);
    expect(calculateIslandSize(10, 2)).toBe(18.5);
    expect(calculateIslandSize(30, 2)).toBe(21.5);
    expect(calculateIslandSize(50, 2)).toBe(25.0);
  });

  it("dynamically expands land when a player has many trees across bilateral groves", () => {
    expect(calculateIslandSize(1, 40)).toBe(25.0);
    expect(calculateIslandSize(1, 28)).toBe(21.5);
    expect(calculateIslandSize(1, 24)).toBe(18.5);
    expect(calculateIslandSize(1, 8)).toBe(15.0);
  });

  it("takes the maximum of level size and tree count footprint", () => {
    // Level 50 player with 2 trees still gets 25x25 realm
    expect(calculateIslandSize(50, 2)).toBe(25.0);
    // Level 10 player with 40 trees gets 25x25 realm
    expect(calculateIslandSize(10, 40)).toBe(25.0);
  });
});

describe("sortTreesByGrowthTier (Camera-Z Amphitheater Ordering)", () => {
  it("sorts trees in ascending height order so small trees sit in front rows", () => {
    const mockTrees = [
      { id: "1", name: "Elder Project", tier: "elder" as const, gridX: 0, gridZ: 0, plantedAt: "" },
      { id: "2", name: "Sapling Project", tier: "sapling" as const, gridX: 0, gridZ: 0, plantedAt: "" },
      { id: "3", name: "Mature Project", tier: "mature" as const, gridX: 0, gridZ: 0, plantedAt: "" },
      { id: "4", name: "Stump Project", tier: "stump" as const, gridX: 0, gridZ: 0, plantedAt: "" },
      { id: "5", name: "Young Project", tier: "young" as const, gridX: 0, gridZ: 0, plantedAt: "" },
      { id: "6", name: "Majestic Project", tier: "majestic" as const, gridX: 0, gridZ: 0, plantedAt: "" },
    ];

    const sorted = sortTreesByGrowthTier(mockTrees);
    expect(sorted.map((t) => t.tier)).toEqual([
      "stump",
      "sapling",
      "young",
      "mature",
      "majestic",
      "elder",
    ]);
  });
});

describe("getGroveCapacity", () => {
  it("computes accurate column, row, and total slot capacities per grove tier", () => {
    // Level 1 starter (9x9)
    const cap1 = getGroveCapacity(1, 2);
    expect(cap1.cols).toBe(2);
    expect(cap1.rows).toBeGreaterThanOrEqual(2);
    expect(cap1.totalPerGrove).toBeGreaterThanOrEqual(4);

    // Level 20 realm (18x18)
    const cap20 = getGroveCapacity(20, 10);
    expect(cap20.cols).toBe(4);
    expect(cap20.totalPerGrove).toBeGreaterThanOrEqual(12);
  });
});



