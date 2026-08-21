# AGENTS.md — Project Rules

# Hard cap: 120 lines. Fill Sections 1-4 at project start.
# AI fills Sections 5-7 automatically during development.
#
# RULES:
# - Global AI rules → auto-loaded by your tool: Freebuff ~/.AGENTS.md · opencode ~/.config/opencode/AGENTS.md · Gemini/antiGravity ~/.gemini/GEMINI.md
# - Domain terms → CONTEXT.md (read every session)
# - Product diary → JOURNAL.md (1 date heading per calendar date, merging session entries)
# - Heavy architecture → ARCHITECTURE.md (load on-demand)
# - Graphify First: Always check graphify-out/graph.json before raw file reads or greps.
# - Session end: Ask "Session logged to JOURNAL.md. Draft X post now with /build-in-public?"

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
- **Testing:** Vitest 4 with 100% test-driven domain core (37/37 tests passing)
- **Knowledge Graph:** Graphify AST & Community clustering (`graphify-out/graph.json`)
- **State Management:** Zustand 5.0.3 with local persistence
- **Audio:** Synthesized Web Audio API retro chimes
- **Language:** TypeScript 5.7+ (strict mode)

---

## 3. DEV COMMANDS

```bash
npm run dev        # start Next.js Turbopack dev server (0.0.0.0:3000)
npm run build      # production build verification with Turbopack
npm test           # run Vitest unit test suite (25 domain, quest & webhook tests)
npm run lint       # ESLint + TypeScript check
```

---

## 4. ENGINEERING PRINCIPLES

- No backward compatibility. Remove obsolete paths instead of adding compatibility layers, fallbacks, or migrations.
- Simplest implementation that fully meets current requirements. No speculative abstractions.
- Keep components modular. Concerns clearly separated.
- Zero AI Slop: No decorative emoji spam. Clean Roman numeral tiers and Lucide icons (`strokeWidth={1.5}`).
- Universal Double-Bezel UI: All cards, floating docks, and interactive modals adhere to porcelain white enclosures (`glass-dock` outer + `porcelain-surface` inner).
- Graphify First: If `graphify-out/graph.json` exists, always query it before raw file searches.

---

## 5. PROJECT PATTERNS

### Shared components
- `src/components/canvas/ForestCanvas.tsx` — Locked orthographic 3D canvas with `<CameraRig />` parallax.
- `src/components/canvas/TerrainIsland.tsx` — Procedural stepped voxel earth base, clay strata, and turquoise pond.
- `src/components/canvas/BlockTree.tsx` — 5-tier stepped pine trees (Emerald Shipping vs Golden Revenue).
- `src/components/canvas/CampProps.tsx` — Milestone campfire, tent, cabin, lantern posts, wooden pier, and hammock.
- `src/components/hud/TopStatusBar.tsx` — Zone 1: Profile, rank badge, XP bar, streaks, shields, lighting cycle, audio, settings.
- `src/components/hud/DailyQuestPanel.tsx` — Zone 2: Today's Quests checklist with live checkoffs.
- `src/components/hud/FloatingDock.tsx` — Zone 3: Bottom Action Dock (`[ LOG DAILY SHIP ]`, `[ + Tree ]`, `[ Camp Shop ]`).
- `src/components/hud/SproutGuide.tsx` — 3-step interactive onboarding for virgin islands.
- `src/components/hud/CampShopModal.tsx` — Pinecone decor store for 3D island items.
- `src/components/hud/AddTreeModal.tsx` — Dual-grove tree planter & live webhook simulator.

---

## 6. MISTAKES TO AVOID

<!-- Format: [YYYY-MM-DD] What went wrong → What to do instead -->
- [2026-08-20] Installed R3F v8 on React 19 causing `Cannot read properties of undefined` → Always use `@react-three/fiber` v9+ for React 19 compatibility.
- [2026-08-20] Pure white background caused severe visual glare → Use Warm Studio Linen `#ece7de` with soft stone shadows.
- [2026-08-21] Decorative emoji clutter compromised professional aesthetic → Strictly enforce Lucide geometric icons and Roman numeral rank tiers.

---

## 7. SESSION RESUME

**Last session date:** 2026-08-21

- Streamlined 3-Zone HUD architecture: Unified Dual-Pod top status bar, Floating Capsule quest dropdown badge, and Tactile Precision bottom dock.
- Overhauled codebase architecture: established `src/types/game.ts` as canonical domain source of truth and decoupled domain math from state stores.
- Executed Ponytail audit: purged dead folder `src/utils/supabase/` and unreferenced `src/lib/supabase/server.ts`, and made `src/lib/supabase/client.ts` cleanly self-contained.
- Configured modern `eslint.config.mjs` flat configuration for Next.js 16 + ESLint 9 (100% clean lint pass).
- Fixed Next.js 16 edge runtime deprecation in `/api/og` and purged all residual emojis (`🌰`, `🌲`).
- Redesigned `src/app/not-found.tsx` with Warm Studio Linen double-bezel card structure.
- Maintained 100% test pass rate across 37 Vitest domain and store tests with zero Turbopack build errors.

**Immediate next task:**
- Implement Task Trail 3D milestone roadmap on the diorama island.

**Open blockers:**
- [None]


