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
  - **Pure Continuous Natural Lawn (`Island.tsx`):** Eradicated the central promenade, cobblestones, and trenches. The island is now one continuous, seamless sage-emerald lawn on an elevated beveled bedrock foundation, with a natural open green buffer between Code and Cash groves.
  - **100% Mathematically Aligned Grid Lines (`gamification.ts` & `Island.tsx`):** Added `getTreeCellBoundingBox` to derive grid lines directly from `(gridX ± CELL_SIZE/2, gridZ ± CELL_SIZE/2)`. In Grid Mode, every visible line perfectly frames its tree tile with zero offset drift.
  - **Purged Empty Plot Plus Clutter (`IslandCanvas.tsx` & `EmptyPlotTile.tsx`):** Deleted `emptyPlots` generation and purged `EmptyPlotTile.tsx`. Zero empty boxes and zero floating plus signs appear. Only real, active trees render.
  - **Bulletproof Hover & Click Controls (`IslandTree.tsx`):** Removed 3D Drei `<Html>` floating badges from canvas space. Tree hover and clicking are ultra-responsive with dedicated cylindrical raycast hitboxes, illuminating the base ring and opening the bottom 2D `TreeCard`.
  - **Purged Ghost & Zombie Assets (`Campsite.tsx`, `Workshop3D.tsx`):** Removed Windmill, Lighthouse, Flagpole, Lantern Post, Robin Bird, and River & Bridge. Deleted all 6 dead 3D model files from `src/components/canvas/models/`. Focused campsite purely on Cabin, Campfire, and Dog firmly on the hearth patio (0% floating).
  - **Sovereign Halo Ring for Final Tree Stage (`PineTree.tsx`):** Added a floating, radiant golden halo ring above the golden peak star of the final tree stage (Mighty / Majestic / Elder). Features smooth animated floating and slow axial rotation in `useFrame` with warm golden emissive glow.
  - **Harmonized Campsite Angles & Universal Dock Parity (`Campsite.tsx`, `demo/page.tsx`):** Standardized Tent, Cabin, and Dog to the identical `[0, 0.35, 0]` rotation so upgrading from Tent to Cabin has zero rotational twist. Replaced custom demo dock with canonical `DashboardDock`, wired live tree pruning in Demo, and added campfire audio toggle to the Demo header.
  - **Campsite & Tree Separation Buffer (`Campsite.tsx`):** Shifted the stone hearth patio, Cabin, Tent, Campfire, and Companion Dog back by $+1.10\text{m}$ (hearth center at $Z = 2.20\text{m}$, Tent/Cabin at $Z = 1.90\text{m} \dots 2.30\text{m}$), expanding the green lawn buffer between trees and campsite from $60\text{cm}$ to $1.70\text{m}\text{--}2.60\text{m}$, perfectly synchronized across Dashboard, Demo, Profile, and Landing views.
  - **Generous 1.55m Perimeter Lawn Margin Calibration (`gamification.ts`, `Island.tsx`, `Campsite.tsx`):** Upgraded Demo island size to $18.5\text{m}$, expanding the side lawn buffer from $0.80\text{m}$ to a generous $1.55\text{m}$ ($+75\text{cm}$) and the front buffer to $3.60\text{m}$, giving trees comfortable breathing room from the cliff drops without creating an empty wasteland.
  - **100% Demo & Dashboard UI Parity (`DashboardNav.tsx`, `dashboard/page.tsx`):** Added the unified `[ Living Island | Grid Mode ]` switcher directly into the Personal Dashboard header, standardized the background to Warm Studio Linen (`#ece7de`), and enabled modular `GridView` switching with live user trees.
  - **Subtle Flush Grass Tile Patches (`IslandTree.tsx`):** Purged all 3D raised curbs, corner pegs, and boxy borders. Installed clean flat grass patches ($1.55\text{m} \times 1.55\text{m}$) resting flush on the lawn with a whisper of 10–15% green tone shift (subtle deeper sage-emerald `#529968` for Code, warm sunlit olive-emerald `#689e57` for Cash) that merges seamlessly into the continuous island turf.
  - **Ascending Tree Arrangement (`IslandCanvas.tsx`, `gamification.ts`, `demo/page.tsx`):** Arranged all trees strictly from small to large (Stump $\to$ Sprout $\to$ Young $\to$ Mature $\to$ Majestic/Elder). Small trees occupy the front row closest to the camera, stepping up to majestic pines in the back rows, eliminating visual occlusion and creating an amphitheater layout where all trees are visible.
  - **Harmonized Demo & Dashboard UI (`demo/page.tsx` & `GridView.tsx`):** Default view is Living Island (`"diorama"`). Top tabs cleanly switch between Living Island, Grid Mode, and 3D Workshop. Collapsible simulation controls give the 3D diorama full-screen breathing room.
  - **3D Workshop Showroom Overhaul (`Workshop3D.tsx`):** Added all 5 tree growth stages (**0. Stump**, **I. Sprout**, **II. Young**, **III. Mature**, **IV. Mighty**), integrated all 6 canonical assets (**Code Pine**, **Cash Pine**, **Canvas Tent**, **Log Cabin**, **Campfire**, **Companion Dog**), added Drought Soil toggle alongside Lighting & 360° Turntable rotation, and built live interactive spec callouts with Roman numeral tiers.
  - **Production Verification:** 64/64 Vitest tests passing green, Next.js Turbopack build compiling cleanly with 0 errors in 1.3s.

**Immediate next task:**

- Review the clean natural lawn, aligned grid mode, and responsive tree clicking with the user in the browser.

**Open blockers:**

- [None]




