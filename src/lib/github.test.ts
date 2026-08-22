import { describe, it, expect } from "vitest";
import {
  calculateStreakFromDates,
  parseGitHubEventsToIsland,
  getFallbackIslandProfile,
  isValidGitHubUsername,
} from "./github";


describe("GitHub Ingestion Engine", () => {
  it("calculates continuous streaks correctly across calendar days", () => {
    const today = "2026-08-22";
    const dates = [
      "2026-08-22T10:00:00Z",
      "2026-08-21T15:30:00Z",
      "2026-08-20T09:00:00Z",
    ];

    const streak = calculateStreakFromDates(dates, today);
    expect(streak).toBe(3);
  });

  it("resets streak to 0 if last push was more than 1 day ago", () => {
    const today = "2026-08-22";
    const dates = ["2026-08-19T10:00:00Z", "2026-08-18T10:00:00Z"];

    const streak = calculateStreakFromDates(dates, today);
    expect(streak).toBe(0);
  });

  it("parses raw GitHub push events into structured trees and stats", () => {
    const rawEvents = [
      {
        id: "evt-1",
        type: "PushEvent",
        actor: { login: "testdev", avatar_url: "https://avatar.test/1" },
        repo: { id: 101, name: "testdev/AppA" },
        payload: { size: 10 },
        created_at: "2026-08-22T12:00:00Z",
      },
      {
        id: "evt-2",
        type: "PushEvent",
        actor: { login: "testdev", avatar_url: "https://avatar.test/1" },
        repo: { id: 102, name: "testdev/AppB" },
        payload: { size: 10 },
        created_at: "2026-08-21T10:00:00Z",
      },
      {
        id: "evt-3",
        type: "PushEvent",
        actor: { login: "testdev", avatar_url: "https://avatar.test/1" },
        repo: { id: 102, name: "testdev/AppB" },
        payload: { size: 10 },
        created_at: "2026-08-20T10:00:00Z",
      },
      {
        id: "evt-4",
        type: "PushEvent",
        actor: { login: "testdev", avatar_url: "https://avatar.test/1" },
        repo: { id: 102, name: "testdev/AppB" },
        payload: { size: 10 },
        created_at: "2026-08-19T10:00:00Z",
      },
    ];

    const profile = parseGitHubEventsToIsland("testdev", rawEvents, "2026-08-22");

    expect(profile.username).toBe("testdev");
    expect(profile.totalCommits).toBe(40);
    expect(profile.trees.length).toBe(2);
    expect(profile.trees[0].name).toBe("AppB"); // 30 commits -> mature tier
    expect(profile.trees[0].tier).toBe("mature");
    expect(profile.trees[1].name).toBe("AppA"); // 10 commits -> young tier
    expect(profile.trees[1].tier).toBe("young");
    expect(profile.streakDays).toBe(4);
  });

  it("validates GitHub username formatting according to official RFC rules", () => {
    expect(isValidGitHubUsername("kwakhare5")).toBe(true);
    expect(isValidGitHubUsername("torvalds")).toBe(true);
    expect(isValidGitHubUsername("octo-cat")).toBe(true);
    expect(isValidGitHubUsername("a")).toBe(true);

    expect(isValidGitHubUsername("")).toBe(false);
    expect(isValidGitHubUsername("../malicious")).toBe(false);
    expect(isValidGitHubUsername("user name")).toBe(false);
    expect(isValidGitHubUsername("-leading")).toBe(false);
    expect(isValidGitHubUsername("trailing-")).toBe(false);
    expect(isValidGitHubUsername("user--double")).toBe(false);
    expect(isValidGitHubUsername("a".repeat(40))).toBe(false);
  });

  it("provides valid zero-state profile when rate-limited", () => {
    const fallback = getFallbackIslandProfile("testuser");
    expect(fallback.username).toBe("testuser");
    expect(fallback.totalCommits).toBe(0);
    expect(fallback.trees.length).toBe(0);
  });
});


