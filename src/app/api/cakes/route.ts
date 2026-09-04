import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CAKES } from "@/lib/data/cakes";
import { mapProductToCake } from "@/lib/catalog";
import { SIZE_ENUM } from "@/lib/dashboard/product-constants";
import type { Cake, CakeSize } from "@/types";

function filterMockCakes(params: URLSearchParams): Cake[] {
  let results = [...CAKES];

  const category = params.get("category");
  if (category) results = results.filter((c) => c.category === category);

  const flavour = params.get("flavour");
  if (flavour) results = results.filter((c) => c.flavours.some((f) => f.toLowerCase() === flavour.toLowerCase()));

  const size = params.get("size");
  if (size) results = results.filter((c) => c.sizes.some((s) => s.toLowerCase() === size.toLowerCase()));

  const search = params.get("search");
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  const sort = params.get("sort");
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") results.sort((a, b) => b.price - a.price);
  else if (sort === "rating") results.sort((a, b) => b.rating - a.rating);
  else if (sort === "newest") results.reverse();

  return results;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;

  try {
    const category = params.get("category");
    const flavour = params.get("flavour");
    const size = params.get("size");
    const search = params.get("search");
    const sort = params.get("sort");

    const where: Record<string, unknown> = {};
    if (category) where.category = { slug: category };
    if (flavour) where.flavours = { has: flavour };
    // The query param is the friendly label ("1kg"); the column stores the
    // DB enum ("ONE_KG") — without this conversion the filter silently
    // matched nothing.
    if (size && size in SIZE_ENUM) where.sizes = { has: SIZE_ENUM[size as CakeSize] };
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    let orderBy: Record<string, "asc" | "desc"> | undefined;
    if (sort === "price-asc") orderBy = { price: "asc" };
    else if (sort === "price-desc") orderBy = { price: "desc" };
    else if (sort === "rating") orderBy = { ratingAvg: "desc" };
    else if (sort === "newest") orderBy = { createdAt: "desc" };

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: { category: { select: { slug: true } } },
    });

    return NextResponse.json({ source: "db", cakes: products.map(mapProductToCake) });
  } catch {
    // No live database connection (or query failed) — fall back to mock data so the
    // endpoint remains usable in this credential-less sandbox / for local demos.
    const cakes = filterMockCakes(params);
    return NextResponse.json({ source: "mock", cakes });
  }
}
