import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  describeDatabaseEnv,
  isDatabaseConfigured,
  redactConnectionString,
} from "@/lib/db-status";

/**
 * Setup diagnostic for the database connection.
 *
 * "The console says no database is connected, but I connected one" has several
 * distinct causes that look identical from the UI: the variable set under a name
 * schema.prisma doesn't read, a scheme the plain Prisma client can't open, a
 * reachable database with no migrations applied, or a genuinely unreachable
 * host. This separates them.
 *
 * Reports variable names, schemes, and error codes — never a connection string
 * or a password. Any error text is passed through redactConnectionString first,
 * since Prisma's messages sometimes quote the URL back.
 *
 * Safe to delete once setup is done.
 */
export const dynamic = "force-dynamic";

/** A representative slice of the schema — enough to tell migrated from empty. */
const EXPECTED_TABLES = [
  "User",
  "Staff",
  "Customer",
  "Order",
  "PlatformSettings",
  "DeliveryZoneRate",
];

type MigrationRow = { migration_name: string; finished_at: Date | null };

export async function GET() {
  const env = describeDatabaseEnv();

  if (!isDatabaseConfigured()) {
    const rejected = env.variables.filter((v) => v.present);
    return NextResponse.json({
      configured: false,
      diagnosis: rejected.length === 0
        ? "No connection string found under any recognised variable name. Set DATABASE_URL in the Vercel project's Production environment, then redeploy — environment changes only reach a new deployment."
        : rejected.some((v) => v.looksLikePlaceholder)
          ? "A connection string is set but is still the checked-in placeholder. Replace it with the real one."
          : `A connection string is set but uses the "${rejected.find((v) => !v.schemeSupported)?.scheme}" scheme, which this build can't open. Use the direct postgresql:// string from your provider.`,
      env,
    });
  }

  let connected = false;
  let error: { code?: string; name?: string; message: string } | null = null;
  let tables: { expected: string[]; missing: string[] } | null = null;
  let migrations: { applied: number; latest: string | null; pending: string[] } | null = null;
  let counts: Record<string, number> | null = null;

  try {
    await prisma.$queryRaw`SELECT 1`;
    connected = true;

    const present = await prisma.$queryRaw<{ table_name: string }[]>`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    `;
    const names = new Set(present.map((r) => r.table_name));
    tables = {
      expected: EXPECTED_TABLES,
      missing: EXPECTED_TABLES.filter((t) => !names.has(t)),
    };

    if (names.has("_prisma_migrations")) {
      const rows = await prisma.$queryRaw<MigrationRow[]>`
        SELECT migration_name, finished_at FROM _prisma_migrations
        ORDER BY started_at ASC
      `;
      const done = rows.filter((r) => r.finished_at !== null);
      migrations = {
        applied: done.length,
        latest: done.at(-1)?.migration_name ?? null,
        pending: rows.filter((r) => r.finished_at === null).map((r) => r.migration_name),
      };
    } else {
      migrations = { applied: 0, latest: null, pending: [] };
    }

    // Only meaningful once the tables exist; an owner row is what the console
    // needs before settings, staff, and profile editing become available.
    if (tables.missing.length === 0) {
      const [users, staff, orders, owners] = await Promise.all([
        prisma.user.count(),
        prisma.staff.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "OWNER" } }),
      ]);
      counts = { users, owners, staff, orders };
    }
  } catch (err) {
    const e = err as { code?: string; name?: string; message?: string };
    error = {
      code: e.code,
      name: e.name,
      message: redactConnectionString(String(e.message ?? err)).slice(0, 400),
    };
  }

  const diagnosis = !connected
    ? "The connection string was accepted but the database could not be reached. Check the host is correct and that the provider allows connections from Vercel."
    : tables && tables.missing.length > 0
      ? "Connected, but the schema is missing tables. Run `npx prisma migrate deploy` against this database."
      : counts && counts.owners === 0
        ? "Connected and migrated, but there is no OWNER user yet. The console will read from the database; create an owner row to get an editable profile."
        : "Connected, migrated, and ready.";

  return NextResponse.json({
    configured: true,
    connected,
    diagnosis,
    env,
    migrations,
    tables,
    counts,
    error,
  });
}
