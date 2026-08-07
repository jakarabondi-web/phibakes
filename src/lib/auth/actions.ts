"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { kenyanPhoneError, parseKenyanPhone } from "@/lib/kenya-phone";
import { createSession, destroySession, landingPathFor, isAuthConfigured } from "./session";
import { findDemoUserByEmail } from "./demo-users";

export type AuthFormState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

const BCRYPT_ROUNDS = 12;

/**
 * Constant-ish failure message. Saying "no account with that email" would let
 * anyone enumerate which addresses are registered, so both a missing user and a
 * wrong password return the same text.
 */
const INVALID_CREDENTIALS = "Email or password is incorrect.";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Enter your full name."),
    email: z.string().email("Enter a valid email address."),
    phone: z.string().optional(),
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

function safeNext(raw: FormDataEntryValue | null): string | null {
  const value = typeof raw === "string" ? raw.trim() : "";
  // Only allow same-site relative paths — an absolute URL here would be an open
  // redirect straight off the back of a successful sign-in.
  if (!value.startsWith("/") || value.startsWith("//")) return null;
  return value;
}

export async function signIn(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!isAuthConfigured()) {
    return { error: "Sign-in isn't configured yet — AUTH_SECRET is missing on the server." };
  }

  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const { email, password } = parsed.data;
  const next = safeNext(formData.get("next"));

  if (!isDatabaseConfigured()) {
    const demo = findDemoUserByEmail(email);
    if (!demo || demo.password !== password) return { error: INVALID_CREDENTIALS };
    await createSession({
      userId: demo.id,
      role: demo.role,
      name: demo.name,
      email: demo.email,
    });
    redirect(next ?? landingPathFor(demo.role));
  }

  let user: {
    id: string;
    name: string;
    email: string;
    role: import("@prisma/client").UserRole;
    passwordHash: string | null;
  } | null = null;

  try {
    user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, name: true, email: true, role: true, passwordHash: true },
    });
  } catch (err) {
    console.error("[auth] sign-in lookup failed:", err);
    return { error: "We couldn't sign you in right now. Please try again." };
  }

  // Compare against a dummy hash when the user is missing so the response time
  // doesn't reveal whether the address exists.
  const hash = user?.passwordHash ?? "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinvalidiu";
  const ok = await bcrypt.compare(password, hash);

  if (!user || !user.passwordHash || !ok) return { error: INVALID_CREDENTIALS };

  await createSession({
    userId: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  });
  redirect(next ?? landingPathFor(user.role));
}

export async function register(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  if (!isAuthConfigured()) {
    return { error: "Registration isn't configured yet — AUTH_SECRET is missing on the server." };
  }

  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
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

  const { name, email, password } = parsed.data;
  const phoneRaw = parsed.data.phone?.trim();

  // Phone is optional, but a supplied one must be a real Kenyan mobile.
  let phone: string | undefined;
  if (phoneRaw) {
    const phoneErr = kenyanPhoneError(phoneRaw);
    if (phoneErr) return { fieldErrors: { phone: phoneErr } };
    phone = parseKenyanPhone(phoneRaw)?.e164;
  }

  if (!isDatabaseConfigured()) {
    return {
      error:
        "Accounts can't be created until a database is connected. Use a demo account below to explore.",
    };
  }

  try {
    const existing = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true },
    });
    if (existing) {
      return { fieldErrors: { email: "An account with this email already exists." } };
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        name,
        email: email.trim().toLowerCase(),
        phone,
        passwordHash,
        role: "CUSTOMER",
        // Every signup is a customer, and the customer row is what orders,
        // quotes, and addresses attach to — create it in the same transaction
        // so we can't end up with a user that can't place an order.
        customer: { create: {} },
      },
      select: { id: true, name: true, email: true, role: true },
    });

    await createSession({
      userId: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    console.error("[auth] registration failed:", err);
    return { error: "We couldn't create your account right now. Please try again." };
  }

  redirect("/account");
}

export async function signOut() {
  await destroySession();
  redirect("/");
}
