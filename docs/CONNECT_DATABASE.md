# Runbook: connect a database to the PhiBakes deployment

Self-contained instructions for an operator (human or agent) with access to the
Vercel dashboard for the **phibakes** project. Everything on the code side is
already done and deployed; the only remaining work is provisioning a database
and putting its connection string into Vercel, which requires dashboard access
that a coding session does not have.

---

## Goal

Make this URL return `"connected": true`:

```
https://www.phibakes.com/api/health/db
```

Success looks exactly like this:

```json
{
  "configured": true,
  "connected": true,
  "diagnosis": "Connected, migrated, and ready.",
  "env": { "resolvedFrom": "DATABASE_URL", ... },
  "migrations": { "applied": 3, "latest": "20260807185240_platform_settings_and_rider_fields", "pending": [] },
  "tables": { "missing": [] },
  "counts": { "users": 1, "owners": 1, "staff": 0, "orders": 0 }
}
```

That endpoint is the single source of truth for this task. It reports variable
names, URL schemes, and error codes only — it never returns a connection string
or a password.

---

## Current state (verified 2026-08-23)

- The Vercel project **phibakes** exists, builds, and serves `www.phibakes.com`.
- Environment variables reach it correctly: `AUTH_SECRET` and `OWNER_EMAIL` /
  `OWNER_NAME` / `OWNER_PASSWORD_HASH` are all present and working. Sign-in works.
- No database variable exists under any accepted name, in any environment.
  The production build log confirms it:
  `[migrate] No usable connection string — skipping migrations.`

So the plumbing is fine. Only the database is missing.

---

## Hard requirements

1. **PostgreSQL only.** `prisma/schema.prisma` declares
   `provider = "postgresql"`, and the migrations use 18 Postgres `CREATE TYPE`
   enums plus two `JSONB` columns. MySQL, SQLite, and Mongo would require
   changing the provider and regenerating all three migrations — do not attempt
   that as part of this task.
2. **The URL must start with `postgresql://` or `postgres://`.** A
   `prisma://` or `prisma+postgres://` URL (Prisma Accelerate / Prisma Postgres)
   will be **rejected** — this build does not include the Accelerate extension.
   If the provider offers one of those, use their direct Postgres string instead.
3. **Never commit the connection string.** `github.com/jakarabondi-web/phibakes`
   is a **public** repository. The string belongs only in Vercel's environment
   variables. Do not write it into `.env`, `.env.example`, `vercel.json`, or any
   file in the repo, and do not paste it into a chat transcript.
4. **Environment changes only reach new deployments.** Saving a variable does
   nothing to the running site until a redeploy happens.

Any Postgres host is acceptable — Neon, Supabase, Railway, Render, Aiven,
DigitalOcean, AWS RDS, or self-hosted. There is no preference in the code.

---

## Path A — provision through Vercel (fewest steps)

Use this if there is no database yet.

1. Go to the Vercel dashboard → the **phibakes** project → **Storage** tab.
2. Choose **Create Database** and pick a Postgres option from the marketplace
   (Neon and Supabase both work).
3. When asked for a region, pick the one geographically closest to Nairobi that
   the provider offers — Frankfurt (`eu-central`) on most.
4. Complete the connect step so the store is **linked to the `phibakes`
   project**, with all environments selected (Production, Preview, Development).

   > This is the step most often missed. Creating a database does not attach it.
   > If the store exists but is not linked to the project, no variable is
   > injected and nothing changes.

5. Vercel injects `DATABASE_URL` and usually `DATABASE_URL_UNPOOLED`,
   `POSTGRES_URL`, and `POSTGRES_PRISMA_URL`. All of those names are recognised
   by the app — no renaming needed.
6. Continue to **"Redeploy"** below.

---

## Path B — use an existing database

Use this if a Postgres database already exists anywhere.

1. From the provider's dashboard, copy the **connection string**. It must look
   like:

   ```
   postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
   ```

   If the provider offers both a *pooled* and a *direct/unpooled* string, copy
   both.

