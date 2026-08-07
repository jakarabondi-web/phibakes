"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Send, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { requestPasswordReset, type ResetRequestState } from "@/lib/auth/password-reset";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState<ResetRequestState, FormData>(
    requestPasswordReset,
    {}
  );

  if (state.sent) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-3 rounded-xl border border-success/30 bg-success/10 px-4 py-6 text-center">
          <CheckCircle2 className="size-7 text-success" />
          <div>
            <p className="text-sm font-semibold text-foreground">Check your inbox</p>
            <p className="mt-1 text-sm text-muted-foreground">
              If an account exists for that email, we&apos;ve sent a reset link. It expires in one
              hour.
            </p>
          </div>
        </div>

        {state.error && <p className="text-xs text-muted-foreground">{state.error}</p>}

        {/* No mail credentials configured — surface the link so the flow is still usable. */}
        {state.devLink && (
          <div className="rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3">
            <p className="text-xs font-semibold text-foreground">
              Email delivery isn&apos;t configured, so here&apos;s the link:
            </p>
            <Link
              href={state.devLink}
              className="mt-1 block break-all text-xs font-medium text-berry underline"
            >
              {state.devLink}
            </Link>
          </div>
        )}

        <Button asChild variant="outline" className="w-full">
          <Link href="/login">Back to sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      {state.error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-3 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@email.com"
          required
          aria-invalid={!!state.fieldErrors?.email}
        />
        {state.fieldErrors?.email && (
          <p className="text-xs text-destructive">{state.fieldErrors.email}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Sending…" : "Send reset link"}
        {!pending && <Send className="size-4" />}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/login" className="font-semibold text-berry hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
