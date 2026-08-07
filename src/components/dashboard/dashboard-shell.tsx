"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div
      className="dashboard-shell flex min-h-dvh w-full text-foreground"
      style={{ backgroundImage: "var(--dashboard-canvas)" }}
    >
      <DashboardSidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 px-3 pb-4 pt-3 sm:pb-6 sm:pt-4 lg:pb-8 lg:pt-5">{children}</main>
      </div>
    </div>
  );
}
