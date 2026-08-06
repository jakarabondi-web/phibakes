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
  { label: "Shop Cakes", href: "/cakes" },
  { label: "Custom Cake", href: "/custom-cake-builder" },
  { label: "Ready Today", href: "/cakes/ready-today" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/70 bg-background/85 backdrop-blur-md shadow-sm"
          : "border-b border-transparent bg-background/60 backdrop-blur-sm"
      )}
    >
      <div className="container-luxe flex h-18 items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg font-bold">
            P
          </span>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            PhiBakes
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary",
                pathname === link.href && "bg-secondary text-primary"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
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
          <Button variant="gold" size="sm" className="ml-1 hidden md:inline-flex" asChild>
            <Link href="/custom-cake-builder">Design a Cake</Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Menu">
                <Menu />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>PhiBakes</SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-1 px-6">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl px-3 py-3 text-base font-medium text-foreground hover:bg-secondary"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 h-px bg-border" />
                <Link href="/account" className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary">
                  My Account
                </Link>
                <Link href="/login" className="rounded-xl px-3 py-3 text-base font-medium hover:bg-secondary">
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
