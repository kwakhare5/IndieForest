import { describe, it, expect, beforeEach } from "vitest";
import { useForestStore } from "./useForestStore";
import { getLocalDateString } from "@/lib/gamification";

describe("useForestStore — Zustand State Engine Tests", () => {
  beforeEach(() => {
    useForestStore.getState().resetIsland();
  });

  describe("Shipping Action & XP Loop", () => {
    it("initializes with clean virgin state", () => {
      const state = useForestStore.getState();
      expect(state.level).toBe(1);
      expect(state.xp).toBe(0);
      expect(state.streakDays).toBe(0);
      expect(state.pinecones).toBe(20);
      expect(state.trees).toHaveLength(0);
    });

    it("logs daily ship, increments streak, and awards XP and pinecones", () => {
      const store = useForestStore.getState();
      store.shipToday("Shipped initial landing page", "manual");

      const updated = useForestStore.getState();
      expect(updated.streakDays).toBe(1);
      expect(updated.xp).toBe(110);
      expect(updated.pinecones).toBe(30); // 20 initial + 10 reward
      expect(updated.lastShipDate).toBe(getLocalDateString());
      expect(updated.shipHistory).toHaveLength(1);
      expect(updated.shipHistory[0].message).toBe("Shipped initial landing page");
      expect(updated.hasCompletedSproutGuide).toBe(true);
    });

    it("levels up when accumulated XP crosses level threshold", () => {
      const store = useForestStore.getState();
      // Level 1 requires 200 XP to level up
      store.shipToday("Ship task 1"); // +110 XP
      store.shipToday("Ship task 2"); // +110 XP -> Total 220 XP (levels up to 2, remaining 20 XP)

      const updated = useForestStore.getState();
      expect(updated.level).toBe(2);
      expect(updated.xp).toBe(20);
    });
  });

  describe("Daily Quests & Checkoffs", () => {
    it("completes quest and adds XP", () => {
      const store = useForestStore.getState();
      store.checkOffQuest("github_commit");

      const updated = useForestStore.getState();
      expect(updated.xp).toBe(50);
      expect(updated.quests.find((q) => q.id === "github_commit")?.completed).toBe(true);
    });
  });

  describe("Camp Shop & Decor Purchases", () => {
    it("allows purchasing decor if pinecone balance is sufficient", () => {
      const store = useForestStore.getState();
      // Give enough pinecones
      useForestStore.setState({ pinecones: 100 });

      const success = store.buyDecor("firepit_stone"); // Cost is 50
      expect(success).toBe(true);

      const updated = useForestStore.getState();
      expect(updated.pinecones).toBe(50);
      expect(updated.unlockedDecor).toContain("firepit_stone");
    });

    it("blocks decor purchase if pinecone balance is insufficient", () => {
      const store = useForestStore.getState();
      useForestStore.setState({ pinecones: 10 });

      const success = store.buyDecor("firepit_stone"); // Cost is 50
      expect(success).toBe(false);

      const updated = useForestStore.getState();
      expect(updated.pinecones).toBe(10);
      expect(updated.unlockedDecor).not.toContain("firepit_stone");
    });
  });

  describe("Dual-Grove Tree Entities", () => {
    it("plants customer revenue trees with accurate coordinates", () => {
      const store = useForestStore.getState();
      store.addTree("Acme Corp", 120, "mature", "revenue");

      const updated = useForestStore.getState();
      expect(updated.trees).toHaveLength(1);
      expect(updated.trees[0].name).toBe("Acme Corp");
      expect(updated.trees[0].mrr).toBe(120);
      expect(updated.trees[0].type).toBe("revenue");
      expect(updated.trees[0].tier).toBe("mature");
    });

    it("removes tree by ID", () => {
      const store = useForestStore.getState();
      store.addTree("Temporary Customer", 50, "young", "revenue");
      const treeId = useForestStore.getState().trees[0].id;

      store.removeTree(treeId);
      expect(useForestStore.getState().trees).toHaveLength(0);
    });

    it("updates tree growth tier", () => {
      const store = useForestStore.getState();
      store.addTree("Growing Customer", 50, "young", "revenue");
      const treeId = useForestStore.getState().trees[0].id;

      store.updateTreeTier(treeId, "majestic");
      expect(useForestStore.getState().trees[0].tier).toBe("majestic");
    });
  });

  describe("Cloud Data Synchronization & Merge", () => {
    it("merges remote cloud trees and ship logs without duplicating existing IDs", () => {
      const store = useForestStore.getState();
      store.addTree("Local Customer", 50, "young", "revenue");

      store.mergeCloudData({
        level: 3,
        pinecones: 80,
        trees: [
          {
            id: "cloud-tree-1",
            name: "Cloud Customer",
            type: "revenue",
            mrr: 150,
            tier: "mature",
            gridX: 1.0,
            gridZ: 1.0,
            plantedAt: new Date().toISOString(),
          },
        ],
      });

      const updated = useForestStore.getState();
      expect(updated.level).toBe(3);
      expect(updated.pinecones).toBe(80);
      expect(updated.trees).toHaveLength(2);
      expect(updated.trees.map((t) => t.name)).toContain("Local Customer");
      expect(updated.trees.map((t) => t.name)).toContain("Cloud Customer");
    });
  });
});

