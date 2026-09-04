/**
 * PhiBakes database seed.
 * Run with: npm run db:seed
 * Populates categories, products, a sample owner + customer, and a demo order
 * so the app has realistic data the moment it's connected to a real database.
 */
import { PrismaClient } from "@prisma/client";
import { seedCatalog } from "./seed-catalog";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding PhiBakes database...");

  const catalogCounts = await seedCatalog(prisma);

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
    categories: catalogCounts.categories,
    products: catalogCounts.products,
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
