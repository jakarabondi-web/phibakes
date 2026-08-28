import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession, SESSION_COOKIE, isStaffRole } from "@/lib/auth/session";

/**
 * Optimistic route protection.
 *
 * Runs before every matched route, including prefetches, so it only reads and
 * verifies the session cookie — no database calls. That keeps it fast but means
 * it proves the cookie's signature, not that the user still exists or still
 * holds the encoded role. Pages and actions re-check authoritatively through
 * the Data Access Layer (`src/lib/auth/dal.ts`).
 *
 * `middleware.ts` is deprecated in Next.js 16; this is the `proxy.ts` successor.
 */

const CUSTOMER_PREFIXES = ["/account"];
const STAFF_PREFIXES = ["/dashboard"];
const AUTH_PAGES = ["/login", "/register", "/forgot-password", "/reset-password"];

export default async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = await decodeSession(token).catch(() => null);

  const needsCustomer = CUSTOMER_PREFIXES.some((p) => pathname.startsWith(p));
  const needsStaff = STAFF_PREFIXES.some((p) => pathname.startsWith(p));
  const isAuthPage = AUTH_PAGES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if ((needsCustomer || needsStaff) && !session) {
    const url = new URL("/login", request.url);
    // Preserve where they were headed so sign-in can return them there.
    url.searchParams.set("next", `${pathname}${search}`);
    const res = NextResponse.redirect(url);
    // A cookie that failed to decode is expired or tampered — clear it so the
    // user isn't bounced in a loop by a stale value.
    if (token) res.cookies.delete(SESSION_COOKIE);
    return res;
  }

  // Customers must not reach the owner/staff console.
  if (needsStaff && session && !isStaffRole(session.role)) {
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // And staff must not land in the customer portal: its pages are built
  // around a customer record staff don't have, so showing them there reads
  // as being signed into someone else's account. Their console is /dashboard.
  if (needsCustomer && session && isStaffRole(session.role)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Already signed in? Don't show the sign-in/registration pages again.
  if (isAuthPage && session) {
    const dest = isStaffRole(session.role) ? "/dashboard" : "/account";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Skip static assets and image optimization; those never need a session check.
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico|icon.png|apple-icon.png).*)"],
};
