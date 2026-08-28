"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getCurrentUser } from "@/lib/auth/dal";
import { isStaffRole } from "@/lib/auth/session";
import { ORDER_STATUS_FLOW, type OrderStatus } from "@/types";
import { statusEnum } from "./orders";

/**
 * Order operations for the console. Staff-gated rather than owner-gated:
 * advancing a cake through the pipeline is the daily job of the whole team,
 * not an owner-only setting. Every mutation re-checks the caller server-side —
 * a server action is a public endpoint.
 */

export type OrderActionState = { ok?: boolean; error?: string };

const NO_DB = "Connect a database to update orders — this console is showing sample data.";

async function requireStaff(): Promise<OrderActionState | null> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (!isStaffRole(user.role)) return { error: "Only staff can update orders." };
  return null;
}

const VALID_STATUSES = new Set<string>([...ORDER_STATUS_FLOW, "Cancelled"]);

function revalidateOrderViews(code: string) {
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${code}`);
  revalidatePath("/dashboard");
  // Customers watch this same state from their side.
  revalidatePath("/account/orders");
  revalidatePath(`/account/orders/${code}`);
}

export async function updateOrderStatus(input: {
  code: string;
  status: OrderStatus;
  note?: string;
}): Promise<OrderActionState> {
  const denied = await requireStaff();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };
  if (!VALID_STATUSES.has(input.status)) return { error: "That isn't a valid order status." };

  try {
    const order = await prisma.order.findFirst({
      where: { code: { equals: input.code, mode: "insensitive" } },
      select: { id: true, status: true },
    });
    if (!order) return { error: "That order no longer exists." };

    const nextStatus = statusEnum(input.status);
    if (order.status === nextStatus) return { ok: true }; // no-op, not an error

    // Status and its history entry move together or not at all — a status
    // with no matching timeline event would make the customer-facing tracker
    // and the console disagree about what happened.
    await prisma.$transaction([
      prisma.order.update({ where: { id: order.id }, data: { status: nextStatus } }),
      prisma.orderStatusEvent.create({
        data: { orderId: order.id, status: nextStatus, note: input.note?.trim() || undefined },
      }),
    ]);
  } catch (err) {
    console.error("[orders] status update failed:", err);
    return { error: "Couldn't update the order status. Please try again." };
  }

  revalidateOrderViews(input.code);
  return { ok: true };
}

export async function saveOrderInternalNotes(input: {
  code: string;
  notes: string;
}): Promise<OrderActionState> {
  const denied = await requireStaff();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };
  if (input.notes.length > 2000) return { error: "Notes are limited to 2000 characters." };

  try {
    const order = await prisma.order.findFirst({
      where: { code: { equals: input.code, mode: "insensitive" } },
      select: { id: true },
    });
    if (!order) return { error: "That order no longer exists." };
    await prisma.order.update({
      where: { id: order.id },
      data: { internalNotes: input.notes.trim() || null },
    });
  } catch (err) {
    console.error("[orders] notes save failed:", err);
    return { error: "Couldn't save the notes. Please try again." };
  }

  revalidateOrderViews(input.code);
  return { ok: true };
}

export async function assignOrderStaff(input: {
  code: string;
  staffId: string | null;
}): Promise<OrderActionState> {
  const denied = await requireStaff();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  try {
    const order = await prisma.order.findFirst({
      where: { code: { equals: input.code, mode: "insensitive" } },
      select: { id: true },
    });
    if (!order) return { error: "That order no longer exists." };

    if (input.staffId) {
      const staff = await prisma.staff.findUnique({ where: { id: input.staffId }, select: { id: true } });
      if (!staff) return { error: "That staff member no longer exists." };
    }

    await prisma.order.update({
      where: { id: order.id },
      data: { assignedStaffId: input.staffId },
    });
  } catch (err) {
    console.error("[orders] assignment failed:", err);
    return { error: "Couldn't update the assignment. Please try again." };
  }

  revalidateOrderViews(input.code);
  return { ok: true };
}
