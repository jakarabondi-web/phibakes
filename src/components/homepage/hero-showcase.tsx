"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { HERO_SHOWCASE } from "@/lib/data/images";
import { cn } from "@/lib/utils";

const ROTATE_MS = 5000;

/**
 * Crossfading hero carousel. Auto-advances through the showcase set,
 * pauses while hovered, and stays on the first slide entirely when the
 * visitor prefers reduced motion.
 */
export function HeroShowcase() {
  const [index, setIndex] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const hovering = useRef(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time sync with an external media query
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const timer = window.setInterval(() => {
      if (!hovering.current) setIndex((i) => (i + 1) % HERO_SHOWCASE.length);
    }, ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [reducedMotion]);

  return (
    <div
      className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-[0_24px_60px_-16px_rgba(74,27,38,0.28)] ring-1 ring-black/5 lg:aspect-auto lg:h-full lg:min-h-[420px]"
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      {HERO_SHOWCASE.map((slide, i) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={i === index ? slide.alt : ""}
          fill
          priority={i === 0}
          sizes="(min-width: 1024px) 50vw, 90vw"
          className={cn(
            "object-cover transition-opacity duration-1000",
            i === index ? "opacity-100" : "opacity-0"
          )}
          aria-hidden={i !== index}
        />
      ))}

      <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
        {HERO_SHOWCASE.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            aria-label={`Show cake ${i + 1} of ${HERO_SHOWCASE.length}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className={cn(
              "size-1.5 rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cream",
              i === index ? "w-4 bg-cream" : "bg-cream/50 hover:bg-cream/80"
            )}
          />
        ))}
      </div>
    </div>
  );
}
