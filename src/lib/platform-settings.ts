import "server-only";

import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { DELIVERY_ZONES, STUDIO_ADDRESS, STUDIO_HOURS } from "@/lib/delivery";

/**
 * Runtime-editable platform settings.
 *
 * Reads fall back to the compiled-in defaults when there's no database, so the
 * storefront and console still work on a fresh clone. Writes are handled in the
 * server actions and refuse outright without a database — a settings screen
 * that reports "saved" while persisting nothing is worse than one that says it
 * can't save yet.
 */

export type PlatformSettingsValues = {
  businessName: string;
  supportEmail: string;
  supportPhone: string;
  studioAddress: string;
  studioHours: string;
  depositPercent: number;
  dailyCapacity: number;
  minLeadTimeHours: number;
  freeDeliveryAbove: number | null;
  taxPercent: number;
  currency: string;
  acceptingOrders: boolean;
};

export type ZoneRate = {
  id: string;
  zone: string;
  fee: number;
  etaMinutes: number;
  isActive: boolean;
  sortOrder: number;
};

export const DEFAULT_SETTINGS: PlatformSettingsValues = {
  businessName: "PhiBakes",
  supportEmail: "hello@phibakes.co.ke",
  supportPhone: "+254 700 123 456",
  studioAddress: STUDIO_ADDRESS,
  studioHours: STUDIO_HOURS,
  depositPercent: 50,
  dailyCapacity: 12,
  minLeadTimeHours: 24,
  freeDeliveryAbove: null,
  taxPercent: 0,
  currency: "KES",
  acceptingOrders: true,
};

export const SETTINGS_ID = "singleton";

/** Memoized per render pass so a page and its layouts share one read. */
export const getPlatformSettings = cache(async (): Promise<PlatformSettingsValues> => {
  if (!isDatabaseConfigured()) return DEFAULT_SETTINGS;
  try {
    const row = await prisma.platformSettings.findUnique({ where: { id: SETTINGS_ID } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      businessName: row.businessName,
      supportEmail: row.supportEmail,
      supportPhone: row.supportPhone,
      studioAddress: row.studioAddress,
      studioHours: row.studioHours,
      depositPercent: row.depositPercent,
      dailyCapacity: row.dailyCapacity,
      minLeadTimeHours: row.minLeadTimeHours,
      freeDeliveryAbove: row.freeDeliveryAbove ? Number(row.freeDeliveryAbove) : null,
      taxPercent: row.taxPercent,
      currency: row.currency,
      acceptingOrders: row.acceptingOrders,
    };
  } catch (err) {
    console.error("[settings] read failed, using defaults:", err);
    return DEFAULT_SETTINGS;
  }
});

export const getZoneRates = cache(async (): Promise<ZoneRate[]> => {
  if (!isDatabaseConfigured()) {
    return DELIVERY_ZONES.map((z, i) => ({
      id: `default-${z.zone}`,
      zone: z.zone,
      fee: z.fee,
      etaMinutes: z.etaMinutes,
      isActive: true,
      sortOrder: i,
    }));
  }
  try {
    const rows = await prisma.deliveryZoneRate.findMany({
      orderBy: [{ sortOrder: "asc" }, { zone: "asc" }],
    });
    // An empty table means rates were never seeded — fall back rather than
    // showing the owner an empty pricing screen.
    if (rows.length === 0) {
      return DELIVERY_ZONES.map((z, i) => ({
        id: `default-${z.zone}`,
        zone: z.zone,
        fee: z.fee,
        etaMinutes: z.etaMinutes,
        isActive: true,
        sortOrder: i,
      }));
    }
    return rows.map((r) => ({
      id: r.id,
      zone: r.zone,
      fee: Number(r.fee),
      etaMinutes: r.etaMinutes,
      isActive: r.isActive,
      sortOrder: r.sortOrder,
    }));
  } catch (err) {
    console.error("[settings] zone read failed, using defaults:", err);
    return DELIVERY_ZONES.map((z, i) => ({
      id: `default-${z.zone}`,
      zone: z.zone,
      fee: z.fee,
      etaMinutes: z.etaMinutes,
      isActive: true,
      sortOrder: i,
    }));
  }
});
