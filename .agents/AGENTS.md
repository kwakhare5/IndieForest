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
  - **Authentic Daniel Diggle Sunnyside World Visual Fidelity (`spikes/sunnyside/`, `/sunnyside-spike`):** Reconstructed and polished the 2D living pixel farmstead world to eliminate all AI-slop defects and match authentic Daniel Diggle assets.
  - **3D Demo Island Sunnyside Color Integration (`src/app/demo/page.tsx`, `Island.tsx`, `PineTree.tsx`, `Cabin.tsx`, `IslandCanvas.tsx`, `DemoIslandCanvas.tsx`):**
    - Extracted exact hex swatches from primary Sunnyside assets: Apple green lawn (`#5fc14c`), warm apricot topsoil (`#e4a672`), terracotta rock stratum (`#c28569`), slate bedrock keel (`#5a6988`), and riverstone discs (`#8b9bb4`).
    - Calibrated pine foliage skirts: shadow base `#2e6635`, mid skirt `#3e8948`, sunlit apex `#53a641`.
    - Calibrated builder cabin: timber walls `#c58a63`, timber trim `#b27760`, warm sunburst shingles `#ef9734`, and slate chimney `#5a6988`.
    - Defaulted `/demo` and `DemoIslandCanvas` to `"sunnyside"` palette with fresh garden ambient lighting (`#ecfdf5`).
    - Added an interactive `Color Palette` toggle (`Sunnyside` vs `Canonical`) in the Island Controls drawer.
    - Added a dedicated `Color Palette` showcase section in `/demo` (`src/app/demo/components/PaletteView.tsx`) with 19 categorized swatches, side-by-side comparisons, 3D material turntable (Orb, Block, Strata), and 1-click copy hex with audio chime feedback.
  - **Zero-Risk Verification:** 65/65 Vitest unit tests passing green, Next.js Turbopack build compiling all 14 routes cleanly in 3.8s with zero TypeScript errors.

**Immediate next task:**

- Inspect and interact with the Sunnyside 3D Demo Island and Color Palette showcase live at `http://localhost:3000/demo`.

**Open blockers:**

- Run `supabase/migrations/20260820000000_init_indieforest.sql` in Supabase SQL editor to create the 4 PostgreSQL tables.






