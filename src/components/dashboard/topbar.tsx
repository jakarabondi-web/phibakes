"use client";

import * as React from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, Moon, Search, Sun, LogOut, Settings, UserRound } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardMobileNav } from "@/components/dashboard/sidebar";
import { AVATAR_IMAGES } from "@/lib/data/images";
import { REFERENCE_DATE } from "@/lib/dashboard-data";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

const NOTIFICATIONS = [
  { id: 1, text: "New order PB-10238 requested by Peter Kariuki", time: "2m ago" },
  { id: 2, text: "Fresh Cream stock is critical (4L left)", time: "1h ago" },
  { id: 3, text: "Quote PBQ-5501 awaiting your review", time: "3h ago" },
];

function titleCaseRole(role?: string) {
  if (!role) return "Owner";
  return role
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function DashboardTopbar({
  user,
}: {
  user?: { name: string; email: string; role: string; avatarUrl?: string | null };
}) {
  const displayName = user?.name ?? "Phoina Mwangis";
  const displayRole = titleCaseRole(user?.role);
  const displayEmail = user?.email ?? "owner@phibakes.co.ke";
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- standard next-themes hydration guard
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-3 z-30 mx-3 mt-3 flex h-16 items-center gap-3 rounded-2xl bg-card/95 px-4 shadow-[var(--shadow-card)] backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
      <DashboardMobileNav />

      <div className="relative hidden max-w-sm flex-1 sm:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search orders, customers, quotes…"
          className="h-9 border-border bg-background pl-9"
          onKeyDown={(e) => {
            if (e.key === "Enter") toast.info("Search is a demo — try the Orders or Customers pages.");
          }}
        />
      </div>

      <p className="ml-auto hidden text-sm font-medium text-muted-foreground md:block">
        {formatDate(REFERENCE_DATE, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
      </p>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Toggle dark mode"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted && theme === "dark" ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell className="size-[18px]" />
              <span className="absolute right-1.5 top-1.5 flex size-2 rounded-full bg-destructive" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              Notifications
              <Badge variant="secondary">{NOTIFICATIONS.length} new</Badge>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {NOTIFICATIONS.map((n) => (
              <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 whitespace-normal py-2">
                <span className="text-sm leading-snug">{n.text}</span>
                <span className="text-xs text-muted-foreground">{n.time}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="ml-1 flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3 hover:bg-secondary">
              <Avatar className="size-7">
                <AvatarImage src={AVATAR_IMAGES[0]} alt="Owner" />
                <AvatarFallback>PM</AvatarFallback>
              </Avatar>
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-medium">{displayName}</span>
                <span className="text-[11px] text-muted-foreground">{displayRole}</span>
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs font-normal text-muted-foreground">{displayRole} · {displayEmail}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <UserRound /> My Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <Settings /> Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/">
                <LogOut /> Back to Storefront
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
