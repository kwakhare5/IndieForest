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

### [IndieForest — Pure 1:1 Symmetrical Square Diorama, Standing Golden Mascot, Supabase Cloud & Full HUD Overhaul] 2026-08-22
- **Commit**: `bb2f101` (Pristine 3D Diorama, Purged Hover Labels, Raycasting Hitbox Stabilization, Island Sync Engine, 54/54 Tests Green)
- **Vibe**: Masterpiece indie studio quality. Balanced 1:1 square isometric framing that scales smoothly as projects grow, paired with a lively companion dog, porcelain double-bezel HUD, and real-time Supabase cloud persistence.
- **Shipped**:
  - **Universal Button Component Normalization & Active State Fix (`Button.tsx`, `DashboardTopLeftNav.tsx`, `DashboardGameControls.tsx`):**
    - Fixed missing `dark` variant background class in `Button.tsx` (`bg-stone-900 text-white font-bold border border-stone-950`), resolving the active state issue where toggled Quests & Modules trigger buttons became transparent on click.
    - Standardized all button variants (`emerald`, `amber`, `dark`, `outline`, `ghost`, `danger`) to share identical height scales, padding, border radii, and `active:scale-[0.97]` tactile press physics.
    - Added dynamic badge pill contrast inside Quests & Modules trigger buttons (`bg-white/20 text-white` when dark/active vs `bg-stone-100` when inactive).
  - **Zero Box-Soup HUD Popover & Modal Architecture Overhaul (`Modal.tsx`, `SettingsModal.tsx`, `DashboardTopLeftNav.tsx`, `DashboardGameControls.tsx`, `AddTreeModal.tsx`, `ShareCardModal.tsx`, `TreeInspectorCard.tsx`, `CampfireFocusModal.tsx`, `CabinWarRoomModal.tsx`, `TentSabbaticalModal.tsx`):**
    - Eliminated all nested card boxes and unnecessary borders inside popovers, replacing container clutter with clean, breathable flat rows separated by soft hairline dividers (`border-stone-100`).
    - Standardized `SettingsModal` on a clean 3-tab segmented controller (`[GitHub Sync | Revenue Webhook | Badges & Links]`), presenting 1 focused developer action at a time with instant copy bars.
    - Flattened `QuestsPopover` and `ModulesPopover` to lightweight list rows with inline progress bars and tactile one-click claim/unlock action discs.
    - Streamlined `AddTreeModal` to a 2-option pill toggle (`Shipping Pine` vs `Revenue Oak`) with high-contrast inputs and direct sprout actions.
    - Synchronized directional transform origins (`origin-top-right`, `origin-top-left`, `origin-bottom`) so every popover expands smoothly from its exact triggering button.
  - **Pure Precision Typographic System Standardized (Plus Jakarta Sans, PP Editorial New, Jersey 10, JetBrains Mono):**
    - Configured **Plus Jakarta Sans** (`--font-sans`) as the universal primary sans-serif for 100% of UI titles, buttons, cards, modals, and body copy.
    - Standardized **PP Editorial New / Instrument Serif** for luxury editorial hero headlines.
    - Restricted **Jersey 10** (`font-pixel`) strictly to gamified numerical counters (streaks, pinecones, MRR numbers), replacing leaked pixel text across loading states, modal subtitles, and inspector labels with clean `font-sans`.
    - Standardized **JetBrains Mono** (`--font-mono`) for hashes, URLs, and code snippets, completely purging Geist.
  - **Spatial Anchored HUD Popovers & Crystal-Clear Developer Guides (`Modal.tsx`, `SettingsModal.tsx`, `AddTreeModal.tsx`, `ShareCardModal.tsx`):**
    - Enhanced universal `Modal.tsx` with localized anchoring (`top-right`, `top-left`, `bottom-center`) and strict edge margin safety (`w-[calc(100vw-2.5rem)]`, `max-h-[calc(100vh-5.5rem)]`), preventing popovers from ever touching screen boundaries.
    - Anchored `SettingsModal` to the top-right adjacent to the settings trigger with 1-click copyable developer guides for GitHub zero-touch commit ingestion and Stripe / Lemon Squeezy / Polar automated revenue webhooks.
    - Anchored `AddTreeModal` and `ShareCardModal` cleanly above the bottom action dock with backdrop click dismiss.
  - **Pristine 3D Diorama Interaction & Zero-Text Hover Experience (`BlockTree.tsx`, `CampProps.tsx`):**
    - Completely removed all floating text labels and badges on hover across trees, campsite stations, and monuments.
    - Maintained tactile cursor feedback (`pointer`), smooth spring elevation physics (`+0.12` on hover), and direct click triggers to double-bezel modals and inspector cards.
  - **Rock-Solid 3D Raycasting Hitboxes & Parallax Stabilization (`ForestCanvas.tsx`, `BlockTree.tsx`, `CampProps.tsx`):**
    - Replaced `visible={false}` (which skips Three.js raycasting) with transparent depthWrite-disabled hitboxes (`transparent opacity={0} depthWrite={false}`).
    - Decoupled stationary collision hitboxes from internal animated visual meshes, eliminating the 60 FPS lift-and-drop feedback oscillation loop.
    - Calibrated camera parallax tilt to `pointer.x * 0.15` in `ForestCanvas.tsx`, preserving subtle 3D depth without displacing objects from under the mouse.
  - **Test-Driven Development (TDD) Seam Verification (54/54 Tests Passing):**
    - **Island Sync Engine Tests (`src/lib/syncEngine.test.ts`):** 5 isolated unit tests covering async queue dispatching, guest filtering, and error resilience.
    - **Dual-Grove High-Tier Coordinates & Multi-Level Leap Tests (`src/lib/gamification.test.ts`):** Verified algorithmic non-clipping slot generation and multi-level XP leap progressions.
  - **Codebase Architecture Deepening & Domain Separation (`syncEngine.ts`, `ShowroomCatalog.tsx`):**
    - **Island Sync Engine Seam (`src/lib/syncEngine.ts`):** Encapsulated asynchronous cloud persistence, offline queueing, and hydration behind a deep interface (`islandSyncEngine.dispatch()`, `islandSyncEngine.hydrate()`), decoupling the Zustand store from storage side effects.
    - **Modular Showroom Catalog (`src/components/gallery/ShowroomCatalog.tsx`):** Extracted 5 rows of 3D asset pedestals into a dedicated showroom catalog module, reducing `gallery/page.tsx` line count and decoupling diorama simulation from catalog rendering.
    - **Domain Separation Enforcement:** Strict separation between Landing Page marketing flows (`src/components/landing/*`), Game Dashboard diorama mechanics (`src/components/hud/*`, `src/components/canvas/*`), and shared double-bezel porcelain design primitives (`src/components/ui/*`).
  - **Pure 1:1 Symmetrical Square Modular Island Architecture (`ModularIsland.tsx`):**
    - Symmetrical $1:1$ width-to-depth isometric square geometry across all progression tiers:
      - **Level 1–4:** $9.0 \times 9.0$ Square (Cozy, dense starter homestead holding Cabin, Campfire, and Sprout seedlings).
      - **Level 5–9:** $12.0 \times 12.0$ Square (Expands symmetrically to hold West Conifers and Sabbatical Tent).
      - **Level 10–19:** $15.0 \times 15.0$ Square (Expands to hold East Stripe Revenue Oaks and Alpine Windmill).
      - **Level 20+:** $18.0 \times 18.0$ Square (Massive diorama with North mountain terrace, Harbor Pier, and Coast Lighthouse).
    - Calibrated dynamic orthographic camera zoom (`baseZoom: 28–42`) ensuring the island fills the screen perfectly at every tier without empty voids.
  - **Option 3 Standing Golden Companion Mascot (`CampDog.tsx`):**
    - Redesigned the companion into a lively 4-legged standing golden retriever/shiba mascot with geometric paws, warm amber coat, crimson leather collar, and polished gold medal.
    - **Living Animation Physics:** Rhythmic arched tail wagging, curious head look-at shifts, subtle torso breathing weight shifts, and an interactive front-paw hop on click!
  - **Supabase PostgreSQL Cloud Integration (`src/lib/supabase.ts` & `supabase/migrations/`):**
    - Installed official `@supabase/supabase-js` client with type-safe schema definitions for `profiles`, `trees`, `ship_logs`, and `guestbook_entries`.
    - **Zustand Cloud Sync (`useForestStore.ts`):** Automatically hydrates saved diorama state on Clerk login (`loadCloudIsland`) and asynchronously backs up state on every ship, tree plant, prune, or perk claim.
    - **Universal Revenue Webhook DB Hook (`/api/webhooks/revenue`):** Directly inserts Stripe/Lemon Squeezy/Polar customer Money Oaks into Supabase `public.trees`.
    - **Persistent Public Guestbook (`/u/[username]`):** Public visitor cheers and bulletin notes persist permanently to Supabase with instant UI feedback.
  - **Canonical Bilateral Titan Farmstead Architecture (`ForestCanvas.tsx`, `CampProps.tsx`, `gallery/page.tsx`):**
    - **West Half ($X < 0$):** Dedicated to 14 GitHub Shipping Conifers descending from high mountain pines to baby seedlings.
    - **East Half ($X > 0$):** Dedicated to 14 Stripe Revenue Golden Oaks.
    - **South Coastal Ranch Homestead:** Executive Log Cabin HQ (`[-0.6, 0.25, 1.8]`), front porch Campfire (`[1.8, 0.25, 2.8]`), Golden Companion (`[-1.8, 0.25, 3.0]`), and Canvas Tent (`[-3.8, 0.25, 2.8]`).
  - **Elite High-Level Monuments:**
    - **Alpine Windmill (`Windmill.tsx`):** Unlocks at Level 15 on the southeast bluff with smoothly rotating 4-blade canvas sails.
    - **Harbor Shipping Pier & Boat (`HarborPier.tsx`):** Unlocks at Level 25 on the southern coastline with a moored wooden cargo dinghy gently bobbing on the water.
    - **Coast Lighthouse (`Lighthouse.tsx`):** Unlocks at Level 35 on the northwest cape with a rotating night light beam.
  - **Dynamic Territory Expansion & Fog-of-War Smoke Clouds (`TerritoryFog.tsx`):**
    - Prototyped low-poly faceted cloud clusters and interactive wooden expansion stakes (`[ 🔒 LVL 5 ]`, `[ 🔒 LVL 10 ]`), then transitioned to pure 1:1 modular square slabs to eliminate visual voids.
  - **3-Zone Tactical Porcelain HUD Architecture (`src/components/hud/*`):** Refactored the dashboard HUD into a streamlined 3-zone layout with universal double-bezel porcelain styling matching the landing page (`glass-dock` outer bezel + `porcelain-surface` inner core):
    - **Top-Left Navigation & Quests (`DashboardTopLeftNav.tsx`):** Minimalist text link `[ ← Home ]` with subtle arrow hover dynamics, plus a porcelain Quests button with an anchored, floating porcelain Quests & Perk Shop popover.
    - **Top-Right Utilities (`DashboardGameControls.tsx`):** Lighting mode toggle (Day/Sunset/Night), Lo-Fi ambiance audio toggle, Settings trigger, and Modules Inventory popover with real-time repo search, grove filtering, and tree pruning.
    - **Bottom-Center Action Dock (`FloatingDock.tsx`):** Monolithic "Command Center" resting dock featuring Burnished Amber Streak pill, Highland Emerald `⚡ Ship Daily` button, `➕ Plant` trigger, `📸 Share` card trigger, and an integrated live summary metrics pill (`🌲 Active Trees · $MRR · LVL`).
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
  - **Dead Code & Obsolete Components Purged:** Deleted `src/components/dashboard/` entirely, purged obsolete `videoExport` scripts, and deleted legacy `TerrainIsland.tsx` and `TerritoryFog.tsx`.
  - **Universal Atomic Component Standardization & Reuse:** Standardized canonical UI primitives ([`Button.tsx`](file:///d:/IndieForest/src/components/ui/Button.tsx), [`Card.tsx`](file:///d:/IndieForest/src/components/ui/Card.tsx), [`Badge.tsx`](file:///d:/IndieForest/src/components/ui/Badge.tsx), [`Modal.tsx`](file:///d:/IndieForest/src/components/ui/Modal.tsx), [`SegmentedControl.tsx`](file:///d:/IndieForest/src/components/ui/SegmentedControl.tsx)) across all pages, modals, and HUD widgets.
  - **Progression Math & Core Single Source of Truth:** Unified all tree tier calculations under canonical `calculateTreeTier` in `src/lib/gamification.ts` with strict support for dormant stumps on churn and dual-gated shipping progression.
  - **Dynamic GitHub README SVG Badge Endpoint (`/api/badge/[username]`):** Built server-rendered SVG generator supporting both 600×200px porcelain diorama cards and compact shields.io pills with 100% test-driven Vitest coverage.
  - **Multi-Tiered Weather Particle Engine (`WeatherSystem.tsx`):** Weather system with distinct particle FX: gentle emerald mist/rain for commits, thunderstorm lightning & golden sunrays for streak milestones, and radiant golden particle showers for Stripe sales.
  - **100% Zero-Touch Automatic GitHub Ingestion:** Auto-sync on dashboard login and `window.onfocus` tab-switch commit detection so pushes in terminal automatically water the island and sprout/expand 3D trees without manual clicking.
  - **100% Test, Lint & Turbopack Cleanliness:** 54/54 Vitest tests passing across 8 suites, ESLint 0 errors / 0 warnings, Next.js 16.3.1 Turbopack build 100% green.

---

### [IndieForest — Initial Architecture & Foundation Setup] 2026-08-20
- **Commit**: `1a4e29c` (Initial Architecture, 3D Island Canvas & Domain Core)
- **Shipped**:
  - Initialized Next.js 16 App Router project with TypeScript 5.7 and Tailwind CSS v4.
  - Integrated Clerk authentication and Supabase PostgreSQL client.
  - Configured `@react-three/fiber` v9 and Three.js for isometric WebGL diorama rendering.
  - Built initial Vitest unit test harness with 100% test-driven coverage for gamification algorithms.
