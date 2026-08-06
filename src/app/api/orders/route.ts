import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ORDERS } from "@/lib/data/orders";
import type { Order, OrderStatus } from "@/types";

const orderItemSchema = z.object({
  productId: z.string().optional(),
  nameSnapshot: z.string().min(1),
  size: z.string().min(1),
  flavour: z.string().min(1),
  filling: z.string().optional(),
  decoration: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().nonnegative(),
  isCustom: z.boolean().optional().default(false),
  referenceImages: z.array(z.string()).optional().default([]),
});

const createOrderSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(1),
  customerPhone: z.string().min(7),
  customerEmail: z.string().email(),
  items: z.array(orderItemSchema).min(1, "At least one item is required"),
  fulfilment: z.enum(["PICKUP", "DELIVERY", "pickup", "delivery"]),
  addressId: z.string().optional(),
  deliveryAddress: z.string().optional(),
  deliveryZone: z.string().optional(),
  deliveryFee: z.number().nonnegative().optional().default(0),
  eventDate: z.string().min(1),
  customerNotes: z.string().optional(),
  couponId: z.string().optional(),
  discountAmount: z.number().nonnegative().optional().default(0),
  depositRatio: z.number().min(0).max(1).optional().default(0.5),
});

function generateOrderCode() {
  const n = Math.floor(10000 + Math.random() * 90000);
  return `PB-${n}`;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const customerId = params.get("customerId");
  const status = params.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (customerId) where.customerId = customerId;
    if (status) where.status = status;

    const orders = await prisma.order.findMany({
      where,
      include: { items: true, payments: true, statusHistory: true, address: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ source: "db", orders });
  } catch {
    let orders = [...ORDERS];
    if (status) orders = orders.filter((o) => o.status.toLowerCase() === status.toLowerCase());
    // Mock data has no customerId concept — filter is a no-op there, kept for API symmetry.
    return NextResponse.json({ source: "mock", orders });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const subtotal = data.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const deliveryFee = data.fulfilment.toLowerCase() === "delivery" ? data.deliveryFee : 0;
  const total = Math.max(0, subtotal - data.discountAmount + deliveryFee);
  const depositAmount = Math.round(total * data.depositRatio);
  const code = generateOrderCode();
  const fulfilment = data.fulfilment.toUpperCase() as "PICKUP" | "DELIVERY";

  try {
    if (!data.customerId) throw new Error("No customerId — cannot resolve DB customer, use mock path");

    const order = await prisma.order.create({
      data: {
        code,
        customerId: data.customerId,
        status: "REQUESTED",
        fulfilment,
        addressId: data.addressId,
        eventDate: new Date(data.eventDate),
        subtotal,
        discountAmount: data.discountAmount,
        deliveryFee,
        total,
        depositAmount,
        customerNotes: data.customerNotes,
        couponId: data.couponId,
        items: {
          create: data.items.map((item) => ({
            productId: item.productId,
            nameSnapshot: item.nameSnapshot,
            size: item.size,
            flavour: item.flavour,
            filling: item.filling,
            decoration: item.decoration,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            isCustom: item.isCustom,
            referenceImages: item.referenceImages,
          })),
        },
        statusHistory: {
          create: { status: "REQUESTED", note: "Order placed by customer" },
        },
      },
      include: { items: true, statusHistory: true },
    });

    return NextResponse.json({ source: "db", order }, { status: 201 });
  } catch {
    // No live database (or no resolvable customerId) — synthesize a realistic,
    // demo-shaped Order matching the frontend's mock `Order` type so the flow keeps working.
    const now = new Date().toISOString();
    const order: Order = {
      id: `mock-${code}`,
      code,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      items: data.items.map((item, i) => ({
        id: `item-${i}`,
        cakeName: item.nameSnapshot,
        image: item.referenceImages[0] ?? "",
        size: item.size,
        flavour: item.flavour,
        quantity: item.quantity,
        price: item.unitPrice,
        isCustom: item.isCustom,
      })),
      status: "Requested" as OrderStatus,
      total,
      depositAmount,
      amountPaid: 0,
      balanceDue: total,
      fulfilment: data.fulfilment.toLowerCase() as "pickup" | "delivery",
      deliveryAddress: data.deliveryAddress,
      deliveryZone: data.deliveryZone,
      eventDate: data.eventDate,
      createdAt: now,
      productionPoints: 1,
      notes: data.customerNotes,
      payments: [],
      timeline: [{ status: "Requested" as OrderStatus, date: now, note: "Order placed by customer" }],
    };

    return NextResponse.json({ source: "mock", order }, { status: 201 });
  }
}
