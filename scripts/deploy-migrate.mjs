#!/usr/bin/env node
/**
 * Applies pending migrations during the build, so connecting a database is one
 * step rather than two.
 *
 * Without this, setting DATABASE_URL gets you a deployment that believes it has
 * a database and then fails every query against an empty schema — the worst of
 * the three states, because it looks connected. Running migrate deploy here
 * means the schema is always in step with the code that ships alongside it.
 *
 * Three outcomes, deliberately distinct:
 *   no database configured  -> skip, build continues (the demo still deploys)
 *   migrations applied      -> build continues
 *   migration failed        -> build FAILS
 * The last one matters: shipping a build whose schema didn't apply is exactly
 * the silent-breakage case this is meant to prevent.
 */

import { spawnSync } from "node:child_process";

/**
 * Migrations want a direct connection. Running them over a transaction pooler
 * can fail on the advisory lock Prisma takes, so the unpooled URLs come first
 * here — the reverse of the runtime order in src/lib/db-status.ts, which wants
 * the pooled one for serverless request traffic.
 */
const CANDIDATES = [
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
];

// Kept in step with PLACEHOLDER_HINTS in src/lib/db-status.ts.
const PLACEHOLDER_HINTS = [
  "user:password",
  "USER:PASSWORD",
  "username:password",
  "<user>",
  "localhost:5432/phibakes?schema=public",
];

function usable(url) {
  if (!url) return false;
  if (PLACEHOLDER_HINTS.some((h) => url.includes(h))) return false;
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

const name = CANDIDATES.find((n) => usable(process.env[n]?.trim()));

if (!name) {
  console.log(
    "[migrate] No usable connection string — skipping migrations. " +
      "The app will run on built-in demo data."
  );
  process.exit(0);
}

console.log(`[migrate] Applying migrations using ${name}…`);

const result = spawnSync("npx", ["prisma", "migrate", "deploy"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: process.env[name].trim() },
});

if (result.status !== 0) {
  console.error(
    "[migrate] Migrations failed. Failing the build rather than deploying an " +
      "app that thinks it has a database but has no schema."
  );
  process.exit(result.status ?? 1);
}

console.log("[migrate] Migrations applied.");
