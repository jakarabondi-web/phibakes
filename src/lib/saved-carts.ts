"use client";

import type { CartItem } from "./cart-context";

/**
 * Named carts a customer saved to come back to, plus the "resume" snapshot of
 * the live cart. Both live in localStorage today; when accounts are wired to a
 * real database these become per-customer rows, and the abandoned-cart feed
 * below becomes a server query instead of a local read.
 */

const SAVED_KEY = "phibakes.saved-carts.v1";
const ACTIVITY_KEY = "phibakes.cart-activity.v1";

export type SavedCart = {
  id: string;
  name: string;
  items: CartItem[];
  savedAt: string;
  subtotal: number;
};

/** Last-touched metadata for the live cart, used to resume and to flag abandonment. */
export type CartActivity = {
  updatedAt: string;
  itemCount: number;
  subtotal: number;
  /** Furthest point the customer reached, so "pick up where you left off" is accurate. */
  lastStage: "browsing" | "cart" | "checkout";
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Quota / private-mode failures shouldn't break the cart.
  }
}

/* ---------------------------------- saved carts --------------------------------- */

export function getSavedCarts(): SavedCart[] {
  return read<SavedCart[]>(SAVED_KEY, []);
}

export function saveCart(name: string, items: CartItem[]): SavedCart {
  const cart: SavedCart = {
    id: `sc-${Date.now().toString(36)}`,
    name: name.trim() || `Saved ${new Date().toLocaleDateString("en-KE")}`,
    items,
    savedAt: new Date().toISOString(),
    subtotal: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  };
  write(SAVED_KEY, [cart, ...getSavedCarts()].slice(0, 20));
  return cart;
}

export function deleteSavedCart(id: string) {
  write(
    SAVED_KEY,
    getSavedCarts().filter((c) => c.id !== id)
  );
}

/* --------------------------------- cart activity -------------------------------- */

export function getCartActivity(): CartActivity | null {
  return read<CartActivity | null>(ACTIVITY_KEY, null);
}

export function recordCartActivity(patch: Partial<CartActivity>) {
  const prev = getCartActivity();
  write(ACTIVITY_KEY, {
    ...prev,
    ...patch,
    updatedAt: new Date().toISOString(),
  });
}

export function clearCartActivity() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(ACTIVITY_KEY);
  } catch {
    // ignore
  }
}

/** A cart counts as abandoned once it's sat untouched this long with items in it. */
export const ABANDON_AFTER_MS = 60 * 60 * 1000; // 1 hour

export function isAbandoned(activity: CartActivity | null, now = Date.now()): boolean {
  if (!activity || activity.itemCount === 0) return false;
  return now - new Date(activity.updatedAt).getTime() > ABANDON_AFTER_MS;
}
