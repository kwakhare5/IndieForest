# Graph Report - IndieForest  (2026-08-21)

## Corpus Check
- Corpus is ~24,232 words - fits in a single context window. You may not need a graph.

## Summary
- 263 nodes · 499 edges · 19 communities (14 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Public Profiles & Brand Logos
- Linting & Config Toolchain
- 3D Game Dashboard & Diorama Canvas
- TypeScript Runtime & Compiler Config
- NPM Dependencies & Visual Icons
- Gamification Logic & 3D Terrain
- Landing Page & Marketing Bento
- Web Audio Sound Synthesis Engine
- Universal Revenue Webhook API
- Code Formatting & Prettier
- Typography & Root Layout
- Supabase Session Middleware
- Supabase SSR OAuth Callback
- React Three Fiber Declarations
- GitHub Commit Verification API
- Next.js Turbopack Build Config
- Tailwind CSS Configuration

## God Nodes (most connected - your core abstractions)
1. `useForestStore` - 38 edges
2. `compilerOptions` - 16 edges
3. `Badge()` - 13 edges
4. `Button()` - 13 edges
5. `Card()` - 11 edges
6. `sound` - 10 edges
7. `TreeData` - 9 edges
8. `getRankTitle()` - 9 edges
9. `SoundEngine` - 9 edges
10. `GrowthTier` - 8 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `parseUniversalRevenueEvent()`  [EXTRACTED]
  src/app/api/webhooks/revenue/route.ts → src/lib/revenueWebhook.ts
- `DashboardPage()` --calls--> `useForestStore`  [EXTRACTED]
  src/app/dashboard/page.tsx → src/store/useForestStore.ts
- `LandingPage()` --calls--> `useForestStore`  [EXTRACTED]
  src/app/page.tsx → src/store/useForestStore.ts
- `BlockTreeProps` --references--> `TreeData`  [EXTRACTED]
  src/components/canvas/BlockTree.tsx → src/lib/gamification.ts
- `ForestCanvasProps` --references--> `TreeData`  [EXTRACTED]
  src/components/canvas/ForestCanvas.tsx → src/lib/gamification.ts

## Import Cycles
- None detected.

## Communities (19 total, 5 thin omitted)

### Community 0 - "Public Profiles & Brand Logos"
Cohesion: 0.10
Nodes (32): PublicProfileProps, AddTreeModalProps, TAB_OPTIONS, TIER_OPTIONS, TYPE_OPTIONS, AuthModalProps, CampShopModal(), CampShopModalProps (+24 more)

### Community 1 - "Linting & Config Toolchain"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+25 more)

### Community 2 - "3D Game Dashboard & Diorama Canvas"
Cohesion: 0.13
Nodes (22): DashboardPage(), ForestCanvas, ForestCanvas, PublicProfilePage(), BlockTree(), CampProps(), ForestCanvas(), TIER_OPTIONS (+14 more)

### Community 3 - "TypeScript Runtime & Compiler Config"
Cohesion: 0.07
Nodes (27): dom, dom.iterable, esnext, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts (+19 more)

### Community 4 - "NPM Dependencies & Visual Icons"
Cohesion: 0.07
Nodes (27): canvas-confetti, lucide-react, next, dependencies, canvas-confetti, lucide-react, next, react (+19 more)

### Community 5 - "Gamification Logic & 3D Terrain"
Cohesion: 0.15
Nodes (23): BlockTreeProps, ForestCanvasProps, calculateShipRewards(), CampDecorItem, completeDailyQuest(), DailyQuest, DEFAULT_CAMP_DECOR_CATALOG, evaluateLevelProgress() (+15 more)

### Community 6 - "Landing Page & Marketing Bento"
Cohesion: 0.27
Nodes (10): ForestCanvas, LandingPage(), MILESTONE_OPTIONS, PREVIEW_TREES, SHIELD_OPTIONS, AuthModal(), signInWithGithub(), signInWithGoogle() (+2 more)

### Community 8 - "Universal Revenue Webhook API"
Cohesion: 0.46
Nodes (5): POST(), GrowthTier, calculateTreeTierFromMrr(), NormalizedCustomerTree, parseUniversalRevenueEvent()

### Community 9 - "Code Formatting & Prettier"
Cohesion: 0.29
Nodes (6): printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 10 - "Typography & Root Layout"
Cohesion: 0.29
Nodes (5): geistMono, instrumentSerif, jakartaSans, metadata, vt323

### Community 11 - "Supabase Session Middleware"
Cohesion: 0.60
Nodes (3): config, middleware(), updateSession()

### Community 13 - "React Three Fiber Declarations"
Cohesion: 0.50
Nodes (3): IntrinsicElements, JSX, React

## Knowledge Gaps
- **111 isolated node(s):** `semi`, `trailingComma`, `singleQuote`, `tabWidth`, `useTabs` (+106 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `useForestStore` connect `3D Game Dashboard & Diorama Canvas` to `Public Profiles & Brand Logos`, `Gamification Logic & 3D Terrain`, `Landing Page & Marketing Bento`?**
  _High betweenness centrality (0.039) - this node is a cross-community bridge._
- **Why does `dependencies` connect `NPM Dependencies & Visual Icons` to `Linting & Config Toolchain`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **What connects `semi`, `trailingComma`, `singleQuote` to the rest of the system?**
  _111 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Public Profiles & Brand Logos` be split into smaller, more focused modules?**
  _Cohesion score 0.09693877551020408 - nodes in this community are weakly interconnected._
- **Should `Linting & Config Toolchain` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `3D Game Dashboard & Diorama Canvas` be split into smaller, more focused modules?**
  _Cohesion score 0.12903225806451613 - nodes in this community are weakly interconnected._
- **Should `TypeScript Runtime & Compiler Config` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._