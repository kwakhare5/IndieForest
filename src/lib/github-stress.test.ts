import { describe, it, expect } from "vitest";
import {
  parseGitHubEventsToIsland,
  calculateStreakFromDates,
  getFallbackIslandProfile,
} from "./github";
import { generateBadgeSvg } from "./badge";
import { calculateTreeTier } from "./gamification";

describe("GitHub Ingestion & Gamification Stress-Testing", () => {
  describe("Edge Case 1: Brand New User with 0 Events", () => {
    it("handles empty events list cleanly without throwing errors", () => {
      const profile = parseGitHubEventsToIsland("newbie_dev", []);
      expect(profile.username).toBe("newbie_dev");
      expect(profile.totalCommits).toBe(0);
      expect(profile.streakDays).toBe(0);
      expect(profile.level).toBe(1);
      expect(profile.trees.length).toBe(0);
    });
  });

  describe("Edge Case 2: Heavy Shipper with 50+ Active Repositories", () => {
    it("slices top 8 active repos and assigns non-overlapping coordinates", () => {
      const mockEvents = Array.from({ length: 50 }, (_, i) => ({
        id: `evt-${i}`,
        type: "PushEvent",
        created_at: new Date().toISOString(),
        repo: { id: i, name: `user/repo-${i}` },
        payload: { size: i + 1 }, // repo-49 has 50 commits, repo-0 has 1 commit
      }));

      const profile = parseGitHubEventsToIsland("power_shipper", mockEvents);

      // Must strictly cap at 8 trees to avoid 3D clutter
      expect(profile.trees.length).toBe(8);
      expect(profile.trees[0].name).toBe("repo-49"); // highest commits first

      // Verify all 8 trees have distinct X/Z coordinates
      const coords = profile.trees.map((t) => `${t.gridX},${t.gridZ}`);
      const uniqueCoords = new Set(coords);
      expect(uniqueCoords.size).toBe(8);
    });
  });

  describe("Edge Case 3: Weird Repository Names & Formatting", () => {
    it("cleans names with slashes, dots, and hyphens", () => {
      const mockEvents = [
        {
          id: "evt-weird",
          type: "PushEvent",
          created_at: new Date().toISOString(),
          repo: { id: 1, name: "org.domain/my-awesome_app.v2" },
          payload: { size: 5 },
        },
      ];

      const profile = parseGitHubEventsToIsland("coder", mockEvents);
      expect(profile.trees[0].name).toBe("my-awesome_app.v2");
    });
  });

  describe("Edge Case 4: Streak Across Midnight & Timezone Jitters", () => {
    it("counts consecutive days even when pushes happen across 4 calendar days", () => {
      const dates = [
        "2026-08-22T14:00:00Z",
        "2026-08-21T14:00:00Z",
        "2026-08-20T14:00:00Z",
        "2026-08-19T14:00:00Z",
      ];
      const streak = calculateStreakFromDates(dates, "2026-08-22");
      expect(streak).toBe(4);
    });

    it("resets streak to 0 if last push was 2 days ago", () => {
      const dates = ["2026-08-20T12:00:00Z", "2026-08-19T08:00:00Z"];
      const streak = calculateStreakFromDates(dates, "2026-08-22");
      expect(streak).toBe(0);
    });
  });

  describe("Edge Case 5: Rate-Limited Fallback Simulation", () => {
    it("returns resilient, authentic fallback state when GitHub API responds 403", () => {
      const fallback = getFallbackIslandProfile("shadow_dev");
      expect(fallback.username).toBe("shadow_dev");
      expect(fallback.trees.length).toBeGreaterThan(0);
      expect(fallback.streakDays).toBeGreaterThan(0);
      expect(fallback.level).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Edge Case 6: Dynamic SVG README Badge Security & XSS Sanitization", () => {
    it("sanitizes dangerous XML characters in usernames (<, >, &, \", ')", () => {
      const maliciousData = {
        username: '<script>alert("hack")</script>&foo',
        level: 42,
        rankTitle: "Island <Monarch> & King",
        rankBadge: "VI",
        streakDays: 99,
        totalCommits: 500,
        activeTreesCount: 8,
      };

      const cardSvg = generateBadgeSvg(maliciousData, "card");
      expect(cardSvg).not.toContain("<script>");
      expect(cardSvg).toContain("&lt;script&gt;");
      expect(cardSvg).toContain("&amp;foo");

      const pillSvg = generateBadgeSvg(maliciousData, "pill");
      expect(pillSvg).not.toContain("<script>");
      expect(pillSvg).toContain("&lt;script&gt;");
    });
  });

  describe("Edge Case 7: Anti-Gaming Tier Formula Under Spam", () => {
    it("prevents automated bot spam (10,000 commits in 1 day) from creating a Majestic tree", () => {
      const botSpamTier = calculateTreeTier("shipping", 10000, { activeDays: 1 });
      // Even with 10,000 commits, activeDays = 1 caps the tree at Young or below!
      expect(botSpamTier).not.toBe("majestic");
      expect(botSpamTier).not.toBe("mature");
    });
  });
});
