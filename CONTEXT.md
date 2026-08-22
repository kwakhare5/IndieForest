# CONTEXT.md — Domain Language, Invariants & Rules
# Read at the START of EVERY session.

---

## 1. Core Domain Entities

| Term | What it means in THIS app | Never call it |
| :--- | :--- | :--- |
| **Diorama / Island** | The visual 1:1 symmetrical square workspace representing a founder's active projects & revenue streams | Map, Board, World, Farm |
| **Modular Slabs** | Expanding 1:1 square isometric terrain blocks ($9\times 9, 12\times 12, 15\times 15, 18\times 18$) | Void, Rectangle, Floor |
| **Daily Ship** | A verified unit of daily progress logged via GitHub commit sync or manual log | Check-in, Task completion, Tick |
| **Alpine Conifer Pine** | Shipping module tree grown through code commits & daily active shipping | Green tree, Pine pin |
| **Golden Money Oak** | Revenue module tree sprouted and grown through customer subscriptions & MRR | Gold tree, Cash pin |
| **Growth Tier** | The 5 growth stages of a tree (`sapling`, `young`, `mature`, `majestic`, `stump`) | Level, Size, Rank |
| **Streak Shield** | Burnout protection item earned every 7 shipping days (max 2) defending against rest days | Freeze, Pass, Cheat token |
| **Drought** | Visual state indicating missed shipping days after all streak shields are exhausted | Penalty, Decay, Failure |
| **Double-Bezel** | Universal porcelain UI architecture with an outer enclosure and inner tactile card | Nested border, Card outline |
| **Anchored Popover** | Lightweight floating porcelain cards anchored directly to HUD capsules | Full-screen drawer, Side panel |
| **README Badge** | Server-rendered dynamic SVG at `/api/badge/[username]` for GitHub profile READMEs | Widget, Banner, Sticker |
| **Visitor Cheer** | 1-click "Water Tree" action by public visitors giving cheer XP to the builder | Like, Upvote, Claps |
| **Golden Companion** | Standing 4-legged mascot dog with animated tail wagging, curious head tilts, and jump physics | Blob, Sleeping lump |

---

## 2. Business Rules & Invariants

1. **Dual-Grove Independence:** Pre-revenue builders can thrive with $0 MRR. Emerald shipping pines grow purely from commits and active days.
2. **Species Integrity:** GitHub shipping repositories strictly render as Alpine Conifer Pines (`ConiferTree.tsx`); Stripe revenue streams strictly render as Golden Broadleaf Money Oaks (`DeciduousTree.tsx`).
3. **Pure Progression (No Cheating):** Tree tiers are computed automatically by pure domain logic in `src/lib/gamification.ts` based on commits, active days, or MRR. Anti-spam bot protections prevent 1-day commit flood gaming.
4. **Streak Safety:** If a calendar day is missed and `streakShields > 0`, 1 shield is consumed and the streak is preserved. If `streakShields === 0`, drought mode triggers and the streak resets to 0.
5. **Universal Revenue Ingestion:** Universal webhook route `/api/webhooks/revenue` parses Stripe, Lemon Squeezy, and Polar payloads into verified modules.
6. **Zero Slop:** No decorative emojis in UI text. Use geometric Lucide icons and clean Roman numerals for tier badges.
7. **Cloud Resilience:** Zustand store auto-syncs with Supabase PostgreSQL (`public.profiles`, `public.trees`, `public.ship_logs`, `public.guestbook_entries`) while retaining instant offline localStorage capability.

---

## 3. User Roles

| Role | Capabilities | Restrictions |
| :--- | :--- | :--- |
| **Developer / Indie Hacker** | Log daily ships, plant project & revenue trees, configure webhooks, export progress cards | — |
| **Visitor / Public Viewer** | View public diorama at `/u/[username]`, leave guestbook notes, send visitor cheers | Cannot modify island state |
