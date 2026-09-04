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
import { PrismaClient } from "@prisma/client";

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

/**
 * First deploy after a database is connected gets the same catalog the
 * storefront has always shown — as real, editable Product rows instead of
 * the compiled-in list — so nothing customers currently see disappears the
 * moment the storefront switches to reading the database.
 *
 * Guarded on the product table being empty, checked every deploy but only
 * ever true once: the moment a single product exists — seeded here or added
 * by the owner — every later deploy is a no-op. An owner's edits or deletes
 * are never overwritten or resurrected by a redeploy. Best-effort: unlike
 * migrations, a failure here doesn't ship a broken app, so it warns and lets
 * the build continue rather than failing it.
 */
try {
  const url = process.env[name].trim();
  const prisma = new PrismaClient({ datasourceUrl: url });
  const productCount = await prisma.product.count();
  await prisma.$disconnect();

  if (productCount > 0) {
    console.log(`[seed] ${productCount} product(s) already exist — skipping catalog seed.`);
  } else {
    console.log("[seed] No products yet — loading the starter catalog…");
    const seed = spawnSync("npx", ["tsx", "prisma/seed-catalog.ts"], {
      stdio: "inherit",
      env: { ...process.env, DATABASE_URL: url },
    });
    if (seed.status !== 0) {
      console.warn("[seed] Catalog seed failed — continuing without it. The Products console can still add items by hand.");
    }
  }
} catch (err) {
  console.warn("[seed] Couldn't check the product count — skipping catalog seed:", err?.message ?? err);
}
