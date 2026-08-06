import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrderByCode } from "@/lib/data/orders";
import { ORDER_STATUS_FLOW } from "@/types";
import type { OrderStatus } from "@/types";

// Prisma OrderStatus enum values (see prisma/schema.prisma).
const PRISMA_ORDER_STATUSES = [
  "REQUESTED",
  "QUOTED",
  "DEPOSIT_PENDING",
  "CONFIRMED",
  "INGREDIENTS_READY",
  "BAKING",
  "DECORATING",
  "QUALITY_CHECK",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "COMPLETED",
  "CANCELLED",
] as const;

const patchSchema = z.object({
  status: z.enum(PRISMA_ORDER_STATUSES),
  note: z.string().optional(),
});

function prismaStatusToDisplay(status: string): OrderStatus {
  const display = status
    .toLowerCase()
    .split("_")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ") as OrderStatus;
  return ORDER_STATUS_FLOW.includes(display) ? display : (ORDER_STATUS_FLOW[0] as OrderStatus);
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  try {
    const order = await prisma.order.findUnique({
      where: { code },
      include: { items: true, payments: true, statusHistory: true, address: true, delivery: true },
    });

    if (order) return NextResponse.json({ source: "db", order });

    const mockOrder = getOrderByCode(code);
    if (mockOrder) return NextResponse.json({ source: "mock", order: mockOrder });

    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  } catch {
    const mockOrder = getOrderByCode(code);
    if (mockOrder) return NextResponse.json({ source: "mock", order: mockOrder });
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const { status, note } = parsed.data;

  try {
    const existing = await prisma.order.findUnique({ where: { code } });
    if (!existing) throw new Error("Order not found in DB — try mock fallback");

    const order = await prisma.order.update({
      where: { code },
      data: {
        status,
        statusHistory: { create: { status, note } },
      },
      include: { items: true, statusHistory: true },
    });

    return NextResponse.json({ source: "db", order });
  } catch {
    const mockOrder = getOrderByCode(code);
    if (!mockOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // No live database — return a shaped preview of the update without mutating the
    // static mock dataset (mock data is process-static; there's no persistence layer here).
    const displayStatus = prismaStatusToDisplay(status);
    const updated = {
      ...mockOrder,
      status: displayStatus,
      timeline: [...mockOrder.timeline, { status: displayStatus, date: new Date().toISOString(), note }],
    };

    return NextResponse.json({ source: "mock", order: updated, warning: "No database connected — this update was not persisted." });
  }
}
