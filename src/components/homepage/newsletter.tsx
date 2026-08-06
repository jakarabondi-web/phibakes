"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Newsletter() {
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success("You're subscribed — welcome to the PhiBakes list!");
      e.currentTarget.reset();
    }, 600);
  }

  return (
    <section className="py-20">
      <div className="container-luxe">
        <div className="rounded-[24px] bg-blush px-6 py-14 text-center sm:px-12">
          <h2 className="text-balance font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Stay Sweet. Stay Updated.
          </h2>
          <p className="mx-auto mt-3 max-w-md text-balance text-sm leading-relaxed text-muted-foreground">
            Subscribe for new cake drops, offers and inspiration.
          </p>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="you@email.com"
              required
              className="bg-cream"
            />
            <Button type="submit" disabled={submitting} className="uppercase tracking-wide">
              {submitting ? "Subscribing…" : "Subscribe"}
              {!submitting && <Send className="size-4" />}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
