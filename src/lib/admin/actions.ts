"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getCurrentUser } from "@/lib/auth/dal";
import { kenyanPhoneError, parseKenyanPhone } from "@/lib/kenya-phone";
import { SETTINGS_ID } from "@/lib/platform-settings";

/**
 * Super-admin actions.
 *
 * Every mutation re-checks the caller's role server-side. A server action is a
 * public endpoint — hiding a button in the UI protects nothing, so authorization
 * lives here rather than in the component that renders the form.
 */

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

const NO_DB =
  "Connect a database to save changes — settings can't be persisted while running on demo data.";

/** Only the OWNER may change money, capacity, or who has access. */
async function requireOwner(): Promise<ActionState | null> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (user.role !== "OWNER") {
    return { error: "Only the owner can change this. Ask them to update it for you." };
  }
  return null;
}

function fieldErrorsFrom(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    if (issue.path[0]) out[String(issue.path[0])] = issue.message;
  }
  return out;
}

/* --------------------------------- settings -------------------------------- */

const settingsSchema = z.object({
  businessName: z.string().min(2, "Enter a business name."),
  supportEmail: z.string().email("Enter a valid email address."),
  supportPhone: z.string().min(1, "Enter a support phone number."),
  studioAddress: z.string().min(5, "Enter the studio address."),
  studioHours: z.string().min(3, "Enter opening hours."),
  depositPercent: z.coerce.number().int().min(0, "0-100.").max(100, "0-100."),
  dailyCapacity: z.coerce.number().int().min(1, "At least 1."),
  minLeadTimeHours: z.coerce.number().int().min(0, "Can't be negative."),
  freeDeliveryAbove: z.union([z.coerce.number().min(0), z.literal("")]).optional(),
  taxPercent: z.coerce.number().int().min(0, "0-100.").max(100, "0-100."),
  currency: z.string().min(3).max(4),
  acceptingOrders: z.coerce.boolean(),
});

