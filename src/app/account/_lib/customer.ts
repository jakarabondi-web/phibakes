import { CUSTOMERS } from "@/lib/data/inventory";
import { ORDERS } from "@/lib/data/orders";
import { QUOTES } from "@/lib/data/quotes";
import type { Order, PaymentRecord, Quote } from "@/types";

/**
 * Simulated logged-in customer for the account portal demo.
 * Wanjiru Kamau === CUSTOMERS[0], matched against ORDERS by customerName.
 */
export const CURRENT_CUSTOMER = CUSTOMERS[0];

export function getMyOrders(): Order[] {
  return ORDERS.filter((o) => o.customerName === CURRENT_CUSTOMER.name);
}

export function getMyOrder(code: string): Order | undefined {
  return getMyOrders().find((o) => o.code.toLowerCase() === code.toLowerCase());
}

/** All demo quotes are shown as if they belong to the logged-in customer, for portal richness. */
export function getMyQuotes(): Quote[] {
  return QUOTES;
}

export type FlatPayment = PaymentRecord & { orderCode: string; cakeName: string };

export function getMyPayments(): FlatPayment[] {
  return getMyOrders().flatMap((o) =>
    o.payments.map((p) => ({ ...p, orderCode: o.code, cakeName: o.items[0]?.cakeName ?? o.code }))
  );
}

export const ACTIVE_STATUSES = new Set([
  "Requested",
  "Quoted",
  "Deposit Pending",
  "Confirmed",
  "Ingredients Ready",
  "Baking",
  "Decorating",
  "Quality Check",
  "Ready",
  "Out for Delivery",
]);

export function isActiveOrder(order: Order) {
  return ACTIVE_STATUSES.has(order.status);
}
