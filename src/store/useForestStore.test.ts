import { describe, it, expect, beforeEach } from "vitest";
import { useForestStore } from "./useForestStore";
import type { DailyQuest } from "@/types/game";

describe("useForestStore", () => {
  beforeEach(() => {
    useForestStore.getState().resetIsland();
  });

  it("initializes with default values and curated projects", () => {
    const state = useForestStore.getState();
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
    expect(state.streakDays).toBe(0);
    expect(state.trees.length).toBe(2);
    expect(state.trees[0].name).toBe("IndieForest");
    expect(state.trees[1].name).toBe("Grocer");
  });

  it("adds and removes trees properly", () => {
    useForestStore.setState({ trees: [] });
    useForestStore.getState().addTree("IndieForest", 0, "sapling", "shipping");
    expect(useForestStore.getState().trees.length).toBe(1);
    expect(useForestStore.getState().trees[0].name).toBe("IndieForest");

    const id = useForestStore.getState().trees[0].id;
    useForestStore.getState().removeTree(id);
    expect(useForestStore.getState().trees.length).toBe(0);
  });

  it("ships progress directly to a project and increments its commits", () => {
    const initialCommits = useForestStore.getState().trees[0].commits || 0;
    const treeId = useForestStore.getState().trees[0].id;
    useForestStore.getState().shipToProject(treeId, "Shipped feature");
    const updatedTree = useForestStore.getState().trees.find((t) => t.id === treeId);
    expect(updatedTree?.commits).toBe(initialCommits + 1);
    expect(useForestStore.getState().streakDays).toBe(1);
  });

  it("records daily ship and increments streak", () => {
    useForestStore.getState().shipToday("Initial commit", "github");
    const state = useForestStore.getState();
    expect(state.streakDays).toBe(1);
    expect(state.level).toBe(2);
    expect(state.totalXp).toBe(100);
    expect(state.shipHistory.length).toBe(1);

    // Verify quest progress auto-triggers
    const quest = useForestStore.getState().dailyQuests.find((q: DailyQuest) => q.id === "atomic-commit");
    expect(quest?.isCompleted).toBe(true);
  });

  it("handles quest claim and level progress rewards", () => {
    useForestStore.getState().shipToday("Initial commit", "github");
    const initialTotalXp = useForestStore.getState().totalXp;
    useForestStore.getState().claimQuestReward("atomic-commit");
    const state = useForestStore.getState();
    expect(state.totalXp).toBe(initialTotalXp + 100);
    const quest = state.dailyQuests.find((q: DailyQuest) => q.id === "atomic-commit");
    expect(quest?.isClaimed).toBe(true);
  });
});
