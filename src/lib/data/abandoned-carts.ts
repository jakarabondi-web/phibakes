import type { CartItem } from "@/lib/cart-context";

/**
 * Abandoned-cart records for the dashboard.
 *
 * Carts are currently held client-side, so a browser's cart isn't readable by
 * staff on another machine — these seeds stand in for the server-side feed so
 * the follow-up workflow is complete and testable. Once carts are persisted
 * per-customer, swap `ABANDONED_CARTS` for that query; the shape below is what
 * the view already consumes.
 */

export type FollowUpChannel = "sms" | "email" | "whatsapp";

export type AbandonedCart = {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Pick<CartItem, "name" | "size" | "flavour" | "price" | "quantity">[];
  subtotal: number;
  /** Furthest point reached before going quiet. */
  lastStage: "cart" | "checkout";
  updatedAt: string;
  /** ISO timestamps of follow-ups already sent, newest last. */
  followUps: { channel: FollowUpChannel; sentAt: string }[];
  recovered?: boolean;
};

function hoursAgo(h: number) {
  // Fixed reference point keeps the demo data stable across renders/builds.
  const base = new Date("2026-08-07T09:00:00.000Z").getTime();
  return new Date(base - h * 60 * 60 * 1000).toISOString();
}

export const ABANDONED_CARTS: AbandonedCart[] = [
  {
    id: "ac-1",
    customerName: "Njeri Mwangi",
    customerEmail: "njeri.mwangi@example.com",
    customerPhone: "+254 712 884 210",
    items: [
      { name: "Ivory Rose Wedding Tier", size: "Multi-tier", flavour: "Vanilla", price: 38000, quantity: 1 },
    ],
    subtotal: 38000,
    lastStage: "checkout",
    updatedAt: hoursAgo(3),
    followUps: [],
  },
  {
    id: "ac-2",
    customerName: "Brian Otieno",
    customerEmail: "brian.otieno@example.com",
    customerPhone: "+254 733 512 907",
    items: [
      { name: "Chocolate Fudge Indulgence", size: "2kg", flavour: "Chocolate", price: 8500, quantity: 1 },
      { name: "Assorted Cupcakes", size: "12 pack", flavour: "Mixed", price: 2400, quantity: 1 },
    ],
    subtotal: 10900,
    lastStage: "cart",
    updatedAt: hoursAgo(9),
    followUps: [{ channel: "sms", sentAt: hoursAgo(2) }],
  },
  {
    id: "ac-3",
    customerName: "Aisha Hassan",
    customerEmail: "aisha.hassan@example.com",
    customerPhone: "+254 720 337 145",
    items: [
      { name: "Red Velvet Celebration", size: "1kg", flavour: "Red Velvet", price: 5500, quantity: 2 },
    ],
    subtotal: 11000,
    lastStage: "checkout",
    updatedAt: hoursAgo(26),
    followUps: [
      { channel: "email", sentAt: hoursAgo(20) },
      { channel: "whatsapp", sentAt: hoursAgo(6) },
    ],
  },
  {
    id: "ac-4",
    customerName: "Peter Kimani",
    customerEmail: "peter.kimani@example.com",
    customerPhone: "+254 790 664 018",
    items: [
      { name: "Lemon Drizzle Loaf", size: "0.5kg", flavour: "Lemon", price: 3200, quantity: 1 },
    ],
    subtotal: 3200,
    lastStage: "cart",
    updatedAt: hoursAgo(52),
    followUps: [{ channel: "sms", sentAt: hoursAgo(48) }],
    recovered: true,
  },
];

/** Default follow-up copy per channel — staff can edit before sending. */
export function defaultFollowUpMessage(cart: AbandonedCart, channel: FollowUpChannel) {
  const firstName = cart.customerName.split(" ")[0];
  const itemName = cart.items[0]?.name ?? "your cake";
  if (channel === "email") {
    return `Hi ${firstName},\n\nYou left ${itemName} in your PhiBakes cart. We've saved it for you — just pick up where you left off and we'll take care of the rest.\n\nNeed a hand choosing a size or flavour? Reply to this email and we'll help.\n\n— The PhiBakes team`;
  }
  return `Hi ${firstName}, it's PhiBakes! You left ${itemName} in your cart. We've saved it for you — finish your order here: phibakes.co.ke/cart`;
}
