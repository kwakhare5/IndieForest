// Canonical Domain Entities & Types for IndieForest

export type GrowthTier = "sapling" | "young" | "mature" | "majestic" | "stump";
export type TreeType = "shipping" | "revenue";

export interface CommitProof {
  sha: string;
  message: string;
  diffUrl?: string;
  repo: string;
  author: string;
  date: string;
}

export interface StripeProof {
  customerId?: string;
  invoiceId?: string;
  amount?: number;
  amountMrr?: number;
  currency?: string;
  plan?: string;
  customerName?: string;
  timestamp: string;
}

export interface TreeData {
  id: string;
  name: string;
  type?: TreeType; // "shipping" (emerald) or "revenue" (golden)
  commits?: number;
  activeDays?: number;
  mrr?: number;
  tier: GrowthTier;
  gridX: number;
  gridZ: number;
  plantedAt: string;
  isDemo?: boolean;
  commitProof?: CommitProof;
  stripeProof?: StripeProof;
}

export interface TimelineEvent {
  id: string;
  timestamp: string;
  title: string;
  type: "commit" | "revenue" | "milestone";
  treeId?: string;
  details?: string;
  value?: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  avatarUrl?: string;
  message: string;
  timestamp: string;
  verifiedVisitor?: boolean;
}

export interface ShipLog {
  id: string;
  date: string;
  message: string;
  source: "github" | "manual";
  xpGained: number;
  proofUrl?: string;
  repo?: string;
  commitSha?: string;
}

export interface Rank {
  title: string;
  badge: string;
}

export interface BadgeData {
  username: string;
  level: number;
  rankTitle: string;
  rankBadge: string;
  streakDays: number;
  totalCommits: number;
  activeTreesCount: number;
  mrr?: number;
}

export interface NormalizedCustomerTree {
  customerName: string;
  mrr: number;
  tier: GrowthTier;
  source: "stripe" | "lemonsqueezy" | "polar" | "custom";
  isValid: boolean;
  isChurn?: boolean;
}

export interface ShipRewardInput {
  streakDays: number;
  hasProofUrl?: boolean;
  isMilestoneDay?: boolean;
  currentShields?: number;
}

export interface ShipRewards {
  xpGained: number;
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

export interface ForestHealth {
  healthPercent: number;
  activeDaysCount: number;
  totalDaysEvaluated: number;
  status: "pristine" | "lush" | "dormant" | "drought";
  label: string;
  badgeClass: string;
}
