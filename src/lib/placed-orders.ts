"use client";

import type { Order, OrderStatus } from "@/types";

/**
 * Orders placed from this browser.
 *
 * Until the checkout is wired to a live database, a placed order had nowhere
 * to live: checkout minted a code client-side and the tracker only ever
 * searched the seeded demo orders. Looking up a real order therefore either
 * failed, or landed on a seed whose status was already mid-production with
 * every earlier stage pre-ticked — which read as the status advancing on its
 * own, with no vendor action.
 *
 * A placed order is stored here at "Requested" with exactly one timeline
 * entry. Nothing in the customer-facing app advances it; only a vendor status
 * change does. Swap this module for real API reads once the DB is live.
 */

const KEY = "phibakes.placed-orders.v1";

function read(): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Order[]) : [];
  } catch {
    return [];
  }
}

function write(orders: Order[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(orders));
  } catch {
    // Quota or private-mode failures shouldn't break the confirmation flow.
  }
}

export function getPlacedOrders(): Order[] {
  return read();
}

export function getPlacedOrderByCode(code: string): Order | undefined {
  const target = code.trim().toLowerCase();
  return read().find((o) => o.code.toLowerCase() === target);
}

export function savePlacedOrder(order: Order) {
  const existing = read().filter((o) => o.code.toLowerCase() !== order.code.toLowerCase());
  write([order, ...existing].slice(0, 25));
}

/**
 * Builds the order exactly as a freshly-placed order should look: status
 * "Requested", a single timeline entry, and no production progress.
 */
export function buildPlacedOrder(input: {
  code: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: Order["items"];
  total: number;
  amountPaid: number;
  fulfilment: "pickup" | "delivery";
  deliveryAddress?: string;
  deliveryZone?: string;
  eventDate: string;
  notes?: string;
  payment?: Order["payments"][number];
}): Order {
  const now = new Date().toISOString();
  return {
    id: `placed-${input.code}`,
    code: input.code,
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    customerEmail: input.customerEmail,
    items: input.items,
    status: "Requested" as OrderStatus,
    total: input.total,
    depositAmount: Math.round(input.total * 0.5),
    amountPaid: input.amountPaid,
    balanceDue: Math.max(0, input.total - input.amountPaid),
    fulfilment: input.fulfilment,
    deliveryAddress: input.deliveryAddress,
    deliveryZone: input.deliveryZone,
    eventDate: input.eventDate,
    createdAt: now,
    productionPoints: 1,
    notes: input.notes,
    payments: input.payment ? [input.payment] : [],
    timeline: [
      {
        status: "Requested" as OrderStatus,
        date: now,
        note: "Order placed by customer — awaiting confirmation from PhiBakes.",
      },
    ],
  };
}
