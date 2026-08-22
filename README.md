# IndieForest

IndieForest is a gamified momentum and accountability dashboard for indie hackers and developers that turns daily shipping into living visual progress. Connect your GitHub repositories or revenue webhooks to track consistent daily shipping, build momentum, level up your rank, and share verified progress cards.

---

## Key Features

- **Zero-Touch GitHub Ingestion:** Automatically detects daily git commit pushes from public repositories and updates your shipping streak with verified commit proof.
- **Universal Revenue Webhooks:** Ingest subscription and payment events across Stripe, Lemon Squeezy, and Polar into tracked revenue milestones.
- **Dual-Grove Progression:**
  - **Emerald Shipping Grove:** Track code repositories from Sapling to Majestic Pines based on active shipping days and commit volume.
  - **Golden Revenue Grove:** Track customer subscriptions and monthly recurring revenue (MRR) milestones.
- **Burnout Protection & Streak Shields:** 7-day shipping milestones grant Streak Shields that protect streaks during rest days.
- **Dynamic README SVG Badges (`/api/badge/[username]`):** Server-rendered live badges for GitHub profile README files in card and pill formats.
- **Tactile Porcelain Design System:** Universal double-bezel UI architecture engineered with Warm Studio Linen (`#ece7de`) and crisp physical micro-physics.
- **1-Click Shareable Progress Cards:** Export high-resolution verified progress graphics with human-crafted copy ready for public building on X/Twitter.

---

## Tech Stack

- **Framework:** Next.js 16.3.1 (App Router with Turbopack)
- **UI & Runtime:** React 19, TypeScript 5.7+
- **Styling:** Tailwind CSS v4, Lucide React icons
- **Authentication:** Clerk (`@clerk/nextjs`) with Google OAuth and session management
- **State Management:** Zustand 5.0.3 with local persistence
- **Testing:** Vitest 4.1.11 with 100% test-driven domain core (43/43 tests passing)
- **Audio:** Synthesized Web Audio API retro chimes
- **Deployment:** Vercel Edge & Serverless Runtime

---

## Prerequisites

