import { CropProject, RevenueTree, CampfireState } from "./types";

export const WORLD_WIDTH = 1376;
export const WORLD_HEIGHT = 768;

export const CAMPFIRE_ANCHOR = { x: 481, y: 283 };
export const REVENUE_TREE_ANCHOR = { x: 568, y: 260 };

// 12 Crop bed grid anchors located in the fertile farmland (top-left region of map)
export const CROP_BED_ANCHORS = [
  { x: 48,  y: 136 },
  { x: 80,  y: 136 },
  { x: 112, y: 136 },
  { x: 144, y: 136 },
  { x: 48,  y: 168 },
  { x: 80,  y: 168 },
  { x: 112, y: 168 },
  { x: 144, y: 168 },
  { x: 48,  y: 200 },
  { x: 80,  y: 200 },
  { x: 112, y: 200 },
  { x: 144, y: 200 },
];

export function getCropStage(commits: number): "00" | "01" | "02" | "03" | "04" | "05" {
  if (commits <= 0) return "00";
  if (commits <= 5) return "01";
  if (commits <= 15) return "02";
  if (commits <= 30) return "03";
  if (commits <= 50) return "04";
  return "05";
}

export const INITIAL_PROJECTS: CropProject[] = [
  { id: "p1", name: "IndieForest App", cropType: "carrot", commits: 48, activeStreak: 7, isWatered: true },
  { id: "p2", name: "Docs Engine", cropType: "sunflower", commits: 22, activeStreak: 4, isWatered: true },
  { id: "p3", name: "CLI Tool", cropType: "wheat", commits: 8, activeStreak: 2, isWatered: true },
  { id: "p4", name: "Auth Microservice", cropType: "pumpkin", commits: 2, activeStreak: 1, isWatered: false },
];

export const INITIAL_REVENUE: RevenueTree = {
  mrr: 450,
  tier: "leafy",
  customerCount: 18,
};

export const INITIAL_CAMPFIRE: CampfireState = {
  isLit: true,
  isFocusActive: false,
  streakDays: 7
};
