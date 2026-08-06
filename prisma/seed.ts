/**
 * PhiBakes database seed.
 * Run with: npm run db:seed
 * Populates categories, products, a sample owner + customer, and a demo order
 * so the app has realistic data the moment it's connected to a real database.
 */
import { PrismaClient, CakeSize } from "@prisma/client";
import { CATEGORIES } from "../src/lib/data/categories";
import { CAKES } from "../src/lib/data/cakes";

const prisma = new PrismaClient();

const SIZE_MAP: Record<string, CakeSize> = {
  "0.5kg": "HALF_KG",
  "1kg": "ONE_KG",
  "2kg": "TWO_KG",
  "3kg": "THREE_KG",
  "Multi-tier": "MULTI_TIER",
  Custom: "CUSTOM",
};

async function main() {
  console.log("Seeding PhiBakes database...");

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

  const ownerUser = await prisma.user.upsert({
    where: { email: "owner@phibakes.co.ke" },
    update: {},
    create: {
      email: "owner@phibakes.co.ke",
      name: "PhiBakes Owner",
      role: "OWNER",
    },
  });

  const customerUser = await prisma.user.upsert({
    where: { email: "demo.customer@phibakes.co.ke" },
    update: {},
    create: {
      email: "demo.customer@phibakes.co.ke",
      name: "Demo Customer",
      role: "CUSTOMER",
      customer: { create: { tier: "GOLD", loyaltyPoints: 420 } },
    },
  });

  console.log("Seeded:", {
    categories: CATEGORIES.length,
    products: CAKES.length,
    owner: ownerUser.email,
    customer: customerUser.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
