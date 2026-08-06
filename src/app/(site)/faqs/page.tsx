import type { Metadata } from "next";
import Link from "next/link";
import { HelpCircle, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { SectionHeading } from "@/components/site/section-heading";

export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers to common questions about ordering, custom cakes, M-PESA payments, delivery, and cancellations at PhiBakes.",
};

const GROUPS = [
  {
    category: "Ordering",
    items: [
      {
        q: "How far in advance do I need to order?",
        a: "Standard cakes need at least 48 hours' notice. Custom and multi-tier cakes need 5–7 days, and wedding cakes should be booked 3–4 weeks ahead, especially during December and wedding season (June–August). Ready Today items can be ordered same-day before 1pm.",
      },
      {
        q: "Can I order a cake for the same day?",
        a: "Yes, from our Ready Today collection — a curated set of in-studio favourites available for same-day pickup or delivery if ordered before 1pm, subject to availability.",
      },
      {
        q: "Do you cater for large events or bulk orders?",
        a: "Yes. For dessert tables, corporate events, or bulk cupcake/pastry orders over 50 pieces, contact us directly for a bulk quote — we offer volume pricing and dedicated event coordination.",
      },
      {
        q: "Can I change my order after placing it?",
        a: "Minor changes (message on cake, size adjustment) can be made up to 48 hours before your event date by contacting our team. Design changes may affect price and require re-quoting.",
      },
    ],
  },
  {
    category: "Custom Cakes",
    items: [
      {
        q: "How does the custom cake builder pricing work?",
        a: "Our builder calculates a live estimate based on size, number of tiers, flavour, filling, and decoration complexity as you design. This is an estimate — our pastry team reviews reference images and confirms final pricing within 24 hours.",
      },
      {
        q: "What's the minimum lead time for a wedding cake?",
        a: "We recommend booking wedding cakes at least 3–4 weeks in advance, and up to 2 months ahead for peak season (Dec, June–Aug) or elaborate sugar-flower designs. A tasting session can be arranged for orders above 3 tiers.",
      },
      {
        q: "Can I bring a reference photo?",
        a: "Absolutely — upload reference images directly in the custom builder or email them to us. We'll recreate the design as closely as possible or offer a similar interpretation using techniques available in our studio.",
      },
      {
        q: "Do you offer cake tastings?",
        a: "Yes, for wedding and large custom orders. Tastings are held at the studio by appointment and the fee is credited toward your final order once confirmed.",
      },
    ],
  },
  {
    category: "Payments & M-PESA",
    items: [
      {
        q: "How does M-PESA payment work on PhiBakes?",
        a: "At checkout, enter your M-PESA phone number and we trigger an STK push directly to your phone. Enter your M-PESA PIN to approve, and your payment reflects on your order instantly — no manual paybill entry needed.",
      },
      {
        q: "How do deposits work?",
        a: "Custom and wedding cake orders require a 50% deposit to confirm production, paid via M-PESA at the time of order confirmation. The remaining balance is due at least 48 hours before your event date, or on delivery for smaller orders.",
      },
      {
        q: "What if my STK push fails or times out?",
        a: "You can retry the STK push directly from your order page, or complete payment via M-PESA Paybill using the till number and order code shown at checkout. Contact us if a payment doesn't reflect within 15 minutes.",
      },
      {
        q: "Do you accept card payments?",
        a: "Yes, we accept Visa and Mastercard through our secure checkout, in addition to M-PESA. Cash on delivery is available for orders under KES 10,000 within Nairobi.",
      },
    ],
  },
  {
    category: "Delivery & Pickup",
    items: [
      {
        q: "Which areas of Nairobi do you deliver to?",
        a: "We deliver across Nairobi including Kilimani, Lavington, Kileleshwa, CBD, Westlands, Karen, Runda, and Langata. See our Delivery Information page for zone fees and estimated times, or contact us for delivery outside these zones.",
      },
      {
        q: "How will I know when my cake is out for delivery?",
        a: "You'll receive an SMS and can track live status — Baking, Decorating, Quality Check, Out for Delivery — from your account dashboard. Our rider will call ahead once en route.",
      },
      {
        q: "Is there a fee for studio pickup?",
        a: "No, studio pickup at our Kilimani location is always free. Our studio is open Tuesday to Sunday, 9am–7pm.",
      },
    ],
  },
  {
    category: "Cancellations",
    items: [
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled free of charge within 2 hours of placing them. After that, cancellations follow our refund policy: deposits are non-refundable once production has started, but can be rescheduled to a new date within 30 days at no extra charge.",
      },
      {
        q: "Can I reschedule my event date?",
        a: "Yes — contact us at least 72 hours before your original date to move your order to a new date, subject to availability. Rescheduling within 72 hours may incur a small rebooking fee for custom orders.",
      },
      {
        q: "What happens if I'm not satisfied with my cake?",
        a: "Every order goes through a quality check before dispatch, but if something isn't right, contact us within 24 hours with photos. We offer replacements, partial refunds, or credit toward a future order depending on the issue.",
      },
    ],
  },
];

export default function FaqsPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <HelpCircle className="size-3.5" /> Help Centre
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Frequently asked questions
          </h1>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Everything you need to know about ordering, paying, and receiving your PhiBakes cake.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-8">
          {GROUPS.map((group) => (
            <div key={group.category}>
              <h2 className="font-display text-2xl font-bold text-foreground">{group.category}</h2>
              <Card className="mt-5 p-6 sm:p-8">
                <Accordion type="single" collapsible className="w-full">
                  {group.items.map((item, i) => (
                    <AccordionItem key={i} value={`${group.category}-${i}`}>
                      <AccordionTrigger>{item.q}</AccordionTrigger>
                      <AccordionContent>{item.a}</AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </Card>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-border/70 bg-card p-8 text-center shadow-sm">
          <MessageCircle className="mx-auto size-8 text-berry" />
          <h2 className="mt-4 font-display text-xl font-semibold text-foreground">
            Still have a question?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Our team typically responds within a few hours.
          </p>
          <Button className="mt-6" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
