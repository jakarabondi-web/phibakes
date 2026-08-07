import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { readSession, isStaffRole, type SessionPayload } from "./session";
import { findDemoUserById } from "./demo-users";

/**
 * Data Access Layer — the authoritative auth check.
 *
 * `proxy.ts` only reads the cookie so it can redirect quickly without touching
 * the database on every request (including prefetches). That check is
 * optimistic: a valid-looking cookie proves the signature held, not that the
 * user still exists or still holds the role encoded in it. Everything that
 * actually reads or writes user data goes through here, where the session is
 * re-verified against the database.
 *
 * Results are memoized per render pass with React `cache`, so a page and its
 * nested layouts share one lookup rather than issuing several.
 */

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string | null;
  twoFactorEnabled: boolean;
};

export const verifySession = cache(async (): Promise<SessionPayload | null> => {
  return readSession();
});

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await verifySession();
  if (!session) return null;

  // Without a database, fall back to the built-in demo accounts so the app is
  // still explorable — the same reason the API routes serve mock data.
  if (!isDatabaseConfigured()) {
    const demo = findDemoUserById(session.userId);
    return demo
      ? {
          id: demo.id,
          name: demo.name,
          email: demo.email,
          role: demo.role,
          avatarUrl: null,
          twoFactorEnabled: false,
        }
      : null;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatarUrl: true,
        twoFactorEnabled: true,
      },
    });
    // A deleted user holding a still-valid cookie must not stay signed in.
    return user ?? null;
  } catch {
    return null;
  }
});

/** Requires any signed-in user; redirects to login preserving the intended destination. */
export async function requireUser(returnTo?: string): Promise<AuthUser> {
  const user = await getCurrentUser();
  if (!user) {
    redirect(returnTo ? `/login?next=${encodeURIComponent(returnTo)}` : "/login");
  }
  return user;
}

/** Requires a staff/owner role; customers are sent to their own portal, not the login page. */
export async function requireStaff(returnTo?: string): Promise<AuthUser> {
  const user = await requireUser(returnTo);
  if (!isStaffRole(user.role)) {
    redirect("/account");
  }
  return user;
}
