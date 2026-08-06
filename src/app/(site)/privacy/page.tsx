import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "PhiBakes Privacy Policy — how we collect, use, and protect your personal data in line with Kenya's Data Protection Act, 2019.",
};

const SECTIONS = [
  {
    title: "1. Introduction",
    body: `PhiBakes Bakery Ltd ("PhiBakes", "we", "us", "our") operates the phibakes.co.ke website and
      related ordering platform. This Privacy Policy explains how we collect, use, disclose, and
      safeguard your information when you visit our website, place an order, or otherwise interact
      with us. We process personal data in accordance with the Data Protection Act, 2019 of Kenya
      and the regulations issued by the Office of the Data Protection Commissioner (ODPC).`,
  },
  {
    title: "2. Information We Collect",
    body: `We collect information you provide directly, such as your name, email address, phone
      number, delivery address, and order details when you create an account, place an order, or
      contact our support team. We also collect payment-related information necessary to process
      M-PESA and card transactions (such as your M-PESA phone number and transaction reference),
      though we never store your M-PESA PIN or full card numbers — these are handled by our
      licensed payment processors. Additionally, we automatically collect certain technical
      information, including your IP address, browser type, device information, and browsing
      behaviour on our site, via cookies and similar technologies.`,
  },
  {
    title: "3. How We Use Your Information",
    body: `We use your information to: process and fulfil your cake orders; communicate with you
      about order status, delivery, and support requests; process payments and prevent fraud;
      personalise your experience and recommend products; send you marketing communications where
      you have opted in (which you may unsubscribe from at any time); and comply with our legal
      and regulatory obligations, including tax and consumer protection laws.`,
  },
  {
    title: "4. Legal Basis for Processing",
    body: `We process your personal data on the basis of: your consent (for marketing
      communications); the necessity to perform a contract with you (processing and delivering
      your order); our legitimate business interests (fraud prevention, service improvement); and
      compliance with legal obligations under Kenyan law.`,
  },
  {
    title: "5. Sharing Your Information",
    body: `We do not sell your personal data. We share information only with trusted third parties
      necessary to operate our service: licensed payment processors and M-PESA/Safaricom for
      transaction processing; delivery riders and logistics partners to fulfil your order; cloud
      hosting and IT service providers who process data on our behalf under confidentiality
      agreements; and regulatory or law enforcement authorities where required by law.`,
  },
  {
    title: "6. Data Retention",
    body: `We retain your personal data for as long as necessary to fulfil the purposes outlined
      in this policy, including to satisfy legal, accounting, or reporting requirements. Order
      records are typically retained for 7 years in line with Kenyan tax record-keeping
      obligations. You may request deletion of your account data at any time, subject to our
      legal retention obligations.`,
  },
  {
    title: "7. Your Rights",
    body: `Under the Data Protection Act, 2019, you have the right to: access the personal data we
      hold about you; request correction of inaccurate data; request deletion of your data, subject
      to legal exceptions; object to or restrict certain processing, including direct marketing;
      request data portability; and lodge a complaint with the Office of the Data Protection
      Commissioner (ODPC) if you believe your rights have been violated. To exercise any of these
      rights, contact us at privacy@phibakes.co.ke.`,
  },
  {
    title: "8. Data Security",
    body: `We implement appropriate technical and organisational measures to protect your personal
      data against unauthorised access, alteration, disclosure, or destruction, including
      encrypted data transmission (SSL/TLS), restricted internal access controls, and regular
      security reviews. However, no method of transmission over the internet is 100% secure, and
      we cannot guarantee absolute security.`,
  },
  {
    title: "9. Cookies",
    body: `We use cookies and similar technologies to keep you signed in, remember your
      preferences, understand site usage, and improve our services. You can control cookies
      through your browser settings, though disabling them may affect site functionality.`,
  },
  {
    title: "10. Children's Privacy",
    body: `Our services are not directed at children under 18. We do not knowingly collect
      personal data from children. If you believe a child has provided us with personal data,
      please contact us so we can remove it.`,
  },
  {
    title: "11. Changes to This Policy",
    body: `We may update this Privacy Policy from time to time to reflect changes in our
      practices or legal requirements. We will post the updated policy on this page with a revised
      effective date, and where changes are material, we will notify you directly.`,
  },
  {
    title: "12. Contact Us",
    body: `If you have any questions about this Privacy Policy or how we handle your data, please
      contact us at privacy@phibakes.co.ke, call +254 700 123 456, or write to us at Argwings
      Kodhek Road, Kilimani, Nairobi, Kenya.`,
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <ShieldCheck className="size-3.5" /> Legal
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Privacy <span className="italic text-berry">Policy</span>
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
