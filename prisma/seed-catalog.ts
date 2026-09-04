/**
 * Catalog seeding — categories and products only, no users or orders.
 *
 * Shared by two callers with different needs:
 *   - `prisma/seed.ts`, the full local dev seed (`npm run db:seed`), which
 *     also creates a sample owner and customer.
 *   - `scripts/deploy-migrate.mjs`, which runs this alone, and only when the
 *     product table is empty (see there for why) — a production deploy must
 *     never also seed throwaway demo accounts into the real Customers list.
 *
 * Upserts by slug, so running it again — including every subsequent deploy,
 * once the catalog is no longer empty — touches nothing that already exists.
 * An owner's edits or deletes are never overwritten or resurrected by this.
 */
import { PrismaClient, CakeSize } from "@prisma/client";
import { CATEGORIES } from "../src/lib/data/categories";
import { CAKES } from "../src/lib/data/cakes";

const SIZE_MAP: Record<string, CakeSize> = {
  "0.5kg": "HALF_KG",
  "1kg": "ONE_KG",
  "2kg": "TWO_KG",
  "3kg": "THREE_KG",
  "Multi-tier": "MULTI_TIER",
  Custom: "CUSTOM",
};

export async function seedCatalog(prisma: PrismaClient) {
  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        name: cat.name,
        description: cat.description,
        imageUrl: cat.image,
      },
    });
  }

  for (const cake of CAKES) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: cake.category } });
    await prisma.product.upsert({
      where: { slug: cake.slug },
      update: {},
      create: {
        slug: cake.slug,
        name: cake.name,
        description: cake.description,
        categoryId: category.id,
        price: cake.price,
        compareAtPrice: cake.compareAtPrice,
        servings: cake.servings,
        prepTimeHours: cake.prepTimeHours,
        isAvailable: cake.available,
        productionPoints: cake.productionPoints,
        sizes: cake.sizes.map((s) => SIZE_MAP[s]),
        flavours: cake.flavours,
        images: cake.images,
        tags: cake.tags,
        ratingAvg: cake.rating,
        ratingCount: cake.reviewCount,
      },
    });
  }

  return { categories: CATEGORIES.length, products: CAKES.length };
}

// Runnable directly: `npx tsx prisma/seed-catalog.ts`.
if (require.main === module) {
  const prisma = new PrismaClient();
  seedCatalog(prisma)
    .then((counts) => console.log("Seeded catalog:", counts))
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
