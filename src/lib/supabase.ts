import { createClient } from "@supabase/supabase-js";
import type { TreeData, ShipLog, GrowthTier, TreeType, GuestbookEntry } from "@/types/game";

export interface ProfileRow {
  id: string;
  username: string;
  display_name?: string | null;
  avatar_url?: string | null;
  github_username?: string | null;
  webhook_token?: string | null;
  level: number;
  xp: number;
  streak_days: number;
  streak_shields: number;
  pinecones: number;
  last_ship_date?: string | null;
  drought: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface TreeRow {
  id: string;
  user_id: string;
  name: string;
  type: TreeType;
  commits?: number | null;
  mrr?: number | null;
  tier: GrowthTier;
  grid_x: number;
  grid_z: number;
  planted_at?: string;
}

export interface ShipLogRow {
  id: string;
  user_id: string;
  message: string;
  source: string;
  commit_url?: string | null;
  xp_gained: number;
  created_at?: string;
}

export interface GuestbookRow {
  id: string;
  target_username: string;
  author: string;
  message: string;
  created_at: string;
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qvewyieyfhnxvvpwytzr.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2ZXd5aWV5ZmhueHZ2cHd5dHpyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE3MDA3ODksImV4cCI6MjA5NzI3Njc4OX0.CfU-G766jLkZwMslubMIQaSmBL4pOsjcK1nF8CpsHtg";

// Universal Supabase Client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Hydrates full user island profile, trees, and logs from Supabase.
 */
export async function loadProfileFromSupabase(userIdOrUsername: string): Promise<{
  profile: ProfileRow;
  trees: TreeData[];
  shipHistory: ShipLog[];
} | null> {
  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userIdOrUsername);
    const query = isUuid
      ? supabase.from("profiles").select("*").eq("id", userIdOrUsername).maybeSingle()
      : supabase.from("profiles").select("*").eq("username", userIdOrUsername).maybeSingle();

    const { data: profile, error: profileError } = await query;
    if (profileError || !profile) return null;

    const typedProfile = profile as unknown as ProfileRow;

    // Load active trees
    const { data: treeRows } = await supabase
      .from("trees")
      .select("*")
      .eq("user_id", typedProfile.id);

    // Load ship logs
    const { data: logRows } = await supabase
      .from("ship_logs")
      .select("*")
      .eq("user_id", typedProfile.id)
      .order("created_at", { ascending: false })
      .limit(30);

    const trees: TreeData[] = ((treeRows || []) as unknown as TreeRow[]).map((t) => ({
      id: t.id,
      name: t.name,
      type: t.type,
      commits: t.commits ?? undefined,
      mrr: t.mrr ?? undefined,
      tier: t.tier,
      gridX: Number(t.grid_x),
      gridZ: Number(t.grid_z),
      plantedAt: t.planted_at || new Date().toISOString(),
    }));

    const shipHistory: ShipLog[] = ((logRows || []) as unknown as ShipLogRow[]).map((l) => ({
      id: l.id,
      date: l.created_at || new Date().toISOString(),
      message: l.message,
      source: l.source as any,
      xpGained: l.xp_gained,
      proofUrl: l.commit_url || undefined,
    }));

    return {
      profile: typedProfile,
      trees,
      shipHistory,
    };
  } catch (err) {
    console.warn("Supabase load fallback:", err);
    return null;
  }
}

/**
 * Synchronizes local state to Supabase PostgreSQL in the background.
 */
