// Dynamic SVG Badge Generator for GitHub Profile READMEs
// Adheres strictly to porcelain double-bezel aesthetic with zero AI slop

export interface BadgeData {
  username: string;
  level: number;
  rankTitle: string;
  rankBadge: string;
  streakDays: number;
  totalCommits: number;
  activeTreesCount: number;
  mrr?: number;
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Generates a dynamic SVG badge in either 'card' or 'pill' style.
 */
export function generateBadgeSvg(data: BadgeData, style: "card" | "pill" = "card"): string {
  const safeUsername = escapeXml(data.username);
  const safeRankTitle = escapeXml(data.rankTitle);
  const safeRankBadge = escapeXml(data.rankBadge);

  if (style === "pill") {
    // Compact Minimalist Pill Badge (340x32)
    return `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="32" viewBox="0 0 340 32" fill="none">
      <defs>
        <linearGradient id="pillGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1b4d3e" />
          <stop offset="100%" stop-color="#0f2922" />
        </linearGradient>
      </defs>
      <rect width="340" height="32" rx="16" fill="url(#pillGrad)" stroke="#2d6a4f" stroke-width="1.5" />
      <g transform="translate(10, 8)">
        <!-- Pine Tree Icon -->
        <path d="M7 2L2 9H5L1 15H13L9 9H12L7 2Z" fill="#52b788" />
      </g>
      <text x="32" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#ffffff" letter-spacing="0.5">IndieForest • @${safeUsername}</text>
      <line x1="190" y1="8" x2="190" y2="24" stroke="#2d6a4f" stroke-width="1" />
      <text x="198" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="600" fill="#d8f3dc">Lvl ${data.level}</text>
      <line x1="240" y1="8" x2="240" y2="24" stroke="#2d6a4f" stroke-width="1" />
      <g transform="translate(248, 8)">
        <!-- Flame Icon -->
        <path d="M5 0C5 3 2 4.5 2 7.5C2 9.5 3.5 11 5.5 11C7.5 11 9 9.5 9 7.5C9 4 5 0 5 0Z" fill="#f59e0b" />
      </g>
      <text x="264" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#fef08a">${data.streakDays}d</text>
      ${
        data.mrr && data.mrr > 0
          ? `<line x1="292" y1="8" x2="292" y2="24" stroke="#2d6a4f" stroke-width="1" />
             <text x="298" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#fbbf24">$${data.mrr}</text>`
          : ""
      }
    </svg>`;
  }

  // High-Resolution Porcelain Double-Bezel Card (540x190)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="540" height="190" viewBox="0 0 540 190" fill="none">
    <defs>
      <filter id="shadow" x="-4" y="-4" width="548" height="198" filterUnits="userSpaceOnUse">
        <feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.06" />
      </filter>
      <linearGradient id="cardBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#ffffff" />
        <stop offset="100%" stop-color="#f8fafc" />
      </linearGradient>
      <linearGradient id="emeraldBadge" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#047857" />
        <stop offset="100%" stop-color="#065f46" />
      </linearGradient>
    </defs>

    <!-- Outer Porcelain Double-Bezel -->
    <rect x="2" y="2" width="536" height="186" rx="24" fill="#ece7de" stroke="#d6cfc5" stroke-width="1.5" filter="url(#shadow)" />
    <rect x="8" y="8" width="524" height="174" rx="20" fill="url(#cardBg)" stroke="#e2e8f0" stroke-width="1" />

    <!-- Left: 3D Isometric Low-Poly Island Graphic -->
    <g transform="translate(24, 24)">
      <!-- Base Island Voxel Geometry -->
      <polygon points="65,15 125,50 65,85 5,50" fill="#047857" />
      <polygon points="5,50 65,85 65,120 5,85" fill="#78350f" />
      <polygon points="65,85 125,50 125,85 65,120" fill="#5c2c10" />
      
      <!-- Stepped Terraced Layers -->
      <polygon points="65,28 110,54 65,80 20,54" fill="#059669" />
      <polygon points="65,42 95,59 65,76 35,59" fill="#10b981" />
      
      <!-- Turquoise Oasis Pond -->
      <ellipse cx="65" cy="59" rx="14" ry="7" fill="#38bdf8" />
      <ellipse cx="65" cy="59" rx="11" ry="5" fill="#0284c7" opacity="0.6" />

      <!-- Center Campfire -->
      <circle cx="50" cy="50" r="3" fill="#ea580c" />
      <circle cx="50" cy="49" r="1.5" fill="#fbbf24" />

      <!-- Isometric Pine Tree (Emerald) -->
      <g transform="translate(85, 20)">
        <polygon points="10,0 2,12 18,12" fill="#064e3b" />
        <polygon points="10,6 0,20 20,20" fill="#047857" />
        <polygon points="10,14 -2,28 22,28" fill="#059669" />
        <rect x="8" y="28" width="4" height="8" fill="#451a03" />
      </g>

      <!-- Golden Pine Tree (Revenue) -->
      <g transform="translate(25, 28)">
        <polygon points="8,0 1,10 15,10" fill="#b45309" />
        <polygon points="8,5 -1,16 17,16" fill="#d97706" />
        <polygon points="8,11 -3,23 19,23" fill="#f59e0b" />
        <rect x="6.5" y="23" width="3" height="6" fill="#451a03" />
      </g>
    </g>

    <!-- Right: Stats & Verified Proof Header -->
    <g transform="translate(175, 24)">
      
      <!-- User Handle & Brand Tag -->
      <g transform="translate(0, 4)">
        <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#0f172a" letter-spacing="-0.5">@${safeUsername}</text>
        <rect x="270" y="0" width="75" height="22" rx="11" fill="#ecfdf5" stroke="#a7f3d0" stroke-width="1" />
        <text x="282" y="15" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="10" font-weight="700" fill="#047857" letter-spacing="0.5">VERIFIED</text>
      </g>

      <!-- Rank & Level Badge -->
      <g transform="translate(0, 36)">
        <rect x="0" y="0" width="80" height="24" rx="8" fill="url(#emeraldBadge)" />
        <text x="12" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="800" fill="#ffffff" letter-spacing="0.5">LVL ${data.level}</text>
        
        <rect x="88" y="0" width="130" height="24" rx="8" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1" />
        <text x="98" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="11" font-weight="700" fill="#334155">${safeRankTitle} [${safeRankBadge}]</text>
      </g>

      <!-- Key Metrics Row -->
      <g transform="translate(0, 78)">
        
        <!-- Active Streak Card -->
        <rect x="0" y="0" width="105" height="52" rx="12" fill="#fffbeb" stroke="#fde68a" stroke-width="1" />
        <text x="12" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#92400e" letter-spacing="0.5">ACTIVE STREAK</text>
        <g transform="translate(12, 28)">
          <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="800" fill="#b45309">${data.streakDays}d Streak</text>
        </g>

        <!-- Total Commits Card -->
        <rect x="115" y="0" width="110" height="52" rx="12" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1" />
        <text x="127" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#166534" letter-spacing="0.5">SHIPPED CODE</text>
        <g transform="translate(127, 28)">
          <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#15803d">${data.totalCommits} Commits</text>
        </g>

        <!-- Active Projects / Revenue Card -->
        <rect x="235" y="0" width="110" height="52" rx="12" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1" />
        <text x="247" y="20" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9" font-weight="700" fill="#475569" letter-spacing="0.5">${data.mrr && data.mrr > 0 ? "REVENUE GROVE" : "ACTIVE GROVES"}</text>
        <g transform="translate(247, 28)">
          <text x="0" y="16" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#0f172a">${data.mrr && data.mrr > 0 ? `$${data.mrr}/mo` : `${data.activeTreesCount} Projects`}</text>
        </g>

      </g>

      <!-- Footer Brand Watermark -->
      <g transform="translate(0, 142)">
        <text x="0" y="10" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="9.5" font-weight="600" fill="#94a3b8">Powered by <tspan fill="#059669" font-weight="700">IndieForest</tspan> • Living 3D Developer Island</text>
      </g>

    </g>
  </svg>`;
}
