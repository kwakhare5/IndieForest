import { describe, it, expect } from "vitest";
import type { TreeData } from "@/types/game";
import {
  getXpForLevel,
  getRankTitle,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  completeDailyQuest,
  purchaseCampDecor,
  getLocalDateString,
  getTreeSlotCoordinate,
  calculateTreeTier,
  reconstructHistoricalIsland,
  calculateForestHealth,
} from "./gamification";


describe("Gamification Engine — Clean Code & TDD", () => {
  describe("Seam 1: Level & XP Curve", () => {
    it("calculates deterministic XP required for Level 1", () => {
      expect(getXpForLevel(1)).toBe(200);
    });

    it("increases XP requirement smoothly as level increases", () => {
      expect(getXpForLevel(2)).toBeGreaterThan(getXpForLevel(1));
      expect(getXpForLevel(5)).toBeGreaterThan(getXpForLevel(2));
      expect(getXpForLevel(10)).toBeGreaterThan(getXpForLevel(5));
    });

    it("maps developer ranks to correct titles and clean Roman numerals", () => {
      expect(getRankTitle(1)).toEqual({ title: "Seedling Scout", badge: "I" });
      expect(getRankTitle(5)).toEqual({ title: "Code Forager", badge: "II" });
      expect(getRankTitle(10)).toEqual({ title: "Shipwright", badge: "III" });
      expect(getRankTitle(20)).toEqual({ title: "Island Architect", badge: "IV" });
      expect(getRankTitle(35)).toEqual({ title: "Mountain Warden", badge: "V" });
      expect(getRankTitle(50)).toEqual({ title: "Forest Monarch", badge: "VI" });
    });
  });

  describe("Seam 2: Ship Rewards Calculation", () => {
    it("awards base 100 XP and 10 pinecones on day 1", () => {
      const rewards = calculateShipRewards({ streakDays: 1, hasProofUrl: false, isMilestoneDay: false });
      expect(rewards.xpGained).toBe(110);
      expect(rewards.pineconesGained).toBe(10);
      expect(rewards.shieldsGained).toBe(0);
    });

    it("awards proof of work bonus (+25 XP) when proofUrl is provided", () => {
      const rewards = calculateShipRewards({ streakDays: 1, hasProofUrl: true, isMilestoneDay: false });
      expect(rewards.xpGained).toBe(135);
    });

    it("caps streak bonus at +150 XP to prevent runaway inflation", () => {
      const rewards = calculateShipRewards({ streakDays: 30, hasProofUrl: false, isMilestoneDay: false });
      expect(rewards.xpGained).toBe(250);
    });

    it("awards bonus pinecones and a streak shield on 7-day milestone", () => {
      const rewards = calculateShipRewards({ streakDays: 7, hasProofUrl: false, isMilestoneDay: true, currentShields: 0 });
      expect(rewards.pineconesGained).toBe(35);
      expect(rewards.shieldsGained).toBe(1);
    });

    it("caps total shields at 2 maximum", () => {
      const rewards = calculateShipRewards({ streakDays: 14, hasProofUrl: false, isMilestoneDay: true, currentShields: 2 });
      expect(rewards.shieldsGained).toBe(0);
    });
  });

  describe("Seam 3: Level Up & Remainder Rollover", () => {
    it("maintains current level when XP is below threshold", () => {
      const result = evaluateLevelProgress({ currentLevel: 1, currentXp: 50, earnedXp: 50 });
      expect(result.level).toBe(1);
      expect(result.xp).toBe(100);
      expect(result.didLevelUp).toBe(false);
    });

    it("levels up and rolls over excess XP correctly", () => {
      const result = evaluateLevelProgress({ currentLevel: 1, currentXp: 150, earnedXp: 100 });
      expect(result.level).toBe(2);
      expect(result.xp).toBe(50);
      expect(result.didLevelUp).toBe(true);
    });
  });

  describe("Seam 4: Streak Expiry & Burnout Shield Protection", () => {
    it("preserves streak and does not activate drought on same-day or next-day activity", () => {
      const state = evaluateStreakState({
        lastShipDate: "2026-08-19",
        todayDate: "2026-08-20",
        currentStreak: 5,
        currentShields: 1,
      });
      expect(state.streakDays).toBe(5);
      expect(state.streakShields).toBe(1);
      expect(state.drought).toBe(false);
    });

    it("consumes 1 shield to protect streak when 1 day is missed", () => {
      const state = evaluateStreakState({
        lastShipDate: "2026-08-17",
        todayDate: "2026-08-20",
        currentStreak: 12,
        currentShields: 1,
      });
      expect(state.streakDays).toBe(12);
      expect(state.streakShields).toBe(0);
      expect(state.drought).toBe(false);
    });

    it("triggers drought and resets streak to 0 when no shields are left", () => {
      const state = evaluateStreakState({
        lastShipDate: "2026-08-17",
        todayDate: "2026-08-20",
        currentStreak: 12,
        currentShields: 0,
      });
      expect(state.streakDays).toBe(0);
      expect(state.drought).toBe(true);
    });
  });

  describe("Seam 5: Canonical Radial Coordinate Slots", () => {
    it("assigns non-overlapping western coordinates for emerald shipping trees", () => {
      const coord1 = getTreeSlotCoordinate("shipping", 0);
      const coord2 = getTreeSlotCoordinate("shipping", 1);
      expect(coord1[0]).toBeLessThan(0); // West is negative X
      expect(coord1).not.toEqual(coord2);
    });

    it("assigns non-overlapping eastern coordinates for golden revenue trees", () => {
      const coord1 = getTreeSlotCoordinate("revenue", 0);
      const coord2 = getTreeSlotCoordinate("revenue", 1);
      expect(coord1[0]).toBeGreaterThan(0); // East is positive X
      expect(coord1).not.toEqual(coord2);
    });
  });

  describe("Seam 6: Smart Proof-of-Ship Anti-Gaming Formula", () => {
    it("requires both commits and active days to reach Majestic tier", () => {
      const singleDaySpam = calculateTreeTier("shipping", 100, 0, 1);
      expect(singleDaySpam.tier).not.toBe("majestic");

      const legitimateGrowth = calculateTreeTier("shipping", 60, 0, 20);
      expect(legitimateGrowth.tier).toBe("majestic");
    });
  });

  describe("Seam 7: Daily Quests Engine", () => {
    it("completes daily quest and awards XP", () => {
      const quests = [
        { id: "focus_ship", title: "Ship focus", xpReward: 100, completed: false },
      ];
      const result = completeDailyQuest(quests, "focus_ship");
      expect(result.success).toBe(true);
      expect(result.xpAwarded).toBe(100);
      expect(result.updatedQuests[0].completed).toBe(true);
    });
  });

  describe("Seam 8: Pinecone Camp Shop Purchases", () => {
    it("allows purchasing camp items when pinecones are sufficient", () => {
      const result = purchaseCampDecor([], 100, "firepit_stone");
      expect(result.success).toBe(true);
      expect(result.unlockedIds).toContain("firepit_stone");
    });
  });

  describe("Seam 9: Local Calendar Time & Historical Timeline Reconstruction", () => {
    it("formats dates as YYYY-MM-DD", () => {
      const d = getLocalDateString(new Date("2026-08-22T12:00:00Z"));
      expect(d).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("filters trees correctly by historical cutoff timestamp", () => {
      const testTrees: TreeData[] = [
        {
          id: "t1",
          name: "Repo A",
          type: "shipping",
          tier: "mature",
          gridX: -1.2,
          gridZ: -0.8,
          plantedAt: "2026-08-01T00:00:00Z",
        },
        {
          id: "t2",
          name: "Repo B",
          type: "shipping",
          tier: "young",
          gridX: -1.8,
          gridZ: 0.4,
          plantedAt: "2026-08-15T00:00:00Z",
        },
      ];

      const stateAtAug5 = reconstructHistoricalIsland(testTrees, "2026-08-05");
      expect(stateAtAug5.length).toBe(1);
      expect(stateAtAug5[0].id).toBe("t1");

      const stateAtAug20 = reconstructHistoricalIsland(testTrees, "2026-08-20");
      expect(stateAtAug20.length).toBe(2);
    });

    it("returns empty array if cutoff is before any tree was planted", () => {
      const trees: TreeData[] = [
        { id: "1", name: "Tree", tier: "young", gridX: 0, gridZ: 0, plantedAt: "2026-08-15T00:00:00.000Z" },
      ];
      const result = reconstructHistoricalIsland(trees, "2026-08-10T00:00:00.000Z");
      expect(result).toHaveLength(0);
    });
  });

  describe("Seam 8: Rolling 30-Day Forest Health %", () => {
    it("calculates 100% pristine health for 30/30 active days", () => {
      const activeDates: string[] = [];
      const baseDate = new Date("2026-08-22T00:00:00Z");
      for (let i = 0; i < 30; i++) {
        const d = new Date(baseDate.getTime() - i * 86400000);
        activeDates.push(d.toISOString().slice(0, 10));
      }

      const health = calculateForestHealth(activeDates, "2026-08-22");
      expect(health.healthPercent).toBe(100);
      expect(health.status).toBe("pristine");
      expect(health.activeDaysCount).toBe(30);
    });

    it("calculates lush health for 24/30 active days (80%)", () => {
      const activeDates: string[] = [];
      const baseDate = new Date("2026-08-22T00:00:00Z");
      for (let i = 0; i < 24; i++) {
        const d = new Date(baseDate.getTime() - i * 86400000);
        activeDates.push(d.toISOString().slice(0, 10));
      }

      const health = calculateForestHealth(activeDates, "2026-08-22");
      expect(health.healthPercent).toBe(80);
      expect(health.status).toBe("lush");
    });

    it("calculates dormant health for 18/30 active days (60%)", () => {
      const activeDates: string[] = [];
      const baseDate = new Date("2026-08-22T00:00:00Z");
      for (let i = 0; i < 18; i++) {
        const d = new Date(baseDate.getTime() - i * 86400000);
        activeDates.push(d.toISOString().slice(0, 10));
      }

      const health = calculateForestHealth(activeDates, "2026-08-22");
      expect(health.healthPercent).toBe(60);
      expect(health.status).toBe("dormant");
    });

    it("calculates drought health for < 50% active days", () => {
      const activeDates = ["2026-08-20", "2026-08-15"];
      const health = calculateForestHealth(activeDates, "2026-08-22");
      expect(health.healthPercent).toBe(7);
      expect(health.status).toBe("drought");
    });
  });
});
