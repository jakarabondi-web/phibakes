"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Message sent — we'll be in touch shortly.");
      e.currentTarget.reset();
    }, 800);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-success/20 bg-success/5 px-6 py-16 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <h3 className="font-display text-xl font-semibold text-foreground">Message sent!</h3>
        <p className="max-w-sm text-sm text-muted-foreground">
          Thank you for reaching out. Our team usually replies within a few hours during studio
          hours.
        </p>
        <Button variant="outline" className="mt-2" onClick={() => setSubmitted(false)}>
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="flex flex-col gap-2">
        <Label htmlFor="name">Full name</Label>
        <Input id="name" name="name" placeholder="Jane Wanjiku" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" type="tel" placeholder="07XX XXX XXX" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Wedding cake enquiry" required />
      </div>
      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="message">Message</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Tell us about your event, date, and what you have in mind…"
          className="min-h-36"
          required
        />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? "Sending…" : "Send Message"}
          {!submitting && <Send className="size-4" />}
        </Button>
      </div>
    </form>
  );
}
