# Graph Report - IndieForest  (2026-08-22)

## Corpus Check
- 216 files · ~109,811 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 578 nodes · 800 edges · 57 communities (38 shown, 19 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.5)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Landing Page UI Modules
- Dashboard Views & Analytics
- Architecture Subsystem 2
- Architecture Subsystem 3
- Architecture Subsystem 4
- Architecture Subsystem 5
- Architecture Subsystem 6
- Architecture Subsystem 7
- Architecture Subsystem 8
- Architecture Subsystem 9
- Architecture Subsystem 10
- Architecture Subsystem 11
- Architecture Subsystem 12
- Architecture Subsystem 13
- Architecture Subsystem 14
- Architecture Subsystem 15
- GitHub & Revenue Ingestion
- Architecture Subsystem 17
- Architecture Subsystem 18
- Architecture Subsystem 19
- Architecture Subsystem 20
- Domain State & Gamification Engine
- Architecture Subsystem 22
- Architecture Subsystem 23
- Architecture Subsystem 24
- Architecture Subsystem 26
- Architecture Subsystem 27
- Architecture Subsystem 28
- Architecture Subsystem 29
- Architecture Subsystem 30
- Architecture Subsystem 31
- Architecture Subsystem 32
- Architecture Subsystem 33
- Architecture Subsystem 34
- Architecture Subsystem 35
- Architecture Subsystem 38
- Architecture Subsystem 40
- Architecture Subsystem 41
- Architecture Subsystem 42
- Architecture Subsystem 44

## God Nodes (most connected - your core abstractions)
1. `useForestStore` - 18 edges
2. `compilerOptions` - 16 edges
3. `compilerOptions` - 16 edges
4. `Button()` - 16 edges
5. `compilerOptions` - 16 edges
6. `Card()` - 15 edges
7. `Badge()` - 14 edges
8. `getRankTitle()` - 13 edges
9. `sound` - 12 edges
10. `SoundEngine` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `isValidGitHubUsername()`  [EXTRACTED]
  src/app/api/github/route.ts → src/lib/github.ts
- `POST()` --calls--> `parseUniversalRevenueEvent()`  [EXTRACTED]
  src/app/api/webhooks/revenue/route.ts → src/lib/revenueWebhook.ts
- `PublicProfilePage()` --calls--> `getRankTitle()`  [EXTRACTED]
  src/app/u/[username]/page.tsx → src/lib/gamification.ts
- `DashboardModulesListProps` --references--> `TreeData`  [EXTRACTED]
  src/components/dashboard/DashboardModulesList.tsx → src/types/game.ts
- `LandingHero()` --calls--> `useForestStore`  [EXTRACTED]
  src/components/landing/LandingHero.tsx → src/store/useForestStore.ts

## Import Cycles
- None detected.

## Communities (57 total, 19 thin omitted)

### Community 0 - "Landing Page UI Modules"
Cohesion: 0.07
Nodes (40): PublicProfileProps, DashboardHeaderProps, DashboardStatsGridProps, AddTreeModalProps, TAB_OPTIONS, GuestbookModal(), GuestbookModalProps, SettingsModalProps (+32 more)

### Community 1 - "Dashboard Views & Analytics"
Cohesion: 0.08
Nodes (51): GET(), GET(), GET(), GitHubRawCommit, DashboardPage(), PublicProfilePage(), DashboardHeader(), DashboardInfoCards() (+43 more)

### Community 2 - "Architecture Subsystem 2"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, @eslint/eslintrc, devDependencies, eslint, eslint-config-next, @eslint/eslintrc, postcss (+25 more)

### Community 3 - "Architecture Subsystem 3"
Cohesion: 0.07
Nodes (28): dependencies, @clerk/tanstack-react-start, react, react-dom, @tanstack/react-router, @tanstack/react-router-devtools, @tanstack/react-start, devDependencies (+20 more)

### Community 4 - "Architecture Subsystem 4"
Cohesion: 0.07
Nodes (27): .next/dev/types/**/*.ts, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+19 more)

### Community 5 - "Architecture Subsystem 5"
Cohesion: 0.07
Nodes (26): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+18 more)

