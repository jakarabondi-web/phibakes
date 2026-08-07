"use client";

import * as React from "react";
import Link from "next/link";
import { Bell, Menu, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutItem } from "@/components/auth/sign-out-item";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { initials } from "@/lib/utils";
import { AccountNavLinks } from "./account-sidebar";

export function AccountTopbar({
  customerName,
  customerEmail,
  avatar,
  unread,
}: {
  customerName: string;
  customerEmail: string;
  avatar?: string;
  unread: number;
}) {
  const [sheetOpen, setSheetOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur-md">
      <div className="flex h-18 items-center justify-between gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <SheetHeader>
                <SheetTitle>My Account</SheetTitle>
              </SheetHeader>
              <div className="px-4 pb-6">
                <AccountNavLinks onNavigate={() => setSheetOpen(false)} />
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-base font-bold">
              P
            </span>
            <span className="hidden font-display text-lg font-bold tracking-tight text-foreground sm:inline">
              PhiBakes
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
            asChild
          >
            <Link href="/account/notifications">
              <Bell />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 min-w-4.5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-charcoal">
                  {unread}
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="ml-1 flex items-center gap-2 rounded-full py-1 pl-1 pr-2.5 transition-colors hover:bg-secondary"
                aria-label="Account menu"
              >
                <Avatar className="size-8">
                  <AvatarImage src={avatar} alt={customerName} />
                  <AvatarFallback>{initials(customerName)}</AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium sm:inline">{customerName.split(" ")[0]}</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <p className="text-sm font-semibold text-foreground">{customerName}</p>
                <p className="truncate text-xs text-muted-foreground">{customerEmail}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/profile">
                  <UserCog className="size-4" /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <SignOutItem />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
