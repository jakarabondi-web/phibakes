import "server-only";

import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";

/**
 * Bootstrap owner account, configured entirely through environment variables.
 *
 * The repository is public, so a real owner's address and password must never
 * be committed — unlike the throwaway demo accounts in `demo-users.ts`, these
 * live only in the deployment's environment.
 *
 * It is also deliberately checked *before* the database, so the owner always
 * has a way in: a failed migration, an empty user table, or a forgotten
 * password can't lock them out of their own console.
 *
 *   OWNER_EMAIL          — the address that may sign in
 *   OWNER_PASSWORD_HASH  — bcrypt hash of the password (preferred)
 *   OWNER_PASSWORD       — plaintext fallback, if hashing is inconvenient
 *   OWNER_NAME           — display name, optional
 */

export type OwnerAccount = {
  id: string;
  email: string;
  name: string;
  role: UserRole;
};

/** Stable id so an existing session cookie keeps resolving across restarts. */
export const OWNER_ACCOUNT_ID = "env-owner";

export function isOwnerAccountConfigured(): boolean {
  return Boolean(
    process.env.OWNER_EMAIL &&
      (process.env.OWNER_PASSWORD_HASH || process.env.OWNER_PASSWORD)
  );
}

export function getOwnerAccount(): OwnerAccount | null {
  const email = process.env.OWNER_EMAIL?.trim().toLowerCase();
  if (!email || !isOwnerAccountConfigured()) return null;
  return {
    id: OWNER_ACCOUNT_ID,
    email,
    name: process.env.OWNER_NAME?.trim() || "PhiBakes Owner",
    role: "OWNER",
  };
}

/** True when the supplied credentials match the configured owner. */
export async function verifyOwnerCredentials(
  email: string,
  password: string
): Promise<OwnerAccount | null> {
  const owner = getOwnerAccount();
  if (!owner) return null;
  if (email.trim().toLowerCase() !== owner.email) return null;

  const hash = process.env.OWNER_PASSWORD_HASH?.trim();
  if (hash) {
    const ok = await bcrypt.compare(password, hash);
    return ok ? owner : null;
  }

  const plain = process.env.OWNER_PASSWORD;
  if (plain && password === plain) return owner;

  return null;
}
