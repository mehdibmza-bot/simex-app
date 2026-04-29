# SIMEX 2.0 — Furniture Hardware E-commerce

Production-grade Next.js e-commerce platform for SIMEX, the Tunisian leader in furniture hardware (charnières, glissières, poignées, éclairage LED, accessoires de cuisine).

## Stack

- **Next.js 15** (App Router, RSC, Server Actions)
- **TypeScript** strict
- **Tailwind CSS** + **shadcn/ui** primitives
- **Prisma** + **PostgreSQL**
- **Redis** (ioredis) — live order updates, sessions
- **Zustand** — client cart/wishlist state
- **Recharts** — admin analytics
- **Framer Motion** — micro-animations
- **JOSE** (JWT) — stateless auth
- **Zod** — runtime validation
- **i18n** — FR / EN / AR (with RTL)

## Features

### Customer
- Trilingual storefront (FR / EN / AR with RTL)
- Auto-rotating hero slider
- Live "Happy Hour" countdown
- 8 product categories
- Product catalog with filters
- Project Builder (BOM generator)
- Cart drawer + wishlist drawer (Zustand)
- Account modal (sign-in / register)
- Search dialog with live suggestions
- Mission, FAQ, Newsletter
- WhatsApp click-to-chat
- Tunisia payment rails: ClicToPay / D17 / Konnect / COD

### Pro Hub (B2B)
- 4 tiers (Bronze 10% → Diamond 25%)
- 30-day payment terms
- Priority delivery + dedicated advisor

### Admin
- KPI dashboard (revenue, orders, AOV, conversion)
- Sales chart (daily / weekly / monthly)
- Recent orders table
- Product CRUD
- Order status workflow

## Quick Start

```bash
# 1. Install
npm install

# 2. Set up environment
cp .env.example .env
# Edit .env: set DATABASE_URL to your Postgres instance

# 3. Generate Prisma client + push schema
npm run db:generate
npm run db:push

# 4. Seed demo data (categories, products, users, orders)
npm run db:seed

# 5. Run dev server
npm run dev
```

Open http://localhost:3000

### Demo accounts
- **Admin**: `admin@simex.tn` / `admin123`
- **Pro Gold**: `menuisier@example.tn` / `pro123`

## Project Structure

```
src/
├── app/
│   ├── (storefront)/         # Customer-facing pages
│   │   ├── page.tsx          # Home
│   │   ├── products/
│   │   ├── cart/
│   │   └── account/
│   ├── admin/                # Admin dashboard
│   ├── api/                  # REST endpoints
│   ├── layout.tsx            # Root layout (fonts, providers)
│   └── globals.css           # Brand tokens
├── components/
│   ├── ui/                   # shadcn primitives
│   ├── layout/               # Header, footer, nav
│   ├── home/                 # Hero, categories, etc.
│   ├── product/              # Product card, quick view
│   └── admin/                # Charts, KPI cards
├── lib/
│   ├── db.ts                 # Prisma client
│   ├── store.ts              # Zustand stores
│   ├── i18n.ts               # i18n provider
│   ├── auth.ts               # JWT helpers
│   └── utils.ts              # cn, formatters
└── data/
    └── i18n-dictionaries.ts  # FR / EN / AR translations
prisma/
├── schema.prisma             # DB schema
└── seed.ts                   # Demo data
```

## Roadmap

- [x] Storefront homepage with all sections
- [x] Product catalog + detail
- [x] Cart / wishlist / search / account
- [x] Admin dashboard with Recharts
- [x] Multilanguage FR / EN / AR + RTL
- [ ] Stripe-style checkout (ClicToPay live integration)
- [ ] Driver tracking PWA
- [ ] AI advisor (SIMA) chat widget
- [ ] AR product preview (WebXR)
- [ ] Visual search (CLIP)

## Brand

Black `#0A0A0A` + Red `#E1252A` — preserved from the original SIMEX logo.
Display: Bebas Neue / Sans: Inter / Arabic: Cairo.

---

© 2026 SIMEX · societesimex@gmail.com · +216 97 730 083
