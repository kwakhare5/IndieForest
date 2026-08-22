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

- `src/components/ui/Card.tsx` — Universal double-bezel porcelain card & inset containers.
- `src/components/ui/Button.tsx` — Tactile specular buttons with action discs and active physics.
- `src/components/ui/Badge.tsx` — Status pills, rank badges, and live pulse dots.
- `src/components/ui/Modal.tsx` — Double-bezel modal enclosure & backdrop blur.
- `src/components/ui/SegmentedControl.tsx` — Sliding pill toggle controls.
- `src/components/landing/*` — Dedicated modular landing page components.
- `src/components/dashboard/*` — Dedicated modular dashboard components.
- `src/components/hud/*` — Overlay modals (Settings, ShareCard, AddTree, Guestbook).

---

## 6. MISTAKES TO AVOID

<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->

- [2026-08-20] Installed R3F v8 on React 19 causing `Cannot read properties of undefined` → Always use `@react-three/fiber` v9+ for React 19 compatibility.
- [2026-08-20] Pure white background caused severe visual glare → Use Warm Studio Linen `#ece7de` with soft stone shadows.
- [2026-08-21] Decorative emoji clutter compromised professional aesthetic → Strictly enforce Lucide geometric icons and Roman numeral rank tiers.
- [2026-08-22] Manual logging friction caused builder drop-off → Enforce 100% zero-touch GitHub commit & Stripe webhook ingestion.

---

## 7. SESSION RESUME

- **3-Zone Tactical Porcelain HUD Architecture (`src/components/hud/*`):** Refactored the dashboard HUD into a streamlined 3-zone layout with universal double-bezel porcelain styling matching the landing page:
  - **Top-Left Navigation & Quests (`DashboardTopLeftNav.tsx`):** Lightweight `[ ← Home ]` link and Quests button with an anchored, floating porcelain Quests & Perk Shop popover.
  - **Top-Right Utilities (`DashboardGameControls.tsx`):** Lighting mode, Lo-Fi ambiance audio toggle, Settings trigger, and Modules Inventory popover with real-time repo search, filtering, and pruning.
  - **Bottom-Center Action Dock (`FloatingDock.tsx`):** Monolithic "Command Center" resting dock featuring Burnished Amber Streak pill, Highland Emerald `⚡ Ship Daily` button, `➕ Plant` trigger, `📸 Share` card trigger, and an integrated live summary metrics pill (`🌲 Active Trees · $MRR · LVL`).
- **Seamless Emerald Meadow Ground (`TerrainIsland.tsx`):** Clean, seamless, glitch-free top meadow grass slab (`#10b981` Emerald) resting on a warm terracotta foundation cliff (`#78350f`) with subtle shoreline riverstones and calibrated studio contact shadows.
- **Eradication of Heavy Full-Screen Side Drawers:** Deleted obsolete `DailyQuestsDrawer.tsx` and `ModuleInventoryDrawer.tsx`, replacing them with lightweight, non-blocking anchored popovers that preserve complete visibility of the 3D diorama canvas.
- **Dedicated 3D Tree Species for Shipping vs Revenue:**
  - **GitHub Shipping Modules (`src/components/canvas/models/ConiferTree.tsx`):** Dedicated Alpine Conifers featuring a delicate single-stick crop sprout (`Stage 1`), an organic branching sapling with faceted leaf clouds (`Stage 2`), a 3-tier cedar mountain pine (`Stage 3`), and a 4-tier majestic pine with golden torus halo (`Stage 4`).
  - **Stripe Revenue Modules (`src/components/canvas/models/DeciduousTree.tsx`):** Dedicated Golden Broadleaf Money Oaks featuring a golden sprout seedling (`Stage 1`), a branching golden ginkgo (`Stage 2`), a 5-canopy mature golden oak (`Stage 3`), and a grand solar money oak (`Stage 4`).
- **Showroom Gallery 2-Mode Overhaul (`src/app/gallery/page.tsx`):** Added a top segmented switcher between **`Full Living Island`** (an interactive *Hay Day* inspired farm preview with all 16 shipping & revenue trees at max tiers, full campsite homestead, glowing lanterns, and wildlife) and **`Asset Catalog`** (4 organized showroom rows on rotating 8-sided pedestals). Calibrated lighting modes (Day/Sunset/Night), turntable rotation, and wireframe views.
- **Micro-Interactions & Spring Physics:** Added tactile button depression physics (`active:scale-95`), Apple-style `zoom-in-95` popover spring entrances, and in-world 3D tree hover spring elevation (`+0.12` units with smooth lerp).
- **100% Test, Lint & Turbopack Cleanliness:** 48/48 Vitest tests passing, ESLint 0 errors / 0 warnings, Next.js 16.3.1 Turbopack build 100% green.

**Immediate next task:**

- Share launch link on X/Twitter and monitor visitor analytics.

**Open blockers:**

- [None]




