# CONTEXT.md — Domain Language & Rules
# Read at the START of EVERY session.

---

## Core Entities

| Term | What it means in THIS app | Never call it |
|---|---|---|
| **Island** | The floating 3D low-poly voxel terrain diorama representing a developer's startup | Map, Level, Board, World |
| **Daily Ship** | A verified unit of daily coding progress logged via GitHub commit sync or 1-click manual checkoff | Check-in, Task completion, Tick, Log entry |
| **Emerald Tree** | A 3D stepped pine tree placed in the shipping grove, grown purely through code commits and daily ships | Green tree, Pine pin |
| **Golden Tree** | A 3D golden pine tree placed in the revenue grove, sprouted and expanded through paying customers and MRR | Gold tree, Cash pin |
| **Growth Tier** | The 5 visual stages of a tree (`sapling`, `young`, `mature`, `majestic`, `stump`) | Tree level, Size, Rank |
| **Drought** | The state of withered foliage and fog triggered when shipping days are missed without active shields | Decay, Punishment, Penalty |
| **Streak Shield** | An inventory item earned every 7-day streak (capped at 2) that automatically protects streaks during rest days | Freeze, Pass, Cheat token |
| **Pinecones** | In-game spendable currency earned through daily consistency and leveling up for camp decor | Coins, Credits, Tokens, Points |
| **Floating Dock** | The consolidated bottom double-bezel control dock housing streak status, ship CTA, tree planter, shop, and share | Bottom navbar, Taskbar, Menu bar |
| **Timeline Scrubber** | Interactive bottom time-travel slider and 10s auto time-lapse player that reconstructs historical island growth | History bar, Playback, Rewind |
| **README Badge** | Live dynamic SVG rendered at `/api/badge/[username]` for embedding in GitHub Profile READMEs | Widget, Banner, Sticker |
| **Visitor Cheer** | 1-click "Water Tree" particle action by public visitors that sends cheer XP to the founder | Like, Upvote, Claps |
| **Double-Bezel** | Universal porcelain UI architecture with an outer shell (`glass-dock`) and inner porcelain core (`porcelain-surface`) | Nested border, Card outline |

---

## Business Rules & Invariants

1. **Dual-Grove Independence:** Pre-revenue builders can thrive with $0 MRR. Emerald shipping pines level up purely from commits (`Sapling` at 1 ship, `Young` at 8 ships, `Mature` at 25 ships, `Majestic` at 60 ships).
2. **Pure Progression (No Cheating):** Tree tiers are computed automatically by pure domain logic in `src/lib/gamification.ts` based on commits or MRR.
3. **Streak Safety:** If a calendar day is missed and `streakShields > 0`, 1 shield is consumed and the streak is preserved. If `streakShields === 0`, drought mode activates and the streak resets to 0.
4. **Universal Revenue Webhooks:** Universal webhook route `/api/webhooks/revenue` parses Stripe, Lemon Squeezy, and Polar payloads into verified Customer Trees in `src/lib/revenueWebhook.ts`.
5. **Zero Slop:** No decorative emojis in UI text. Use geometric Lucide icons and clean Roman numerals for tier badges.

---

## User Roles

| Role | Capabilities | Restrictions |
|---|---|---|
| **Developer / Indie Hacker** | Log daily ships, plant project & revenue trees, buy camp decor, export 3D social cards, switch lighting | — |
| **Visitor / Public Viewer** | View 3D island, orbit diorama parallax, view public ship history and stats at `/u/[username]`, send visitor cheers | Cannot modify island state |
