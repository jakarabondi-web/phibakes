import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Award, HeartHandshake, Leaf, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";
import { cakeImage, AVATAR_IMAGES } from "@/lib/data";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet PhiBakes — Nairobi's premium cake studio. Our story, our craftsmanship, and the team behind every celebration cake we bake.",
};

const STATS = [
  { label: "Years in business", value: "9+" },
  { label: "Cakes delivered", value: "14,200+" },
  { label: "Studio team members", value: "22" },
  { label: "Average rating", value: "4.9/5" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Design-led craftsmanship",
    description:
      "Every cake starts as a sketch. Our decorators trained in classical and modern piping techniques so your cake looks as good as it tastes.",
  },
  {
    icon: Leaf,
    title: "Honest ingredients",
    description:
      "Real butter, Belgian couverture chocolate, and fruit sourced from Nairobi's best markets. No shortcuts, no artificial fillers.",
  },
  {
    icon: HeartHandshake,
    title: "Service you can rely on",
    description:
      "From your first enquiry to the last slice, one team stays with your order — quoting, baking, delivering, and following up.",
  },
  {
    icon: Award,
    title: "Consistency, every time",
    description:
      "Standardised recipes and a quality-check stage before every cake leaves the studio, whether it's a cupcake box or a five-tier wedding cake.",
  },
];

const TEAM = [
  {
    name: "Phyllis Nyambura",
    role: "Founder & Head Pastry Chef",
    avatar: AVATAR_IMAGES[0],
    bio: "Trained in Le Cordon Bleu techniques, Phyllis started PhiBakes from a home kitchen in Kilimani in 2017.",
  },
  {
    name: "Collins Mutuku",
    role: "Head of Cake Design",
    avatar: AVATAR_IMAGES[1],
    bio: "Leads our sugar-art and tiered-cake studio, with a specialty in sculptural wedding cakes.",
  },
  {
    name: "Diana Achieng",
    role: "Operations & Logistics Manager",
    avatar: AVATAR_IMAGES[2],
    bio: "Keeps every order on schedule, from ingredient sourcing to the final delivery handover.",
  },
  {
    name: "Samuel Kiplangat",
    role: "Customer Experience Lead",
    avatar: AVATAR_IMAGES[3],
    bio: "Your first point of contact for quotes, custom orders, and event planning support.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-noise">
        <div className="absolute inset-0 bg-gradient-to-b from-blush/60 via-cream to-cream" />
        <div className="container-luxe relative grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <Badge variant="gold" className="px-3.5 py-1.5 text-xs">
              <Sparkles className="size-3.5" /> Our Story
            </Badge>
            <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl">
              A Nairobi kitchen table, grown into a{" "}
              <span className="italic text-berry">premium cake studio.</span>
            </h1>
            <p className="mt-6 max-w-lg text-balance text-lg leading-relaxed text-muted-foreground">
              PhiBakes began in 2017 in a small Kilimani kitchen, baking birthday cakes for
              neighbours. Today we run a dedicated studio serving weddings, corporate events, and
              everyday celebrations across Nairobi — without losing the care of that first oven.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/custom-cake-builder">
                  Design Your Cake <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/gallery">View Our Work</Link>
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] shadow-2xl">
            <Image
              src={cakeImage(4)}
              alt="A PhiBakes signature cake in the studio"
              fill
              preload
              sizes="(min-width: 1024px) 45vw, 90vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="container-luxe py-4">
        <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border/70 bg-card p-8 shadow-sm sm:grid-cols-4 sm:gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold text-berry sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* STUDIO GALLERY */}
      <section className="container-luxe py-16 sm:py-24">
        <SectionHeading
          eyebrow="Inside the studio"
          title="Where every cake comes to life"
          description="Our Kilimani studio houses a dedicated baking kitchen, a decorating atelier, and a climate-controlled finishing room for delicate sugar work."
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[cakeImage(10), cakeImage(14), cakeImage(1), cakeImage(9)].map((src, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-2xl shadow-sm ${
                i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square sm:mt-8"
              }`}
            >
              <Image
                src={src}
                alt="PhiBakes studio photography"
                fill
                sizes="(min-width: 640px) 25vw, 50vw"
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ))}
        </div>
      </section>

      {/* VALUES */}
      <section className="bg-blush/40 py-16 sm:py-24">
        <div className="container-luxe">
          <SectionHeading
            eyebrow="What we stand for"
            title="Craftsmanship in every detail"
            description="Four principles guide how we bake, design, and deliver — whether it's a dozen cupcakes or a five-tier wedding cake."
            align="center"
            className="mx-auto"
          />
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <Card key={v.title} className="p-6">
                <div className="flex size-11 items-center justify-center rounded-full bg-berry/10 text-berry">
                  <v.icon className="size-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="container-luxe py-16 sm:py-24">
        <SectionHeading
          eyebrow="Meet the team"
          title="The hands behind every cake"
          description="A small, dedicated team of pastry chefs, designers, and coordinators who treat every order like it's for their own family."
          align="center"
          className="mx-auto"
        />
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member) => (
            <Card key={member.name} className="items-center p-6 text-center">
              <div className="relative size-24 overflow-hidden rounded-full shadow-md">
                <Image src={member.avatar} alt={member.name} fill sizes="96px" className="object-cover" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">{member.name}</h3>
              <p className="text-xs font-medium uppercase tracking-wide text-gold">{member.role}</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{member.bio}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container-luxe pb-24">
        <div className="relative overflow-hidden rounded-[2rem] bg-chocolate px-8 py-16 text-center text-cream sm:px-16">
          <div className="absolute inset-0 bg-noise opacity-40" />
          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-balance font-display text-3xl font-bold sm:text-4xl">
              Ready to taste the PhiBakes difference?
            </h2>
            <p className="mt-4 text-balance text-cream/75">
              Browse our signature collection or design a fully custom cake for your next
              celebration — we&apos;ll take care of the rest.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button size="lg" variant="gold" asChild>
                <Link href="/cakes">
                  Order a Cake <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-cream/30 text-cream hover:bg-cream/10" asChild>
                <Link href="/contact">Talk to Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
