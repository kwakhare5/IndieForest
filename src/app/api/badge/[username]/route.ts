import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUserIsland } from "@/lib/github";
import { generateBadgeSvg } from "@/lib/badge";
import { getRankTitle } from "@/lib/gamification";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const { username } = await params;
  const { searchParams } = new URL(req.url);
  const style = searchParams.get("style") === "pill" ? "pill" : "card";

  if (!username) {
    return new NextResponse("Username required", { status: 400 });
  }

  try {
    const profile = await fetchGitHubUserIsland(username);
    const rank = getRankTitle(profile.level);

    const svg = generateBadgeSvg(
      {
        username: profile.username,
        level: profile.level,
        rankTitle: rank.title,
        rankBadge: rank.badge,
        streakDays: profile.streakDays,
        totalCommits: profile.totalCommits,
        activeTreesCount: profile.trees.length,
        mrr: 0,
      },
      style
    );

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
        "Cache-Control": "public, max-age=120, s-maxage=300, stale-while-revalidate=600",
      },
    });
  } catch {
    // Graceful fallback for offline / rate-limited badge requests
    const fallbackSvg = generateBadgeSvg(
      {
        username,
        level: 1,
        rankTitle: "Seedling Scout",
        rankBadge: "I",
        streakDays: 1,
        totalCommits: 5,
        activeTreesCount: 1,
      },
      style
    );

    return new NextResponse(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'",
        "Cache-Control": "public, max-age=60, s-maxage=120",
      },
    });
  }
}

