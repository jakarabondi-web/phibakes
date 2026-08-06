import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cakeImage } from "@/lib/data";

export function CustomCakeBanner() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-luxe">
        <div className="grid grid-cols-1 items-center gap-10 overflow-hidden rounded-2xl bg-blush p-8 sm:p-10 lg:grid-cols-2 lg:gap-12 lg:p-14">
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-xl shadow-lg">
              <Image
                src={cakeImage(4)}
                alt="Custom-designed celebration cake by PhiBakes"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 hidden size-28 overflow-hidden rounded-xl border-4 border-cream shadow-lg sm:block">
              <Image
                src={cakeImage(11)}
                alt="Detail of a custom cake design"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div className="absolute -top-5 -left-4 hidden size-24 overflow-hidden rounded-xl border-4 border-cream shadow-lg sm:block">
              <Image
                src={cakeImage(8)}
                alt="Detail of a custom cake design"
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
          </div>

          <div className="order-1 text-center lg:order-2 lg:text-left">
            <h2 className="text-balance font-display text-3xl font-bold text-foreground sm:text-4xl">
              Made <span className="italic text-berry">especially</span> for you
            </h2>
            <p className="mx-auto mt-4 max-w-md text-balance leading-relaxed text-muted-foreground lg:mx-0">
              Share your ideas and we&apos;ll create a cake that&apos;s uniquely yours. Any theme,
              any size, crafted to perfection.
            </p>
            <Button size="lg" className="mt-6 uppercase tracking-wider" asChild>
              <Link href="/custom-cake-builder">
                Start Designing <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
