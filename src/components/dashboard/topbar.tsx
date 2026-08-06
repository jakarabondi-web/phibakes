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
import { toast } from "sonner";

const NOTIFICATIONS = [
  { id: 1, text: "New order PB-10238 requested by Peter Kariuki", time: "2m ago" },
  { id: 2, text: "Fresh Cream stock is critical (4L left)", time: "1h ago" },
  { id: 3, text: "Quote PBQ-5501 awaiting your review", time: "3h ago" },
];

export function DashboardTopbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/80 sm:px-6">
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

      <div className="ml-auto flex items-center gap-1.5">
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
                <AvatarFallback>PB</AvatarFallback>
              </Avatar>
              <span className="hidden text-sm font-medium sm:inline">Phibeon Bakes</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <p className="text-sm font-medium">Phibeon Bakes</p>
              <p className="text-xs font-normal text-muted-foreground">owner@phibakes.co.ke</p>
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
