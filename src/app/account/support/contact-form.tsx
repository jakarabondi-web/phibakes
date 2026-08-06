"use client";

import * as React from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ContactForm() {
  const [submitted, setSubmitted] = React.useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Message sent — our team will reply within a few hours.");
  }

  if (submitted) {
    return (
      <div className="rounded-xl bg-success/10 p-4 text-sm text-success">
        Thanks for reaching out! We've received your message and will respond shortly via email.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="support-subject">Subject</Label>
        <Input id="support-subject" placeholder="e.g. Question about my order" required />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="support-message">Message</Label>
        <Textarea id="support-message" placeholder="Tell us how we can help..." required className="min-h-32" />
      </div>
      <Button type="submit" className="self-start">
        <Send /> Send Message
      </Button>
    </form>
  );
}
