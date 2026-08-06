"use client";

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { InstagramIcon, FacebookIcon, TiktokIcon } from "@/components/site/social-icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Wedding Cakes", href: "/cakes/wedding" },
      { label: "Birthday Cakes", href: "/cakes/birthday" },
      { label: "Graduation Cakes", href: "/cakes/graduation" },
      { label: "Corporate Cakes", href: "/cakes/corporate" },
      { label: "Cupcakes & Desserts", href: "/cakes/cupcakes" },
      { label: "Custom Cake Builder", href: "/custom-cake-builder" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About PhiBakes", href: "/about" },
      { label: "Gallery", href: "/gallery" },
      { label: "Reviews", href: "/reviews" },
      { label: "Delivery Information", href: "/delivery-information" },
      { label: "FAQs", href: "/faqs" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Dashboard", href: "/account" },
      { label: "Track an Order", href: "/track-order" },
      { label: "Sign In", href: "/login" },
      { label: "Create Account", href: "/register" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border bg-chocolate text-cream">
      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-10 items-center justify-center rounded-full bg-gold text-charcoal font-display text-lg font-bold">
                P
              </span>
              <span className="font-display text-xl font-bold">PhiBakes</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              Beautiful cakes, baked for your moment. Nairobi&apos;s premium cake studio for
              weddings, birthdays, and every celebration in between.
            </p>
            <div className="mt-6 space-y-2 text-sm text-cream/80">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-gold shrink-0" />
                Kilimani, Nairobi, Kenya
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-gold shrink-0" />
                +254 700 123 456
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-gold shrink-0" />
                hello@phibakes.co.ke
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[InstagramIcon, FacebookIcon, TiktokIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-9 items-center justify-center rounded-full border border-cream/20 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold tracking-wide text-gold uppercase">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-cream/75 transition-colors hover:text-cream">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-2xl border border-cream/10 bg-cream/5 p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <h4 className="font-display text-lg font-semibold">Get sweet updates</h4>
            <p className="text-sm text-cream/70">New collections, seasonal offers, and cake inspiration.</p>
          </div>
          <form className="flex w-full max-w-sm gap-2 sm:w-auto" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="you@email.com"
              className="border-cream/20 bg-cream/10 text-cream placeholder:text-cream/50"
              required
            />
            <Button variant="gold" className="shrink-0">
              Subscribe
            </Button>
          </form>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/60 sm:flex-row">
          <p>© {new Date().getFullYear()} PhiBakes Bakery Ltd. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-cream">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-cream">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
