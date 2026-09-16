export type CropType = "carrot" | "sunflower" | "wheat" | "pumpkin";

export interface CropProject {
  id: string;
  name: string;
  cropType: CropType;
  commits: number;
  activeStreak: number;
  isWatered: boolean;
  branch?: string;
  lastShipped?: string;
}

export interface RevenueTree {
  mrr: number;
  tier: "sapling" | "leafy" | "golden";
  customerCount: number;
}

export interface CampfireState {
  isLit: boolean;
  isFocusActive: boolean;
  streakDays: number;
  focusDurationMinutes?: number;
  remainingSeconds?: number;
}

export interface CameraState {
  x: number;
  y: number;
  zoom: number;
}

export type ActiveModalType = "project" | "focus" | "revenue" | "guestbook" | "workshop" | null;

export interface ClutterProp {
  id: string;
  type: "daisy" | "pebble" | "stump" | "berry_bush" | "crate_stack" | "jug";
  x: number;
  y: number;
  tileId?: number;
}
