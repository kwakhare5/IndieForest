import { syncProfileToSupabase, loadProfileFromSupabase } from "./supabase";
import type { TreeData, ShipLog } from "@/types/game";

export interface IslandSyncPayload {
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
}

/**
 * Deep Island Sync Engine
 * Encapsulates background Supabase synchronization, offline fallback, and error handling
 * behind a single, testable interface.
 */
class IslandSyncEngine {
  private isSyncing = false;
  private pendingSync: IslandSyncPayload | null = null;

  /**
   * Dispatches an asynchronous cloud backup of the current diorama state.
   */
  public async dispatch(payload: IslandSyncPayload): Promise<boolean> {
    if (!payload.userId || payload.userId === "guest") {
      return false;
    }

    if (this.isSyncing) {
      this.pendingSync = payload;
      return true;
    }

    this.isSyncing = true;
    try {
      await syncProfileToSupabase(payload);
      return true;
    } catch (err) {
      console.warn("IslandSyncEngine non-blocking error:", err);
      return false;
    } finally {
      this.isSyncing = false;
      if (this.pendingSync) {
        const next = this.pendingSync;
        this.pendingSync = null;
        this.dispatch(next);
      }
    }
  }

  /**
   * Hydrates the full diorama state from Supabase PostgreSQL.
   */
  public async hydrate(userId: string) {
    if (!userId || userId === "guest") {
      return null;
    }
    try {
      return await loadProfileFromSupabase(userId);
    } catch (err) {
      console.warn("IslandSyncEngine hydrate fallback:", err);
      return null;
    }
  }
}

export const islandSyncEngine = new IslandSyncEngine();
