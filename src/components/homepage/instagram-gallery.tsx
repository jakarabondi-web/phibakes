import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/site/section-heading";
import { GALLERY_IMAGES } from "@/lib/data/images";

const GALLERY = GALLERY_IMAGES.slice(0, 6);

export function InstagramGallery() {
  return (
    <section className="py-20">
      <div className="container-luxe">
        <SectionHeading
          align="center"
          eyebrow="@phibakes"
          title="Follow @PhiBakes"
          description="Our latest creations, fresh from the studio."
          className="mx-auto"
        />
        <div className="mt-10 grid grid-cols-3 gap-3 sm:grid-cols-6">
          {GALLERY.map((src, i) => (
            <a
              key={i}
              href="#"
              className="group relative aspect-square overflow-hidden rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <Image
                src={src}
                alt="PhiBakes cake creation on Instagram"
                fill
                sizes="(min-width: 640px) 16vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </a>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <a
            href="#"
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-berry underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View More on Instagram <ArrowRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
