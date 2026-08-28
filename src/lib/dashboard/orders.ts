import "server-only";

import { cache } from "react";
import type { OrderStatus as DbOrderStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { ORDERS } from "@/lib/data/orders";
import type { Order, OrderStatus, PaymentRecord } from "@/types";

/**
 * Dashboard order reads.
 *
 * Demo orders appear ONLY when no database is configured. This deliberately
 * breaks with the fall-back-on-empty convention used by the gallery and zone
 * rates: those are decorative, orders are operational. A connected bakery with
 * zero orders must see an empty list — an owner who can't tell a sample order
 * from a real one is an owner who bakes a cake nobody bought. For the same
 * reason a failed read against a configured database throws instead of
 * degrading: an error page is honest, a quietly empty (or quietly fake) order
 * book is not.
 */

export type OrdersResult = {
  orders: Order[];
  /** false = running on built-in demo data (no database configured). */
  live: boolean;
};

/** DB enum "OUT_FOR_DELIVERY" <-> view label "Out for Delivery". */
export function statusLabel(db: DbOrderStatus): OrderStatus {
  return db
    .toLowerCase()
    .split("_")
    .map((w) => (w === "for" ? "for" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ") as OrderStatus;
}

export function statusEnum(label: OrderStatus): DbOrderStatus {
  return label.toUpperCase().replace(/ /g, "_") as DbOrderStatus;
}

const ORDER_INCLUDE = {
  customer: { include: { user: { select: { name: true, email: true, phone: true } } } },
  items: { include: { product: { select: { images: true } } } },
  payments: true,
  statusHistory: { orderBy: { createdAt: "asc" as const } },
  address: true,
  assignedStaff: { include: { user: { select: { name: true } } } },
} satisfies Prisma.OrderInclude;

type DbOrder = Prisma.OrderGetPayload<{ include: typeof ORDER_INCLUDE }>;

const PAYMENT_METHOD: Record<string, PaymentRecord["method"]> = {
  MPESA: "mpesa",
  CARD: "card",
  CASH: "cash",
};

const FALLBACK_ITEM_IMAGE = "/images/stock/cake-01.jpg";

function mapOrder(row: DbOrder): Order {
  const successfulPaid = row.payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + Number(p.amount), 0);
  const total = Number(row.total);

  const timeline =
    row.statusHistory.length > 0
      ? row.statusHistory.map((e) => ({
          status: statusLabel(e.status),
          date: e.createdAt.toISOString(),
          note: e.note ?? undefined,
        }))
      : [{ status: statusLabel(row.status), date: row.createdAt.toISOString() }];

  return {
    id: row.id,
    code: row.code,
    customerName: row.customer.user.name,
    customerPhone: row.customer.user.phone ?? "",
    customerEmail: row.customer.user.email,
    items: row.items.map((item) => ({
      id: item.id,
      cakeName: item.nameSnapshot,
      image: item.product?.images[0] ?? item.referenceImages[0] ?? FALLBACK_ITEM_IMAGE,
      size: item.size,
      flavour: item.flavour,
      quantity: item.quantity,
      price: Number(item.unitPrice),
      isCustom: item.isCustom,
    })),
    status: statusLabel(row.status),
    total,
    depositAmount: Number(row.depositAmount),
    amountPaid: successfulPaid,
    balanceDue: Math.max(0, total - successfulPaid),
    fulfilment: row.fulfilment === "DELIVERY" ? "delivery" : "pickup",
    deliveryAddress: row.address
      ? [row.address.line1, row.address.line2, row.address.city].filter(Boolean).join(", ")
      : undefined,
    deliveryZone: row.address?.zone ?? undefined,
    eventDate: row.eventDate.toISOString(),
    createdAt: row.createdAt.toISOString(),
    assignedStaff: row.assignedStaff?.user.name,
    assignedStaffId: row.assignedStaffId ?? undefined,
    productionPoints: row.productionPoints,
    notes: row.customerNotes ?? undefined,
    internalNotes: row.internalNotes ?? undefined,
    payments: row.payments.map((p) => ({
      id: p.id,
      type: p.type.toLowerCase() as PaymentRecord["type"],
      method: PAYMENT_METHOD[p.method] ?? "cash",
      amount: Number(p.amount),
      status: p.status === "SUCCESS" ? "success" : p.status === "FAILED" ? "failed" : "pending",
      mpesaReceipt: p.mpesaReceiptNumber ?? undefined,
      phone: p.phoneNumber ?? undefined,
      date: p.createdAt.toISOString(),
    })),
    timeline,
  };
}

export const getDashboardOrders = cache(async (): Promise<OrdersResult> => {
  if (!isDatabaseConfigured()) return { orders: ORDERS, live: false };
  const rows = await prisma.order.findMany({
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return { orders: rows.map(mapOrder), live: true };
});

/** Orders belonging to one customer, for the customer detail page. Live only —
 * the demo path matches by name there, since demo orders carry no customerId. */
export const getDashboardOrdersForCustomer = cache(async (customerId: string): Promise<Order[]> => {
  if (!isDatabaseConfigured()) return [];
  const rows = await prisma.order.findMany({
    where: { customerId },
    include: ORDER_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(mapOrder);
});

export const getDashboardOrderByCode = cache(
  async (code: string): Promise<{ order: Order | null; live: boolean }> => {
    if (!isDatabaseConfigured()) {
      return {
        order: ORDERS.find((o) => o.code.toLowerCase() === code.toLowerCase()) ?? null,
        live: false,
      };
    }
    const row = await prisma.order.findFirst({
      where: { code: { equals: code, mode: "insensitive" } },
      include: ORDER_INCLUDE,
    });
    return { order: row ? mapOrder(row) : null, live: true };
  }
);
