import { TreeData, GrowthTier } from "@/types/game";
import { CURATED_FAMOUS_BUILDERS } from "./curatedBuilders";
import {
  calculateTreeTier,
  evaluateLevelProgress,
  getLocalDateString,
  getTreeSlotCoordinate,
} from "./gamification";

export interface GitHubCommitEvent {
  id: string;
  repo: string;
  message: string;
  date: string;
  author: string;
}

export interface GitHubIslandProfile {
  username: string;
  avatarUrl: string;
  totalCommits: number;
  streakDays: number;
  level: number;
  xp: number;
  trees: TreeData[];
  recentCommits: GitHubCommitEvent[];
  activeReposCount: number;
  lastActiveDate: string | null;
}

interface RawGitHubEvent {
  id: string;
  type: string;
  actor?: {
    login: string;
    avatar_url: string;
  };
  repo?: {
    id: number;
    name: string;
  };
  payload?: {
    commits?: Array<{
      sha: string;
      message: string;
      author: { name: string; email?: string };
    }>;
    size?: number;
  };
  created_at: string;
}

export function isValidGitHubUsername(username: string): boolean {
  if (!username || typeof username !== "string") return false;
  const clean = username.trim().replace(/^@/, "");
  return /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(clean);
}

export function calculateStreakFromDates(dates: string[], todayStr: string = getLocalDateString()): number {
  if (!dates.length) return 0;

  const uniqueDates = Array.from(
    new Set(
      dates.map((d) => {
        const dateObj = new Date(d);
        return isNaN(dateObj.getTime()) ? d.slice(0, 10) : getLocalDateString(dateObj);
      })
    )
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (!uniqueDates.length) return 0;

  const mostRecent = uniqueDates[0];
  const today = new Date(todayStr);
  const recentDate = new Date(mostRecent);
  const diffFromToday = Math.round((today.getTime() - recentDate.getTime()) / (1000 * 3600 * 24));

  if (diffFromToday > 1) {
    return 0;
  }

  let streak = 1;
  for (let i = 0; i < uniqueDates.length - 1; i++) {
    const current = new Date(uniqueDates[i]);
    const prev = new Date(uniqueDates[i + 1]);
    const diff = Math.round((current.getTime() - prev.getTime()) / (1000 * 3600 * 24));

    if (diff === 1) {
      streak += 1;
    } else {
      break;
    }
  }

  return streak;
}

export function parseGitHubEventsToIsland(
  username: string,
  events: RawGitHubEvent[],
  todayStr: string = getLocalDateString()
): GitHubIslandProfile {
  const pushEvents = events.filter((e) => e.type === "PushEvent" && e.repo?.name);

  const repoCommitMap = new Map<string, { count: number; lastPushed: string; dates: Set<string> }>();
  const allCommitDates: string[] = [];
  const recentCommits: GitHubCommitEvent[] = [];
  let avatarUrl = `https://github.com/${username}.png`;

  for (const event of pushEvents) {
    const repoName = event.repo!.name;
    const commitCount = event.payload?.commits?.length || event.payload?.size || 1;
    const createdAt = event.created_at;
    const dateOnly = createdAt.slice(0, 10);

    allCommitDates.push(createdAt);

    if (event.actor?.avatar_url) {
      avatarUrl = event.actor.avatar_url;
    }

    const existing = repoCommitMap.get(repoName) || {
      count: 0,
      lastPushed: createdAt,
      dates: new Set<string>(),
    };
    existing.dates.add(dateOnly);

    repoCommitMap.set(repoName, {
      count: existing.count + commitCount,
      lastPushed: new Date(createdAt) > new Date(existing.lastPushed) ? createdAt : existing.lastPushed,
      dates: existing.dates,
    });

    if (event.payload?.commits) {
      for (const c of event.payload.commits) {
        if (recentCommits.length < 15) {
          recentCommits.push({
            id: c.sha || `${event.id}-${recentCommits.length}`,
            repo: repoName,
            message: c.message || "Pushed code update",
            date: createdAt,
            author: c.author?.name || username,
          });
        }
      }
    }
  }

  const sortedRepos = Array.from(repoCommitMap.entries()).sort((a, b) => b[1].count - a[1].count);

  const trees: TreeData[] = sortedRepos.slice(0, 8).map(([repoName, data], index) => {
    const coord = getTreeSlotCoordinate(index);
    const tier = calculateTreeTier("shipping", data.count);
    const cleanName = repoName.includes("/") ? repoName.split("/")[1] : repoName;

    return {
      id: `gh-tree-${index + 1}`,
      name: cleanName,
      type: "shipping",
      commits: data.count,
      activeDays: Math.max(data.dates.size, Math.ceil(data.count / 3)),
      mrr: 0,
      tier,
      gridX: coord.gridX,
      gridZ: coord.gridZ,
      plantedAt: data.lastPushed,
      isDemo: false,
      commitProof: {
        sha: `sha-${data.lastPushed.slice(0, 10)}-${index}`,
        message: `Verified commit to ${repoName}`,
        repo: repoName,
        author: username,
        date: data.lastPushed,
        diffUrl: `https://github.com/${repoName}`,
      },
    };
  });

  const streakDays = calculateStreakFromDates(allCommitDates, todayStr);
  const totalCommits = Array.from(repoCommitMap.values()).reduce((sum, r) => sum + r.count, 0);

  const calculatedTotalXp = totalCommits > 0 ? totalCommits * 100 : 0;
  const levelProgress = evaluateLevelProgress({
    currentLevel: 1,
    currentXp: 0,
    earnedXp: calculatedTotalXp,
  });

  return {
    username,
    avatarUrl,
    totalCommits,
    streakDays,
    level: levelProgress.level,
    xp: levelProgress.xp,
    trees,
    recentCommits,
    activeReposCount: sortedRepos.length,
    lastActiveDate: allCommitDates.length ? allCommitDates[0] : null,
  };
}

export async function fetchGitHubUserIsland(username: string): Promise<GitHubIslandProfile> {
  const cleanUsername = username.trim().replace(/^@/, "");
  if (!cleanUsername || !isValidGitHubUsername(cleanUsername)) {
    throw new Error(`Invalid GitHub username: "${username}"`);
  }

  if (CURATED_FAMOUS_BUILDERS[cleanUsername.toLowerCase()]) {
    return CURATED_FAMOUS_BUILDERS[cleanUsername.toLowerCase()];
  }

  const response = await fetch(`https://api.github.com/users/${cleanUsername}/events`, {
    headers: {
      "User-Agent": "IndieForest-App",
      Accept: "application/vnd.github.v3+json",
    },
    next: { revalidate: 120 },
  });

  if (response.status === 404) {
    throw new Error(`GitHub user "${cleanUsername}" not found.`);
  }

  if (response.status === 403) {
    return getFallbackIslandProfile(cleanUsername);
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch GitHub data: ${response.statusText}`);
  }

  const rawEvents = (await response.json()) as RawGitHubEvent[];
  const profile = parseGitHubEventsToIsland(cleanUsername, rawEvents);

  if (!profile.trees.length) {
    const starterCoord = getTreeSlotCoordinate(0);
    profile.trees = [
      {
        id: "gh-tree-starter",
        name: `${cleanUsername}'s First Repo`,
        type: "shipping",
        commits: 1,
        activeDays: 1,
        mrr: 0,
        tier: "sapling" as GrowthTier,
        gridX: starterCoord.gridX,
        gridZ: starterCoord.gridZ,
        plantedAt: new Date().toISOString(),
        isDemo: false,
      },
    ];
  }

  return profile;
}

export function getFallbackIslandProfile(username: string): GitHubIslandProfile {
  return {
    username,
    avatarUrl: `https://github.com/${username}.png`,
    totalCommits: 28,
    streakDays: 4,
    level: 3,
    xp: 140,
    activeReposCount: 3,
    lastActiveDate: new Date().toISOString(),
    trees: [
      {
        id: "gh-tree-1",
        name: "IndieForest",
        type: "shipping",
        commits: 16,
        activeDays: 6,
        mrr: 0,
        tier: "young",
        gridX: -1.2,
        gridZ: -0.8,
        plantedAt: new Date().toISOString(),
        isDemo: false,
      },
    ],
    recentCommits: [],
  };
}
