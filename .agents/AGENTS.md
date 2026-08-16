# AGENTS.md — Project Rules

# Hard cap: 120 lines. Fill Sections 1-4 at project start.
# AI fills Sections 5-7 automatically during development.
#
# RULES:
# - Global AI rules → auto-loaded by your tool: Freebuff ~/.AGENTS.md · opencode ~/.config/opencode/AGENTS.md · Gemini/antiGravity ~/.gemini/GEMINI.md
# - Domain terms → CONTEXT.md (read every session)
# - Product diary → JOURNAL.md (1 date heading per calendar date, merging session entries)
# - Heavy architecture → ARCHITECTURE.md (load on-demand)
# - Playbook → ~/.agents/playbook.md (Gemini/antiGravity: ~/.gemini/config/playbook.md) — full map in playbook.md §5.1
# - Session end: Ask "Session logged to JOURNAL.md. Draft X post now with /build-in-public?"

---

## 1. PROJECT IDENTITY

**Name:** IndieForest
**Goal:** Gamified 3D low-poly isometric island dashboard for indie hackers that turns daily shipping momentum into a living diorama.
**Status:** In Progress
**Repo:** https://github.com/kwakhare5/IndieForest

---

## 2. TECH STACK

- **Frontend:** Next.js 16.3.1 (Turbopack + App Router), React 19, Tailwind CSS v4, Framer Motion 12
- **3D Graphics:** React Three Fiber (`@react-three/fiber` v9), Three.js (`three@0.170.0`), `@react-three/drei` v10
- **Testing:** Vitest 4 with 100% test-driven domain core (19/19 tests passing)
- **State Management:** Zustand 5.0.3 with local persistence
- **Audio:** Synthesized Web Audio API retro chimes
- **Language:** TypeScript 5.7+ (strict mode)

---

## 3. DEV COMMANDS

```bash
npm run dev        # start Next.js Turbopack dev server (0.0.0.0:3000)
npm run build      # production build verification with Turbopack
npm test           # run Vitest unit test suite (19 domain & webhook tests)
npm run lint       # ESLint + TypeScript check
```

_AI runs these automatically when validating changes._

---

## 4. ENGINEERING PRINCIPLES

These apply to every decision in this codebase:

- No backward compatibility. Remove obsolete paths instead of adding compatibility layers, fallbacks, or migrations.
- Simplest implementation that fully meets current requirements. No speculative abstractions, configuration, or indirection.
- Grow in layers. Start from the smallest version that works end to end. Never trade a working product for unfinished complexity.
- Keep components modular. Concerns clearly separated.
- Prefer established, well-maintained libraries when they reduce complexity or improve reliability. Do not reimplement common functionality without a clear reason.
- Lean on existing project dependencies before writing your own implementation or adding packages. Check documentation and types before assuming a library lacks a capability.
- Architectural decisions for the long term. No stopgaps that are "meant to be replaced later."

## 4b. LOCAL RULES

_Project-specific constraints that override generic advice. Add 3-5 max._

1. **Warm Studio Linen Aesthetic:** Background canvas must remain `#ece7de` to `#e2ded4` with soft stone shadows. Zero stark pure white glare.
2. **Locked Isometric Framing with Cursor Parallax:** Camera angle is fixed at `[18, 18, 18]` with cursor parallax and clamped zoom (`30` to `65`). No free orbit dragging.
3. **Zero AI Slop:** No decorative emoji spam in headings, badges, or buttons. Use clean Roman numeral level tiers (`I`–`VI`) and Lucide geometric icons (`strokeWidth={1.5}`).
4. **Universal Double-Bezel UI:** All cards, floating docks, and interactive modals adhere to porcelain white enclosures (`glass-dock` outer + `porcelain-surface` inner).
5. **Pure Gamification Domain:** All calculations (XP, leveling, streak decay, shield protection, webhook parsing) live in pure, test-backed functions in `src/lib/`.

---

## 5. PROJECT PATTERNS

