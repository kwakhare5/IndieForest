import { describe, it, expect, beforeEach } from "vitest";
import { useForestStore } from "./useForestStore";

describe("useForestStore", () => {
  beforeEach(() => {
    useForestStore.getState().resetIsland();
  });

  it("initializes with default values", () => {
    const state = useForestStore.getState();
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.streakDays).toBe(0);
    expect(state.trees).toEqual([]);
  });

  it("adds and removes trees properly", () => {
    useForestStore.getState().addTree("IndieForest", 0, "sapling", "shipping");
    expect(useForestStore.getState().trees.length).toBe(1);
    expect(useForestStore.getState().trees[0].name).toBe("IndieForest");

    const id = useForestStore.getState().trees[0].id;
    useForestStore.getState().removeTree(id);
    expect(useForestStore.getState().trees.length).toBe(0);
  });

  it("records daily ship and increments streak", () => {
    useForestStore.getState().shipToday("Initial commit", "github");
    const state = useForestStore.getState();
    expect(state.streakDays).toBe(1);
    expect(state.level).toBe(2);
    expect(state.totalXp).toBe(100);
    expect(state.shipHistory.length).toBe(1);
  });
});
