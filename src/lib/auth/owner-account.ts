import "server-only";

import bcrypt from "bcryptjs";
import type { UserRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";

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

/**
 * Gives the env-configured owner a real database row once a database exists.
 *
 * The env account is deliberately row-less, which is right while there's no
 * database and wrong the moment there is one: it can't be edited, can't own
 * anything, and leaves the console permanently read-only for the person who is
 * supposed to control it. On sign-in, adopt or create the matching User row and
 * put *its* id in the session, so from then on the owner is an ordinary
 * database user — editable profile, changeable password, everything.
 *
 * Returns null if there's no database or the write fails, and the caller then
 * falls back to the env identity. That fallback is the whole point of this
 * account: a broken database must not lock the owner out of their own console.
 */
export async function ensureOwnerUserRow(owner: OwnerAccount) {
  if (!isDatabaseConfigured()) return null;

  const select = { id: true, name: true, email: true, role: true } as const;

  try {
    const existing = await prisma.user.findUnique({ where: { email: owner.email }, select });

    if (existing) {
      // The address may already exist as a customer — from a storefront signup
      // before the owner account was configured. OWNER_EMAIL is set by whoever
      // controls the deployment, so treat it as authoritative and promote,
      // rather than signing them into a downgraded session.
      if (existing.role !== "OWNER") {
        return await prisma.user.update({
          where: { id: existing.id },
          data: { role: "OWNER" },
          select,
        });
      }
      return existing;
    }

    // Carry the configured password across so the same credentials keep working
    // after the promotion. A hash is stored as-is; plaintext is hashed here so
    // it never lands in the database in the clear.
    const configuredHash = process.env.OWNER_PASSWORD_HASH?.trim();
    const plain = process.env.OWNER_PASSWORD;
    const passwordHash = configuredHash
      ? configuredHash
      : plain
        ? await bcrypt.hash(plain, 12)
        : null;

    return await prisma.user.create({
      data: { name: owner.name, email: owner.email, role: "OWNER", passwordHash },
      select,
    });
  } catch (err) {
    console.error("[auth] couldn't give the owner a database row:", err);
    return null;
  }
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
