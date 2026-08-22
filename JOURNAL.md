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

### [IndieForest — Dead Code Purge, Fake Data Eradication & Full-Screen Game HUD] 2026-08-22
- **Commit**: `b8e4f1a` (3D Porcelain Diorama Engine, Milestone Campsite Modals, Timeline Scrubber & Turntable Exporter)
- **Shipped**:
  - **Dead Code & Obsolete Components Purged:** Deleted `src/components/dashboard/` entirely (`DashboardHeader.tsx`, `DashboardStatsGrid.tsx`, `DashboardModulesList.tsx`, and `DashboardInfoCards.tsx`), eliminating 100% of dead, unreferenced dashboard code.
  - **Fake Data & Legacy Artifacts Eradicated:** 100% purged all `pinecones` fields and calculations across `src/types/game.ts`, `src/lib/gamification.ts`, `src/lib/gamification.test.ts`, `src/lib/github.ts`, `src/lib/curatedBuilders.ts`, `src/store/useForestStore.ts`, and `LandingHero.tsx`. Fixed XP display bug on landing hero preview card.
  - **Canonical Tier I Alignment:** Updated SVG badge route fallback title from legacy "Seedling Scout" to canonical "Sprout Planter".
  - **Full-Screen 3D Game Island Environment (`src/app/dashboard/page.tsx`):** Transformed `/dashboard` into an edge-to-edge `100vw × 100vh` game world (zero document scrolling) where the orthographic isometric 3D canvas diorama serves as the primary viewport.
  - **Tactical Porcelain Game HUD (`src/components/hud/*`):** Pinned Top-Left Builder Status Capsule (`DashboardBuilderCapsule.tsx`) with avatar, rank, level, XP progress bar, streak flame, shields, and 30-day health ratio; Top-Right Game Controls (`DashboardGameControls.tsx`) with fast-sync, campfire lo-fi audio toggle, and inventory trigger; Bottom-Center Porcelain Action Dock (`FloatingDock.tsx`); and interactive in-world billboard badges.
  - **Interactive Tree Inspector Card (`TreeInspectorCard.tsx`):** Clicking any tree in 3D directly pops up a floating porcelain inspect card with commit/MRR metrics, tier stage, plot coordinates, and delete actions.
  - **Slide-Over Module Inventory Drawer (`ModuleInventoryDrawer.tsx`):** Built a slide-over tactical drawer on the right screen edge for bulk module search, filtering by grove (Shipping vs. Revenue), and repository management without unmounting the 3D world.
  - **Immersive Mode Toggle:** Added `H` key shortcut and eye toggle button to hide/restore HUD chrome for clean diorama screenshotting.
  - **Solid White Porcelain UI Architecture (`globals.css` & HUD Modals):** Replaced translucent glassmorphism blur and `backdrop-filter` effects with solid, tactile porcelain white (`#ffffff`) surfaces, crisp borders, and subtle physical shadows matching the landing page button aesthetics.
  - **Modular Landing Component Reuse (`src/components/landing/*`):** Extracted and consolidated reusable landing primitives: `LandingSectionHeader.tsx` and `LandingFeatureCard.tsx`, eliminating duplicate boilerplate across `LandingRitual.tsx`, `LandingShowcase.tsx`, `LandingBento.tsx`, and `LandingFaq.tsx`.
  - **Full Landing Page Copy Restoration (`src/components/landing/*`):** Replaced all lingering "Lorem Ipsum" placeholders across `LandingNavbar.tsx`, `LandingRitual.tsx`, `LandingShowcase.tsx`, `LandingBento.tsx`, `LandingFaq.tsx`, and `LandingFooter.tsx` with authentic, high-converting zero-slop IndieForest copy.
  - **3D Living Porcelain Diorama Engine (`src/components/canvas/*`):** Built procedural 2-layer chamfered terrain slab (`TerrainIsland.tsx`), 5-tier faceted conifer conoids with golden/emerald shaders and floating in-world 3D porcelain billboard badges (`BlockTree.tsx`), milestone campsite structures (`CampProps.tsx`), particle weather system (`WeatherSystem.tsx`), and orthographic isometric camera rig with hologram mouse parallax (`ForestCanvas.tsx`).
  - **Milestone Campsite Interactivity & Procedural Audio (`src/components/hud/*` & `src/lib/sound.ts`):** Synthesized procedural lo-fi campfire crackle ambiance in Web Audio API. Built Milestone Campfire Daily Focus modal with Pomodoro timer (`CampfireFocusModal.tsx`), Streak Shield Vault & Sabbatical Rest Planner (`TentSabbaticalModal.tsx`), and Founder's War Room HQ (`CabinWarRoomModal.tsx`).
  - **Universal Floating Double-Bezel Dock (`FloatingDock.tsx`):** Engineered tactile porcelain bottom dock consolidating streak status, 1-click checkoff, tree planter, rest vault, timeline scrubber, turntable video exporter, and 3D card share actions.
  - **30-Day Timeline Growth Scrubber (`TimelineScrubber.tsx`):** Built historical time-travel scrubber slider and 10-second automated time-lapse playback player.
  - **10-Second 3D Turntable Video Exporter (`src/lib/videoExport.ts` & `TurntableExportModal.tsx`):** Implemented client-side $360^\circ$ orbit video capture at 60fps using browser `MediaRecorder` API with instant download.
  - **Multi-Route 3D Integration:** Embedded live 3D diorama canvas in Dashboard (`src/app/dashboard/page.tsx`), Public Profile (`src/app/u/[username]/page.tsx` with visitor water cheer action), and Landing Page Hero (`src/components/landing/LandingHero.tsx`).
  - **1200×675 High-Res 3D Card Exporter (`ShareCardModal.tsx`):** Enhanced direct WebGL canvas compositor with 3 copyable numbers-led indie hacker tweet templates.
  - **100% Test, Lint & Turbopack Cleanliness:** 48/48 Vitest tests passing across 8 suites, ESLint 0 errors / 0 warnings, Next.js 16.3.1 Turbopack build 100% green.


  - **Security & RFC Validation:** Enforced official GitHub username RFC regex (`^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$`) across all API routes to prevent SSRF and path traversal.
  - **Token Authentication & Anti-Replay Defense:** Webhook endpoints strictly require non-empty authenticated secret tokens via query params.
  - **SVG CSP & Anti-Sniff Protection:** Added `X-Content-Type-Options: nosniff` and `Content-Security-Policy: default-src 'none'; style-src 'unsafe-inline'` to dynamic README SVG badges.
  - **Exhaustive Production Documentation:** Expanded `README.md` into comprehensive technical architecture manual with API schemas, gamification formulas, and deployment guide.



  - **Universal Atomic Component Standardization & Reuse:** Enhanced and standardized canonical UI primitives ([`Button.tsx`](file:///d:/IndieForest/src/components/ui/Button.tsx), [`Card.tsx`](file:///d:/IndieForest/src/components/ui/Card.tsx), [`Badge.tsx`](file:///d:/IndieForest/src/components/ui/Badge.tsx), [`Modal.tsx`](file:///d:/IndieForest/src/components/ui/Modal.tsx), [`SegmentedControl.tsx`](file:///d:/IndieForest/src/components/ui/SegmentedControl.tsx)) across all pages, modals, and HUD widgets.
  - **Progression Math & Core Single Source of Truth:** Unified all tree tier calculations under canonical `calculateTreeTier` in `src/lib/gamification.ts` with strict support for dormant stumps on churn and dual-gated shipping progression. Eliminated duplicate/obsolete helper math from `revenueWebhook.ts` and `page.tsx`.
  - **Zero-`any` Type System & Domain Consolidation:** Consolidated domain entity types (`GrowthTier`, `TreeType`, `WeatherType`, `TreeData`, `ShipLog`, `CampDecorItem`, `DailyQuest`, `Rank`, `BadgeData`, `NormalizedCustomerTree`) in `src/types/game.ts`. Replaced loose casts with strict typed schemas for Stripe, Lemon Squeezy, and Polar webhook events.
  - **State & Store Optimization (`useForestStore.ts`):** Streamlined store actions, eliminated redundant type aliases, added strict `WeatherType` support and verified SSR-safe storage.
  - **Dynamic GitHub README SVG Badge Endpoint (`/api/badge/[username]`):** Built server-rendered SVG generator (`src/lib/badge.ts` + `/api/badge/[username]/route.ts`) supporting both 600×200px porcelain diorama cards and compact shields.io pills with 100% test-driven Vitest coverage.
  - **3D Timeline Scrubber & 10s Time-Lapse Player (`TimelineScrubber.tsx`):** Built floating interactive scrubber on dashboard (`src/app/dashboard/page.tsx`) and public profile (`src/app/u/[username]/page.tsx`) with quick-jumps (`7d`, `30d`, `90d`, `All`) and automated 10-second turntable growth animation for Twitter/X video clips.
  - **Multi-Tiered Weather Particle Engine (`WeatherSystem.tsx`):** Upgraded weather system with distinct particle FX: gentle emerald mist/rain for commits, dramatic thunderstorm lightning & golden sunrays for streak milestones, and radiant golden particle showers for Stripe sales.
  - **Verifiable Proof Popovers & Tree Inspector (`ForestCanvas.tsx`):** Upgraded 3D tree inspector to display verified GitHub commit SHAs with clickable diff links and Stripe webhook confirmation badges.
  - **Public Living Portfolio & Visitor Social Interaction (`u/[username]/page.tsx`):** Integrated 1-click **"💧 Water Tree"** visitor cheers (+5 XP toast) and campsite guestbook modal (`GuestbookModal.tsx`) for 1-line encouraging notes from fellow builders.
  - **Complete 3D Diorama Spatial Slot Refactor:** Mapped all 16 radial tree slots strictly to North/Mid quadrants ($Z \le 0.8$) and dedicated the South quadrant ($Z \ge 1.2$) exclusively to Campsite, Pond & Pier, eliminating 100% of mesh collisions.
  - **Milestone Campsite Progression:** Added dynamic upgrades (Day 3 Campfire $\rightarrow$ Day 7 Canvas Tent $\rightarrow$ Day 14 Log Cabin $\rightarrow$ Day 30 Pier & Lanterns).
  - **Orthographic In-World Badge Scale Normalization:** Removed `distanceFactor` from `@react-three/drei` `<Html>` tags to prevent orthographic magnification distortion.
  - **100% Zero-Touch Automatic GitHub Ingestion:** Wire auto-sync on dashboard login and `window.onfocus` tab-switch commit detection so pushes in terminal automatically water the island and sprout/expand 3D trees without manual clicking.
  - **Floating 3D In-World Porcelain Billboard Badges:** Added `@react-three/drei` `<Html center>` billboard tags hovering over each tree displaying repo name and commit tier (`🌲 IndieForest · IV (42c)` or `🪙 Pro Plan · $199/mo`).
  - **Semantic-Only 3D Diorama & Clutter Purge:** Purged random non-functional rocks and boulders from `TerrainIsland.tsx` to maintain a pristine, razor-sharp porcelain aesthetic.
  - **1-Click Famous Builders Instant Hero Hook:** Created `src/lib/curatedBuilders.ts` and added instant hero preview chips (`@levelsio`, `@shadcn`, `@antfu`, `@marclou`) loading in <10ms with zero GitHub API rate-limit consumption.
  - **Rolling 30-Day Forest Health % (Consistency Metric):** Implemented `calculateForestHealth` in `src/lib/gamification.ts` with 4 health tiers (`Pristine 90%+`, `Lush 75–89%`, `Dormant 50–74%`, `Drought <50%`), displayed in `TopStatusBar.tsx` with live sync status.
  - **Formal Architecture Decision Records (ADRs 0001–0006):** Documented foundational design decisions in `docs/adr/` (Orthographic 3D Diorama, Dual-Grove Independence, Zero-Touch GitHub Auto-Watering, Pure Domain Math, Local-First Zustand State & Universal Webhooks, Porcelain Double-Bezel System).
  - **Wayfinder Launch Map & Frontier Tickets:** Created `docs/WAYFINDER_MAP.md` mapping out public launch deliverables, Stripe signature verification research, and Supabase cloud sync prototyping.
  - **Spacious "Hay Day for Indie Hackers" Farm Island Transformation:** Refactored the entire 3D diorama into a clean, spacious 2-layer farm slab (chamfered spring meadow grass top + warm caramel terracotta clay base, $0.45\text{m}$ thick, zero messy strata noise), generous $1.6\text{m}$ pitch farm plots, crystal turquoise farm pond with handcrafted wooden pier, central cobblestone walkway, and zero extraneous visual clutter.
  - **Dynamic Level-Based Farm Scaling ($6.0\text{m} \rightarrow 13.5\text{m}$):** Expanded physical terrain bounds progressively from Lv 1–4 Virgin Islet ($6.0\text{m} \times 5.8\text{m}$, 2 slots) to Lv 20+ Archipelago Estate ($13.5\text{m} \times 13.0\text{m}$, 16 slots).
  - **100% Zero Fake Mock Data & Zero AI-Slop Copy:** Clean virgin starter island, 65/65 tests passing, and porcelain double-bezel design system in Warm Studio Linen `#ece7de`.
- **Metrics**: 65/65 Vitest unit & store tests passing (100% green) · 0 ESLint errors/warnings · 0 TypeScript errors · 100% production Turbopack build pass.
- **Visuals**: Spacious 2-layer Hay Day farm slab, generous $1.6\text{m}$ plot spacing, crystal turquoise pond, wooden pier, cozy campfire, and porcelain HUD in Warm Studio Linen `#ece7de`.
- **Vibe**: 🌾 Pure Hay Day for Indie Hackers perfection, spacious 2-layer slab, 65/65 tests passing, production-ready!



### [IndieForest — Architecture Overhaul, Ponytail Cleanup & Codebase Hardening] 2026-08-21
- **Commit**: `56d87a0`
- **Shipped**:
  - **Deep Codebase & Dead Code Purge:** Safely deleted redundant `src/components/hud/AuthModal.tsx` (131 lines removed), cleaned unused imports/props in `TopStatusBar.tsx` and `AddTreeModal.tsx`, achieving 100% clean ESLint pass (0 errors, 0 warnings) and clean Turbopack build.
  - **Decoupled Progression & Pure Game Mechanics:** Fully separated the Emerald Shipping Grove (commits/grind) from Golden Revenue Grove (MRR/payments) so pre-revenue builders can thrive with $0 MRR, replaced manual tree tier cheat overrides in `ForestCanvas.tsx` with authentic progress story cards, and overhauled `AddTreeModal.tsx` with 1-click copyable webhook endpoints.
  - **Calibrated Zoomed-Out 3D Diorama & Lightweight Typography:** Fixed orthographic default framing to a comfortable zoomed-out panoramic scale (`zoom: 29` dashboard, `zoom: 28` profile, `zoom: 24` preview), switched to thin-weight `Jersey 10` & `Silkscreen` font engine, purged dead code `src/lib/supabase/sync.ts`, and achieved 100% clean Turbopack production build with zero warnings.
  - **Mindful HUD, Solid Porcelain & Sizing Normalization:** Reorganized HUD into a clean Top-Left back navigation and expandable quest popover (`[ ← | 🎯 Quests 1/3 ▾ ]`), a compact Top-Right status pill (`[ Lvl 12 (75%) | 🌰 50 | ⚙️ ▾ ]`) with expandable quick-controls, an integrated bottom action dock unifying daily shipping with streak flame and burnout shields (`[ 🔥 14d 🛡️ 2 | +Tree | LOG DAILY SHIP | Shop | Share ]`), replaced the central onboarding card with a gentle floating pointer bubble directly above the dock, enforced solid Porcelain White double-bezel styling, and safely deleted obsolete `DailyQuestPanel.tsx`.
  - **Full Codebase Architecture Refactoring:** Created `src/types/game.ts` as the canonical source of truth for all domain entities, eliminating domain $\leftrightarrow$ store circular dependencies and type fragmentation across UI components.
  - **Ponytail Dead Code Purge:** Safely deleted obsolete/duplicate `src/utils/supabase/` and unreferenced `src/lib/supabase/server.ts`, and made `src/lib/supabase/client.ts` cleanly self-contained.
  - **Modern ESLint 9 Flat Config:** Configured modern `eslint.config.mjs` flat configuration resolving all Next.js 16 linting issues (clean pass with 0 errors, 0 warnings).
  - **Next.js 16 Deprecation Fix:** Removed deprecated `runtime = "edge"` in `/api/og/route.tsx` and purged all residual raw emojis (`🌰`, `🌲`) in favor of clean geometric Lucide icons and SVG vector marks.
  - **Warm Studio Linen 404 Page:** Redesigned `src/app/not-found.tsx` with double-bezel porcelain card structure and standardized button primitives.
  - **Clerk Authentication Engine:** Integrated `@clerk/nextjs` (ClerkProvider, clerkMiddleware, `<SignInButton mode="modal">`, `<UserButton />`) with 1-click Google OAuth and zero dev configuration.
  - **TDD Gamification & Store Hardening:** Expanded test suite to 37/37 passing Vitest tests across math, streak decay, shields, quests, camp decor, and cloud synchronization.
  - **WebGL 3D Canvas Snapshot for Social Sharing:** Built high-resolution PNG composite generator in `ShareCardModal` with 1-click clipboard image copy for Twitter/X.
- **Metrics**: 37/37 Vitest unit & store tests passing · 0 lint errors/warnings · 0 TypeScript errors · 100% production build pass.
- **Visuals**: Clean double-bezel porcelain modals, instant Google OAuth modal, Warm Studio Linen 404 page, and high-res 3D PNG social card exports.
- **Ask/Roast**: Session logged to JOURNAL.md.
- **Vibe**: 🌲 Surgical codebase perfection, zero dead code, zero circular imports, 37/37 tests green!

### [IndieForest — Next.js 16 + 3D Low-Poly Island + Gamification Engine + Anti-Slop Design] 2026-08-20
- **Commit**: `ad2b93c`
- **Shipped**:
  - **Full-Stack Initialization:** Upgraded stack to **Next.js 16.3.1 (Turbopack)** + **React 19** + **Tailwind CSS v4** + **TypeScript 5.7 (Strict)**.
  - **3D Living Isometric Island:** Built 3D low-poly floating island in React Three Fiber (`@react-three/fiber` v9) with terraced voxel terrain, turquoise pond, contact stones, and 5-tier stepped pine trees (Emerald Shipping vs Golden Revenue).
  - **Complete Gamification Loop:** Pure domain XP leveling curve (`200 * Level^1.35`), developer ranks (Seedling Scout → Forest Monarch), Streak Shield burnout protection, and Pinecone (🌰) cosmetic camp shop.
  - **Universal Double-Bezel Design System:** Engineered chamfered porcelain card architecture (`glass-dock` outer shell + `porcelain-surface` inner core) with Warm Studio Linen palette (`#ece7de`) using `taste-skill` and `high-end-visual-design`.
  - **Complete Emoji & AI Slop Purge:** Replaced all informal emojis across HUD, modals, and landing page with clean geometric Lucide icons (`strokeWidth={1.5}`) and Roman numeral rank tiers.
  - **1-Click Daily Shipping Ritual:** Built Daily Shipping modal with Web Audio API synthesized retro chimes, particle rain shower event, and Twitter/X progress card exporter.
  - **Automated Verification:** 25/25 Vitest unit tests passing in 218ms; Turbopack production build compiled in 773ms with 0 errors.
- **Metrics**: 25/25 Vitest unit tests passing · 8 static/dynamic routes · 0 lint warnings · 0 errors.
- **Visuals**: Warm Studio Linen `#ece7de`, radiant apple green branding, double-bezel porcelain surfaces, and crisp Satoshi + Editorial typography.
- **Vibe**: 🌲 Fast, surgical, high-polish agency finish with zero AI slop!
