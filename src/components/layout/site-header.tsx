"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, UserRound, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";

const NAV_LINKS = [
  { label: "Cakes", href: "/cakes" },
  { label: "Custom", href: "/custom-cake-builder" },
  { label: "Occasions", href: "/gallery" },
  { label: "Ready Today", href: "/cakes/ready-today" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

function Wordmark() {
  return (
    <Link href="/" className="flex shrink-0 items-center" aria-label="PhiBakes home">
      <Image
        src="/images/brand/phibakes-logo-mark.png"
        alt="PhiBakes — Cakes, Love, Memories"
        width={1492}
        height={1022}
        priority
        className="h-20 w-auto sm:h-24 lg:h-28"
      />
    </Link>
  );
}

/**
 * Floating "glass pill" header (menu Option 3). The pill hovers over the
 * page with a backdrop blur; on mobile the hamburger drops a rounded menu
 * card beneath the pill instead of a full-screen drawer.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount } = useCart();
  const [open, setOpen] = React.useState(false);
  const cardRef = React.useRef<HTMLDivElement>(null);

  const isActive = React.useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu card on navigation
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4">
      <div className="relative mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 rounded-full border border-border/80 bg-background/80 py-2 pl-4 pr-2 shadow-[0_10px_30px_rgba(91,35,49,0.10)] backdrop-blur-md supports-[backdrop-filter]:bg-background/70 sm:pl-5">
          <Wordmark />

          <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-blush hover:text-primary"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/account"
              aria-label="Account"
              className="hidden size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-blush hover:text-primary sm:inline-flex"
            >
              <UserRound className="size-[19px]" strokeWidth={1.8} />
            </Link>
            <Link
              href="/cart"
              aria-label={`Cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
              className="relative inline-flex size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-blush hover:text-primary"
            >
              <ShoppingBag className="size-[19px]" strokeWidth={1.8} />
              {itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-charcoal">
                  {itemCount}
                </span>
              )}
            </Link>
            <Link
              href="/cakes"
              className="hidden items-center gap-1.5 rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal transition-shadow hover:shadow-md md:inline-flex"
            >
              Order a Cake
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-blush lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown card */}
        <div
          ref={cardRef}
          className={cn(
            "absolute inset-x-0 top-full z-50 mt-2 origin-top rounded-3xl border border-border bg-background p-2.5 shadow-[0_18px_44px_rgba(91,35,49,0.18)] transition-all duration-200 lg:hidden",
            open
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none -translate-y-2 scale-[0.98] opacity-0"
          )}
        >
          <nav className="flex flex-col" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex min-h-11 items-center justify-between rounded-2xl px-4 py-3 text-[0.95rem] font-medium",
                  isActive(link.href)
                    ? "bg-blush font-semibold text-primary"
                    : "text-foreground hover:bg-cream"
                )}
              >
                {link.label}
                <ArrowRight className="size-4 text-gold" />
              </Link>
            ))}
          </nav>
          <div className="mt-1.5 flex gap-2 px-1 pb-1">
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="flex min-h-11 flex-1 items-center justify-center rounded-2xl border border-border bg-cream text-xs font-semibold uppercase tracking-wide text-primary"
            >
              Sign in
            </Link>
            <Link
              href="/cakes"
              onClick={() => setOpen(false)}
              className="flex min-h-11 flex-1 items-center justify-center rounded-2xl bg-primary text-xs font-semibold uppercase tracking-wide text-primary-foreground"
            >
              Order a Cake
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
