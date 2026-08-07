import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";

/**
 * Signed, httpOnly cookie sessions.
 *
 * The payload deliberately carries only what routing needs (user id, role,
 * name) so `proxy.ts` can make an optimistic redirect decision without a
 * database round-trip on every request — including prefetches. Anything
 * authoritative is re-checked against the database in the Data Access Layer
 * (`src/lib/auth/dal.ts`), which is the real security boundary.
 */

export const SESSION_COOKIE = "phibakes_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type SessionPayload = {
  userId: string;
  role: UserRole;
  name: string;
  email: string;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    // A weak or missing secret would let anyone mint a valid session, so fail
    // loudly rather than silently signing with a guessable key.
    throw new Error(
      "AUTH_SECRET is missing or too short (need >= 32 chars). Generate one with: openssl rand -base64 32"
    );
  }
  return new TextEncoder().encode(secret);
}

export function isAuthConfigured(): boolean {
  const secret = process.env.AUTH_SECRET;
  return Boolean(secret && secret.length >= 32);
}

export async function encodeSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function decodeSession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { algorithms: ["HS256"] });
    if (!payload.userId || !payload.role) return null;
    return {
      userId: String(payload.userId),
      role: payload.role as UserRole,
      name: String(payload.name ?? ""),
      email: String(payload.email ?? ""),
    };
  } catch {
    // Expired, tampered, or signed with a different secret.
    return null;
  }
}

export async function createSession(payload: SessionPayload) {
  const token = await encodeSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(Date.now() + SESSION_DURATION_MS),
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function readSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  return decodeSession(cookieStore.get(SESSION_COOKIE)?.value);
}

/** Where a user should land after signing in, based on their role. */
export function landingPathFor(role: UserRole): string {
  return role === "CUSTOMER" ? "/account" : "/dashboard";
}

/** Roles allowed into the owner/staff console. */
export function isStaffRole(role: UserRole): boolean {
  return role !== "CUSTOMER";
}
