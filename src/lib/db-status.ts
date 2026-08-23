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

/**
 * Variable names to accept, in priority order.
 *
 * schema.prisma reads DATABASE_URL, but the hosting integrations rarely set
 * that name: Vercel Postgres and Supabase provision POSTGRES_PRISMA_URL and
 * POSTGRES_URL, Neon adds DATABASE_URL_UNPOOLED. Connecting a database through
 * one of those and finding the app still on mock data — with no indication why
 * — is a genuinely undebuggable state, so accept the aliases and hand the
 * resolved URL to Prisma explicitly (see lib/prisma.ts).
 *
 * Pooled URLs come first because serverless functions should not each hold a
 * direct connection.
 */
export const DATABASE_URL_VARS = [
  "DATABASE_URL",
  "POSTGRES_PRISMA_URL",
  "POSTGRES_URL",
  "DATABASE_URL_UNPOOLED",
  "POSTGRES_URL_NON_POOLING",
] as const;

/** Schemes Prisma can open with the plain client (no Accelerate extension). */
const SUPPORTED_SCHEMES = ["postgres", "postgresql"];

function schemeOf(url: string): string {
  const at = url.indexOf("://");
  return at === -1 ? "" : url.slice(0, at).toLowerCase();
}

function isPlaceholder(url: string): boolean {
  return PLACEHOLDER_HINTS.some((hint) => url.includes(hint));
}

function isUsable(url: string): boolean {
  return !isPlaceholder(url) && SUPPORTED_SCHEMES.includes(schemeOf(url));
}

/**
 * The connection string to actually use, or null when none is configured.
 * Prefers DATABASE_URL and falls back to the integration-provided aliases.
 */
export function resolveDatabaseUrl(): string | null {
  for (const name of DATABASE_URL_VARS) {
    const url = process.env[name]?.trim();
    if (url && isUsable(url)) return url;
  }
  return null;
}

export function isDatabaseConfigured(): boolean {
  return resolveDatabaseUrl() !== null;
}

/**
 * A value-free account of what the environment actually holds, for the setup
 * diagnostic. Reports each variable's scheme and whether it was accepted, never
 * its value — a connection string carries the password.
 */
export function describeDatabaseEnv() {
  const variables = DATABASE_URL_VARS.map((name) => {
    const raw = process.env[name]?.trim() ?? "";
    const scheme = schemeOf(raw);
    return {
      name,
      present: raw.length > 0,
      scheme: raw ? scheme || "(no scheme)" : null,
      schemeSupported: raw ? SUPPORTED_SCHEMES.includes(scheme) : false,
      looksLikePlaceholder: raw ? isPlaceholder(raw) : false,
      usable: raw ? isUsable(raw) : false,
      length: raw.length,
    };
  });

  const resolved = DATABASE_URL_VARS.find((name) => {
    const url = process.env[name]?.trim();
    return url && isUsable(url);
  });

  return { resolvedFrom: resolved ?? null, variables };
}

/**
 * A one-line reason the app is running without a database, for the console's
 * own notice. "No database is connected" is unhelpful to someone who just
 * connected one — this says which of the several possible causes it is.
 * Returns null when a database is configured.
 */
export function databaseSetupHint(): string | null {
  if (isDatabaseConfigured()) return null;

  const present = describeDatabaseEnv().variables.filter((v) => v.present);
  if (present.length === 0) {
    return "No connection string is set on this deployment. Add DATABASE_URL to the Production environment and redeploy — environment changes only reach a new deployment.";
  }
  if (present.some((v) => v.looksLikePlaceholder)) {
    return "DATABASE_URL is still the example placeholder, so it was ignored. Replace it with the real connection string.";
  }
  const badScheme = present.find((v) => !v.schemeSupported);
  return `${badScheme?.name} uses the "${badScheme?.scheme}" scheme, which this build can't open. Use the direct postgresql:// connection string from your provider.`;
}

/** Strips credentials from anything about to be returned or logged. */
export function redactConnectionString(text: string): string {
  return text.replace(/\/\/[^@\s/]+@/g, "//***:***@");
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
