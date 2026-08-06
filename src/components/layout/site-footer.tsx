import Link from "next/link";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { InstagramIcon, FacebookIcon, TiktokIcon } from "@/components/site/social-icons";

const COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Shop All Cakes", href: "/cakes" },
      { label: "Best Sellers", href: "/cakes" },
      { label: "Ready Today", href: "/cakes/ready-today" },
      { label: "Cupcakes", href: "/cakes/cupcakes" },
      { label: "Desserts", href: "/cakes/cupcakes" },
      { label: "Gift Cards", href: "/cakes" },
    ],
  },
  {
    title: "Occasions",
    links: [
      { label: "Birthday Cakes", href: "/cakes/birthday" },
      { label: "Wedding Cakes", href: "/cakes/wedding" },
      { label: "Graduation Cakes", href: "/cakes/graduation" },
      { label: "Corporate Cakes", href: "/cakes/corporate" },
      { label: "Baby Showers", href: "/cakes" },
      { label: "Anniversaries", href: "/cakes" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Delivery & Areas", href: "/delivery-information" },
      { label: "FAQs", href: "/faqs" },
      { label: "Payment Methods", href: "/faqs" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-primary text-primary-foreground">
      <div className="container-luxe py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center">
              <span className="font-display text-2xl font-semibold text-primary-foreground">
                <span className="italic">Phi</span>
                <span className="not-italic">Bakes</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-primary-foreground/70">
              Handcrafted cakes made with love in Nairobi — for weddings, birthdays, and every
              celebration in between.
            </p>
            <div className="mt-6 space-y-2 text-sm text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-gold" />
                Kilimani, Nairobi, Kenya
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-gold" />
                +254 700 123 456
              </div>
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-gold" />
                hello@phibakes.co.ke
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              {[InstagramIcon, FacebookIcon, TiktokIcon].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="Social link"
                  className="flex size-9 items-center justify-center rounded-full border border-primary-foreground/20 transition-colors hover:border-gold hover:text-gold"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-gold">
                {col.title}
              </h4>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link, i) => (
                  <li key={`${link.href}-${i}`}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-foreground/75 transition-colors hover:text-primary-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wide text-gold">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-sm text-primary-foreground/75">
              <li className="flex items-center gap-2">
                <Phone className="size-4 shrink-0 text-gold" />
                +254 700 123 456
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4 shrink-0 text-gold" />
                hello@phibakes.co.ke
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0 text-gold" />
                Nairobi, Kenya
              </li>
              <li className="flex items-center gap-2">
                <Clock className="size-4 shrink-0 text-gold" />
                Mon – Sun: 8am – 8pm
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-primary-foreground/15 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="rounded-md border border-primary-foreground/20 px-2.5 py-1 text-xs font-semibold tracking-wide">
              M-PESA
            </span>
            <span className="rounded-md border border-primary-foreground/20 px-2.5 py-1 text-xs font-semibold tracking-wide">
              VISA
            </span>
            <span className="rounded-md border border-primary-foreground/20 px-2.5 py-1 text-xs font-semibold tracking-wide">
              MASTERCARD
            </span>
          </div>
          <p className="text-xs text-primary-foreground/60">
            © 2026 PhiBakes. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs">
            <Link href="/privacy" className="text-primary-foreground/70 hover:text-primary-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground">
              Terms
            </Link>
            <Link href="/terms" className="text-primary-foreground/70 hover:text-primary-foreground">
              Refund Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
