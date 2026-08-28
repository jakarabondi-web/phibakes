import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AccountShell } from "./_components/account-shell";
import { requireUser } from "@/lib/auth/dal";
import { isStaffRole } from "@/lib/auth/session";

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
  const user = await requireUser("/account");

  // proxy.ts also bounces staff cookies, but that check is optimistic too. This
  // one is what actually guarantees the owner can never end up browsing the
  // customer portal as if it were their account.
  if (isStaffRole(user.role)) redirect("/dashboard");

  return (
    <AccountShell user={{ name: user.name, email: user.email, avatarUrl: user.avatarUrl ?? null }}>
      {children}
    </AccountShell>
  );
}
