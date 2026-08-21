// Canonical Domain Entities & Game Types for IndieForest

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
