import { NextResponse } from "next/server";
import { readSession, isStaffRole } from "@/lib/auth/session";

/**
 * Cookie-only session peek for the public storefront header, so it can point
 * its account icon at /dashboard for staff and /account for everyone else.
 *
 * Deliberately not the authoritative check (see lib/auth/dal.ts) — this never
 * touches the database, so it can't force the whole storefront into dynamic
 * rendering the way calling it from a shared layout would. That's safe here
 * because the result only decides which link to show; /dashboard re-verifies
 * the session against the database itself and bounces anyone who isn't
 * actually staff, exactly as it did before this endpoint existed.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await readSession();
  return NextResponse.json({
    signedIn: Boolean(session),
    isStaff: Boolean(session && isStaffRole(session.role)),
  });
}
