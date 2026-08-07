import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ResetPasswordForm } from "./reset-password-form";

export const metadata: Metadata = {
  title: "Choose a new password",
  description: "Set a new password for your PhiBakes account.",
};

export default function ResetPasswordPage() {
  return (
    <section className="bg-noise">
      <div className="container-luxe flex min-h-[calc(100vh-20rem)] items-center justify-center py-16 sm:py-24">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-11 items-center justify-center rounded-full bg-gold text-charcoal font-display text-xl font-bold">
                P
              </span>
              <span className="font-display text-2xl font-bold text-foreground">PhiBakes</span>
            </Link>
            <h1 className="mt-6 text-balance font-display text-2xl font-bold text-foreground sm:text-3xl">
              Choose a new <span className="italic text-berry">password</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Pick something you haven&apos;t used before.
            </p>
          </div>

          <Card className="p-2 sm:p-4">
            <CardContent className="pt-4">
              <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted/50" />}>
                <ResetPasswordForm />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
