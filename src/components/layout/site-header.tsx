"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, User, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Cakes", href: "/cakes" },
  { label: "Custom Cakes", href: "/custom-cake-builder" },
  { label: "Occasions", href: "/cakes" },
  { label: "Ready Today", href: "/cakes/ready-today" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl font-semibold text-primary", className)}>
      <span className="italic">Phi</span>
      <span className="not-italic">Bakes</span>
    </span>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-cream/95 backdrop-blur-sm">
      <div className="container-luxe grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Wordmark />
        </Link>

        <nav className="hidden lg:flex items-center justify-center gap-1">
          {NAV_LINKS.map((link, i) => (
            <Link
              key={`${link.href}-${i}`}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-primary",
                pathname === link.href && "text-primary font-semibold"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Search">
            <Search />
          </Button>
          <Button variant="ghost" size="icon" className="hidden sm:inline-flex" aria-label="Account" asChild>
            <Link href="/account">
              <User />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" className="relative" aria-label="Cart" asChild>
            <Link href="/cart">
              <ShoppingBag />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4.5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                  {itemCount}
                </span>
              )}
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm bg-cream">
              <SheetHeader>
                <SheetTitle>
                  <Wordmark />
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-6">
                {NAV_LINKS.map((link, i) => (
                  <Link
                    key={`${link.href}-${i}`}
                    href={link.href}
                    className={cn(
                      "rounded-xl px-3 py-3 text-base font-medium text-foreground hover:bg-secondary hover:text-primary",
                      pathname === link.href && "bg-secondary text-primary"
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link
                  href="/account"
                  className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary hover:text-primary"
                >
                  My Account
                </Link>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary hover:text-primary"
                >
                  Sign In
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
