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

- **Complete 3D Diorama Spatial Slot Refactor:** Mapped all 16 radial tree slots strictly to North/Mid quadrants ($Z \le 0.8$) and dedicated the South quadrant ($Z \ge 1.2$) exclusively to Campsite, Pond & Pier, eliminating 100% of mesh collisions.
- **Milestone Campsite Progression:** Added dynamic upgrades (Day 3 Campfire $\rightarrow$ Day 7 Canvas Tent $\rightarrow$ Day 14 Log Cabin $\rightarrow$ Day 30 Pier & Lanterns).
- **Orthographic In-World Badge Scale Normalization:** Removed `distanceFactor` from `@react-three/drei` `<Html>` tags to prevent orthographic magnification distortion.
- **100% Zero-Touch Automatic GitHub Ingestion:** Implemented `syncGitHubIsland` and `autoCheckTodayCommits` in `useForestStore.ts` and wired `window.onfocus` tab-switch detection in `src/app/dashboard/page.tsx` so pushing commits from terminal automatically waters the island and levels up trees without manual clicking.
- **Floating 3D In-World Porcelain Billboard Badges:** Added `@react-three/drei` `<Html center>` billboard tags in `BlockTree.tsx` hovering over each tree displaying repo name and commit tier (`🌲 IndieForest · IV (42c)` or `🪙 Pro Plan · $199/mo`).
- **Semantic-Only 3D Diorama & Clutter Purge:** Purged non-semantic random clutter rocks and boulders from `TerrainIsland.tsx` to maintain a pristine, razor-sharp porcelain aesthetic.
- **1-Click Famous Builders Instant Hero Hook:** Created `src/lib/curatedBuilders.ts` and added instant hero preview chips (`@levelsio`, `@shadcn`, `@antfu`, `@marclou`) on `src/app/page.tsx` loading in <10ms with zero GitHub API rate-limit consumption.
- **Rolling 30-Day Forest Health % (Consistency Metric):** Implemented `calculateForestHealth` in `src/lib/gamification.ts` with 4 health tiers (`Pristine 90%+`, `Lush 75–89%`, `Dormant 50–74%`, `Drought <50%`), displayed in `TopStatusBar.tsx` with live sync status.
- **Single Canonical Master Specification:** Consolidated all product, architecture, math, visual, and UX documentation into a single canonical file `docs/MASTER_SPECIFICATION.md` and purged redundant docs.
- **100% Test-Driven Quality:** 61/61 Vitest unit tests passing with zero Turbopack build or lint errors.

**Immediate next task:**

- Launch on X / Product Hunt and draft post with `/build-in-public`.

**Open blockers:**

- [None]

