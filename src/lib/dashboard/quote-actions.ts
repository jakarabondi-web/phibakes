"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getCurrentUser } from "@/lib/auth/dal";
import { isStaffRole } from "@/lib/auth/session";
import { getPlatformSettings } from "@/lib/platform-settings";

/**
 * Quote operations for the console. Staff-gated for the same reason as order
 * operations (see ./order-actions.ts): pricing and converting quotes is the
 * team's daily work, and every action re-checks the caller server-side.
 */

export type QuoteActionState = { ok?: boolean; error?: string; orderCode?: string };

const NO_DB = "Connect a database to update quotes — this console is showing sample data.";

async function requireStaff(): Promise<QuoteActionState | null> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (!isStaffRole(user.role)) return { error: "Only staff can update quotes." };
  return null;
}

function revalidateQuoteViews() {
  revalidatePath("/dashboard/quotes");
  revalidatePath("/account/quotes");
}

/** Price the quote and mark it QUOTED — the step that tells the customer a number. */
export async function sendQuote(input: { code: string; price: number }): Promise<QuoteActionState> {
  const denied = await requireStaff();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };
  if (!Number.isFinite(input.price) || input.price <= 0) {
    return { error: "Enter a quoted price above zero." };
  }

  try {
    const quote = await prisma.quote.findFirst({
      where: { code: { equals: input.code, mode: "insensitive" } },
      select: { id: true, convertedOrderId: true },
    });
    if (!quote) return { error: "That quote no longer exists." };
    if (quote.convertedOrderId) return { error: "That quote was already converted to an order." };

    await prisma.quote.update({
      where: { id: quote.id },
      data: { quotedPrice: input.price, status: "QUOTED" },
    });
  } catch (err) {
    console.error("[quotes] send failed:", err);
    return { error: "Couldn't send that quote. Please try again." };
  }

  revalidateQuoteViews();
  return { ok: true };
}

function generateOrderCode() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `PB-${n}`;
}

/**
 * Turn an accepted quote into a real order. The quote's priced amount becomes
 * a single custom order item; the deposit uses the platform's configured
 * percentage. Everything moves in one transaction — a quote marked converted
 * with no order behind it (or the reverse) would leave the console and the
 * customer telling different stories.
 */
export async function convertQuoteToOrder(input: { code: string }): Promise<QuoteActionState> {
  const denied = await requireStaff();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  try {
    const quote = await prisma.quote.findFirst({
      where: { code: { equals: input.code, mode: "insensitive" } },
    });
    if (!quote) return { error: "That quote no longer exists." };
    if (quote.convertedOrderId) return { error: "That quote was already converted to an order." };

    const price = quote.quotedPrice ?? quote.estimatedPrice;
    if (!price) return { error: "Set a quoted price before converting to an order." };

    const settings = await getPlatformSettings();
    const total = Number(price);
    const depositAmount = Math.round((total * settings.depositPercent) / 100);
    const orderCode = generateOrderCode();

    await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          code: orderCode,
          customerId: quote.customerId,
          status: "CONFIRMED",
          fulfilment: "PICKUP",
          eventDate: quote.eventDate,
          subtotal: total,
          total,
          depositAmount,
          customerNotes: quote.specialInstructions,
          items: {
            create: {
              nameSnapshot: `Custom ${quote.occasion} Cake (${quote.size})`,
              size: quote.size,
              flavour: quote.flavour,
              filling: quote.filling,
              decoration: quote.decoration,
              quantity: 1,
              unitPrice: total,
              isCustom: true,
              referenceImages: quote.referenceImages,
            },
          },
          statusHistory: {
            create: { status: "CONFIRMED", note: `Converted from quote ${quote.code}` },
          },
        },
      });
      await tx.quote.update({
        where: { id: quote.id },
        data: { status: "ACCEPTED", convertedOrderId: order.id },
      });
      return order;
    });

    revalidateQuoteViews();
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard");
    return { ok: true, orderCode };
  } catch (err) {
    console.error("[quotes] convert failed:", err);
    return { error: "Couldn't convert that quote. Please try again." };
  }
}
