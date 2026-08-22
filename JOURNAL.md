# Product Journal

A chronological record of project milestones, features shipped, and metrics. This file is append-only.

---

## How to Maintain This Journal (For the Agent)
During the Session End ritual (called automatically whenever significant changes are made), the agent:
1. Reads the current `JOURNAL.md`.
2. Formats all work under **at most ONE date heading per calendar day** (`### [Project — Summary] YYYY-MM-DD`).
3. If today's date heading (`YYYY-MM-DD`) already exists under `## Log Entries`, merges/appends the new bullet points under `- **Shipped**:`, updates `- **Commit**:`, and updates `- **Vibe**:`.
4. If today's date heading does NOT exist, prepends a new date heading `### [Project — Summary] YYYY-MM-DD` directly under `## Log Entries` (newest date on top).

---

## Log Entries

### [IndieForest — 3-Zone Tactical HUD, Dedicated 3D Botanical Species & UI Polish] 2026-08-22
- **Commit**: `b49f81a` (Tactical Porcelain HUD, Anchored Popovers, Dedicated Conifer & Deciduous 3D Lineages)
- **Vibe**: Razor-sharp, organic, tactile luxury instrument feel. Clean porcelain surfaces with dignified Scottish Highland emerald and burnished amber accents.
- **Shipped**:
  - **3-Zone Tactical Porcelain HUD Architecture (`src/components/hud/*`):** Refactored the dashboard HUD into a streamlined 3-zone layout with universal double-bezel porcelain styling matching the landing page (`glass-dock` outer bezel + `porcelain-surface` inner core):
    - **Top-Left Navigation & Quests (`DashboardTopLeftNav.tsx`):** Minimalist text link `[ ← Home ]` with subtle arrow hover dynamics, plus a porcelain Quests button with an anchored, floating porcelain Quests & Perk Shop popover.
    - **Top-Right Utilities (`DashboardGameControls.tsx`):** Lighting mode toggle (Day/Sunset/Night), Lo-Fi ambiance audio toggle, Settings trigger, and Modules Inventory popover with real-time repo search, grove filtering, and tree pruning.
    - **Bottom-Center Action Dock (`FloatingDock.tsx`):** Monolithic "Command Center" resting dock featuring Burnished Amber Streak pill, Highland Emerald `⚡ Ship Daily` button, `➕ Plant` trigger, `📸 Share` card trigger, and an integrated live summary metrics pill (`🌲 Active Trees · $MRR · LVL`).
  - **Seamless Emerald Meadow Ground (`TerrainIsland.tsx`):** Clean, seamless, glitch-free top meadow grass slab (`#10b981` Emerald) resting on a warm terracotta foundation cliff (`#78350f`) with subtle shoreline riverstones and calibrated studio contact shadows.
  - **Eradication of Heavy Full-Screen Side Drawers:** Deleted obsolete `DailyQuestsDrawer.tsx` and `ModuleInventoryDrawer.tsx`, replacing them with lightweight, non-blocking anchored popovers that preserve complete visibility of the 3D diorama canvas.
  - **Dedicated 3D Tree Species Architecture:**
    - **GitHub Shipping Modules (`src/components/canvas/models/ConiferTree.tsx`):** Dedicated Alpine Evergreen Conifers featuring a delicate single-stick crop sprout (`Stage 1`), an organic branching sapling with faceted leaf clouds (`Stage 2`), a 3-tier cedar mountain pine (`Stage 3`), and a 4-tier majestic pine with golden torus halo (`Stage 4`).
    - **Stripe Revenue Modules (`src/components/canvas/models/DeciduousTree.tsx`):** Dedicated Golden Broadleaf Money Oaks featuring a golden sprout seedling (`Stage 1`), a branching golden ginkgo (`Stage 2`), a 5-canopy mature golden oak (`Stage 3`), and a grand solar money oak (`Stage 4`).
  - **Stage 1 & 2 Botanical Polish:**
    - **Stage 1 (Sapling Sprout):** Redesigned into a delicate single-stick crop seedling (`r = 0.014, h = 0.32`) with 2 opposing baby sprout leaflets, top bud, and a miniature fertile soil mound ring.
    - **Stage 2 (Young Sapling):** Replaced the rigid short cone with an organic honey-wood stem branching into 3 faceted leaf clouds (`dodecahedronGeometry` with flat shading).
  - **Lower-Pitch Isometric Camera Rig & 2-Step Discrete Zoom (`ForestCanvas.tsx`):**
    - Locked canvas rotation (`enableRotate={false}`) and set camera position to `[14.5, 9.0, 14.5]` targeting `[0, 0.35, 0]` (~28° elevation angle) to provide full vertical perspective on tree trunks, tent entrance, log cabin facade, and sleeping animals.
    - Built a discrete 2-step zoom toggle (`1.0x Overview` vs `1.5x Focus`) bound to `Z` key.
  - **Subtle Studio Mineral Porcelain Palette & Highland Emerald Restraint:**
    - Replaced aggressive jet-black button fills with warm tactile studio porcelain and charcoal text across `Quests`, `Modules`, `Share`, and `Stats`.
    - Reserved rich Scottish Highland Emerald (`#047857`) strictly for the primary `⚡ Ship Daily` momentum action and soft warm ochre for unbroken streaks.
  - **Showroom Gallery 2-Mode Overhaul (`src/app/gallery/page.tsx`):** Added a top segmented switcher between **`Full Living Island`** (an interactive *Hay Day* inspired farm preview with all 16 shipping & revenue trees at max tiers, full campsite homestead, glowing lanterns, and wildlife) and **`Asset Catalog`** (4 organized showroom rows on rotating 8-sided pedestals). Calibrated lighting modes (Day/Sunset/Night), turntable rotation, and wireframe views.
  - **Micro-Interactions & Spring Motion Physics:**
    - Added tactile button depression physics (`active:scale-95`) with Web Audio API sound synchronization.
    - Apple-style `zoom-in-95` popover spring entrances for Quests, Modules, and Stats trays.
    - In-world 3D tree hover spring elevation (`+0.12` units with smooth lerp) with dynamic cursor pointer feedback.
  - **Live Production Deployment to Vercel (https://indieforest.vercel.app):** Successfully resolved Edge Middleware 500 error (`MIDDLEWARE_INVOCATION_FAILED`) by purging unused edge middleware interceptor and supplying resilient fallback publishable key for `<ClerkProvider>`. Promoted production build to Vercel live domain.
  - **Master Product Blueprint & Roadmap (`docs/PRODUCT_BLUEPRINT_AND_ROADMAP.md`):** Documented complete 12-section canonical specification covering vision, 3D farm layout, conifer micro-anatomy, camera & organic lighting, milestone campsite hubs, daily quest & pinecone shop economy, developer workflow hooks, and phased roadmap.
  - **Dead Code & Obsolete Components Purged:** Deleted `src/components/dashboard/` entirely and purged obsolete `videoExport` scripts.
  - **Universal Atomic Component Standardization & Reuse:** Standardized canonical UI primitives ([`Button.tsx`](file:///d:/IndieForest/src/components/ui/Button.tsx), [`Card.tsx`](file:///d:/IndieForest/src/components/ui/Card.tsx), [`Badge.tsx`](file:///d:/IndieForest/src/components/ui/Badge.tsx), [`Modal.tsx`](file:///d:/IndieForest/src/components/ui/Modal.tsx), [`SegmentedControl.tsx`](file:///d:/IndieForest/src/components/ui/SegmentedControl.tsx)) across all pages, modals, and HUD widgets.
  - **Progression Math & Core Single Source of Truth:** Unified all tree tier calculations under canonical `calculateTreeTier` in `src/lib/gamification.ts` with strict support for dormant stumps on churn and dual-gated shipping progression.
  - **Dynamic GitHub README SVG Badge Endpoint (`/api/badge/[username]`):** Built server-rendered SVG generator supporting both 600×200px porcelain diorama cards and compact shields.io pills with 100% test-driven Vitest coverage.
  - **Multi-Tiered Weather Particle Engine (`WeatherSystem.tsx`):** Weather system with distinct particle FX: gentle emerald mist/rain for commits, thunderstorm lightning & golden sunrays for streak milestones, and radiant golden particle showers for Stripe sales.
  - **100% Zero-Touch Automatic GitHub Ingestion:** Auto-sync on dashboard login and `window.onfocus` tab-switch commit detection so pushes in terminal automatically water the island and sprout/expand 3D trees without manual clicking.
  - **100% Test, Lint & Turbopack Cleanliness:** 48/48 Vitest tests passing across 8 suites, ESLint 0 errors / 0 warnings, Next.js 16.3.1 Turbopack build 100% green.

---

### [IndieForest — Initial Architecture & Foundation Setup] 2026-08-20
- **Commit**: `1a4e29c` (Initial Architecture, 3D Island Canvas & Domain Core)
- **Shipped**:
  - Initialized Next.js 16 App Router project with TypeScript 5.7 and Tailwind CSS v4.
  - Integrated Clerk authentication and Supabase PostgreSQL client.
  - Configured `@react-three/fiber` v9 and Three.js for isometric WebGL diorama rendering.
  - Built initial Vitest unit test harness with 100% test-driven coverage for gamification algorithms.
