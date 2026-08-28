import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { CUSTOMERS } from "@/lib/data/inventory";
import type { Customer } from "@/types";

/**
 * Dashboard customer reads. Same policy as orders (see ./orders.ts): demo
 * customers only when no database is configured, an honest empty list once
 * one is, and a thrown error over silently wrong data.
 */

export type CustomersResult = {
  customers: Customer[];
  live: boolean;
};

function tierLabel(tier: string): Customer["tier"] {
  const t = tier.toLowerCase();
  return (t.charAt(0).toUpperCase() + t.slice(1)) as Customer["tier"];
}

type CustomerRow = {
  id: string;
  loyaltyPoints: number;
  tier: string;
  createdAt: Date;
  user: { name: string; email: string; phone: string | null; avatarUrl: string | null };
  orders: { total: unknown; createdAt: Date }[];
};

function mapCustomer(row: CustomerRow): Customer {
  const totalSpent = row.orders.reduce((sum, o) => sum + Number(o.total), 0);
  const lastOrder = row.orders.reduce<Date | null>(
    (latest, o) => (latest === null || o.createdAt > latest ? o.createdAt : latest),
    null
  );
  return {
    id: row.id,
    name: row.user.name,
    email: row.user.email,
    phone: row.user.phone ?? "",
    avatar: row.user.avatarUrl ?? undefined,
    joinedAt: row.createdAt.toISOString(),
    totalOrders: row.orders.length,
    totalSpent,
    loyaltyPoints: row.loyaltyPoints,
    tier: tierLabel(row.tier),
    lastOrderAt: lastOrder?.toISOString(),
  };
}

const CUSTOMER_QUERY = {
  include: {
    user: { select: { name: true, email: true, phone: true, avatarUrl: true } },
    orders: { select: { total: true, createdAt: true } },
  },
} as const;

export const getDashboardCustomers = cache(async (): Promise<CustomersResult> => {
  if (!isDatabaseConfigured()) return { customers: CUSTOMERS, live: false };
  const rows = await prisma.customer.findMany({
    ...CUSTOMER_QUERY,
    orderBy: { createdAt: "desc" },
  });
  return { customers: rows.map(mapCustomer), live: true };
});

export const getDashboardCustomerById = cache(
  async (id: string): Promise<{ customer: Customer | null; live: boolean }> => {
    if (!isDatabaseConfigured()) {
      return { customer: CUSTOMERS.find((c) => c.id === id) ?? null, live: false };
    }
    const row = await prisma.customer.findUnique({ where: { id }, ...CUSTOMER_QUERY });
    return { customer: row ? mapCustomer(row) : null, live: true };
  }
);
