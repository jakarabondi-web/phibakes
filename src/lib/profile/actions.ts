"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getCurrentUser } from "@/lib/auth/dal";
import { kenyanPhoneError, parseKenyanPhone } from "@/lib/kenya-phone";
import { createSession } from "@/lib/auth/session";
import { OWNER_ACCOUNT_ID } from "@/lib/auth/owner-account";

/**
 * Self-service profile editing.
 *
 * Unlike the admin actions, this is not owner-gated — everyone may edit their
 * own details. What it does enforce is that they can only edit *themselves*:
 * the row updated is always the signed-in user's, never an id supplied by the
 * client, so this can't be used to edit someone else's account.
 */

export type ProfileState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const BCRYPT_ROUNDS = 12;

/**
 * The env-configured owner has no database row — its name and email come from
 * OWNER_NAME / OWNER_EMAIL — so there is nothing to update. Say so plainly
 * rather than failing with a generic error.
 */
const ENV_OWNER_MESSAGE =
  "This account is configured with environment variables, so its details are set by OWNER_NAME and OWNER_EMAIL rather than here. Connect a database and create an owner account to get an editable profile.";

const NO_DB = "Connect a database to save profile changes.";

function fieldErrorsFrom(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    if (issue.path[0]) out[String(issue.path[0])] = issue.message;
  }
  return out;
}

const profileSchema = z.object({
  name: z.string().min(2, "Enter your full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
});

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (user.id === OWNER_ACCOUNT_ID) return { error: ENV_OWNER_MESSAGE };
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const { name, email } = parsed.data;
  let phone: string | undefined;
  if (parsed.data.phone?.trim()) {
    const err = kenyanPhoneError(parsed.data.phone);
    if (err) return { fieldErrors: { phone: err } };
    phone = parseKenyanPhone(parsed.data.phone)?.e164;
  }

  const nextEmail = email.trim().toLowerCase();

  try {
    if (nextEmail !== user.email.toLowerCase()) {
      const taken = await prisma.user.findUnique({
        where: { email: nextEmail },
        select: { id: true },
      });
      if (taken && taken.id !== user.id) {
        return { fieldErrors: { email: "That email is already used by another account." } };
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { name: name.trim(), email: nextEmail, phone },
      select: { id: true, name: true, email: true, role: true },
    });

    // The session carries the display name and email, so it has to be reissued
    // or the topbar keeps showing the old details until the cookie expires.
    await createSession({
      userId: updated.id,
      role: updated.role,
      name: updated.name,
      email: updated.email,
    });
  } catch (err) {
    console.error("[profile] update failed:", err);
    return { error: "Couldn't save your profile. Please try again." };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/account/profile");
  return { ok: true };
}

/**
 * Data URLs produced by fileToAvatarDataUrl() top out around 60-90KB for a
 * 256x256 WebP/JPEG. This caps well above that — generously enough for any
 * real output, tight enough to reject someone posting an arbitrary blob
 * through the action directly rather than through the resizer.
 */
const MAX_AVATAR_DATA_URL_LENGTH = 400_000;

export async function updateAvatar(dataUrl: string): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (user.id === OWNER_ACCOUNT_ID) return { error: ENV_OWNER_MESSAGE };
  if (!isDatabaseConfigured()) return { error: NO_DB };

  if (!/^data:image\/(webp|jpeg|png);base64,/.test(dataUrl)) {
    return { error: "That doesn't look like an image. Please try again." };
  }
  if (dataUrl.length > MAX_AVATAR_DATA_URL_LENGTH) {
    return { error: "That image is too large. Please try a different photo." };
  }

  try {
    await prisma.user.update({ where: { id: user.id }, data: { avatarUrl: dataUrl } });
  } catch (err) {
    console.error("[profile] avatar update failed:", err);
    return { error: "Couldn't save your photo. Please try again." };
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard", "layout");
  revalidatePath("/account/profile");
  return { ok: true };
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[0-9]/, "Include at least one number.")
      .regex(/[a-zA-Z]/, "Include at least one letter."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export async function changePassword(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (user.id === OWNER_ACCOUNT_ID) {
    return {
      error:
        "This account's password comes from OWNER_PASSWORD_HASH. Generate a new hash and update that variable to change it.",
    };
  }
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const parsed = passwordSchema.safeParse({
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  try {
    const row = await prisma.user.findUnique({
      where: { id: user.id },
      select: { passwordHash: true },
    });
    // An account created by an admin, or one that signed up through Google, has
    // no password yet — it must be set through the reset flow, not here, since
    // there's no current password to verify against.
    if (!row?.passwordHash) {
      return {
        error:
          "This account has no password set yet. Use “Forgot password” on the sign-in page to create one.",
      };
    }

    const ok = await bcrypt.compare(parsed.data.currentPassword, row.passwordHash);
    if (!ok) return { fieldErrors: { currentPassword: "That's not your current password." } };

    const passwordHash = await bcrypt.hash(parsed.data.newPassword, BCRYPT_ROUNDS);
    await prisma.user.update({ where: { id: user.id }, data: { passwordHash } });
  } catch (err) {
    console.error("[profile] password change failed:", err);
    return { error: "Couldn't change your password. Please try again." };
  }

  return { ok: true };
}
