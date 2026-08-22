# CONTEXT.md — Domain Language & Rules
# Read at the START of EVERY session.

---

## Core Entities

| Term | What it means in THIS app | Never call it |
|---|---|---|
| **Island** | The floating 3D low-poly voxel terrain diorama representing a developer's startup ecosystem | Map, Level, Board, World |
| **Daily Ship** | A verified unit of daily coding progress logged via GitHub commit sync or 1-click checkoff | Check-in, Task completion, Tick, Log entry |
| **Emerald Tree** | A 3D stepped pine tree placed in the West Shipping Grove, grown purely through code commits and daily ships | Green tree, Pine pin |
| **Golden Tree** | A 3D golden pine tree placed in the East Revenue Grove, sprouted and expanded through paying customers and MRR | Gold tree, Cash pin |
| **Growth Tier** | The 5 visual stages of a tree (`sapling`, `young`, `mature`, `majestic`, `stump`) | Tree level, Size, Rank |
| **Drought** | The state of withered foliage and fog triggered when shipping days are missed without active shields | Decay, Punishment, Penalty |
| **Streak Shield** | An inventory item earned every 7-day streak (capped at 2) that automatically protects streaks during rest days | Freeze, Pass, Cheat token |
| **Builder Capsule** | The Top-Left game HUD capsule displaying builder avatar, rank Roman numeral, level, XP bar, streak flame, and 30-day health ratio | Header, Profile bar |
| **Floating Dock** | The consolidated bottom porcelain control dock housing streak status, campfire focus CTA, tree planter, rest vault, timeline scrubber, turntable exporter, and share card | Bottom navbar, Taskbar, Menu bar |
| **Module Inventory Drawer** | The right-hand slide-over tactical drawer for searching, filtering by grove (Shipping vs. Revenue), and managing projects without unmounting the 3D diorama canvas | Modules page, Table, Dashboard grid |
| **Tree Inspector Card** | The floating in-world porcelain card displayed when any 3D tree is clicked directly on the island | Detail modal, Tooltip |
| **Timeline Scrubber** | Interactive bottom time-travel slider and 10s auto time-lapse player that reconstructs historical island growth | History bar, Playback, Rewind |
| **README Badge** | Live dynamic SVG rendered at `/api/badge/[username]` for embedding in GitHub Profile READMEs | Widget, Banner, Sticker |
| **Visitor Cheer** | 1-click "Water Tree" particle action by public visitors that sends cheer XP to the founder | Like, Upvote, Claps |
| **Double-Bezel** | Universal porcelain UI architecture with an outer shell (`glass-dock`) and inner porcelain core (`porcelain-surface`) in solid white | Glassmorphism, Card outline |

---

## Business Rules & Invariants

1. **Dual-Grove Independence:** Pre-revenue builders can thrive with $0 MRR. Emerald shipping pines level up purely from commits (`Sapling` at 1 commit, `Young` at 8 commits, `Mature` at 25 commits, `Majestic` at 60 commits).
2. **Pure Progression (No Cheating):** Tree tiers are computed automatically by pure domain logic in `src/lib/gamification.ts` based on commits or MRR.
3. **Streak Safety:** If a calendar day is missed and `streakShields > 0`, 1 shield is consumed and the streak is preserved. If `streakShields === 0`, drought mode activates and the streak resets to 0.
4. **Universal Revenue Webhooks:** Universal webhook route `/api/webhooks/revenue` parses Stripe, Lemon Squeezy, and Polar payloads into verified Customer Trees in `src/lib/revenueWebhook.ts`.
5. **Zero Slop:** No decorative emojis in UI text. Use geometric Lucide icons (`strokeWidth={1.5}`) and clean Roman numerals for tier badges.
6. **Full-Screen Game Architecture:** `/dashboard` is a fixed `100vw × 100vh` game environment with zero document scrolling. All interactions occur via floating tactical HUD overlays.

---

## User Roles

| Role | Capabilities | Restrictions |
|---|---|---|
| **Developer / Indie Hacker** | Log daily ships, plant project & revenue trees, manage module inventory, export 3D social cards and 10s video reels, schedule sabbaticals | — |
| **Visitor / Public Viewer** | View 3D island, orbit diorama parallax, view public ship history and stats at `/u/[username]`, send visitor cheers | Cannot modify island state |