### Community 6 - "Architecture Subsystem 6"
Cohesion: 0.08
Nodes (24): dependencies, @clerk/react, react, react-dom, devDependencies, @types/react, @types/react-dom, typescript (+16 more)

### Community 7 - "Architecture Subsystem 7"
Cohesion: 0.08
Nodes (25): canvas-confetti, lucide-react, dependencies, canvas-confetti, @clerk/nextjs, lucide-react, next, react (+17 more)

### Community 8 - "Architecture Subsystem 8"
Cohesion: 0.08
Nodes (23): compilerOptions, allowJs, baseUrl, esModuleInterop, forceConsistentCasingInFileNames, isolatedModules, jsx, lib (+15 more)

### Community 9 - "Architecture Subsystem 9"
Cohesion: 0.09
Nodes (22): dependencies, @clerk/chrome-extension, plasmo, react, react-dom, displayName, react, react-dom (+14 more)

### Community 10 - "Architecture Subsystem 10"
Cohesion: 0.09
Nodes (22): dependencies, @clerk/react-router, react, react-dom, react-router, devDependencies, @react-router/dev, @react-router/node (+14 more)

### Community 11 - "Architecture Subsystem 11"
Cohesion: 0.09
Nodes (21): dependencies, @clerk/nextjs, next, react, react-dom, devDependencies, @types/react, @types/react-dom (+13 more)

### Community 12 - "Architecture Subsystem 12"
Cohesion: 0.10
Nodes (19): dependencies, @clerk/vue, vue, devDependencies, typescript, vite, @vitejs/plugin-vue, vue-tsc (+11 more)

### Community 13 - "Architecture Subsystem 13"
Cohesion: 0.15
Nodes (12): dependencies, astro, @astrojs/node, @clerk/astro, name, scripts, build, dev (+4 more)

### Community 14 - "Architecture Subsystem 14"
Cohesion: 0.18
Nodes (10): dependencies, @clerk/nuxt, nuxt, name, private, scripts, build, dev (+2 more)

### Community 15 - "Architecture Subsystem 15"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, jsx, module, moduleResolution, skipLibCheck, strict, target (+2 more)

### Community 16 - "GitHub & Revenue Ingestion"
Cohesion: 0.25
Nodes (8): POST(), LemonSqueezyWebhookPayload, parseUniversalRevenueEvent(), PolarWebhookPayload, StripeEventObject, StripeWebhookPayload, ZERO_DECIMAL_CURRENCIES, NormalizedCustomerTree

### Community 18 - "Architecture Subsystem 18"
Cohesion: 0.22
Nodes (8): compilerOptions, jsx, lib, moduleResolution, strict, target, DOM, ES2022

### Community 19 - "Architecture Subsystem 19"
Cohesion: 0.32
Nodes (6): auth.users, public.handle_new_user, on_auth_user_created, public.profiles, public.ship_logs, public.trees

### Community 21 - "Domain State & Gamification Engine"
Cohesion: 0.29
Nodes (6): printWidth, semi, singleQuote, tabWidth, trailingComma, useTabs

### Community 22 - "Architecture Subsystem 22"
Cohesion: 0.29
Nodes (5): geistMono, instrumentSerif, jakartaSans, metadata, vt323

## Knowledge Gaps
- **260 isolated node(s):** `name`, `type`, `dev`, `build`, `astro` (+255 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **19 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `SoundEngine` connect `Architecture Subsystem 17` to `Landing Page UI Modules`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `dependencies` connect `Architecture Subsystem 7` to `Architecture Subsystem 2`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `name`, `type`, `dev` to the rest of the system?**
  _260 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Landing Page UI Modules` be split into smaller, more focused modules?**
  _Cohesion score 0.07191780821917808 - nodes in this community are weakly interconnected._
- **Should `Dashboard Views & Analytics` be split into smaller, more focused modules?**
  _Cohesion score 0.07884615384615384 - nodes in this community are weakly interconnected._
- **Should `Architecture Subsystem 2` be split into smaller, more focused modules?**
  _Cohesion score 0.058823529411764705 - nodes in this community are weakly interconnected._
- **Should `Architecture Subsystem 3` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._