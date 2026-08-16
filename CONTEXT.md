# CONTEXT.md — Domain Language
# Read at the START of EVERY session.
#
# PURPOSE: Give the AI a shared vocabulary so it names things consistently
# across function names, variables, comments, tests, and UI labels.
#
# HOW TO FILL THIS IN:
# Don't fill this manually. Run /grill at the start of a new project.
# The AI interviews you → you answer → it writes this file automatically.
# After that, the AI maintains it during development (Step 6 of the coding loop).
#
# Rule: Only terms that are non-obvious or specific to THIS app.
# Don't add common words like "user", "button", "form".

---

## Core Entities

_What are the main "things" in your app? What do you call them?_

| Term | What it means in THIS app | Never call it |
|------|--------------------------|---------------|
| Island | The floating 3D low-poly voxel terrain block representing a developer's startup diorama | Map, Level, Board, World |
| Daily Ship | A verified unit of daily coding progress logged via GitHub commit sync or 1-click manual checkoff | Check-in, Task completion, Tick, Log entry |
| Customer Tree | A 3D stepped pine tree placed on the island, mapped directly to an active paying subscriber or MRR value | Subscriber node, Revenue pin, Item |
| Growth Tier | The 5 visual stages of a customer tree (`sapling`, `young`, `mature`, `majestic`, `stump`) | Tree level, Size, Rank |
| Vitality | The environmental health of the island fueled by daily shipping streaks | Health, HP, Score |
| Drought | The state of withered foliage and fog triggered when shipping days are missed without active shields | Decay, Punishment, Penalty |
| Streak Shield | An inventory item earned every 7-day streak (capped at 2) that automatically protects streaks during rest days | Freeze, Pass, Cheat token |
| Pinecones | In-game spendable currency earned through daily consistency and leveling up | Coins, Credits, Tokens, Points |
| Floating Dock | The consolidated Apple-style bottom double-bezel control dock housing level, quest, streak, and ship CTA | Bottom navbar, Taskbar, Menu bar |
| Double-Bezel | Nested concentric card architecture with an outer translucent shell (`glass-dock`) and inner specular core (`porcelain-surface`) | Nested border, Card outline |
| Tree Stump Logo | The official master brand icon featuring 4 concentric golden annual growth rings and a green sprout on radiant Apple green | Pine tree icon, Bush logo |

---

## Business Rules

_Invariants that must never be violated. AI treats these as hard constraints._

1. A daily ship immediately triggers a 3D rain shower event and awards base 100 XP + streak bonus (up to 150) + proof bonus (+25 XP).
2. Multiple ships on the same calendar day update the latest commit message and XP but increment the streak counter only once per day.
3. Every 7 consecutive daily ships awards +1 Streak Shield (max 2) and a +25 Pinecone milestone bonus.
4. If a calendar day is missed and `streakShields > 0`, 1 shield is automatically consumed and the streak is preserved. If `streakShields === 0`, drought mode activates and the streak resets to 0.
5. All calculations for XP curves (`200 * Level^1.35`), ranks, and streak states must be computed via pure functions in `src/lib/gamification.ts`.
6. Universal Revenue Webhooks (`/api/webhooks/revenue`) parse Stripe, Lemon Squeezy, and Polar payloads into verified Customer Trees in pure domain `src/lib/revenueWebhook.ts`.

---

## User Roles

| Role | Can do | Cannot do |
|------|--------|-----------|
| Developer / Indie Hacker | Log ships, set daily focus quests, inspect customer MRR trees, trigger rain, export social cards | — |
| Visitor / Public Viewer | Inspect 3D island, orbit diorama, view public ship history and stats | Modify state, log ships, change customer trees |

---

## Status / State Machines

| Status | Meaning | Can transition to |
|--------|---------|-------------------|
| sapling | Newly sprouted customer ($0–$19/mo MRR) | young, stump |
| young | Growing customer ($20–$49/mo MRR) | mature, stump |
| mature | Solid recurring customer ($50–$99/mo MRR) | majestic, stump |
| majestic | Anchor / Enterprise customer ($100+/mo MRR) | stump |
| stump | Churned customer (rings visible) | sapling (resubscribed) |

---

## Key Workflows

1. **Daily Shipping Loop:** Developer visits dashboard → inspects streak → sets morning #1 focus quest → clicks "SHIP IT" (or syncs GitHub repo) → rain pours in 3D diorama, sound chimes, and XP bar levels up.
2. **Customer Tree Growth:** Developer acquires paying subscriber → clicks "Plant Customer Tree" (or receives webhook) → enters name and MRR → stepped pine tree sprouts in 3D island terrain.
3. **Build-in-Public Sharing:** Developer achieves shipping milestone → clicks Share button on Floating Dock → previews high-aesthetic progress card → 1-click copies text and opens Twitter/X.

---

## Naming Conventions

| Thing | Convention | Example |
|-------|-----------|---------|
| 3D Canvas Components | PascalCase | `TerrainIsland.tsx`, `BlockTree.tsx` |
| React UI Components | PascalCase | `FloatingDock.tsx`, `ShipModal.tsx`, `Modal.tsx` |
| API routes | kebab-case | `/api/github`, `/api/webhooks/revenue` |
| TypeScript types | PascalCase | `TreeData`, `ShipLog`, `GrowthTier`, `WebhookEvent` |
| Pure domain utilities | camelCase | `calculateShipRewards`, `evaluateStreakState`, `parseRevenueWebhook` |
| Custom hooks / stores | camelCase, `use` prefix | `useForestStore` |

---

## ADRs — Architecture Decision Records

| Date | Decision | Why |
|------|---------|-----|
| 2026-08-20 | React Three Fiber v9 + Three.js 0.170 | Real-time 3D depth, dynamic lighting, contact shadows, and zero sprite generation latency |
| 2026-08-20 | Next.js 16.3.1 (Turbopack) & React 19 | Sub-second compilation and native client component type validation |
| 2026-08-20 | Locked Isometric Camera with Cursor Parallax | Eliminates disorientation from free-orbit controls while providing tactile physical depth |
| 2026-08-20 | Warm Studio Linen Palette (`#ece7de`) | Eliminates stark pure white glare and gives a warm papercraft diorama aesthetic |
| 2026-08-20 | Pure Domain Logic in `gamification.ts` & `revenueWebhook.ts` | Complete separation of concerns with 100% test coverage via Vitest (19/19 passing) |
| 2026-08-20 | Official Tree Stump Master Brand Asset | Golden growth rings and heartwood sprout represent daily shipping longevity on radiant Apple green |
| 2026-08-20 | Canonical Double-Bezel Modal Architecture | Replaces disparate modal styles with unified `glass-dock` outer + `porcelain-surface` inner chamber |
| 2026-08-20 | Global Scrollbar Suppression | Eliminates ugly browser scrollbars while keeping fluid wheel and touch scrolling active |
