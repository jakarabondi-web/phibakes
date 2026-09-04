import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { getCategory } from "@/lib/data";
import { getCatalogReadyTodayCakes } from "@/lib/catalog";
import { formatKes } from "@/lib/utils";

export async function ReadyToday() {
  const category = getCategory("ready-today");
  const readyTodayCakes = await getCatalogReadyTodayCakes(3);
  return (
    <section className="py-20">
      <div className="container-luxe">
        <SectionHeading
          eyebrow="Same-Day Pickup"
          title="Ready Today"
          accent="Today"
          description={category?.description}
        />
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {readyTodayCakes.map((cake) => (
            <Card key={cake.id} className="overflow-hidden gap-0 p-0 py-0">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={cake.images[0]}
                  alt={cake.name}
                  fill
                  sizes="(min-width: 640px) 33vw, 90vw"
                  className="object-cover"
                />
                <Badge variant="success" className="absolute left-3 top-3">
                  Available Today
                </Badge>
              </div>
              <div className="flex flex-col gap-1.5 p-5">
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {cake.name}
                </h3>
                <p className="font-display text-base font-bold text-berry">
                  {formatKes(cake.price)}
                </p>
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Truck className="size-3.5" /> Same-day delivery
                </p>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-10 flex justify-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/cakes/ready-today" className="uppercase tracking-wide">
              View All Ready Today <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