- **Node.js:** version 20.x or higher
- **Package Manager:** `npm` (v10+), `pnpm`, or `yarn`
- **Clerk Account:** Free API keys from [Clerk.com](https://clerk.com) for authentication

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/kwakhare5/IndieForest.git
cd IndieForest
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Populate the required environment variables:

```ini
# Clerk Authentication Keys (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Public Application URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional Webhook Secrets
REVENUE_WEBHOOK_SECRET=whsec_...
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## Architecture & Directory Structure

```
IndieForest/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── badge/[username]/route.ts  # Dynamic SVG README badges
│   │   │   ├── github/route.ts            # Public GitHub commit sync endpoint
│   │   │   ├── github/preview/route.ts    # Instant profile preview endpoint
│   │   │   ├── og/route.tsx               # OpenGraph social card generator
│   │   │   └── webhooks/revenue/route.ts  # Stripe/LemonSqueezy/Polar webhook handler
│   │   ├── dashboard/page.tsx             # Main authenticated builder dashboard
│   │   ├── u/[username]/page.tsx          # Public diorama showcase profile
│   │   ├── layout.tsx                     # Root layout with ClerkProvider
│   │   └── page.tsx                       # Modular landing page composer
│   ├── components/
│   │   ├── landing/                       # Modular landing subcomponents
│   │   │   ├── LandingNavbar.tsx          # Sticky navigation bar
│   │   │   ├── LandingHero.tsx            # Hero section with interactive preview
│   │   │   ├── LandingRitual.tsx          # Daily shipping ritual breakdown
│   │   │   ├── LandingShowcase.tsx        # Multi-device diorama showcase
│   │   │   ├── LandingBento.tsx           # Feature bento grid
│   │   │   ├── LandingFaq.tsx             # Accordion FAQ section
│   │   │   └── LandingFooter.tsx          # Footer with social links
│   │   ├── dashboard/                     # Modular dashboard subcomponents
│   │   │   ├── DashboardHeader.tsx        # Builder identity and action bar
│   │   │   ├── DashboardStatsGrid.tsx     # Consistency and streak metrics
│   │   │   ├── DashboardModulesList.tsx   # Active shipping & revenue modules
│   │   │   └── DashboardInfoCards.tsx     # README badge & webhook setup guides
│   │   ├── hud/                           # Overlay modals and tools
│   │   │   ├── AddTreeModal.tsx           # Module planter and webhook URL copier
│   │   │   ├── GuestbookModal.tsx         # Public visitor guestbook
│   │   │   ├── SettingsModal.tsx          # Account settings and data sync
│   │   │   └── ShareCardModal.tsx         # Progress graphic generator
│   │   └── ui/                            # Atomic porcelain design system
│   │       ├── Badge.tsx                  # Status pills and Roman rank badges
│   │       ├── Button.tsx                 # Tactile specular action buttons
│   │       ├── Card.tsx                   # Double-bezel porcelain card enclosures
│   │       ├── Modal.tsx                  # Double-bezel modal enclosure
│   │       └── SegmentedControl.tsx       # Sliding tab controls
│   ├── lib/
│   │   ├── badge.ts                       # Server-side SVG rendering logic
│   │   ├── curatedBuilders.ts             # Famous indie builder showcase profiles
│   │   ├── gamification.ts                # Pure domain math: XP, tiers, streak shields
│   │   ├── github.ts                      # Zero-touch GitHub event parser & streak calculator
│   │   ├── revenueWebhook.ts              # Universal webhook parser (Stripe/LS/Polar)
│   │   └── sound.ts                       # Synthesized Web Audio API retro chimes
│   ├── store/
│   │   └── useForestStore.ts              # Zustand reactive state with local persistence
│   └── types/
│       └── game.ts                        # Canonical domain entities and interfaces
```

---

## Domain Math & Gamification Mechanics

All progression and consistency math is implemented as pure, side-effect-free TypeScript functions in `src/lib/gamification.ts`:

### 1. Developer Rank Progression

| Tier | Level Range | Rank Title | Badge |
| :--- | :--- | :--- | :--- |
| **Tier I** | Levels 1–3 | Sprout Planter | `I` |
| **Tier II** | Levels 4–7 | Grove Cultivator | `II` |
| **Tier III** | Levels 8–12 | Timber Craftsman | `III` |
| **Tier IV** | Levels 13–19 | Island Architect | `IV` |
| **Tier V** | Level 20+ | Forest Sovereign | `V` |

### 2. Module Growth Tiers

- **Shipping Track (Emerald):**
  - **Sapling:** 1–7 commits / active days
  - **Young:** 8–24 commits
  - **Mature:** 25–59 commits
  - **Majestic:** 60+ commits (with anti-bot spam protections requiring multi-day activity)
- **Revenue Track (Golden):**
  - **Sapling:** $1–$49 /mo MRR
  - **Young:** $50–$499 /mo MRR
  - **Mature:** $500–$1,999 /mo MRR
  - **Majestic:** $2,000+ /mo MRR
- **Stump (Dormant):** Churned subscriptions or archived repositories.

### 3. Streak & Burnout Shield Rules

- Each consecutive shipping day increments `streakDays` by 1.
- Every 7-day milestone grants **+1 Streak Shield** (capped at 2 shields maximum).
- Missing a calendar day automatically consumes 1 active shield to preserve the streak.
- If zero shields are available upon missing a day, `drought` state triggers and streak resets to 0.

---

## API Reference & Webhooks

### 1. Public GitHub Commit Ingestion (`/api/github`)

- **Method:** `GET /api/github?username={github_handle}`
- **Description:** Queries public GitHub push events, calculates current streak and active repositories, and triggers automatic ship rewards.
- **Validation:** Enforces standard GitHub RFC username validation regex (`^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$`).

### 2. Universal Revenue Webhook (`/api/webhooks/revenue`)

- **Method:** `POST /api/webhooks/revenue?userId={user_id}`
- **Supported Providers:**
  - **Stripe:** `invoice.payment_succeeded`, `customer.subscription.created`, `customer.subscription.deleted`
  - **Lemon Squeezy:** `subscription_created`, `subscription_cancelled`
  - **Polar:** `order.created`, `subscription.canceled`
- **Output:** Normalizes payloads into standardized `NormalizedCustomerTree` structures and updates growth tiers.

### 3. Live README SVG Badges (`/api/badge/[username]`)

- **Method:** `GET /api/badge/[username]?style=card|pill`
- **Response:** Raw SVG image with `Cache-Control: public, max-age=1800` and CSP security headers.
- **Markdown Embed:**
  ```markdown
  [![IndieForest](https://indieforest.dev/api/badge/kwakhare5)](https://indieforest.dev/u/kwakhare5)
  ```

---

## Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Next.js Turbopack development server on `http://localhost:3000` |
| `npm run build` | Compiles optimized Next.js production build with Turbopack |
| `npm test` | Runs the full Vitest unit test suite (43/43 domain tests) |
| `npm run lint` | Runs ESLint and TypeScript checks across the entire codebase |

---

## Testing

IndieForest uses **Vitest** for fast unit and domain testing:

```bash
npm test
```

Test coverage includes:
- `src/lib/gamification.test.ts` — XP curves, level ups, streak decay, shield absorption, anti-spam tier scaling.
- `src/lib/revenueWebhook.test.ts` — Stripe, Lemon Squeezy, and Polar webhook payload normalization.
- `src/lib/github.test.ts` — GitHub push events parsing and streak calculations.
- `src/lib/badge.test.ts` — Dynamic SVG badge generation and XSS sanitization.
- `src/store/useForestStore.test.ts` — Zustand store mutations, shipping logs, and reset safety.

---

## Deployment (Vercel)

IndieForest is optimized for 1-click deployment on **Vercel**:

1. Push your code to a GitHub repository.
2. Import the repository into the [Vercel Dashboard](https://vercel.com).
3. Set the Environment Variables (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`).
4. Deploy.

---

## License

This project is open source and available under the [MIT License](LICENSE).
