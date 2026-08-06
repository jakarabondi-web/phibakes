import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { BuilderWizard } from "@/components/builder/builder-wizard";

export const metadata: Metadata = {
  title: "Custom Cake Builder | PhiBakes",
  description:
    "Design your dream cake in 8 simple steps — occasion, size, flavour, filling, decoration and more — with instant, transparent pricing.",
};

export default function CustomCakeBuilderPage() {
  return (
    <section className="relative overflow-hidden bg-noise pb-20 pt-14 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-b from-blush/50 via-cream to-cream" />
      <div className="container-luxe relative">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <Sparkles className="size-3.5" /> Custom Cake Builder
          </Badge>
          <h1 className="mt-6 text-balance font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl lg:text-5xl">
            Design your <span className="text-berry">dream cake</span> in 8 easy steps
          </h1>
          <p className="mt-4 text-balance text-muted-foreground leading-relaxed">
            From occasion to decoration, build a cake that&apos;s entirely yours — with transparent,
            instant pricing every step of the way.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-5xl">
          <BuilderWizard />
        </div>
      </div>
    </section>
  );
}
