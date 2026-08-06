import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Sparkles,
  Truck,
  ShieldCheck,
  Clock3,
  Star,
  Wand2,
  CalendarCheck,
  PackageCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { CakeCard } from "@/components/site/cake-card";
import { CATEGORIES, getFeaturedCakes, HERO_IMAGES, GALLERY_IMAGES } from "@/lib/data";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export default function HomePage() {
  const featured = getFeaturedCakes(8);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 via-cream to-cream" />
        <div className="container-luxe relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div className="animate-fade-up">
            <Badge variant="gold" className="px-3.5 py-1.5 text-xs">
              <Sparkles className="size-3.5" /> Nairobi&apos;s Premium Cake Studio
            </Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl lg:text-6xl">
              Beautiful cakes, <span className="text-berry">baked for your moment.</span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
              From same-day treats to multi-tier wedding masterpieces — design, order, and track
              your cake in one seamless experience. Pay securely with M-PESA.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/custom-cake-builder">
                  Design Custom Cake <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/cakes">Browse Collection</Link>
              </Button>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-berry" /> Secure M-PESA payments
              </div>
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-berry" /> Nairobi-wide delivery
              </div>
              <div className="flex items-center gap-2">
                <Star className="size-4 fill-gold text-gold" /> 4.9 rated by 900+ customers
              </div>
            </div>
          </div>

          <div className="relative animate-fade-in">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl">
              <Image
                src={HERO_IMAGES[0]}
                alt="Elegant celebration cake by PhiBakes"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <Card className="absolute -bottom-6 -left-6 hidden w-56 gap-2 p-4 py-4 sm:block">
              <div className="flex items-center gap-3 px-0">
                <div className="flex size-11 items-center justify-center rounded-full bg-success/10 text-success">
                  <PackageCheck className="size-5" />
                </div>
                <div className="px-0">
                  <p className="text-sm font-semibold">Order Confirmed</p>
                  <p className="text-xs text-muted-foreground">Baking starts tomorrow, 6am</p>
                </div>
              </div>
            </Card>
            <Card className="absolute -top-6 -right-4 hidden w-48 gap-1 p-3.5 py-3.5 sm:block">
              <div className="flex items-center gap-1 px-0">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="size-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="px-0 text-xs text-muted-foreground">
                &quot;Exactly what we imagined for our wedding.&quot;
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="py-20">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Collections"
            title="Popular Categories"
            description="Every cake is handcrafted to order in our Kilimani studio."
          />
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/cakes/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-2xl shadow-sm transition-shadow hover:shadow-xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(min-width: 1024px) 22vw, 45vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="font-display text-lg font-semibold text-cream">{cat.name}</h3>
                  <p className="text-xs text-cream/75">{cat.cakeCount}+ designs</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="bg-secondary/40 py-20">
        <div className="container-luxe">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="Handpicked" title="Featured Cakes" />
            <Button variant="link" asChild>
              <Link href="/cakes">
                View all cakes <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((cake) => (
              <CakeCard key={cake.id} cake={cake} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-20">
        <div className="container-luxe">
          <SectionHeading
            align="center"
            eyebrow="Simple Process"
            title="How It Works"
            description="From inspiration to delivery — four steps to your perfect cake."
            className="mx-auto"
          />
          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Wand2, title: "Design or Choose", copy: "Pick from our catalog or build a fully custom cake in minutes." },
              { icon: CalendarCheck, title: "Book Your Slot", copy: "Select your event date — our smart calendar prevents overbooking." },
              { icon: ShieldCheck, title: "Pay with M-PESA", copy: "Secure a 50% deposit instantly via STK push, pay balance later." },
              { icon: Truck, title: "Track & Enjoy", copy: "Follow your cake from oven to doorstep, live, in your dashboard." },
            ].map((step, i) => (
              <div key={step.title} className="relative text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-blush text-berry">
                  <step.icon className="size-7" />
                </div>
                <span className="mt-4 block font-display text-sm font-semibold text-gold">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY PHIBAKES */}
      <section className="bg-chocolate py-20 text-cream">
        <div className="container-luxe grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div>
            <Badge variant="gold" className="bg-gold/15">Why PhiBakes</Badge>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl">
              Trusted by Nairobi&apos;s biggest celebrations
            </h2>
            <p className="mt-4 text-cream/75 leading-relaxed">
              We combine artisan baking with a technology-first experience — real-time order
              tracking, transparent pricing, and secure M-PESA payments — so you never have to
              chase a WhatsApp thread again.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-6">
              {[
                ["4.9 / 5", "Average rating"],
                ["3,200+", "Cakes delivered"],
                ["48hr", "Avg. turnaround"],
                ["12", "Delivery zones"],
              ].map(([stat, label]) => (
                <div key={label}>
                  <p className="font-display text-3xl font-bold text-gold">{stat}</p>
                  <p className="text-sm text-cream/60">{label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Clock3, title: "On-Time Guarantee", copy: "Production calendar prevents overbooking." },
              { icon: ShieldCheck, title: "Secure Payments", copy: "Daraja-powered M-PESA STK push." },
              { icon: Truck, title: "Live Tracking", copy: "From baking to your doorstep." },
              { icon: Sparkles, title: "Bespoke Design", copy: "8-step custom cake builder." },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-cream/10 bg-cream/5 p-5">
                <f.icon className="size-6 text-gold" />
                <h4 className="mt-3 font-display text-base font-semibold">{f.title}</h4>
                <p className="mt-1 text-xs text-cream/60">{f.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20">
        <div className="container-luxe">
          <SectionHeading align="center" eyebrow="Testimonials" title="Loved by our customers" className="mx-auto" />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <Card key={t.id} className="p-6 py-6">
                <div className="flex items-center gap-1 px-0">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${i < t.rating ? "fill-gold text-gold" : "text-border"}`}
                    />
                  ))}
                </div>
                <p className="mt-4 px-0 text-sm leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3 px-0">
                  <div className="relative size-10 overflow-hidden rounded-full">
                    <Image src={t.avatar} alt={t.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* INSTAGRAM GALLERY */}
      <section className="pb-20">
        <div className="container-luxe">
          <SectionHeading eyebrow="@phibakes" title="From our studio" description="Follow our latest creations on Instagram." />
          <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-6">
            {GALLERY_IMAGES.slice(0, 12).map((src, i) => (
              <a
                key={i}
                href="#"
                className="group relative aspect-square overflow-hidden rounded-xl"
              >
                <Image src={src} alt="PhiBakes gallery" fill sizes="16vw" className="object-cover transition-transform duration-300 group-hover:scale-110" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* DELIVERY AREAS */}
      <section className="pb-24">
        <div className="container-luxe">
          <Card className="grid grid-cols-1 gap-8 overflow-hidden p-8 py-8 sm:p-10 sm:py-10 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="px-0">
              <Badge variant="secondary">Delivery Areas</Badge>
              <h3 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
                We deliver across greater Nairobi
              </h3>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Karen, Kilimani, Westlands, Lavington, CBD, Runda, Kileleshwa, Langata and more.
                Delivery fees are calculated automatically at checkout based on your zone.
              </p>
            </div>
            <Button size="lg" asChild className="px-0 lg:px-6">
              <Link href="/delivery-information">
                View Delivery Zones <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>
        </div>
      </section>
    </>
  );
}