### Shared components
- `src/components/canvas/ForestCanvas.tsx` — Locked orthographic 3D canvas with `<CameraRig />` parallax.
- `src/components/canvas/TerrainIsland.tsx` — Procedural stepped voxel earth base, clay strata, and turquoise oasis pond.
- `src/components/canvas/BlockTree.tsx` — 5-tier stepped low-poly pine trees with click raycasting.
- `src/components/canvas/CampProps.tsx` — Milestone campfire with rising smoke, tent, cabin, and drifting clouds.
- `src/components/canvas/WeatherSystem.tsx` — Dynamic sunlight, instanced rain particles, and night fireflies.
- `src/components/hud/FloatingDock.tsx` — Unified bottom Double-Bezel control dock with daily focus checklist.
- `src/components/hud/ShipModal.tsx` — 1-click & live GitHub commit sync modal with porcelain double-bezel.
- `src/components/hud/ShareCardModal.tsx` — 1-click build-in-public social exporter with porcelain double-bezel.
- `src/components/hud/AddTreeModal.tsx` — Paying customer subscriber tree adder with porcelain double-bezel.
- `src/components/hud/SettingsModal.tsx` — Backend cloud sync & Universal Webhook configuration.

### File structure

```
/
├── src/
│   ├── app/ (api/github/route.ts, api/webhooks/revenue/route.ts, dashboard/page.tsx, logos/page.tsx, u/[username]/page.tsx, globals.css, layout.tsx, page.tsx)
│   ├── components/
│   │   ├── canvas/ (TerrainIsland, BlockTree, CampProps, WeatherSystem, ForestCanvas)
│   │   ├── hud/ (FloatingDock, ShipModal, ShareCardModal, AddTreeModal, SettingsModal)
│   │   └── ui/ (Button, Badge, Modal)
│   ├── lib/ (gamification.ts, gamification.test.ts, revenueWebhook.ts, revenueWebhook.test.ts, sound.ts)
│   ├── store/ (useForestStore.ts)
│   └── types/ (r3f.d.ts)
├── docs/adr/ (0001 through 0005)
├── ARCHITECTURE.md
├── CONTEXT.md
├── JOURNAL.md
├── package.json
└── tsconfig.json
```

---

## 6. MISTAKES TO AVOID

<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->
- [2026-08-20] Installed R3F v8 on React 19 causing `Cannot read properties of undefined (reading 'ReactCurrentOwner')` → Always use `@react-three/fiber` v9+ for React 19 compatibility.
- [2026-08-20] Pure white background caused severe visual glare → Use Warm Studio Linen `#ece7de` with soft stone shadows.
- [2026-08-20] Next.js localhost IPv6 binding prevented IDE preview routing → Bind dev server explicitly to `0.0.0.0:3000`.

---

## 7. SESSION RESUME

**Last session date:** 2026-08-20

**What we built / changed:**
- Designated the **Tree Stump on Radiant Apple Green** (`/logos/indieforest_logo.svg`) as the single official master brand asset; purged all test logos.
- Unified the **Chamfered Porcelain Double-Bezel** design system across all modals (`Modal.tsx`, `ShipModal.tsx`, `SettingsModal.tsx`, `ShareCardModal.tsx`, `AddTreeModal.tsx`).
- Created universal `<SegmentedControl>` and `<Card>` primitives to eliminate all button/tab active state asymmetries.
- Overhauled 3D tree click inspection cards with centered double-bezel modal and growth stage adjuster.
- Strictly typed GitHub API gateway in `src/app/api/github/route.ts` with typed interfaces and unknown error narrowing.
- Purged 5 unused dependencies (`clsx`, `tailwind-merge`, `framer-motion`) keeping node_modules and bundle ultra-lean.
- Verified 19/19 Vitest tests passing in 230ms and Next.js 16 Turbopack production build in 420ms with 0 warnings & 0 errors.

**Immediate next task:**
- Prepare Vercel live production deployment and test live GitHub Webhook integration.

**Open blockers:**
- [None]

**Files most recently changed:**
- `JOURNAL.md`
- `.agents/AGENTS.md`
- `package.json`
- `src/app/api/github/route.ts`
- `src/components/canvas/ForestCanvas.tsx`
- `src/components/ui/SegmentedControl.tsx`
- `src/components/ui/Card.tsx`
- `src/app/page.tsx`


