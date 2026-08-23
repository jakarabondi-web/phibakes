import { NextResponse } from "next/server";
import { isAuthConfigured } from "@/lib/auth/session";
import { isDatabaseConfigured } from "@/lib/db-status";
import { isGoogleConfigured } from "@/lib/auth/google";
import { isOwnerAccountConfigured } from "@/lib/auth/owner-account";

/**
 * Setup diagnostic: reports which auth-related environment variables are
 * *present*, never their values. Without this, a failed sign-in on a deployed
 * environment is indistinguishable from a wrong password — there's no way to
 * tell a missing AUTH_SECRET from bad credentials by looking at the UI.
 *
 * Safe to leave in place (it leaks no secrets), and safe to delete once setup
 * is done.
 */
export const dynamic = "force-dynamic";

export function GET() {
  const secret = process.env.AUTH_SECRET ?? "";

  return NextResponse.json({
    ready: isAuthConfigured() && isOwnerAccountConfigured(),
    authSecret: {
      present: secret.length > 0,
      longEnough: secret.length >= 32,
      length: secret.length, // length only — never the value
    },
    ownerAccount: {
      configured: isOwnerAccountConfigured(),
      emailSet: Boolean(process.env.OWNER_EMAIL),
      nameSet: Boolean(process.env.OWNER_NAME),
      passwordHashSet: Boolean(process.env.OWNER_PASSWORD_HASH),
      passwordPlainSet: Boolean(process.env.OWNER_PASSWORD),
      // A hash mangled by shell expansion is the classic paste error: the
      // bcrypt prefix ($2a$/$2b$) disappears when $-sequences get substituted.
      passwordHashLooksValid: /^\$2[aby]\$\d{2}\$.{53}$/.test(
        process.env.OWNER_PASSWORD_HASH ?? ""
      ),
    },
    database: {
      configured: isDatabaseConfigured(),
      // Why, and whether it can actually be reached, lives in the dedicated
      // database diagnostic — this endpoint is about auth.
      details: "/api/health/db",
    },
    google: { configured: isGoogleConfigured() },
    siteUrlSet: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
  });
}
