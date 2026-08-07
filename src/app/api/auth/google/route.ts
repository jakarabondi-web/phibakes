import crypto from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  isGoogleConfigured,
  buildAuthUrl,
  googleRedirectUri,
  GOOGLE_STATE_COOKIE,
} from "@/lib/auth/google";

/** Starts the Google sign-in flow. */
export async function GET(request: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_unconfigured", request.url));
  }

  // CSRF guard: a random state echoed back by Google and compared on return.
  const state = crypto.randomBytes(16).toString("hex");
  const redirectUri = googleRedirectUri(request.nextUrl.origin);

  const res = NextResponse.redirect(buildAuthUrl({ state, redirectUri }));
  res.cookies.set(GOOGLE_STATE_COOKIE, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes is ample for a sign-in round trip
  });
  return res;
}
