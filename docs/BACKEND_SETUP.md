# Connecting PhiBakes to a real backend

The app runs today on mock data. Every API route degrades gracefully while
`DATABASE_URL` is unset or still the placeholder, so nothing breaks before this
is done. Connecting a real Postgres is three commands.

## 1. Provision a Postgres database

Any Postgres 14+ works. Hosted options that suit a Vercel deployment:

| Provider | Notes |
| --- | --- |
| **Neon** | Serverless Postgres, generous free tier, integrates with Vercel |
| **Supabase** | Postgres plus auth/storage if you want them later |
| **Vercel Postgres** | Provisioned from the Vercel dashboard, zero config |
| **Railway / Render** | Standard managed Postgres |

Copy the connection string it gives you. It looks like:

```
postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require
```

## 2. Set `DATABASE_URL`

**Locally** — put it in `.env` (already gitignored):

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/DBNAME?sslmode=require"
```

**On Vercel** — Project → Settings → Environment Variables → add `DATABASE_URL`
for Production, Preview, and Development, then redeploy.

## 3. Create the schema and seed it

```bash
npx prisma migrate deploy   # applies prisma/migrations to the database
npm run db:seed             # 7 categories, 23 products, an owner + demo customer
```

Use `migrate deploy` in CI/production. Use `npx prisma migrate dev` locally only
when you're changing `schema.prisma` and want a new migration generated.

That's it — the API routes switch to the database automatically. Every response
carries a `source` field so you can confirm at a glance:

```bash
curl https://your-app.vercel.app/api/orders
# {"source":"db","orders":[...]}      <- connected
# {"source":"mock","orders":[...]}    <- still on mock data
```

## How the fallback behaves

`src/lib/db-status.ts` distinguishes *"no database configured"* from
*"database configured but the query failed"*, because those need opposite
handling:

- **No database configured** — reads and writes both fall back to mock data.
  The demo works out of the box on a fresh clone.
- **Database configured but a write fails** — the route returns **503**, not a
  synthesized success. This matters: without it, a failed order write would
  return `201` with an order code while nothing persisted, and the customer
  would believe they'd ordered. The underlying error is logged server-side.
- **Guest checkout / guest quote** — no `customerId` means there's no customer
  row to attach to, so these take the synthesized path deliberately even with a
  live database. They are not failures.

## Authentication

Sign-in needs one more variable beyond `DATABASE_URL`:

```bash
AUTH_SECRET="$(openssl rand -base64 32)"   # >= 32 chars, keep it secret
NEXT_PUBLIC_SITE_URL="https://phibakes.co.ke"
```

`AUTH_SECRET` signs the session cookie — anyone who knows it can mint a session
for any user, so treat it like a password and use a different value per
environment. The app refuses to sign anything with a missing or short secret
rather than falling back to a guessable key.

**How protection is layered.** `src/proxy.ts` (Next 16's replacement for the
deprecated `middleware.ts`) runs on every matched route and only *reads* the
cookie — no database call, because it also runs on prefetches. That check is
optimistic: it proves the cookie's signature, not that the user still exists or
still holds the encoded role. The authoritative check lives in
`src/lib/auth/dal.ts`, which re-reads the user from the database and is called
by the `/account` and `/dashboard` layouts. Both are needed: the proxy makes
redirects fast, the DAL makes them true.

**Without a database**, sign-in falls back to demo accounts
(`src/lib/auth/demo-users.ts`) so the flow is explorable on a fresh clone —
`owner@phibakes.co.ke`, `baker@phibakes.co.ke`, or `customer@phibakes.co.ke`,
all with password `demo1234`. These are ignored entirely once `DATABASE_URL`
points at a real database. Registration and password reset both require a
database and say so.

**Google sign-in** is fully implemented and disabled until credentials exist.
Create an OAuth 2.0 Client ID in the Google console, add
`<NEXT_PUBLIC_SITE_URL>/api/auth/google/callback` as an authorised redirect URI,
and set `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`. Until then the button
renders disabled with a note, rather than starting a flow that can't finish.

**Password reset** emails a single-use token that expires in an hour; only its
SHA-256 hash is stored, so a database dump can't be used to reset anyone's
password. With no `RESEND_API_KEY`, the email is logged instead of sent and the
reset link is shown on screen so the flow is still completable in development.

## Still client-side after this step

These use `localStorage` and are per-browser, so they don't appear in the
database yet:

- Cart contents, saved carts, favourites (`src/lib/cart-context.tsx`,
  `saved-carts.ts`, `favourites-context.tsx`)
- Placed-order records used by the tracker (`src/lib/placed-orders.ts`)
- The dashboard's abandoned-cart feed reads seeded records
  (`src/lib/data/abandoned-carts.ts`)

Each is written against the shape its eventual server query will return, so
moving them is a data-source swap rather than a rewrite. Now that accounts
exist, these can be keyed to `getCurrentUser()` and persisted per customer — the
remaining work is the data migration, not the auth.

## Other integrations

`DATABASE_URL` is independent of the rest. See `.env.example` for M-PESA
(Daraja), Resend (email), Twilio (SMS/WhatsApp), Google Maps, and R2 storage —
each degrades to simulation mode until its keys are set, and each can be turned
on separately.
