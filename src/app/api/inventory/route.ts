import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { INVENTORY } from "@/lib/data/inventory";

const createInventoryItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  unit: z.string().min(1),
  quantity: z.number(),
  reorderLevel: z.number().nonnegative(),
  costPerUnit: z.number().nonnegative(),
  supplierId: z.string().optional(),
  expiryDate: z.string().optional(),
});

function statusForQuantity(quantity: number, reorderLevel: number): "HEALTHY" | "LOW" | "CRITICAL" {
  if (quantity <= reorderLevel * 0.5) return "CRITICAL";
  if (quantity <= reorderLevel) return "LOW";
  return "HEALTHY";
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const category = params.get("category");
  const status = params.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (status) where.status = status.toUpperCase();

    const items = await prisma.inventoryItem.findMany({ where, orderBy: { name: "asc" }, include: { supplier: true } });
    return NextResponse.json({ source: "db", items });
  } catch {
    let items = [...INVENTORY];
    if (category) items = items.filter((i) => i.category.toLowerCase() === category.toLowerCase());
    if (status) items = items.filter((i) => i.status.toLowerCase() === status.toLowerCase());
    return NextResponse.json({ source: "mock", items });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createInventoryItemSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const status = statusForQuantity(data.quantity, data.reorderLevel);

  try {
    const item = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        category: data.category,
        unit: data.unit,
        quantity: data.quantity,
        reorderLevel: data.reorderLevel,
        costPerUnit: data.costPerUnit,
        supplierId: data.supplierId,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
        status,
      },
    });

    return NextResponse.json({ source: "db", item }, { status: 201 });
  } catch {
    const item = {
      id: `mock-inv-${Date.now()}`,
      name: data.name,
      category: data.category,
      unit: data.unit,
      quantity: data.quantity,
      reorderLevel: data.reorderLevel,
      costPerUnit: data.costPerUnit,
      supplier: data.supplierId ?? "Unassigned",
      expiryDate: data.expiryDate,
      status: status.toLowerCase() as "healthy" | "low" | "critical",
    };

    return NextResponse.json(
      { source: "mock", item, warning: "No database connected — this item was not persisted." },
      { status: 201 }
    );
  }
}
