import Link from "next/link";
import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { PageHeader } from "../_components/page-header";
import { ContactForm } from "./contact-form";

const FAQS = [
  {
    q: "How do I track my order?",
    a: "Go to Track Order in your account sidebar and select your order code — you'll see a live status timeline from confirmation through delivery.",
  },
  {
    q: "How do I pay the remaining balance on my order?",
    a: "Open the order from Order History and use the M-PESA STK prompt sent to your phone, or visit Payments to retry a payment.",
  },
  {
    q: "Can I change my delivery address after ordering?",
    a: "Yes — contact support at least 24 hours before your event date and we'll update the delivery details for you.",
  },
  {
    q: "How do loyalty points work?",
    a: "You earn 1 point for every KES 100 spent. Points are credited when an order is marked Completed and can be redeemed on the Rewards page.",
  },
  {
    q: "What if I need to cancel or reschedule?",
    a: "Cancellations made more than 72 hours before your event date are eligible for a full refund of your deposit. Contact support to reschedule.",
  },
];

export const metadata = { title: "Support" };

export default function SupportPage() {
  return (
    <div>
      <PageHeader title="Support" description="We're here to help with orders, payments, and everything in between." />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <Accordion type="single" collapsible className="mt-2">
              {FAQS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger>{faq.q}</AccordionTrigger>
                  <AccordionContent>{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <Button variant="link" className="mt-2 px-0" asChild>
              <Link href="/faqs">
                View all FAQs <ArrowRight className="size-4" />
              </Link>
            </Button>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Contact Support</CardTitle>
            </CardHeader>
            <div className="mt-4">
              <ContactForm />
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="border-primary/20 bg-gradient-to-br from-blush/60 to-cream p-6 py-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <MessageCircle className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">Live Chat</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">
              Our support team is online Mon–Sat, 8am–7pm. Average response time under 5 minutes.
            </p>
            <Button className="mt-4 w-full" variant="gold" disabled>
              Start Chat (Coming Soon)
            </Button>
          </Card>

          <Card className="p-6 py-6">
            <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-primary">
              <Phone className="size-5" />
            </span>
            <h3 className="mt-4 font-display text-base font-semibold">Call or WhatsApp</h3>
            <p className="mt-1.5 text-sm text-muted-foreground">+254 700 123 456</p>
            <Button variant="outline" className="mt-4 w-full" asChild>
              <Link href="/contact">Contact Page</Link>
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
