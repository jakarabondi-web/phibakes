import type { Metadata } from "next";
import { AccountShell } from "./_components/account-shell";
import { requireUser } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: {
    default: "My Account",
    template: "%s | My Account | PhiBakes",
  },
  description: "Manage your PhiBakes orders, quotes, payments, and profile.",
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Authoritative check. proxy.ts already redirected anonymous requests, but that
  // check only read the cookie — this re-verifies against the database.
  await requireUser("/account");
  return <AccountShell>{children}</AccountShell>;
}
