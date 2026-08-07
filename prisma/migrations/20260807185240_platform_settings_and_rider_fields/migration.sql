-- AlterTable
ALTER TABLE "Staff" ADD COLUMN     "maxConcurrent" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "vehiclePlate" TEXT,
ADD COLUMN     "vehicleType" TEXT;

-- CreateTable
CREATE TABLE "PlatformSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "businessName" TEXT NOT NULL DEFAULT 'PhiBakes',
    "supportEmail" TEXT NOT NULL DEFAULT 'hello@phibakes.co.ke',
    "supportPhone" TEXT NOT NULL DEFAULT '+254 700 123 456',
    "studioAddress" TEXT NOT NULL DEFAULT 'PhiBakes Studio, Kilimani Ring Road, off Argwings Kodhek, Nairobi',
    "studioHours" TEXT NOT NULL DEFAULT 'Mon - Sat, 8:00am - 7:00pm  ·  Sun, 10:00am - 4:00pm',
    "depositPercent" INTEGER NOT NULL DEFAULT 50,
    "dailyCapacity" INTEGER NOT NULL DEFAULT 12,
    "minLeadTimeHours" INTEGER NOT NULL DEFAULT 24,
    "freeDeliveryAbove" DECIMAL(10,2),
    "taxPercent" INTEGER NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "acceptingOrders" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "PlatformSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeliveryZoneRate" (
    "id" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "fee" DECIMAL(10,2) NOT NULL,
    "etaMinutes" INTEGER NOT NULL DEFAULT 60,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeliveryZoneRate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DeliveryZoneRate_zone_key" ON "DeliveryZoneRate"("zone");

-- CreateIndex
CREATE INDEX "DeliveryZoneRate_isActive_idx" ON "DeliveryZoneRate"("isActive");
