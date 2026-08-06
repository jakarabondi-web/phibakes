# PhiBakes

**Beautiful cakes, baked for your moment.**

PhiBakes is a premium cake ordering and bakery management platform for a
Nairobi-based cake studio — combining a boutique storefront, a custom cake
builder, M-PESA payments, real-time order tracking, and a full operations
dashboard for the bakery owner.

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19, TypeScript
- **Styling:** Tailwind CSS v4 with a custom design system (brand tokens, dark mode)
- **UI:** shadcn-style component library on Radix UI primitives, Framer Motion, Recharts
- **Data:** Prisma ORM + PostgreSQL (schema in `prisma/schema.prisma`), with a typed mock-data layer (`src/lib/data/`) so the UI runs fully styled without a live database
- **Payments:** Safaricom Daraja (M-PESA STK Push) integration scaffolding in `src/lib/services/mpesa.ts`
- **Notifications:** Resend (email) and Twilio (SMS/WhatsApp) service stubs in `src/lib/services/`

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app runs fully styled out of the box using the mock data layer — no
database or third-party credentials are required for local development.

## Project Structure

- `src/app/(site)/` — public storefront: homepage, catalog, cake details, custom cake builder, cart, checkout, order tracking, static/info pages, auth
- `src/app/account/` — customer portal: orders, quotes, invoices, payments, addresses, wishlist, rewards, notifications, support, profile
- `src/app/dashboard/` — owner/admin dashboard: overview, orders, quotes, customers, calendar, production, inventory, recipes, suppliers, payments, reports, marketing, gallery, reviews, staff, delivery, settings, audit logs
- `src/app/api/` — route handlers for cakes, orders, quotes, inventory, M-PESA (STK push/callback/status), and notifications
- `src/components/ui/` — the design system's component library
- `src/lib/data/` — mock data (cakes, orders, quotes, inventory, customers, etc.)
- `src/lib/services/` — third-party integration stubs (M-PESA, email, SMS/WhatsApp)
- `prisma/schema.prisma` — full production data model

## Going to production

Copy `.env.example` to `.env` and fill in real credentials to move from the
mock-data layer to a live database and real integrations:

- `DATABASE_URL` — a Postgres connection string (Neon recommended)
- `MPESA_*` — Safaricom Daraja API credentials for M-PESA STK Push
- `RESEND_API_KEY` — for transactional email
- `TWILIO_*` — for SMS and WhatsApp notifications
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` — for delivery zone maps
- `CLOUDFLARE_R2_*` — for photo/asset storage

Then run:

```bash
npm run db:push    # or db:migrate for versioned migrations
npm run db:seed    # populate categories/products/demo users
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run lint` | Lint the codebase |
| `npm run db:generate` | Regenerate the Prisma client |
| `npm run db:push` | Push the schema to your database |
| `npm run db:migrate` | Create/apply a versioned migration |
| `npm run db:seed` | Seed categories, products, and demo users |
| `npm run db:studio` | Open Prisma Studio |