2. In Vercel → **phibakes** → **Settings** → **Environment Variables**, add:

   | Name | Value | Environments |
   |---|---|---|
   | `DATABASE_URL` | the pooled string (or the only string) | Production, Preview, Development |
   | `DATABASE_URL_UNPOOLED` | the direct string — **only if the provider gave one** | Production, Preview, Development |

   `DATABASE_URL_UNPOOLED` is optional but recommended: migrations use it in
   preference, because the advisory lock Prisma takes during a migration does
   not survive a transaction pooler.

3. While in this screen, also add if missing:

   | Name | Value | Environments |
   |---|---|---|
   | `NEXT_PUBLIC_SITE_URL` | `https://www.phibakes.com` | Production, Preview, Development |

   Password-reset links and the Google OAuth callback are built from it.

4. **Paste carefully.** Enter the value into the dashboard form, not through a
   shell — a shell expands `$` sequences and silently corrupts strings that
   contain them.

5. If the provider has an IP allowlist, note that Vercel serverless functions
   have no fixed outbound IP. Either allow all addresses or use that provider's
   official Vercel integration.

---

## Redeploy

Vercel usually redeploys automatically after connecting a store. If it does not:

1. Vercel → **phibakes** → **Deployments**.
2. Open the most recent **Production** deployment.
3. Use the **⋯** menu → **Redeploy**.

---

## Verify — in this order

### 1. Build log

Open the new deployment's build log and search for `[migrate]`. Expect:

```
[migrate] Applying migrations using DATABASE_URL…
The following migration(s) have been applied:
  └─ 20260807152435_init
  └─ 20260807160004_add_password_reset_tokens
  └─ 20260807185240_platform_settings_and_rider_fields
[migrate] Migrations applied.
```

Failure modes:

| Log line | Meaning | Fix |
|---|---|---|
| `No usable connection string — skipping migrations` | The variable did not reach the build | Confirm it is scoped to **Production**, saved, and that the redeploy ran *after* saving |
| `P1001: Can't reach database server` | Host wrong, or the provider blocks the connection | Check host/port; check the IP allowlist |
| `P1000: Authentication failed` | Wrong user or password | Re-copy the string from the provider |
| Build fails at `[migrate] Migrations failed` | Intentional — a schema that did not apply must not ship | Fix the cause above and redeploy |

### 2. Health endpoint

```bash
curl -s https://www.phibakes.com/api/health/db
```

Interpretation:

| `diagnosis` | What to do |
|---|---|
| `Connected, migrated, and ready.` | Done — go to step 3 |
| `Connected and migrated, but there is no OWNER user yet` | Normal before first sign-in. Do step 3 |
| `Connected, but the schema is missing tables` | Migrations did not run — re-check the build log |
| `...could not be reached` | Reachability problem — see `error.code` in the response |
| `...uses the "prisma+postgres" scheme` | Wrong URL type — use the provider's direct `postgresql://` string |
| `No connection string found...` | The variable is not set for this environment |

### 3. Sign in

1. Go to `https://www.phibakes.com/login`.
2. Sign in with the address in `OWNER_EMAIL` and its password.
3. Go to **My Profile** in the top-right menu.

Expected: the Full name, Email, and Phone fields are **editable**, with a
**Save profile** button, and no yellow notice about environment variables.

That confirms the owner was given a real database row. Then check
**Settings** and **Staff** — neither should show the "No database is connected"
notice, and saves should persist across a reload.

---

## Optional: seed the catalog

After a successful connect, the database has the schema but almost no rows.
`prisma/seed.ts` inserts categories, products, an owner, and a customer.

This does **not** need to run from Vercel. Anyone with the connection string can
run it locally:

```bash
DATABASE_URL="postgresql://..." npm run db:seed
```

---

## Report back

When finished, report:

- Which provider and region were used
- Which variable names Vercel ended up with (names only — **never the values**)
- The full JSON body from `https://www.phibakes.com/api/health/db`
- Whether the profile page was editable after signing in

Do not include the connection string, the password, or `OWNER_PASSWORD_HASH` in
any report, commit, comment, or message.
