import { describe, it, expect } from "vitest";
import { generateBadgeSvg, BadgeData } from "./badge";

describe("Dynamic GitHub README Badge Generator", () => {
  const mockData: BadgeData = {
    username: "kwakhare5",
    level: 12,
    rankTitle: "Shipwright",
    rankBadge: "III",
    streakDays: 14,
    totalCommits: 84,
    activeTreesCount: 4,
    mrr: 237,
  };

  it("generates a rich porcelain card SVG with correct stats and double-bezel styling", () => {
    const svg = generateBadgeSvg(mockData, "card");

    expect(svg).toContain("<svg");
    expect(svg).toContain("kwakhare5");
    expect(svg).toContain("LVL 12");
    expect(svg).toContain("14d Streak");
    expect(svg).toContain("Shipwright");
    expect(svg).toContain("III");
    expect(svg).toContain("84 Commits");
    expect(svg).toContain("</svg>");
  });

  it("generates a compact pill SVG compatible with shields.io formatting", () => {
    const svg = generateBadgeSvg(mockData, "pill");

    expect(svg).toContain("<svg");
    expect(svg).toContain("IndieForest");
    expect(svg).toContain("Lvl 12");
    expect(svg).toContain("14d");
    expect(svg).toContain("</svg>");
  });

  it("sanitizes username and strings to prevent XML injection", () => {
    const dirtyData: BadgeData = {
      ...mockData,
      username: "<script>alert('xss')</script>",
    };

    const svg = generateBadgeSvg(dirtyData, "card");
    expect(svg).not.toContain("<script>");
    expect(svg).toContain("&lt;script&gt;");
  });
});
