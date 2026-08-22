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

export type TimeOfDay = "day" | "sunset" | "night";

export type QuestId =
  | "atomic-commit"
  | "build-in-public"
  | "customer-touchpoint"
  | "grove-stewardship";

export interface DailyQuest {
  id: QuestId;
  title: string;
  description: string;
  category: "shipping" | "distribution" | "revenue" | "social";
  xpReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  isClaimed: boolean;
}

export interface ForestState {
  user: {
    id: string;
    username: string;
    avatarUrl: string;
    isAuthenticated: boolean;
    githubRepo?: string;
  };

  level: number;
  xp: number;
  totalXp: number;

  streakDays: number;
  bestStreak: number;
  streakShields: number;
  lastShipDate: string | null;
  drought: boolean;

  timeOfDay: TimeOfDay;
  dailyQuests: DailyQuest[];

  trees: TreeData[];
  shipHistory: ShipLog[];

  isAutoSyncing: boolean;
  lastSyncTime: string | null;

  setUser: (userData: Partial<ForestState["user"]>) => void;
  loginUser: (userData: Partial<ForestState["user"]>) => void;
  logoutUser: () => void;
  setGithubRepo: (repo: string) => void;
  setTimeOfDay: (time: TimeOfDay) => void;
  toggleTimeOfDay: () => void;
  claimQuestReward: (questId: QuestId) => void;
  triggerQuestProgress: (questId: QuestId, amount?: number) => void;
  shipToday: (
    message: string,
    source?: "github" | "manual",
    proofUrl?: string,
    repo?: string
  ) => void;
  addTree: (
    name: string,
    mrr?: number,
    tier?: GrowthTier,
    type?: TreeType
  ) => void;
  removeTree: (id: string) => void;
  updateTreeTier: (id: string, tier: GrowthTier) => void;
  checkStreakExpiry: () => void;
  resetIsland: () => void;
  syncGitHubIsland: (username: string) => Promise<void>;
  autoCheckTodayCommits: () => Promise<boolean>;
  syncCloudIsland: () => Promise<void>;
  loadCloudIsland: (userId: string) => Promise<boolean>;
  mergeCloudData: (data: {
    level?: number;
    xp?: number;
    totalXp?: number;
    streakDays?: number;
    bestStreak?: number;
    streakShields?: number;
    trees?: TreeData[];
    shipHistory?: ShipLog[];
  }) => void;
}


