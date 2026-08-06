"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSent(true);
      toast.success("Password reset link sent.");
    }, 800);
  }

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-3 py-6 text-center">
        <CheckCircle2 className="size-10 text-success" />
        <h3 className="font-display text-lg font-semibold text-foreground">Check your inbox</h3>
        <p className="max-w-xs text-sm text-muted-foreground">
          If an account exists for that email, we&apos;ve sent a link to reset your password.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input id="email" name="email" type="email" placeholder="you@email.com" required />
      </div>
      <Button type="submit" size="lg" disabled={submitting} className="w-full">
        {submitting ? "Sending…" : "Send Reset Link"}
        {!submitting && <Send className="size-4" />}
      </Button>
    </form>
  );
}
