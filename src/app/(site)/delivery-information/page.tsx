import type { Metadata } from "next";
import Link from "next/link";
import {
  Bike,
  Clock3,
  MapPin,
  MessageCircleQuestion,
  ShieldCheck,
  Smartphone,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";
import { formatKes } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Delivery Information",
  description:
    "Pickup and delivery details for PhiBakes — Nairobi zone fees, delivery windows, tracking, and studio hours.",
};

const ZONES = [
  { zone: "Kilimani (Studio Zone)", fee: 300, eta: "60–90 min" },
  { zone: "Lavington", fee: 400, eta: "60–90 min" },
  { zone: "Kileleshwa", fee: 350, eta: "60–90 min" },
  { zone: "CBD", fee: 450, eta: "60–90 min" },
  { zone: "Westlands", fee: 500, eta: "90 min – 2 hrs" },
  { zone: "Karen", fee: 700, eta: "2–3 hrs" },
  { zone: "Runda", fee: 800, eta: "2–3 hrs" },
  { zone: "Langata", fee: 650, eta: "2–3 hrs" },
];

const STEPS = [
  {
    icon: Smartphone,
    title: "Live order tracking",
    description:
      "From the moment your order is confirmed, track it through Baking, Decorating, Quality Check, and Out for Delivery from your account dashboard.",
  },
  {
    icon: ShieldCheck,
    title: "OTP verification",
    description:
      "Our rider will ask for the 4-digit OTP sent to your phone before handing over your order — this protects you from misdelivery.",
  },
  {
    icon: Bike,
    title: "Proof of delivery",
    description:
      "Every delivery is photographed at the doorstep and logged against your order, so you always have a record of a safe handover.",
  },
];

const FAQS = [
  {
    q: "How far in advance should I schedule delivery?",
    a: "For standard cakes, we recommend booking at least 48 hours ahead. Wedding and multi-tier cakes need 2–4 weeks' notice. Ready Today items can be delivered same-day if ordered before 1pm.",
  },
  {
    q: "Can I choose a specific delivery time?",
    a: "Yes — at checkout you can pick a 2-hour delivery window between 8am and 8pm. We'll text you when your rider is 20 minutes away.",
  },
  {
    q: "What if I'm not available to receive the cake?",
    a: "Please nominate an alternate recipient with a phone number at checkout — our rider will call ahead and can hand over to them using the same OTP.",
  },
  {
    q: "Do you deliver outside the listed zones?",
    a: "Yes, for areas outside our standard zone list (e.g. Kiambu, Ruaka, Syokimau) contact us for a custom delivery quote before you check out.",
  },
];

export default function DeliveryInformationPage() {
  return (
    <>
      <section className="bg-noise">
        <div className="container-luxe py-16 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
              <Bike className="size-3.5" /> Pickup &amp; Delivery
            </Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Getting your cake to you, <span className="italic text-berry">safely and on time</span>
            </h1>
            <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
              Collect from our Kilimani studio or have your cake delivered anywhere in Nairobi by
              our own trained riders.
            </p>
          </div>
        </div>
      </section>

      {/* PICKUP VS DELIVERY */}
      <section className="container-luxe pb-16">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="p-8">
            <div className="flex size-11 items-center justify-center rounded-full bg-berry/10 text-berry">
              <Store className="size-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Studio Pickup</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Collect your order directly from our studio — free of charge, with time to inspect
              your cake before you head out.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">
                  PhiBakes Studio, Argwings Kodhek Road, Kilimani, Nairobi
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">
                  Tue – Sun, 9:00am – 7:00pm (closed Mondays)
                </span>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex size-11 items-center justify-center rounded-full bg-berry/10 text-berry">
              <Bike className="size-5" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold text-foreground">Nairobi Delivery</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Delivered by our own climate-controlled cake vehicles, never third-party couriers —
              so your cake arrives exactly as it left the studio.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <Clock3 className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">
                  Delivery windows daily, 8:00am – 8:00pm. Choose your 2-hour slot at checkout.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-gold" />
                <span className="text-muted-foreground">
                  Fully insured in transit — we reboxed and re-inspect every cake before it leaves.
                </span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FEE TABLE + MAP */}
      <section className="bg-blush/40 py-16 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Delivery zones"
            title="Delivery fees by area"
            description="Fees are calculated automatically at checkout based on your delivery address. Estimated travel time is from order dispatch, not from order placement."
          />
          <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[420px] text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-4">Zone</th>
                      <th className="px-6 py-4">Delivery Fee</th>
                      <th className="px-6 py-4">Est. Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ZONES.map((z) => (
                      <tr key={z.zone} className="border-b border-border/70 last:border-b-0">
                        <td className="px-6 py-4 font-medium text-foreground">{z.zone}</td>
                        <td className="px-6 py-4 text-berry font-semibold">{formatKes(z.fee)}</td>
                        <td className="px-6 py-4 text-muted-foreground">{z.eta}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            <div className="relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(122,41,75,0.08),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(198,154,91,0.12),transparent_55%)]" />
              <div className="relative">
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  <MapPin className="size-4 text-berry" /> Delivery coverage map
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Google Maps integration — live zone boundaries and rider tracking appear here at
                  checkout.
                </p>
              </div>
              <ul className="relative mt-6 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                {ZONES.map((z) => (
                  <li key={z.zone} className="flex items-center gap-1.5">
                    <span className="size-1.5 rounded-full bg-gold" /> {z.zone.replace(" (Studio Zone)", "")}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TRACKING STEPS */}
      <section className="container-luxe py-16 sm:py-24">
        <SectionHeading
          eyebrow="How tracking works"
          title="Know exactly where your cake is"
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map((s) => (
            <Card key={s.title} className="p-6 text-center items-center">
              <div className="flex size-11 items-center justify-center rounded-full bg-berry/10 text-berry">
                <s.icon className="size-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-blush/40 py-16 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="Common questions"
            title="Delivery FAQs"
            align="center"
            className="mx-auto"
          />
          <Card className="mx-auto mt-10 max-w-2xl p-6 sm:p-8">
            <Accordion type="single" collapsible>
              {FAQS.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger>{f.q}</AccordionTrigger>
                  <AccordionContent>{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Card>
          <div className="mt-8 flex justify-center">
            <Button variant="outline" asChild>
              <Link href="/faqs">
                <MessageCircleQuestion className="size-4" /> View all FAQs
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
