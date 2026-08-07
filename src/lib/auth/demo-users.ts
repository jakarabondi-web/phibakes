import type { UserRole } from "@prisma/client";

/**
 * Built-in accounts used only when no database is configured, mirroring the
 * mock-data fallback the API routes already use. They let the sign-in flow,
 * role-based redirects, and route protection be exercised on a fresh clone.
 *
 * These are inert the moment DATABASE_URL points at a real database: the sign-in
 * action checks the database first and never consults this list. Passwords are
 * intentionally obvious — they are demo credentials for public seed data, not
 * secrets.
 */

export type DemoUser = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export const DEMO_USERS: DemoUser[] = [
  {
    id: "demo-owner",
    name: "Phoina Mwangis",
    email: "owner@phibakes.co.ke",
    password: "demo1234",
    role: "OWNER",
  },
  {
    id: "demo-baker",
    name: "Kevin Odhiambo",
    email: "baker@phibakes.co.ke",
    password: "demo1234",
    role: "BAKER",
  },
  {
    id: "demo-customer",
    name: "Amina Wanjiru",
    email: "customer@phibakes.co.ke",
    password: "demo1234",
    role: "CUSTOMER",
  },
];

export function findDemoUserByEmail(email: string): DemoUser | undefined {
  const target = email.trim().toLowerCase();
  return DEMO_USERS.find((u) => u.email === target);
}

export function findDemoUserById(id: string): DemoUser | undefined {
  return DEMO_USERS.find((u) => u.id === id);
}
