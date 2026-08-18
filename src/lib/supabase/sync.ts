import { createClient } from "./client";
import { ForestState } from "@/store/useForestStore";
import { TreeData, ShipLog } from "@/types/game";

export interface SupabaseProfile {
  id: string;
  username: string;
  display_name?: string;
  avatar_url?: string;
  github_username?: string;
  level: number;
  xp: number;
  streak_days: number;
  streak_shields: number;
  pinecones: number;
  last_ship_date?: string | null;
  drought: boolean;
}

export interface SupabaseTreeRow {
  id: string;
  user_id: string;
  name: string;
  mrr: number;
  tier: "sapling" | "young" | "mature" | "majestic" | "stump";
  grid_x: number;
  grid_z: number;
  planted_at: string;
}

export interface SupabaseShipLogRow {
  id: string;
  user_id: string;
  message: string;
  source: "github" | "manual" | "stripe" | "lemonsqueezy" | "polar";
  commit_url?: string;
  xp_gained: number;
  created_at: string;
}

/**
 * Fetches user profile, trees, and ship logs from Supabase.
 */
export async function fetchSupabaseUserData(userId: string) {
  const supabase = createClient();

  try {
    const [profileRes, treesRes, logsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("trees").select("*").eq("user_id", userId),
      supabase.from("ship_logs").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
    ]);

    const profile: SupabaseProfile | null = profileRes.data;
    const trees: TreeData[] = (treesRes.data || []).map((t: SupabaseTreeRow) => ({
      id: t.id,
      name: t.name,
      type: "revenue",
      mrr: Number(t.mrr),
      tier: t.tier,
      gridX: Number(t.grid_x),
      gridZ: Number(t.grid_z),
      plantedAt: t.planted_at,
    }));

    const shipHistory: ShipLog[] = (logsRes.data || []).map((l: SupabaseShipLogRow) => ({
      id: l.id,
      date: l.created_at,
      message: l.message,
      source: l.source === "github" ? "github" : "manual",
      xpGained: l.xp_gained,
      proofUrl: l.commit_url,
    }));

    return { profile, trees, shipHistory };
  } catch (error) {
    console.error("Failed to fetch user data from Supabase:", error);
    return null;
  }
}

/**
 * Pushes local state updates to Supabase for the authenticated user.
 */
export async function syncLocalToSupabase(userId: string, state: ForestState) {
  const supabase = createClient();

  try {
    // 1. Update Profile State
    await supabase
      .from("profiles")
      .update({
        level: state.level,
        xp: state.xp,
        streak_days: state.streakDays,
        streak_shields: state.streakShields,
        pinecones: state.pinecones,
        last_ship_date: state.lastShipDate,
        drought: state.drought,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId);

    return { success: true };
  } catch (error) {
    console.error("Failed to sync local state to Supabase:", error);
    return { success: false, error };
  }
}
