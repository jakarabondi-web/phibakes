import Image from "next/image";

// 240×240 icon set from the Option 1 asset pack — burgundy grounds with
// white/gold linework, designed to sit inside this section's berry panel.
const STEPS = [
  {
    icon: "/images/how-it-works/choose.png",
    title: "Choose",
    copy: "Pick a cake or start a custom design",
  },
  {
    icon: "/images/how-it-works/book.png",
    title: "Book",
    copy: "Select your date, time & delivery details",
  },
  {
    icon: "/images/how-it-works/pay.png",
    title: "Pay",
    copy: "Pay securely via M-PESA or card",
  },
  {
    icon: "/images/how-it-works/we-bake.png",
    title: "We Bake",
    copy: "Our artisans bake fresh with love and precision",
  },
  {
    icon: "/images/how-it-works/deliver.png",
    title: "Deliver",
    copy: "We deliver on time, fresh to your doorstep",
  },
];

export function HowItWorks() {
  return (
    <section className="py-10 sm:py-14">
      <div className="container-luxe">
        <div className="rounded-xl bg-primary px-6 py-14 text-primary-foreground sm:px-10 sm:py-16 lg:py-[4.5rem]">
          <h2 className="text-center font-display text-3xl font-bold sm:text-4xl">
            How it <span className="italic text-gold">works</span>
          </h2>

          <div className="relative mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5 lg:gap-x-4">
            {/* Connecting dashed line — desktop only */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-8 top-8 hidden border-t border-dashed border-primary-foreground/30 lg:block"
            />

            {STEPS.map((step, i) => (
              <div key={step.title} className="relative flex flex-col items-center text-center">
                <div className="relative z-10 size-16 overflow-hidden rounded-full ring-1 ring-primary-foreground/25">
                  <Image src={step.icon} alt="" fill className="object-cover" aria-hidden />
                </div>
                <span className="mt-4 text-xs font-semibold uppercase tracking-wider text-gold-on-dark">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 max-w-[11rem] text-sm leading-relaxed text-primary-foreground/75">
                  {step.copy}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
