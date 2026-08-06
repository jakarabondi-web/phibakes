"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export function CakeGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = React.useState(0);

  return (
    <div>
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-muted shadow-sm">
        <Image
          src={images[active]}
          alt={`${name} — view ${active + 1}`}
          fill
          preload
          sizes="(min-width: 1024px) 45vw, 100vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 && (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1} of ${name}`}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-colors",
                i === active ? "border-primary" : "border-transparent hover:border-border"
              )}
            >
              <Image src={img} alt="" fill sizes="10vw" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
