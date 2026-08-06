import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { QUOTES } from "@/lib/data/quotes";

const PRISMA_QUOTE_STATUSES = ["PENDING_REVIEW", "QUOTED", "ACCEPTED", "DECLINED", "EXPIRED"] as const;

const patchSchema = z.object({
  status: z.enum(PRISMA_QUOTE_STATUSES).optional(),
  quotedPrice: z.number().nonnegative().optional(),
});

function getMockQuoteByCode(code: string) {
  return QUOTES.find((q) => q.code === code);
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  try {
    const quote = await prisma.quote.findUnique({ where: { code } });
    if (quote) return NextResponse.json({ source: "db", quote });

    const mockQuote = getMockQuoteByCode(code);
    if (mockQuote) return NextResponse.json({ source: "mock", quote: mockQuote });

    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
  } catch {
    const mockQuote = getMockQuoteByCode(code);
    if (mockQuote) return NextResponse.json({ source: "mock", quote: mockQuote });
    return NextResponse.json({ error: "Quote not found" }, { status: 404 });
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

  if (!parsed.data.status && parsed.data.quotedPrice === undefined) {
    return NextResponse.json({ error: "Provide at least one of status or quotedPrice" }, { status: 400 });
  }

  try {
    const existing = await prisma.quote.findUnique({ where: { code } });
    if (!existing) throw new Error("Quote not found in DB — try mock fallback");

    const quote = await prisma.quote.update({
      where: { code },
      data: {
        status: parsed.data.status,
        quotedPrice: parsed.data.quotedPrice,
      },
    });

    return NextResponse.json({ source: "db", quote });
  } catch {
    const mockQuote = getMockQuoteByCode(code);
    if (!mockQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const statusMap: Record<string, typeof mockQuote.status> = {
      PENDING_REVIEW: "Pending Review",
      QUOTED: "Quoted",
      ACCEPTED: "Accepted",
      DECLINED: "Declined",
      EXPIRED: "Expired",
    };

    const updated = {
      ...mockQuote,
      status: parsed.data.status ? statusMap[parsed.data.status] : mockQuote.status,
      quotedPrice: parsed.data.quotedPrice ?? mockQuote.quotedPrice,
    };

    return NextResponse.json({ source: "mock", quote: updated, warning: "No database connected — this update was not persisted." });
  }
}
