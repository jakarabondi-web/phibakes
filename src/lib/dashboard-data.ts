// Derived / synthesized data helpers for the Owner Dashboard.
// Everything here is computed from the existing mock data sources (ORDERS,
// INVENTORY, CUSTOMERS, CAKES) — nothing is hardcoded as a standalone fact.
import { ORDERS } from "@/lib/data/orders";
import { INVENTORY, PRODUCTION_TASKS, CUSTOMERS } from "@/lib/data/inventory";
import { CAKES } from "@/lib/data/cakes";
import { CATEGORIES } from "@/lib/data/categories";
import type { OrderStatus } from "@/types";

// The dataset is authored around this in-story "today" so derived KPIs
// (today's orders, deliveries today, etc.) line up with the seeded records.
export const REFERENCE_DATE = "2026-08-06";
export const REFERENCE_MONTH = 8; // August
export const REFERENCE_YEAR = 2026;

const PRODUCTION_STATUSES: OrderStatus[] = [
  "Ingredients Ready",
  "Baking",
  "Decorating",
  "Quality Check",
];

function sameDay(dateISO: string, ref = REFERENCE_DATE) {
  return new Date(dateISO).toDateString() === new Date(ref).toDateString();
}

function inReferenceMonth(dateISO: string) {
  const d = new Date(dateISO);
  return d.getFullYear() === REFERENCE_YEAR && d.getMonth() + 1 === REFERENCE_MONTH;
}

export function getOverviewStats() {
  const activeOrders = ORDERS.filter((o) => o.status !== "Cancelled");

  const todaysOrders = ORDERS.filter((o) => sameDay(o.createdAt)).length;

  const revenueThisMonth = activeOrders
    .filter((o) => inReferenceMonth(o.createdAt))
    .reduce((sum, o) => sum + o.total, 0);

  const depositsCollected = activeOrders.reduce((sum, o) => sum + o.amountPaid, 0);
  const outstandingBalance = activeOrders.reduce((sum, o) => sum + o.balanceDue, 0);

  const ordersInProduction = activeOrders.filter((o) => PRODUCTION_STATUSES.includes(o.status)).length;

  const deliveriesToday = ORDERS.filter(
    (o) => o.fulfilment === "delivery" && sameDay(o.eventDate) && o.status !== "Cancelled"
  ).length;

  const criticalInventory = INVENTORY.filter((i) => i.status === "critical").length;
  const lowInventory = INVENTORY.filter((i) => i.status === "low").length;

  return {
    todaysOrders,
    revenueThisMonth,
    depositsCollected,
    outstandingBalance,
    ordersInProduction,
    deliveriesToday,
    unreadMessages: 7, // no messaging data source yet — plausible mock count
    inventoryAlerts: criticalInventory + lowInventory,
    criticalInventory,
    lowInventory,
  };
}

// Deterministic pseudo-random helper (no Math.random so builds are stable).
function seeded(n: number) {
  const x = Math.sin(n) * 10000;
  return x - Math.floor(x);
}

export function getSalesTrend(days = 30) {
  const end = new Date(REFERENCE_DATE);
  const base = ORDERS.reduce((s, o) => s + o.total, 0) / ORDERS.length / 6;
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(end);
    d.setDate(d.getDate() - (days - 1 - i));
    const weekday = d.getDay();
    const weekendBoost = weekday === 0 || weekday === 6 ? 1.4 : 1;
    const noise = 0.6 + seeded(i * 13.7) * 0.9;
    const revenue = Math.round(base * weekendBoost * noise * 1000) / 1000;
    return {
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-KE", { day: "numeric", month: "short" }),
      revenue: Math.round(revenue * 1000),
      orders: Math.max(1, Math.round(2 + seeded(i * 3.3) * 6 * weekendBoost)),
    };
  });
}

export function getOrdersByStatus() {
  const counts = new Map<OrderStatus, number>();
  for (const o of ORDERS) counts.set(o.status, (counts.get(o.status) ?? 0) + 1);
  return Array.from(counts.entries()).map(([status, count]) => ({ status, count }));
}

