"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ShoppingBag, UserRound, ArrowRight, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCart } from "@/lib/cart-context";
import { useFavourites } from "@/lib/favourites-context";

const NAV_LINKS = [
  { label: "Cakes", href: "/cakes" },
  { label: "Custom Cake", href: "/custom-cake-builder" },
  { label: "Ready Today", href: "/cakes/ready-today" },
  { label: "Gallery", href: "/gallery" },
  { label: "Track Order", href: "/track-order" },
  { label: "About", href: "/about" },
];

function Wordmark() {
  return (
    <Link href="/" className="relative z-10 flex shrink-0 items-center" aria-label="PhiBakes home">
      <Image
        src="/images/brand/phibakes-logo-mark.png"
        alt="PhiBakes — Cakes, Love, Memories"
        width={1000}
        height={358}
        priority
        className="h-14 w-auto sm:h-20 lg:h-24"
      />
    </Link>
  );
}

/**
 * Classic flush header: a solid, full-width bar with a hairline bottom
 * border — no floating pill, no rounded canvas. The row has a fixed height
 * per breakpoint (h-20/28/32), generous enough that the logo sits fully
 * inside it with breathing room — nothing hangs over the page content, so
 * the logo can't overlap the hero or the mobile menu. Nav, account/cart,
 * and CTA sit inline on the right. Below xl, nav collapses into a
 * full-width dropdown sheet.
 */
export function SiteHeader() {
  // Defaults to the customer portal — correct for the common case (anonymous
  // visitor or a customer) and safe even before the check below resolves.
  // Staff get redirected to /dashboard once we know who's signed in; a cookie
  // read alone would force this whole layout to render dynamically on every
  // storefront page, so this asks a tiny endpoint instead of doing it here.
  const [accountHref, setAccountHref] = React.useState("/account");
  const [isStaff, setIsStaff] = React.useState(false);

  React.useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/whoami")
      .then((r) => r.json())
      .then((data: { isStaff: boolean }) => {
        if (!cancelled && data.isStaff) {
          setAccountHref("/dashboard");
          setIsStaff(true);
        }
      })
      .catch(() => {
        // Signed-out default is already correct; nothing to recover.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const pathname = usePathname();
  const { itemCount } = useCart();
  const { count: favouriteCount } = useFavourites();
  const [open, setOpen] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isActive = React.useCallback(
    (href: string) =>
      href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`),
    [pathname]
  );

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close the menu on navigation
    setOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <header ref={menuRef} className="sticky top-0 z-40 border-b border-border bg-background shadow-[0_2px_16px_rgba(91,35,49,0.06)]">
      <div className="relative mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-4 sm:h-28 sm:px-6 lg:h-32 lg:px-8">
        <Wordmark />

        <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium transition-colors",
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
            href={accountHref}
            aria-label={isStaff ? "Dashboard" : "Account"}
            className="hidden size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-blush hover:text-primary sm:inline-flex"
          >
            <UserRound className="size-[19px]" strokeWidth={1.8} />
          </Link>
          <Link
            href="/favourites"
            aria-label={`Favourites${favouriteCount > 0 ? ` (${favouriteCount} saved)` : ""}`}
            className="relative hidden size-10 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-blush hover:text-primary sm:inline-flex"
          >
            <Heart className="size-[19px]" strokeWidth={1.8} />
            {favouriteCount > 0 && (
              <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-berry text-[10px] font-bold text-primary-foreground">
                {favouriteCount}
              </span>
            )}
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
            className="hidden items-center gap-1.5 whitespace-nowrap rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-charcoal transition-shadow hover:shadow-md md:inline-flex"
          >
            Order a Cake
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-blush xl:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown sheet — full-width, drops from the flush header */}
      <div
        className={cn(
          "overflow-hidden border-t border-border bg-background transition-[grid-template-rows] duration-200 xl:hidden",
          "grid",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col p-2.5" aria-label="Mobile">
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
          <div className="flex gap-2 px-3.5 pb-3.5">
            <Link
              href="/favourites"
              onClick={() => setOpen(false)}
              className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-2xl border border-border bg-cream text-xs font-semibold uppercase tracking-wide text-primary"
            >
              <Heart className="size-3.5" />
              Saved{favouriteCount > 0 ? ` (${favouriteCount})` : ""}
            </Link>
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
