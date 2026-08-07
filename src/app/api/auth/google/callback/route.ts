import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import {
  isGoogleConfigured,
  exchangeCodeForProfile,
  googleRedirectUri,
  GOOGLE_STATE_COOKIE,
} from "@/lib/auth/google";
import { encodeSession, SESSION_COOKIE, landingPathFor } from "@/lib/auth/session";

function fail(request: NextRequest, reason: string) {
  const res = NextResponse.redirect(new URL(`/login?error=${reason}`, request.url));
  res.cookies.delete(GOOGLE_STATE_COOKIE);
  return res;
}

export async function GET(request: NextRequest) {
  if (!isGoogleConfigured()) return fail(request, "google_unconfigured");

  const params = request.nextUrl.searchParams;
  if (params.get("error")) return fail(request, "google_denied");

  const code = params.get("code");
  const state = params.get("state");
  const expectedState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value;

  // Reject a callback whose state is missing or doesn't match the one we set.
  if (!code || !state || !expectedState || state !== expectedState) {
    return fail(request, "google_state");
  }

  if (!isDatabaseConfigured()) return fail(request, "google_no_db");

  try {
    const profile = await exchangeCodeForProfile(code, googleRedirectUri(request.nextUrl.origin));

    // Google is the identity provider here, so an unverified address can't be
    // trusted to prove ownership — it would let someone claim another's account.
    if (!profile.emailVerified) return fail(request, "google_unverified");

    const existing = await prisma.user.findUnique({
      where: { email: profile.email },
      select: { id: true, name: true, email: true, role: true, avatarUrl: true },
    });

    const user =
      existing ??
      (await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          avatarUrl: profile.picture,
          role: "CUSTOMER",
          emailVerified: new Date(),
          // No passwordHash: this account signs in via Google. The reset flow
          // can still set one later if they want email sign-in too.
          customer: { create: {} },
        },
        select: { id: true, name: true, email: true, role: true, avatarUrl: true },
      }));

    // Backfill an avatar for an account that first registered by email.
    if (existing && !existing.avatarUrl && profile.picture) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { avatarUrl: profile.picture },
      });
    }

    const token = await encodeSession({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    const res = NextResponse.redirect(new URL(landingPathFor(user.role), request.url));
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
    res.cookies.delete(GOOGLE_STATE_COOKIE);
    return res;
  } catch (err) {
    console.error("[auth] Google callback failed:", err);
    return fail(request, "google_failed");
  }
}
