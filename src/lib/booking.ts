/**
 * Production-point booking capacity.
 * Every cake consumes a number of "production points" on its event date.
 * Once a date's booked points reach the owner-configured daily capacity,
 * the date is considered Fully Booked and cannot accept new orders.
 */
import { ORDERS } from "@/lib/data/orders";
import { formatDate } from "@/lib/utils";

export const DAILY_CAPACITY = 12; // points/day, configurable by the owner in Settings

export const PRODUCTION_POINTS: Record<string, number> = {
  simple: 1, // ready-today / cupcakes / desserts / simple birthday
  custom: 3, // custom-built cakes, graduation, corporate
  wedding: 8, // multi-tier wedding cakes
};

export function pointsForOccasion(occasion: string, isCustom: boolean) {
  if (occasion.toLowerCase().includes("wedding")) return PRODUCTION_POINTS.wedding;
  if (isCustom) return PRODUCTION_POINTS.custom;
  return PRODUCTION_POINTS.simple;
}

function bookedPointsForDate(dateISO: string) {
  const target = new Date(dateISO).toDateString();
  return ORDERS.filter((o) => new Date(o.eventDate).toDateString() === target && o.status !== "Cancelled").reduce(
    (sum, o) => sum + o.productionPoints,
    0
  );
}

export function getDateAvailability(dateISO: string) {
  const booked = bookedPointsForDate(dateISO);
  const remaining = Math.max(0, DAILY_CAPACITY - booked);
  return {
    date: dateISO,
    booked,
    capacity: DAILY_CAPACITY,
    remaining,
    isFullyBooked: remaining <= 0,
  };
}

export function canBookDate(dateISO: string, requiredPoints: number) {
  return getDateAvailability(dateISO).remaining >= requiredPoints;
}

export function getAvailabilityForRange(startISO: string, days: number) {
  const start = new Date(startISO);
  return Array.from({ length: days }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const iso = d.toISOString();
    return { ...getDateAvailability(iso), label: formatDate(d) };
  });
}
