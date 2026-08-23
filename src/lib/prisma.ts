import { PrismaClient } from "@prisma/client";
import { resolveDatabaseUrl } from "@/lib/db-status";

// Prevent multiple PrismaClient instances in dev (Next.js hot reload).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

// schema.prisma reads DATABASE_URL, but hosting integrations often provision
// POSTGRES_PRISMA_URL / POSTGRES_URL instead. Passing the resolved URL keeps
// Prisma and isDatabaseConfigured() agreeing on the same connection, so the app
// can't decide a database is present and then fail to open it. Undefined leaves
// Prisma to read the datasource from the environment as usual.
const datasourceUrl = resolveDatabaseUrl() ?? undefined;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    ...(datasourceUrl ? { datasourceUrl } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
