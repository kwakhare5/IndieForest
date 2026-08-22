import { describe, it, expect, vi, beforeEach } from "vitest";
import { islandSyncEngine, IslandSyncPayload } from "./syncEngine";
import * as supabaseModule from "./supabase";

vi.mock("./supabase", () => ({
  syncProfileToSupabase: vi.fn(),
  loadProfileFromSupabase: vi.fn(),
}));

describe("IslandSyncEngine", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockPayload: IslandSyncPayload = {
    userId: "user_test_123",
    username: "testbuilder",
    level: 5,
    xp: 250,
    streakDays: 7,
    streakShields: 1,
    pinecones: 100,
    lastShipDate: "2026-08-22",
    drought: false,
    trees: [
      {
        id: "tree-1",
        name: "IndieForest",
        type: "shipping",
        tier: "young",
        gridX: -2.0,
        gridZ: -3.4,
        plantedAt: "2026-08-20",
        commits: 12,
      },
    ],
    shipHistory: [
      {
        id: "ship-1",
        date: "2026-08-22",
        message: "Shipped v1.0",
        source: "manual",
        xpGained: 100,
      },
    ],
  };

  it("rejects sync dispatch for guest or empty userId", async () => {
    const guestPayload = { ...mockPayload, userId: "guest" };
    const emptyPayload = { ...mockPayload, userId: "" };

    const resGuest = await islandSyncEngine.dispatch(guestPayload);
    const resEmpty = await islandSyncEngine.dispatch(emptyPayload);

    expect(resGuest).toBe(false);
    expect(resEmpty).toBe(false);
    expect(supabaseModule.syncProfileToSupabase).not.toHaveBeenCalled();
  });

  it("successfully dispatches sync payload to Supabase", async () => {
    vi.mocked(supabaseModule.syncProfileToSupabase).mockResolvedValueOnce();

    const success = await islandSyncEngine.dispatch(mockPayload);

    expect(success).toBe(true);
    expect(supabaseModule.syncProfileToSupabase).toHaveBeenCalledWith(mockPayload);
  });

  it("handles Supabase sync failures gracefully without crashing", async () => {
    vi.mocked(supabaseModule.syncProfileToSupabase).mockRejectedValueOnce(
      new Error("Network disconnect")
    );

    const success = await islandSyncEngine.dispatch(mockPayload);

    expect(success).toBe(false);
  });

  it("returns null on hydrate for guest user", async () => {
    const data = await islandSyncEngine.hydrate("guest");
    expect(data).toBeNull();
    expect(supabaseModule.loadProfileFromSupabase).not.toHaveBeenCalled();
  });

  it("hydrates profile and trees from Supabase when available", async () => {
    const mockCloudData = {
      profile: {
        id: "user_test_123",
        username: "testbuilder",
        level: 10,
        xp: 400,
        streak_days: 14,
        streak_shields: 2,
        pinecones: 350,
        drought: false,
        last_ship_date: "2026-08-22",
      },
      trees: mockPayload.trees,
      shipHistory: mockPayload.shipHistory,
    };

    vi.mocked(supabaseModule.loadProfileFromSupabase).mockResolvedValueOnce(
      mockCloudData as unknown as { profile: { id: string; username: string; level: number; xp: number; streak_days: number; streak_shields: number; pinecones: number; drought: boolean; last_ship_date: string | null }; trees: typeof mockPayload.trees; shipHistory: typeof mockPayload.shipHistory }
    );

    const data = await islandSyncEngine.hydrate("user_test_123");

    expect(data).toEqual(mockCloudData);
    expect(supabaseModule.loadProfileFromSupabase).toHaveBeenCalledWith("user_test_123");
  });
});
