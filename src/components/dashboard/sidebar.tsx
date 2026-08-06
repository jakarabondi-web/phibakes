"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_SECTIONS } from "@/components/dashboard/nav-config";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

function Brand({ collapsed }: { collapsed?: boolean }) {
  return (
    <div className={cn("bg-primary", collapsed ? "px-2 py-4" : "px-4 py-5")}>
      <Link href="/dashboard" className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold text-charcoal font-display text-base font-bold">
          P
        </span>
        {!collapsed && (
          <span className="font-display text-lg font-bold leading-none text-primary-foreground">
            PhiBakes
            <span className="block text-[10px] font-sans font-medium tracking-widest text-primary-foreground/70">
              OWNER CONSOLE
            </span>
          </span>
        )}
      </Link>
    </div>
  );
}

function NavLinks({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-2 py-2">
      {NAV_SECTIONS.map((section) => (
        <div key={section.label}>
          {!collapsed && (
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {section.label}
            </p>
          )}
          <div className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active =
                item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  title={collapsed ? item.label : undefined}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-2",
                    active
                      ? "border-primary bg-blush text-primary"
                      : "text-foreground/80 hover:bg-secondary hover:text-foreground"
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

export function DashboardSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-dvh shrink-0 flex-col border-r border-border bg-background transition-[width] duration-200 lg:flex",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <Brand collapsed={collapsed} />
      <NavLinks collapsed={collapsed} />
      <div className="border-t border-border p-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-center gap-2 text-muted-foreground"
          onClick={onToggle}
        >
          {collapsed ? <ChevronsRight className="size-4" /> : <ChevronsLeft className="size-4" />}
          {!collapsed && "Collapse"}
        </Button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open menu" className="lg:hidden">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="justify-center p-0">
          <SheetTitle asChild>
            <Brand />
          </SheetTitle>
        </SheetHeader>
        <NavLinks />
      </SheetContent>
    </Sheet>
  );
}