export function getRevenueByCategory() {
  const byCategory = new Map<string, number>();
  for (const o of ORDERS) {
    if (o.status === "Cancelled") continue;
    for (const item of o.items) {
      const cake = CAKES.find((c) => c.name === item.cakeName);
      const category = cake?.category ?? "desserts";
      byCategory.set(category, (byCategory.get(category) ?? 0) + item.price * item.quantity);
    }
  }
  return CATEGORIES.map((c) => ({
    category: c.name,
    revenue: byCategory.get(c.slug) ?? 0,
  })).filter((c) => c.revenue > 0);
}

export function getCustomerGrowth() {
  // Cumulative customer count by join month, synthesized from CUSTOMERS.joinedAt
  const sorted = [...CUSTOMERS].sort(
    (a, b) => new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime()
  );
  const months: { label: string; key: string }[] = [];
  const start = new Date(sorted[0]?.joinedAt ?? REFERENCE_DATE);
  const end = new Date(REFERENCE_DATE);
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1);
  while (cursor <= end) {
    months.push({
      label: cursor.toLocaleDateString("en-KE", { month: "short", year: "2-digit" }),
      key: `${cursor.getFullYear()}-${cursor.getMonth()}`,
    });
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return months.map((m, i) => {
    const count = sorted.filter((c) => {
      const d = new Date(c.joinedAt);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      return months.findIndex((mm) => mm.key === key) <= i;
    }).length;
    return { month: m.label, customers: count };
  });
}

export function getTodaysProduction() {
  return PRODUCTION_TASKS.filter((t) => sameDay(t.start)).sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
}

export function getUpcomingDeliveries(limit = 6) {
  return ORDERS.filter((o) => o.fulfilment === "delivery" && o.status !== "Cancelled" && o.status !== "Delivered" && o.status !== "Completed")
    .sort((a, b) => new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime())
    .slice(0, limit);
}

export function getReportSummary() {
  const active = ORDERS.filter((o) => o.status !== "Cancelled");
  const totalRevenue = active.reduce((s, o) => s + o.total, 0);
  const depositsCollected = active.reduce((s, o) => s + o.amountPaid, 0);
  const outstanding = active.reduce((s, o) => s + o.balanceDue, 0);
  const inventoryValuation = INVENTORY.reduce((s, i) => s + i.quantity * i.costPerUnit, 0);
  const estimatedMarginPct = 38; // plausible bakery gross-margin estimate
  const estimatedProfit = Math.round(totalRevenue * (estimatedMarginPct / 100));
  const repeatCustomers = CUSTOMERS.filter((c) => c.totalOrders > 1).length;
  const avgOrderValue = Math.round(totalRevenue / Math.max(1, active.length));

  return {
    totalRevenue,
    depositsCollected,
    outstanding,
    inventoryValuation,
    estimatedMarginPct,
    estimatedProfit,
    repeatCustomers,
    repeatCustomerRate: Math.round((repeatCustomers / Math.max(1, CUSTOMERS.length)) * 100),
    avgOrderValue,
    totalOrders: active.length,
  };
}

export function getMonthlyGrowth() {
  // Synthesize a 6-month revenue trend leading up to the reference month,
  // anchored to the real current-month revenue so the trend is coherent.
  const stats = getOverviewStats();
  const months = ["Mar", "Apr", "May", "Jun", "Jul", "Aug"];
  let running = stats.revenueThisMonth * 0.62;
  return months.map((m, i) => {
    if (i === months.length - 1) return { month: m, revenue: stats.revenueThisMonth };
    running = running * (1 + (0.06 + seeded(i * 5.1) * 0.05));
    return { month: m, revenue: Math.round(running) };
  });
}

export function getPopularCakes(limit = 6) {
  const counts = new Map<string, number>();
  for (const o of ORDERS) {
    for (const item of o.items) {
      counts.set(item.cakeName, (counts.get(item.cakeName) ?? 0) + item.quantity);
    }
  }
  return CAKES.map((c) => ({
    cake: c,
    orders: counts.get(c.name) ?? Math.round(seeded(c.id.length * 7) * 5),
  }))
    .sort((a, b) => b.orders - a.orders)
    .slice(0, limit);
}
