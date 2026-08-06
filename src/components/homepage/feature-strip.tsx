import { Smartphone, CalendarCheck, Radar, Truck, type LucideIcon } from "lucide-react";

type Feature = {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: "primary" | "success";
};

const FEATURES: Feature[] = [
  {
    icon: Smartphone,
    title: "M-PESA Payments",
    description: "Secure & Fast",
    accent: "success",
  },
  {
    icon: CalendarCheck,
    title: "Book & Schedule",
    description: "Pick a date",
    accent: "primary",
  },
  {
    icon: Radar,
    title: "Track Your Order",
    description: "Stay updated",
    accent: "success",
  },
  {
    icon: Truck,
    title: "Delivery in Nairobi",
    description: "Safe & On Time",
    accent: "primary",
  },
];

export function FeatureStrip() {
  return (
    <section className="border-b border-border bg-card">
      <div className="container-luxe">
        <div className="flex gap-8 overflow-x-auto pb-2 snap-x snap-mandatory sm:grid sm:grid-cols-2 sm:gap-0 sm:overflow-visible sm:divide-x sm:divide-border sm:pb-0 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="flex w-64 shrink-0 snap-start items-center gap-4 py-8 sm:w-auto sm:shrink sm:px-6"
            >
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full border ${
                  feature.accent === "primary"
                    ? "border-primary/30 text-primary"
                    : "border-success/30 text-success"
                }`}
              >
                <feature.icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-bold text-foreground">{feature.title}</p>
                <p className="text-xs text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
