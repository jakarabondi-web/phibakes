"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff, KeyRound, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { resetPassword } from "@/lib/auth/password-reset";
import type { AuthFormState } from "@/lib/auth/actions";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction, pending] = useActionState<AuthFormState, FormData>(resetPassword, {});

  if (!token) {
    return (
      <div className="flex flex-col gap-4 text-center">
        <p className="text-sm text-muted-foreground">
          This link is missing its reset token. Request a new one to continue.
        </p>
        <Button asChild className="w-full">
          <Link href="/forgot-password">Request a new link</Link>
        </Button>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <input type="hidden" name="token" value={token} />

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
        <Label htmlFor="password">New password</Label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="••••••••"
            required
            minLength={8}
            className="pr-11"
            aria-invalid={!!state.fieldErrors?.password}
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {state.fieldErrors?.password ? (
          <p className="text-xs text-destructive">{state.fieldErrors.password}</p>
        ) : (
          <p className="text-xs text-muted-foreground">
            At least 8 characters, including a letter and a number.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm new password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          placeholder="••••••••"
          required
          aria-invalid={!!state.fieldErrors?.confirmPassword}
        />
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs text-destructive">{state.fieldErrors.confirmPassword}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? "Updating…" : "Update password"}
        {!pending && <KeyRound className="size-4" />}
      </Button>
    </form>
  );
}
