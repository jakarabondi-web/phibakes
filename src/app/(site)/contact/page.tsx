import type { Metadata } from "next";
import { Clock3, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with PhiBakes — visit our Kilimani studio, call, email, or send us a message about your next cake order.",
};

const DETAILS = [
  {
    icon: MapPin,
    label: "Studio Address",
    value: "Argwings Kodhek Road, Kilimani, Nairobi, Kenya",
  },
  {
    icon: Clock3,
    label: "Studio Hours",
    value: "Tue – Sun, 9:00am – 7:00pm (closed Mondays)",
  },
  {
    icon: Phone,
    label: "Phone / WhatsApp",
    value: "+254 700 123 456",
  },
  {
    icon: Mail,
    label: "Email",
    value: "hello@phibakes.co.ke",
  },
];

export default function ContactPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <MessageCircle className="size-3.5" /> Get In Touch
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            We&apos;d <span className="italic text-berry">love</span> to hear from you
          </h1>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            Whether it&apos;s a quick question or a wedding cake enquiry, our team is here to
            help.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <Card className="p-6 sm:p-8">
              <h2 className="font-display text-lg font-semibold text-foreground">Studio Details</h2>
              <div className="mt-5 space-y-5">
                {DETAILS.map((d) => (
                  <div key={d.label} className="flex items-start gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-berry/10 text-berry">
                      <d.icon className="size-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {d.label}
                      </div>
                      <div className="mt-0.5 text-sm text-foreground">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(122,41,75,0.08),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(198,154,91,0.12),transparent_55%)]" />
              <div className="relative flex items-center gap-2 text-sm font-semibold text-foreground">
                <MapPin className="size-4 text-berry" /> Find our studio
              </div>
              <p className="relative mt-2 text-xs text-muted-foreground">
                Google Maps integration — an interactive map of our Kilimani studio location
                appears here.
              </p>
            </div>
          </div>

          <Card className="p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-foreground">Send a message</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Fill in the form below and we&apos;ll get back to you shortly.
            </p>
            <div className="mt-6">
              <ContactForm />
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
