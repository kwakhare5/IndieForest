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
- `src/components/canvas/*` — 3D WebGL diorama (`IslandCanvas`, `Island`, `IslandTree`, `Campsite`, `Weather`).
- `src/components/hud/*` — Overlay HUD & modals (`DashboardNav`, `DashboardControls`, `DashboardDock`, `TreeCard`, `AddProjectModal`, `OverviewModal`, `FocusModal`, `RestShieldModal`, `ShareModal`, `SettingsModal`, `GuestbookModal`).

---

## 6. MISTAKES TO AVOID

<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->

- [2026-08-20] Installed R3F v8 on React 19 causing `Cannot read properties of undefined` → Always use `@react-three/fiber` v9+ for React 19 compatibility.
- [2026-08-20] Pure white background caused severe visual glare → Use Warm Studio Linen `#ece7de` with soft stone shadows.
- [2026-08-21] Decorative emoji clutter compromised professional aesthetic → Strictly enforce Lucide geometric icons and Roman numeral rank tiers.
- [2026-08-22] Manual logging friction caused builder drop-off → Enforce 100% zero-touch GitHub commit & Stripe webhook ingestion.

---

## 7. SESSION RESUME

- **Current State & Accomplishments:**
  - **Canonical 4-Font Typography System (`layout.tsx`, `globals.css`):** Strictly enforced the 4 canonical fonts: **Geist Sans** (`.font-sans` for primary UI), **That That New Pixel** (`.font-pixel` for streaks/milestones), **Instrument Serif** (`.font-editorial` for display), and **JetBrains Mono** (`.font-mono` for code/metrics). Purged all obsolete Google font imports, Jersey 10, Plus Jakarta Sans, and legacy fallback stacks.
  - **Comprehensive Font Weight & Tracking Calibration:** Resolved heavy, ink-blocked appearance by diagnosing Geist's Neo-Grotesque anatomy and Windows DirectWrite antialiasing. Calibrated global tracking to `-0.01em` and default body weight to `400`. Systematically refactored 25+ files across all UI components ([`Button.tsx`](file:///d:/IndieForest/src/components/ui/Button.tsx), [`Badge.tsx`](file:///d:/IndieForest/src/components/ui/Badge.tsx), [`Modal.tsx`](file:///d:/IndieForest/src/components/ui/Modal.tsx), [`SegmentedControl.tsx`](file:///d:/IndieForest/src/components/ui/SegmentedControl.tsx)), HUD overlays/modals, landing page, [`Workshop3D.tsx`](file:///d:/IndieForest/src/app/demo/components/Workshop3D.tsx), public profile, and unfair prototype to `font-medium` (500) and `font-normal` (400), completely eliminating `font-bold` (700) and `font-semibold` (600) across `src/`.
  - **High-Taste Social & Proof-of-Work Specimen (`/prototype/unfair`):** Designed 3 tangible high-status card concepts inspired by unfair.so's spatial luxury: Diorama Shadowbox, Sovereign Builder Passport, and Compound Ledger, pairing Instrument Serif display with That That New Pixel metrics.
  - **Pure Continuous Natural Lawn (`Island.tsx`):** Eradicated the central promenade, cobblestones, and trenches. The island is now one continuous, seamless sage-emerald lawn on an elevated beveled bedrock foundation, with a natural open green buffer between Code and Cash groves.
  - **100% Mathematically Aligned Grid Lines (`gamification.ts` & `Island.tsx`):** Added `getTreeCellBoundingBox` to derive grid lines directly from `(gridX ± CELL_SIZE/2, gridZ ± CELL_SIZE/2)`. In Grid Mode, every visible line perfectly frames its tree tile with zero offset drift.
  - **Purged Ghost Assets & Empty Plot Clutter (`IslandCanvas.tsx`, `Campsite.tsx`):** Removed all ghost 3D models and empty plot plus signs. Focused campsite purely on Cabin, Campfire, and Dog firmly on the hearth patio.
  - **Sovereign Halo Ring for Final Tree Stage (`PineTree.tsx`):** Added a floating, radiant golden halo ring above the golden peak star of the final tree stage with smooth animated floating and axial rotation.
  - **Production Verification:** 64/64 Vitest tests passing green, Next.js Turbopack build compiling cleanly with 0 errors in 2.4s.

**Immediate next task:**

- Test live in browser at `http://localhost:3000/dashboard`, verify `kwakhare5` trees sprout, and run Supabase SQL migration in the dashboard.

**Open blockers:**

- Run `supabase/migrations/20260820000000_init_indieforest.sql` in Supabase SQL editor to create the 4 PostgreSQL tables.