export async function saveSettings(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;

  const parsed = settingsSchema.safeParse({
    businessName: formData.get("businessName"),
    supportEmail: formData.get("supportEmail"),
    supportPhone: formData.get("supportPhone"),
    studioAddress: formData.get("studioAddress"),
    studioHours: formData.get("studioHours"),
    depositPercent: formData.get("depositPercent"),
    dailyCapacity: formData.get("dailyCapacity"),
    minLeadTimeHours: formData.get("minLeadTimeHours"),
    freeDeliveryAbove: formData.get("freeDeliveryAbove") ?? "",
    taxPercent: formData.get("taxPercent"),
    currency: formData.get("currency"),
    acceptingOrders: formData.get("acceptingOrders") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const phoneErr = kenyanPhoneError(parsed.data.supportPhone);
  if (phoneErr) return { fieldErrors: { supportPhone: phoneErr } };

  if (!isDatabaseConfigured()) return { error: NO_DB };

  const d = parsed.data;
  const freeAbove =
    d.freeDeliveryAbove === "" || d.freeDeliveryAbove === undefined
      ? null
      : Number(d.freeDeliveryAbove);

  try {
    const values = {
      businessName: d.businessName.trim(),
      supportEmail: d.supportEmail.trim().toLowerCase(),
      supportPhone: parseKenyanPhone(d.supportPhone)?.formatted ?? d.supportPhone.trim(),
      studioAddress: d.studioAddress.trim(),
      studioHours: d.studioHours.trim(),
      depositPercent: d.depositPercent,
      dailyCapacity: d.dailyCapacity,
      minLeadTimeHours: d.minLeadTimeHours,
      freeDeliveryAbove: freeAbove,
      taxPercent: d.taxPercent,
      currency: d.currency.trim().toUpperCase(),
      acceptingOrders: d.acceptingOrders,
    };
    await prisma.platformSettings.upsert({
      where: { id: SETTINGS_ID },
      update: values,
      create: { id: SETTINGS_ID, ...values },
    });
  } catch (err) {
    console.error("[admin] saveSettings failed:", err);
    return { error: "Couldn't save those settings. Please try again." };
  }

  // Rates and capacity change what the storefront quotes, so refresh both.
  revalidatePath("/dashboard/settings");
  revalidatePath("/checkout");
  revalidatePath("/");
  return { ok: true };
}

/* ------------------------------- zone rates -------------------------------- */

const zoneSchema = z.object({
  id: z.string().optional(),
  zone: z.string().min(2, "Enter a zone name."),
  fee: z.coerce.number().min(0, "Fee can't be negative."),
  etaMinutes: z.coerce.number().int().min(5, "At least 5 minutes."),
  isActive: z.coerce.boolean(),
});

export async function saveZoneRate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;

  const parsed = zoneSchema.safeParse({
    id: formData.get("id") || undefined,
    zone: formData.get("zone"),
    fee: formData.get("fee"),
    etaMinutes: formData.get("etaMinutes"),
    isActive: formData.get("isActive") === "on",
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const { id, zone, fee, etaMinutes, isActive } = parsed.data;
  try {
    // Default rows aren't real records — their synthetic ids must create, not update.
    const isRealId = id && !id.startsWith("default-");
    if (isRealId) {
      await prisma.deliveryZoneRate.update({
        where: { id },
        data: { zone: zone.trim(), fee, etaMinutes, isActive },
      });
    } else {
      await prisma.deliveryZoneRate.upsert({
        where: { zone: zone.trim() },
        update: { fee, etaMinutes, isActive },
        create: { zone: zone.trim(), fee, etaMinutes, isActive },
      });
    }
  } catch (err) {
    console.error("[admin] saveZoneRate failed:", err);
    return { error: "Couldn't save that zone. The name may already be in use." };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/checkout");
  return { ok: true };
}

export async function deleteZoneRate(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const id = String(formData.get("id") ?? "");
  if (!id || id.startsWith("default-")) {
    return { error: "That zone isn't saved yet, so there's nothing to delete." };
  }
  try {
    await prisma.deliveryZoneRate.delete({ where: { id } });
  } catch (err) {
    console.error("[admin] deleteZoneRate failed:", err);
    return { error: "Couldn't delete that zone." };
  }
  revalidatePath("/dashboard/settings");
  revalidatePath("/checkout");
  return { ok: true };
}

/* ---------------------------------- staff ---------------------------------- */

const STAFF_ROLES = ["MANAGER", "BAKER", "DECORATOR", "DELIVERY_RIDER", "SUPPORT"] as const;

const staffSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Enter their full name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional(),
  role: z.enum(STAFF_ROLES),
  isActive: z.coerce.boolean(),
  vehicleType: z.string().optional(),
  vehiclePlate: z.string().optional(),
  maxConcurrent: z.coerce.number().int().min(1).max(20).optional(),
  notes: z.string().optional(),
});

export async function saveStaff(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;

  const parsed = staffSchema.safeParse({
    id: formData.get("id") || undefined,
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    role: formData.get("role"),
    isActive: formData.get("isActive") === "on",
    vehicleType: formData.get("vehicleType") || undefined,
    vehiclePlate: formData.get("vehiclePlate") || undefined,
    maxConcurrent: formData.get("maxConcurrent") || undefined,
    notes: formData.get("notes") || undefined,
  });
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };

  const d = parsed.data;
  let phone: string | undefined;
  if (d.phone?.trim()) {
    const err = kenyanPhoneError(d.phone);
    if (err) return { fieldErrors: { phone: err } };
    phone = parseKenyanPhone(d.phone)?.e164;
  }

  if (!isDatabaseConfigured()) return { error: NO_DB };

  const isRider = d.role === "DELIVERY_RIDER";
  const staffFields = {
    role: d.role as StaffRole,
    isActive: d.isActive,
    // Clear dispatch details when someone is moved off riding, so a stale plate
    // can't follow them into a kitchen role.
    vehicleType: isRider ? d.vehicleType?.trim() || null : null,
    vehiclePlate: isRider ? d.vehiclePlate?.trim() || null : null,
    maxConcurrent: isRider ? d.maxConcurrent ?? 3 : 3,
    notes: d.notes?.trim() || null,
  };

  try {
    if (d.id) {
      const staff = await prisma.staff.findUnique({
        where: { id: d.id },
        select: { userId: true },
      });
      if (!staff) return { error: "That staff member no longer exists." };

      await prisma.$transaction([
        prisma.user.update({
          where: { id: staff.userId },
          data: { name: d.name.trim(), email: d.email.trim().toLowerCase(), phone, role: d.role },
        }),
        prisma.staff.update({ where: { id: d.id }, data: staffFields }),
      ]);
    } else {
      const existing = await prisma.user.findUnique({
        where: { email: d.email.trim().toLowerCase() },
        select: { id: true },
      });
      if (existing) {
        return { fieldErrors: { email: "Someone already uses that email address." } };
      }
      // No password yet: they set one via the reset flow, so we never invent
      // a credential and mail it around.
      await prisma.user.create({
        data: {
          name: d.name.trim(),
          email: d.email.trim().toLowerCase(),
          phone,
          role: d.role,
          staff: { create: staffFields },
        },
      });
    }
  } catch (err) {
    console.error("[admin] saveStaff failed:", err);
    return { error: "Couldn't save that team member. Please try again." };
  }

  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/delivery");
  return { ok: true };
}

export async function setStaffActive(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const id = String(formData.get("id") ?? "");
  const isActive = formData.get("isActive") === "true";
  try {
    await prisma.staff.update({ where: { id }, data: { isActive } });
  } catch (err) {
    console.error("[admin] setStaffActive failed:", err);
    return { error: "Couldn't update that team member." };
  }
  revalidatePath("/dashboard/staff");
  return { ok: true };
}

export async function deleteStaff(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const id = String(formData.get("id") ?? "");
  try {
    const staff = await prisma.staff.findUnique({ where: { id }, select: { userId: true } });
    if (!staff) return { error: "That staff member no longer exists." };
    // Deleting the user cascades to the staff row; orders keep their history
    // because assignedStaffId is nullable.
    await prisma.user.delete({ where: { id: staff.userId } });
  } catch (err) {
    console.error("[admin] deleteStaff failed:", err);
    return { error: "Couldn't remove that team member — they may have linked records." };
  }
  revalidatePath("/dashboard/staff");
  revalidatePath("/dashboard/delivery");
  return { ok: true };
}
