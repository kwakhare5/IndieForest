import { NextRequest, NextResponse } from "next/server";
import { fetchGitHubUserIsland } from "@/lib/github";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
  }

  try {
    const profile = await fetchGitHubUserIsland(username);
    return NextResponse.json(profile, {
      headers: {
        "Cache-Control": "public, s-maxage=120, stale-while-revalidate=300",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch GitHub island";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
