import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GalleryGrid } from "./gallery-grid";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse PhiBakes' portfolio of wedding, birthday, corporate, and graduation cakes — photographed in our Nairobi studio.",
};

export default function GalleryPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="gold" className="mx-auto px-3.5 py-1.5 text-xs">
            <Sparkles className="size-3.5" /> Our Portfolio
          </Badge>
          <h1 className="mt-6 text-balance font-display text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Cakes we&apos;ve <span className="italic text-berry">loved</span> baking
          </h1>
          <p className="mt-4 text-balance text-lg leading-relaxed text-muted-foreground">
            A look inside our studio archive — real cakes, real celebrations. Filter by occasion
            or browse the full collection.
          </p>
        </div>

        <div className="mt-14">
          <GalleryGrid />
        </div>
      </div>
    </section>
  );
}
