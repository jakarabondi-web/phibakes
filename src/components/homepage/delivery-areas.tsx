import Link from "next/link";
import { MapPin } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";

const DELIVERY_AREAS = [
  "CBD",
  "Westlands",
  "Kilimani",
  "Karen",
  "Lavington",
  "Kasarani",
  "Embakasi",
  "Ruaka",
  "Ruiru",
  "Kiambu",
];

export function DeliveryAreas() {
  return (
    <section className="py-20">
      <div className="container-luxe">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionHeading eyebrow="Delivery" title="We Deliver Across Nairobi" />
            <div className="mt-8 flex flex-wrap gap-3">
              {DELIVERY_AREAS.map((area) => (
                <span
                  key={area}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-foreground"
                >
                  <MapPin className="size-3.5 text-berry" />
                  {area}
                </span>
              ))}
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Can&apos;t find your area?{" "}
              <Link href="/contact" className="font-semibold text-berry underline-offset-4 hover:underline">
                Contact us
              </Link>{" "}
              and we&apos;ll see how we can help.
            </p>
          </div>

          <div className="relative hidden aspect-[4/3] w-full overflow-hidden rounded-[2rem] border border-border/70 bg-blush lg:block">
            <div className="absolute inset-0 bg-noise" />
            <div className="relative flex h-full flex-col items-center justify-center gap-3 text-berry">
              <div className="flex size-16 items-center justify-center rounded-full bg-cream shadow-[var(--shadow-card)]">
                <MapPin className="size-8" />
              </div>
              <p className="font-display text-xl font-semibold">Nairobi</p>
              <p className="text-xs text-berry/70">& surrounding areas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
