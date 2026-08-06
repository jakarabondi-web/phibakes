import Image from "next/image";

type Feature = {
  icon: string;
  title: string;
  description: string;
  accent: "primary" | "success";
};

const FEATURES: Feature[] = [
  {
    icon: "/images/trust-icons/mpesa-payments.png",
    title: "M-PESA Payments",
    description: "Secure & Fast",
    accent: "success",
  },
  {
    icon: "/images/trust-icons/book-and-schedule.png",
    title: "Book & Schedule",
    description: "Pick a date",
    accent: "primary",
  },
  {
    icon: "/images/trust-icons/track-your-order.png",
    title: "Track Your Order",
    description: "Stay updated",
    accent: "success",
  },
  {
    icon: "/images/trust-icons/delivery-in-nairobi.png",
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
                className={`relative flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border ${
                  feature.accent === "primary" ? "border-primary/30" : "border-success/30"
                }`}
              >
                <Image src={feature.icon} alt="" fill className="object-contain p-2" aria-hidden />
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
