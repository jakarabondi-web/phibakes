import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCakeBySlug } from "@/lib/data/cakes";
import { mapProductToCake } from "@/lib/catalog";

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: { select: { slug: true } } },
    });

    if (product) return NextResponse.json({ source: "db", cake: mapProductToCake(product) });

    // Not found in DB — try the mock catalogue before declaring a 404 (keeps the
    // sandbox/demo experience working when there is no real database).
    const mockCake = getCakeBySlug(slug);
    if (mockCake) return NextResponse.json({ source: "mock", cake: mockCake });

    return NextResponse.json({ error: "Cake not found" }, { status: 404 });
  } catch {
    const mockCake = getCakeBySlug(slug);
    if (mockCake) return NextResponse.json({ source: "mock", cake: mockCake });
    return NextResponse.json({ error: "Cake not found" }, { status: 404 });
  }
}
