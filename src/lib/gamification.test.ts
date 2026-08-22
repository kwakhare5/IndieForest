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

  it("calculates dual-grove slot coordinates for shipping and revenue", () => {
    const ship0 = getTreeSlotCoordinate(0, "shipping");
    expect(ship0.gridX).toBeLessThan(0); // West pasture
    expect(typeof ship0.gridZ).toBe("number");

    const rev0 = getTreeSlotCoordinate(0, "revenue");
    expect(rev0.gridX).toBeGreaterThan(0); // East pasture
    expect(typeof rev0.gridZ).toBe("number");

    // Clear of campsite on South-West and pond on South-East
    const ship3 = getTreeSlotCoordinate(3, "shipping");
    expect(ship3.gridX).toBeLessThan(0);
    const rev3 = getTreeSlotCoordinate(3, "revenue");
    expect(rev3.gridX).toBeGreaterThan(0);

    // Algorithmic expansion for large forests (level 20+)
    const ship10 = getTreeSlotCoordinate(10, "shipping");
    expect(ship10.gridX).toBeLessThan(0);
    expect(typeof ship10.gridZ).toBe("number");

    const rev10 = getTreeSlotCoordinate(10, "revenue");
    expect(rev10.gridX).toBeGreaterThan(0);
    expect(typeof rev10.gridZ).toBe("number");
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


