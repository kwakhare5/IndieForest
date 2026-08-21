# AGENTS.md — IndieForest Project Rules

---

## 1. PROJECT IDENTITY

**Name:** IndieForest
**Goal:** Gamified 3D low-poly isometric island dashboard for indie hackers that turns daily shipping momentum into a living diorama.
**Status:** In Progress
**Repo:** https://github.com/kwakhare5/IndieForest

---

## 2. TECH STACK

- **Frontend:** Next.js 16.3.1 (Turbopack + App Router), React 19, Tailwind CSS v4
- **3D Graphics:** React Three Fiber (`@react-three/fiber` v9), Three.js (`three@0.170.0`), `@react-three/drei` v10
- **Auth & Database:** Clerk (`@clerk/nextjs`) for instant Google/email auth + Supabase PostgreSQL
- **Testing:** Vitest 4 with 100% test-driven domain core (54/54 tests passing)
- **Knowledge Graph:** Graphify AST & Community clustering (`graphify-out/graph.json`)
- **State Management:** Zustand 5.0.3 with local persistence
- **Audio:** Synthesized Web Audio API retro chimes
- **Language:** TypeScript 5.7+ (strict mode)

---

## 3. DEV COMMANDS

```bash
npm run dev        # start Next.js Turbopack dev server (0.0.0.0:3000)
npm run build      # production build verification with Turbopack
npm test           # run Vitest unit test suite (40 domain, github, badge, quest & webhook tests)
npm run lint       # ESLint + TypeScript check
```

---

## 4. ENGINEERING PRINCIPLES

- No backward compatibility. Remove obsolete paths instead of adding compatibility layers, fallbacks, or migrations.
- Simplest implementation that fully meets current requirements. No speculative abstractions.
- Keep components modular. Concerns clearly separated.
- Zero AI Slop: No decorative emoji spam. Clean Roman numeral tiers and Lucide icons (`strokeWidth={1.5}`).
- Universal Double-Bezel UI: All cards, floating docks, and interactive modals adhere to porcelain white enclosures (`glass-dock` outer + `porcelain-surface` inner).
- Single Source of Truth: All canonical specs live in `docs/MASTER_SPECIFICATION.md`.

---

## 5. PROJECT PATTERNS

### Shared components

- `src/components/canvas/ForestCanvas.tsx` — Locked orthographic 3D canvas with `<CameraRig />` parallax.
- `src/components/canvas/TerrainIsland.tsx` — Procedural stepped voxel earth base, clay strata, and turquoise pond.
- `src/components/canvas/BlockTree.tsx` — 5-tier stepped pine trees (Emerald Shipping vs Golden Revenue).
- `src/components/canvas/CampProps.tsx` — Milestone campfire, tent, cabin, lantern posts, wooden pier, and hammock.
- `src/components/canvas/WeatherSystem.tsx` — Multi-tiered particle system (emerald rain, milestone thunderstorm/sunrays, golden revenue showers).
- `src/components/hud/TopStatusBar.tsx` — Zone 1: Profile, rank badge, XP bar, streaks, shields, lighting cycle, audio, settings.
- `src/components/hud/FloatingDock.tsx` — Zone 3: Bottom Action Dock (`[ LOG DAILY SHIP ]`, `[ + Tree ]`, `[ Camp Shop ]`).
- `src/components/hud/TimelineScrubber.tsx` — 3D Timeline Scrubber & 10s automated turntable time-lapse player.
- `src/components/hud/GuestbookModal.tsx` — Campsite bulletin board guestbook modal for visitor notes.
- `src/components/hud/CampShopModal.tsx` — Pinecone decor store for 3D island items.
- `src/components/hud/AddTreeModal.tsx` — Dual-grove tree planter & live webhook simulator.

---

## 6. MISTAKES TO AVOID

<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->

- [2026-08-20] Installed R3F v8 on React 19 causing `Cannot read properties of undefined` → Always use `@react-three/fiber` v9+ for React 19 compatibility.
- [2026-08-20] Pure white background caused severe visual glare → Use Warm Studio Linen `#ece7de` with soft stone shadows.
- [2026-08-21] Decorative emoji clutter compromised professional aesthetic → Strictly enforce Lucide geometric icons and Roman numeral rank tiers.
- [2026-08-22] Manual logging friction caused builder drop-off → Enforce 100% zero-touch GitHub commit & Stripe webhook ingestion.

---

## 7. SESSION RESUME

**Last session date:** 2026-08-22

- **Deep Codebase Cleanup & Progression Single Source of Truth:** Unified all tree tier calculations under canonical `calculateTreeTier` in `src/lib/gamification.ts` with strict support for dormant stumps on churn and dual-gated shipping progression. Eliminated duplicate/obsolete helper math from `revenueWebhook.ts`.
- **Zero-`any` Type System & Domain Consolidation:** Consolidated canonical domain entity types (`GrowthTier`, `TreeType`, `WeatherType`, `TreeData`, `ShipLog`, `CampDecorItem`, `DailyQuest`, `Rank`, `BadgeData`, `NormalizedCustomerTree`) in `src/types/game.ts`. Replaced loose casts with strict typed schemas for Stripe, Lemon Squeezy, and Polar webhook events.
- **State & Store Optimization (`useForestStore.ts`):** Streamlined store actions, eliminated redundant type aliases, added strict `WeatherType` support and verified SSR-safe storage.
- **Dynamic GitHub README SVG Badge Endpoint (`/api/badge/[username]`):** Built server-rendered SVG generator (`src/lib/badge.ts` + `/api/badge/[username]/route.ts`) supporting both 600×200px porcelain diorama cards and compact shields.io pills with 100% test-driven Vitest coverage.
- **3D Timeline Scrubber & 10s Time-Lapse Player (`TimelineScrubber.tsx`):** Built floating interactive scrubber on dashboard (`src/app/dashboard/page.tsx`) and public profile (`src/app/u/[username]/page.tsx`) with quick-jumps (`7d`, `30d`, `90d`, `All`) and automated 10-second turntable growth animation for Twitter/X video clips.
- **Multi-Tiered Weather Particle Engine (`WeatherSystem.tsx`):** Upgraded weather system with distinct particle FX: gentle emerald mist/rain for commits, dramatic thunderstorm lightning & golden sunrays for streak milestones, and radiant golden particle showers for Stripe sales.
- **Verifiable Proof Popovers & Tree Inspector (`ForestCanvas.tsx`):** Upgraded 3D tree inspector to display verified GitHub commit SHAs with clickable diff links and Stripe webhook confirmation badges.
- **Public Living Portfolio & Visitor Social Interaction (`u/[username]/page.tsx`):** Integrated 1-click **"💧 Water Tree"** visitor cheers (+5 XP toast) and campsite guestbook modal (`GuestbookModal.tsx`) for 1-line encouraging notes from fellow builders.
- **16 Non-Overlapping Radial Slots & Smart Proof-of-Ship (`gamification.ts`):** Enforced 16 canonical radial sector slots (`WEST_EMERALD_SLOTS`, `EAST_GOLDEN_SLOTS`) to eliminate tree clipping.
- **100% Test-Driven Quality:** 55/55 Vitest unit tests passing with zero Turbopack build or lint errors.

**Immediate next task:**

- Launch on X / Product Hunt and draft post with `/build-in-public`.

**Open blockers:**

- [None]

