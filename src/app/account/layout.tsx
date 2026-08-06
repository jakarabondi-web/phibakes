import type { Metadata } from "next";
import { AccountShell } from "./_components/account-shell";

export const metadata: Metadata = {
  title: {
    default: "My Account",
    template: "%s | My Account | PhiBakes",
  },
  description: "Manage your PhiBakes orders, quotes, payments, and profile.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return <AccountShell>{children}</AccountShell>;
}
