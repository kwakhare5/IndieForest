import { describe, it, expect } from "vitest";
import {
  getXpForLevel,
  getRankTitle,
  calculateShipRewards,
  evaluateLevelProgress,
  evaluateStreakState,
  completeDailyQuest,
  purchaseCampDecor,
  TreeData,
  getLocalDateString,
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

  describe("Seam 5: Daily Quests Engine", () => {
    it("marks a daily quest completed and returns awarded XP", () => {
      const quests = [
        { id: "focus_ship", title: "Ship today's #1 focus", xpReward: 100, completed: false },
        { id: "github_commit", title: "Push code to GitHub", xpReward: 50, completed: false },
        { id: "share_x", title: "Post progress to X", xpReward: 25, completed: false },
      ];

      const result = completeDailyQuest(quests, "focus_ship");
      expect(result.success).toBe(true);
      expect(result.xpAwarded).toBe(100);
      expect(result.updatedQuests.find((q) => q.id === "focus_ship")?.completed).toBe(true);
      expect(result.updatedQuests.find((q) => q.id === "github_commit")?.completed).toBe(false);
    });

    it("prevents double-claiming XP for an already completed quest", () => {
      const quests = [
        { id: "focus_ship", title: "Ship today's #1 focus", xpReward: 100, completed: true },
      ];

      const result = completeDailyQuest(quests, "focus_ship");
      expect(result.success).toBe(false);
      expect(result.xpAwarded).toBe(0);
    });
  });

  describe("Seam 6: Pinecone Camp Shop Purchases", () => {
    it("successfully purchases an unowned decor item if user has enough pinecones", () => {
      const unlockedIds: string[] = [];
      const result = purchaseCampDecor(unlockedIds, 120, "firepit_stone");

      expect(result.success).toBe(true);
      expect(result.remainingPinecones).toBe(70); // 120 - 50 = 70
      expect(result.unlockedIds).toContain("firepit_stone");
    });

    it("rejects purchase if user has insufficient pinecones", () => {
      const unlockedIds: string[] = [];
      const result = purchaseCampDecor(unlockedIds, 30, "firepit_stone");

      expect(result.success).toBe(false);
      expect(result.remainingPinecones).toBe(30);
      expect(result.unlockedIds).not.toContain("firepit_stone");
      expect(result.error).toBe("Insufficient Pinecones");
    });

    it("rejects purchase if item is already unlocked", () => {
      const unlockedIds = ["firepit_stone"];
      const result = purchaseCampDecor(unlockedIds, 100, "firepit_stone");

      expect(result.success).toBe(false);
      expect(result.remainingPinecones).toBe(100);
      expect(result.error).toBe("Item already unlocked");
    });
  });

  describe("Seam 7: Dual-Grove Tree Properties", () => {
    it("correctly flags shipping trees vs revenue trees", () => {
      const shippingTree: TreeData = {
        id: "ship-1",
        name: "Feature Launch",
        type: "shipping",
        tier: "young",
        gridX: 0.5,
        gridZ: 0.5,
        plantedAt: new Date().toISOString(),
      };

      const revenueTree: TreeData = {
        id: "rev-1",
        name: "Acme Corp",
        type: "revenue",
        mrr: 79,
        tier: "mature",
        gridX: -1.0,
        gridZ: -1.0,
        plantedAt: new Date().toISOString(),
      };

      expect(shippingTree.type).toBe("shipping");
      expect(revenueTree.type).toBe("revenue");
      expect(revenueTree.mrr).toBe(79);
    });
  });

  describe("Seam 8: Local Calendar Day Calculations", () => {
    it("formats dates deterministically as YYYY-MM-DD", () => {
      const fixedDate = new Date("2026-08-21T10:00:00Z");
      const dateStr = getLocalDateString(fixedDate);
      expect(dateStr).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it("evaluates consecutive calendar day shipping accurately without UTC drift", () => {
      const state = evaluateStreakState({
        lastShipDate: "2026-08-20",
        todayDate: "2026-08-21",
        currentStreak: 4,
        currentShields: 0,
      });
      expect(state.streakDays).toBe(4);
      expect(state.drought).toBe(false);
    });
  });
});

