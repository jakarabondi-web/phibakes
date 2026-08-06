import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-b-xl bg-gradient-to-br from-blush via-cream to-cream">
      <div className="container-luxe grid min-h-[520px] grid-cols-1 items-center gap-10 py-16 lg:grid-cols-[48%_52%] lg:gap-8 lg:py-20">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold">
            Handcrafted cakes in Nairobi
          </p>
          <h1 className="mt-5 font-display text-[clamp(2.75rem,5.5vw+1rem,4.75rem)] font-medium leading-[1.03] text-foreground">
            Beautiful cakes,
            <br />
            baked for{" "}
            <span className="italic text-berry" style={{ fontOpticalSizing: "auto" }}>
              your moment.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground">
            Premium cakes made with love in Nairobi. Order online, pay with M-PESA, and
            we&apos;ll handle the rest.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="uppercase tracking-wide text-xs" asChild>
              <Link href="/cakes">Order a Cake</Link>
            </Button>
            <Button size="lg" variant="outline" className="uppercase tracking-wide text-xs border-primary text-primary" asChild>
              <Link href="/custom-cake-builder">Design Custom Cake</Link>
            </Button>
          </div>
        </div>

        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-16px_rgba(74,27,38,0.28)] ring-1 ring-black/5 lg:aspect-auto lg:h-full lg:min-h-[420px]">
          <Image
            src="/images/hero/hero-cake-scene.png"
            alt="Elegant white celebration cake with burgundy roses and a gold drip, by PhiBakes"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 90vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
