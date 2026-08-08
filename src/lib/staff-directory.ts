import "server-only";

import { cache } from "react";
import type { StaffRole } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { STAFF } from "@/lib/data/staff";

/**
 * Staff directory for the console.
 *
 * Falls back to the seeded demo team when no database is connected, matching
 * how the rest of the app degrades. Rows carry a `persisted` flag so the UI can
 * tell a real record (editable) from a demo one (read-only) rather than
 * offering edit controls that would fail on submit.
 */

export type StaffRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  isActive: boolean;
  hiredAt: string;
  avatarUrl?: string | null;
  vehicleType?: string | null;
  vehiclePlate?: string | null;
  maxConcurrent: number;
  notes?: string | null;
  persisted: boolean;
};

/** Demo roles are display strings; map them onto the real enum. */
const DEMO_ROLE_MAP: Record<string, StaffRole> = {
  "Head Baker": "MANAGER",
  Baker: "BAKER",
  Decorator: "DECORATOR",
  Rider: "DELIVERY_RIDER",
  "Customer Support": "SUPPORT",
};

export const ROLE_LABEL: Record<StaffRole, string> = {
  MANAGER: "Manager",
  BAKER: "Baker",
  DECORATOR: "Decorator",
  DELIVERY_RIDER: "Rider",
  SUPPORT: "Customer Support",
};

export const getStaffDirectory = cache(async (): Promise<StaffRow[]> => {
  if (!isDatabaseConfigured()) {
    return STAFF.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: DEMO_ROLE_MAP[s.role] ?? "SUPPORT",
      isActive: s.active,
      hiredAt: s.joinedAt,
      avatarUrl: s.avatar,
      maxConcurrent: 3,
      persisted: false,
    }));
  }

  try {
    const rows = await prisma.staff.findMany({
      include: { user: { select: { name: true, email: true, phone: true, avatarUrl: true } } },
      orderBy: { hiredAt: "asc" },
    });
    return rows.map((r) => ({
      id: r.id,
      name: r.user.name,
      email: r.user.email,
      phone: r.user.phone ?? "",
      role: r.role,
      isActive: r.isActive,
      hiredAt: r.hiredAt.toISOString(),
      avatarUrl: r.user.avatarUrl,
      vehicleType: r.vehicleType,
      vehiclePlate: r.vehiclePlate,
      maxConcurrent: r.maxConcurrent,
      notes: r.notes,
      persisted: true,
    }));
  } catch (err) {
    console.error("[staff] read failed, using demo directory:", err);
    return [];
  }
});
