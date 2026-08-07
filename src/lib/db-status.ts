/**
 * Tells apart "no database wired up yet" from "database wired up but the query
 * failed" — a distinction the API routes need before they decide to serve mock
 * data.
 *
 * Falling back to mock data is the right call while DATABASE_URL is still a
 * placeholder: the demo keeps working and nothing is lost. It is the wrong call
 * once a real database is connected, because a failed *write* would otherwise
 * return 201 with an order code while nothing was persisted — the customer
 * believes they've ordered and no record exists. Reads may still degrade, but
 * writes must fail loudly.
 */

const PLACEHOLDER_HINTS = [
  "user:password",
  "USER:PASSWORD",
  "username:password",
  "<user>",
  "localhost:5432/phibakes?schema=public",
];

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) return false;
  // The checked-in default points at a local placeholder; treat it as unset so
  // a fresh clone still runs on mock data without any setup.
  if (PLACEHOLDER_HINTS.some((hint) => url.includes(hint))) return false;
  return url.startsWith("postgres://") || url.startsWith("postgresql://");
}

/**
 * Logs the underlying failure so a misconfigured database is diagnosable in
 * production instead of silently masquerading as "no database".
 */
export function logDbFallback(context: string, error: unknown) {
  if (isDatabaseConfigured()) {
    console.error(`[db] ${context} failed against a configured database:`, error);
  }
}
