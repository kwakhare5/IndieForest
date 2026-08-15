import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const repo = searchParams.get("repo");

  if (!username || !repo) {
    return NextResponse.json(
      { error: "Missing required query parameters: 'username' and 'repo'" },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${username}/${repo}/commits?per_page=10`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
          "User-Agent": "IndieForest-App",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `GitHub API error: ${res.statusText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    const commits = data.map((c: any) => ({
      sha: c.sha.substring(0, 7),
      message: c.commit.message,
      author: c.commit.author?.name || c.author?.login || "Developer",
      date: c.commit.author?.date,
      url: c.html_url,
    }));

    return NextResponse.json({ success: true, commits });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch GitHub commits" },
      { status: 500 }
    );
  }
}
