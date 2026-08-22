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

- **Live Production Deployment to Vercel (https://indieforest.vercel.app):** Successfully resolved Edge Middleware 500 error (`MIDDLEWARE_INVOCATION_FAILED`) by purging unused edge middleware interceptor and supplying resilient fallback publishable key for `<ClerkProvider>`. Promoted production build to Vercel live domain.
- **Full-Screen 3D Game Island Environment (`src/app/dashboard/page.tsx`):** Transformed `/dashboard` into an edge-to-edge `100vw × 100vh` game world (zero vertical document scrolling) where the orthographic isometric 3D canvas diorama serves as the primary persistent viewport.
- **Tactical Porcelain Game HUD (`src/components/hud/*`):** Pinned Top-Left Builder Status Capsule (`DashboardBuilderCapsule.tsx`) with avatar, rank, level, XP progress bar, streak flame, shields, and 30-day health ratio; Top-Right Game Controls (`DashboardGameControls.tsx`) with fast-sync, campfire lo-fi audio toggle, and inventory trigger; Bottom-Center Porcelain Action Dock (`FloatingDock.tsx`); and interactive in-world billboard badges.
- **Interactive Tree Inspector & Slide-Over Inventory Drawer:** Built `TreeInspectorCard.tsx` for in-world tree click inspection and `ModuleInventoryDrawer.tsx` for bulk module filtering, search, and deletion without unmounting the 3D diorama canvas. Added `H` key shortcut for Immersive Mode (hide/show HUD).
- **Solid Porcelain White UI Architecture:** Replaced all translucent glassmorphism blur and `backdrop-filter` effects with solid, tactile porcelain white (`#ffffff`) surfaces, crisp borders, and subtle physical shadows matching the landing page button aesthetics.
- **Dead Code Purge & Legacy Data Eradication:** Deleted obsolete `src/components/dashboard/` directory. Purged 100% of legacy `pinecones` currency across `types/game.ts`, `lib/gamification.ts`, `lib/github.ts`, `lib/curatedBuilders.ts`, `store/useForestStore.ts`, and `LandingHero.tsx`. Fixed XP display bug on landing hero preview card.
- **Modular Landing Page Reuse:** Rebuilt landing page with extracted `LandingSectionHeader.tsx` and `LandingFeatureCard.tsx`, replacing all lingering "Lorem Ipsum" placeholders with authentic IndieForest copy.
- **100% Test, Lint & Build Cleanliness:** 48/48 Vitest tests passing, ESLint 0 errors / 0 warnings, Next.js 16.3.1 Turbopack build 100% green.

**Immediate next task:**

- Share launch link on X/Twitter and monitor visitor analytics.

**Open blockers:**

- [None]




