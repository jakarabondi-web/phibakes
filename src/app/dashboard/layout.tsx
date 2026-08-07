import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { requireStaff } from "@/lib/auth/dal";

export const metadata: Metadata = {
  title: {
    default: "Owner Console",
    template: "%s | PhiBakes Owner Console",
  },
  description: "PhiBakes bakery operations command center.",
};

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Staff-only, re-verified against the database rather than trusting the cookie's role.
  const user = await requireStaff("/dashboard");
  return (
    <DashboardShell
      user={{ name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl }}
    >
      {children}
    </DashboardShell>
  );
}