export async function syncProfileToSupabase({
  userId,
  username,
  level,
  xp,
  streakDays,
  streakShields,
  pinecones,
  lastShipDate,
  drought,
  trees,
  shipHistory,
}: {
  userId: string;
  username: string;
  level: number;
  xp: number;
  streakDays: number;
  streakShields: number;
  pinecones: number;
  lastShipDate: string | null;
  drought: boolean;
  trees: TreeData[];
  shipHistory: ShipLog[];
}) {
  try {
    // 1. Upsert Profile
    await supabase.from("profiles").upsert(
      {
        id: userId,
        username,
        level,
        xp,
        streak_days: streakDays,
        streak_shields: streakShields,
        pinecones,
        last_ship_date: lastShipDate,
        drought,
        updated_at: new Date().toISOString(),
      } as any,
      { onConflict: "id" }
    );

    // 2. Upsert Trees
    if (trees.length > 0) {
      const treeRows: TreeRow[] = trees.map((t) => ({
        id: t.id,
        user_id: userId,
        name: t.name,
        type: t.type || "shipping",
        commits: t.commits ?? null,
        mrr: t.mrr ?? null,
        tier: t.tier,
        grid_x: t.gridX,
        grid_z: t.gridZ,
        planted_at: t.plantedAt,
      }));

      await supabase.from("trees").upsert(treeRows as any, { onConflict: "id" });
    }

    // 3. Upsert Ship Logs (Latest 10)
    if (shipHistory.length > 0) {
      const logRows: ShipLogRow[] = shipHistory.slice(0, 10).map((l) => ({
        id: l.id,
        user_id: userId,
        message: l.message,
        source: l.source || "manual",
        commit_url: l.proofUrl || null,
        xp_gained: l.xpGained,
        created_at: l.date,
      }));

      await supabase.from("ship_logs").upsert(logRows as any, { onConflict: "id" });
    }
  } catch (err) {
    console.warn("Supabase sync non-blocking error:", err);
  }
}

/**
 * Saves a visitor cheer / guestbook message.
 */
export async function saveGuestbookEntry(targetUsername: string, author: string, message: string) {
  try {
    const newEntry: GuestbookRow = {
      id: `gb-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      target_username: targetUsername,
      author,
      message,
      created_at: new Date().toISOString(),
    };

    await supabase.from("guestbook_entries").insert(newEntry as any);
    return newEntry;
  } catch (err) {
    console.warn("Guestbook save error:", err);
    return null;
  }
}

/**
 * Fetches public guestbook entries for a builder.
 */
export async function fetchGuestbookEntries(targetUsername: string): Promise<GuestbookEntry[]> {
  try {
    const { data } = await supabase
      .from("guestbook_entries")
      .select("*")
      .eq("target_username", targetUsername)
      .order("created_at", { ascending: false })
      .limit(20);

    if (!data || data.length === 0) {
      return [
        {
          id: "default-1",
          author: "MarcLou",
          message: "Huge fan of this shipping momentum! Keep crushing it.",
          timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        },
        {
          id: "default-2",
          author: "Tibo",
          message: "Your profile looks incredible. Love the clean aesthetic!",
          timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
        },
      ];
    }

    return (data as unknown as GuestbookRow[]).map((d) => ({
      id: d.id,
      author: d.author,
      message: d.message,
      timestamp: d.created_at,
    }));
  } catch (err) {
    console.warn("Guestbook fetch error:", err);
    return [];
  }
}

/**
 * Subscribes to real-time tree insertions for a user (e.g. from revenue webhooks).
 */
export function subscribeToUserTrees(userId: string, onTreeInserted: (tree: TreeData) => void) {
  if (!userId || userId === "guest") return () => {};

  try {
    const channel = supabase
      .channel(`user-trees-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trees",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const row = payload.new as TreeRow;
          if (row) {
            const newTree: TreeData = {
              id: row.id,
              name: row.name,
              type: row.type,
              commits: row.commits ?? undefined,
              mrr: row.mrr ? Number(row.mrr) : undefined,
              tier: row.tier,
              gridX: Number(row.grid_x),
              gridZ: Number(row.grid_z),
              plantedAt: row.planted_at || new Date().toISOString(),
            };
            onTreeInserted(newTree);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (err) {
    console.warn("Realtime subscription fallback:", err);
    return () => {};
  }
}
