"use server";

import crypto from "crypto";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { sendEmail } from "@/lib/services/email";
import type { AuthFormState } from "./actions";

const TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour
const BCRYPT_ROUNDS = 12;

function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function resetUrl(token: string) {
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://phibakes.co.ke";
  return `${base}/reset-password?token=${token}`;
}

export type ResetRequestState = AuthFormState & { sent?: boolean; devLink?: string };

const emailSchema = z.string().email("Enter a valid email address.");

/**
 * Starts the reset flow. Always reports success regardless of whether the
 * address exists — otherwise the form doubles as a way to discover which
 * emails have accounts.
 */
export async function requestPasswordReset(
  _prev: ResetRequestState,
  formData: FormData
): Promise<ResetRequestState> {
  const parsed = emailSchema.safeParse(formData.get("email"));
  if (!parsed.success) {
    return { fieldErrors: { email: parsed.error.issues[0].message } };
  }
  const email = parsed.data.trim().toLowerCase();

  if (!isDatabaseConfigured()) {
    return {
      sent: true,
      error: "No database is connected yet, so no reset email was actually sent.",
    };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email }, select: { id: true, name: true } });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      // Invalidate any outstanding tokens so an older email can't also be used.
      await prisma.passwordResetToken.updateMany({
        where: { userId: user.id, usedAt: null },
        data: { usedAt: new Date() },
      });

      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });

      const link = resetUrl(token);
      const result = await sendEmail({
        to: email,
        subject: "Reset your PhiBakes password",
        html: `
          <div style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6;color:#32151d">
            <p>Hi ${user.name.split(" ")[0]},</p>
            <p>We received a request to reset your PhiBakes password. This link expires in one hour and can only be used once.</p>
            <p><a href="${link}" style="display:inline-block;background:#71152d;color:#fff8f0;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:600">Reset my password</a></p>
            <p style="color:#8a7278;font-size:13px">If you didn't ask for this, you can safely ignore this email — your password won't change.</p>
          </div>`,
      });

      // With no mail credentials the email is only logged, which would strand
      // the user. Surface the link so the flow is still completable.
      if (result.simulated) {
        return { sent: true, devLink: link };
      }
    }
  } catch (err) {
    console.error("[auth] password reset request failed:", err);
    return { error: "We couldn't start the reset right now. Please try again." };
  }

  return { sent: true };
}

const resetSchema = z
  .object({
    token: z.string().min(1, "This reset link is invalid."),
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[0-9]/, "Include at least one number.")
      .regex(/[a-zA-Z]/, "Include at least one letter."),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export async function resetPassword(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = resetSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  if (!isDatabaseConfigured()) {
    return { error: "Password resets need a connected database." };
  }

  const { token, password } = parsed.data;

  try {
    const record = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: hashToken(token) },
      select: { id: true, userId: true, expiresAt: true, usedAt: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      return { error: "This reset link has expired or already been used. Request a new one." };
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);

    // Mark the token used in the same transaction as the password change so a
    // replayed request can't reset the password twice.
    await prisma.$transaction([
      prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
      prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);
  } catch (err) {
    console.error("[auth] password reset failed:", err);
    return { error: "We couldn't reset your password right now. Please try again." };
  }

  redirect("/login?reset=1");
}
