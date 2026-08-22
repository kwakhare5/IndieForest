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

- **Codebase Reorganization & Human-Centric Renaming (Zero AI Slop):**
  - Standardized all file names across 3D canvas, HUD overlays, and dialog modals to developer-friendly English (`IslandCanvas`, `Island`, `IslandTree`, `Campsite`, `Weather`, `DashboardNav`, `DashboardControls`, `DashboardDock`, `TreeCard`, `AddProjectModal`, `OverviewModal`, `FocusModal`, `RestShieldModal`, `ShareModal`).
  - Purged 14 obsolete/redundant files with zero broken references.
- **Top-Right HUD Profile & Symmetrical Double-Bezel Capsule:**
  - Wrapped user avatar in dedicated `w-6 h-6 rounded-full` container with vertical hairline dividers.
- **SegmentedControl Fixed Multi-Line Overflow:**
  - Standardized tab height and text truncation across all dialogs.
- **100% Test, Lint & Production Build Cleanliness:**
  - 53/53 Vitest tests passing, 0 ESLint warnings, Next.js 16.3.1 Turbopack build 100% green.
  - Safe guarded local commits on `main` (remote push awaiting user directive).

**Immediate next task:**

- Awaiting user review and next instructions.

**Open blockers:**

- [None]




