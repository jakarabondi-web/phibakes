import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { QUOTES } from "@/lib/data/quotes";
import { isDatabaseConfigured, logDbFallback } from "@/lib/db-status";
import type { Quote } from "@/types";

const createQuoteSchema = z.object({
  customerId: z.string().optional(),
  customerName: z.string().min(1),
  occasion: z.string().min(1),
  size: z.string().min(1),
  flavour: z.string().min(1),
  filling: z.string().min(1),
  decoration: z.string().min(1),
  eventDate: z.string().min(1),
  guests: z.number().int().positive().optional(),
  specialInstructions: z.string().optional(),
  referenceImages: z.array(z.string()).optional().default([]),
});

function generateQuoteCode() {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `PBQ-${n}`;
}

/**
 * Transparent, explainable instant-estimate pricing.
 * Real quotes are still reviewed & finalised by staff (quotedPrice on the Quote model) —
 * this only gives the customer an immediate ballpark on submission.
 */
export function estimateQuotePrice(input: { size: string; flavour: string; guests?: number; decoration: string }) {
  const sizeKey = input.size.toLowerCase();
  let base = 4500; // default / half-kg baseline
  if (sizeKey.includes("multi") || sizeKey.includes("tier")) base = 35000;
  else if (sizeKey.includes("custom")) base = 15000;
  else if (sizeKey.includes("3")) base = 12000;
  else if (sizeKey.includes("2")) base = 8500;
  else if (sizeKey.includes("1")) base = 5500;
  else if (sizeKey.includes("0.5") || sizeKey.includes("half")) base = 3200;

  // Flavour-count modifier: a "+" separated flavour list (e.g. "Vanilla + Red Velvet")
  // implies a multi-flavour tier build, which costs more in batching/labour.
  const flavourCount = input.flavour.split(/[+,/]/).map((s) => s.trim()).filter(Boolean).length || 1;
  const flavourModifier = (flavourCount - 1) * 1500;

  // Decoration-complexity modifier: scan for keywords implying skilled handwork.
  const decoration = input.decoration.toLowerCase();
  const complexKeywords = ["fondant", "sculpted", "gold leaf", "airbrush", "sugar flower", "3d", "hand-painted", "handpainted"];
  const mediumKeywords = ["fresh florals", "piping", "drip", "edible print", "buttercream"];
  let decorationModifier = 0;
  if (complexKeywords.some((k) => decoration.includes(k))) decorationModifier += 6000;
  if (mediumKeywords.some((k) => decoration.includes(k))) decorationModifier += 2500;

  // Guest-count modifier: larger guest counts need larger builds / more servings.
  // Guest count is optional — with none given, size alone drives the estimate.
  const guestModifier =
    input.guests && input.guests > 100 ? Math.ceil((input.guests - 100) / 25) * 1000 : 0;

  const estimatedPrice = base + flavourModifier + decorationModifier + guestModifier;
  return Math.round(estimatedPrice / 100) * 100; // round to nearest 100 KES
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const status = params.get("status");

  try {
    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const quotes = await prisma.quote.findMany({ where, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ source: "db", quotes });
  } catch {
    let quotes = [...QUOTES];
    if (status) quotes = quotes.filter((q) => q.status.toLowerCase() === status.toLowerCase());
    return NextResponse.json({ source: "mock", quotes });
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = createQuoteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const code = generateQuoteCode();
  const estimatedPrice = estimateQuotePrice(data);

  // A quote without a customerId is a guest request, not a failure — it has no
  // row to attach to, so it takes the synthesized path even with a live database.
  const isGuestRequest = !data.customerId;

  try {
    if (!data.customerId) throw new Error("Guest quote — no customer row to attach to");

    const quote = await prisma.quote.create({
      data: {
        code,
        customerId: data.customerId,
        occasion: data.occasion,
        size: data.size,
        flavour: data.flavour,
        filling: data.filling,
        decoration: data.decoration,
        eventDate: new Date(data.eventDate),
        guests: data.guests,
        status: "PENDING_REVIEW",
        estimatedPrice,
        specialInstructions: data.specialInstructions,
        referenceImages: data.referenceImages,
      },
    });

    return NextResponse.json({ source: "db", quote }, { status: 201 });
  } catch (err) {
    // With a real database connected, a failed write must not look like success:
    // returning a mock quote would hand the customer a code for a record that
    // doesn't exist. Only synthesize one while the database is still unwired.
    if (!isGuestRequest && isDatabaseConfigured()) {
      logDbFallback("quote.create", err);
      return NextResponse.json(
        { error: "Could not save your quote request. Please try again." },
        { status: 503 }
      );
    }

    const now = new Date().toISOString();
    const quote: Quote = {
      id: `mock-${code}`,
      code,
      customerName: data.customerName,
      occasion: data.occasion,
      size: data.size,
      flavour: data.flavour,
      filling: data.filling,
      decoration: data.decoration,
      eventDate: data.eventDate,
      guests: data.guests,
      status: "Pending Review",
      estimatedPrice,
      createdAt: now,
      referenceImages: data.referenceImages,
      specialInstructions: data.specialInstructions,
    };

    return NextResponse.json({ source: "mock", quote }, { status: 201 });
  }
}
