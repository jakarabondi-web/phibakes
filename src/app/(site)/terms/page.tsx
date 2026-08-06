import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "PhiBakes Terms of Service — the terms governing orders, payments, delivery, and use of the phibakes.co.ke platform.",
};

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    body: `By accessing or using the PhiBakes website, mobile experience, or placing an order with
      PhiBakes Bakery Ltd ("PhiBakes", "we", "us"), you agree to be bound by these Terms of
      Service. If you do not agree to these terms, please do not use our services.`,
  },
  {
    title: "2. Orders and Acceptance",
    body: `All orders placed through our platform are subject to acceptance by PhiBakes. We
      reserve the right to refuse or cancel any order, including in cases of suspected fraud,
      pricing errors, or inability to fulfil the order within the requested timeframe. For custom
      and wedding cake orders, your order is only confirmed once we have reviewed your design
      request and received the required deposit.`,
  },
  {
    title: "3. Pricing and Payments",
    body: `All prices are listed in Kenyan Shillings (KES) and are inclusive of applicable taxes
      unless stated otherwise. We accept payment via M-PESA (STK push and Paybill), Visa/Mastercard,
      and cash on delivery for eligible orders. Custom and wedding cake orders require a
      non-refundable 50% deposit at confirmation, with the balance due at least 48 hours before the
      event date or on delivery, as applicable. Prices are subject to change, but confirmed orders
      will honour the price at the time of confirmation.`,
  },
  {
    title: "4. Cancellations and Refunds",
    body: `Orders may be cancelled free of charge within 2 hours of placement. After production has
      begun, deposits are non-refundable, though we will make reasonable efforts to reschedule your
      order to a new date within 30 days at no additional charge. Refunds approved for quality
      issues will be processed to your original payment method within 7 business days.`,
  },
  {
    title: "5. Delivery and Pickup",
    body: `Delivery windows and fees are indicative and calculated based on your selected zone;
      actual delivery time may vary due to traffic, weather, or circumstances beyond our control.
      Studio pickup is available free of charge during posted studio hours. Risk in the product
      passes to you upon delivery or pickup. You are responsible for providing accurate delivery
      information; PhiBakes is not liable for failed deliveries due to incorrect addresses or
      contact details provided by the customer.`,
  },
  {
    title: "6. Custom Cake Designs",
    body: `Custom cake orders are based on your specifications and any reference images provided.
      While we strive to match designs closely, natural variation in colour, texture, and
      decoration is inherent to handcrafted products, and exact replication of reference images
      cannot be guaranteed. Structural feasibility of certain designs is subject to our pastry
      team's professional judgment.`,
  },
  {
    title: "7. Allergens and Ingredients",
    body: `Our cakes are prepared in a kitchen that handles gluten, dairy, eggs, nuts, and soy. While
      we take care to accommodate dietary requests noted at checkout, we cannot guarantee an
      allergen-free environment. Customers with severe allergies should contact us directly before
      ordering to discuss precautions.`,
  },
  {
    title: "8. Account Responsibilities",
    body: `If you create an account with us, you are responsible for maintaining the
      confidentiality of your login credentials and for all activity under your account. Notify us
      immediately of any unauthorised use of your account.`,
  },
  {
    title: "9. Intellectual Property",
    body: `All content on the PhiBakes platform, including photography, logos, designs, and text,
      is the property of PhiBakes Bakery Ltd or its licensors and may not be reproduced or used
      without our written consent.`,
  },
  {
    title: "10. Limitation of Liability",
    body: `To the fullest extent permitted by Kenyan law, PhiBakes shall not be liable for indirect,
      incidental, or consequential damages arising from the use of our services, including delays
      caused by circumstances beyond our reasonable control. Our total liability for any claim
      shall not exceed the amount paid for the relevant order.`,
  },
  {
    title: "11. Governing Law",
    body: `These Terms of Service are governed by the laws of the Republic of Kenya. Any disputes
      arising from these terms shall first be addressed through good-faith negotiation, and if
      unresolved, submitted to the courts of Kenya or, where agreed by both parties, resolved
      through arbitration under the Arbitration Act.`,
  },
  {
    title: "12. Changes to These Terms",
    body: `We may revise these Terms of Service from time to time. Continued use of our platform
      after changes are posted constitutes acceptance of the revised terms.`,
  },
  {
    title: "13. Contact Us",
    body: `For questions about these Terms of Service, contact us at hello@phibakes.co.ke, call
      +254 700 123 456, or write to us at Argwings Kodhek Road, Kilimani, Nairobi, Kenya.`,
  },
];

export default function TermsPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <FileText className="size-3.5" /> Legal
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-4 text-sm text-muted-foreground">Effective date: 1 January 2026</p>
        </div>

        <Card className="mx-auto mt-14 max-w-3xl p-6 sm:p-10">
          <div className="flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="font-display text-lg font-semibold text-foreground">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
