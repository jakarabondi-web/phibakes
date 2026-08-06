import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Reset your PhiBakes account password.",
};

export default function ForgotPasswordPage() {
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
              Reset your <span className="italic text-berry">password</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>
          </div>

          <Card className="p-2 sm:p-4">
            <CardContent className="pt-6">
              <ForgotPasswordForm />
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Remembered it after all?{" "}
            <Link href="/login" className="font-semibold text-berry hover:underline">
              Back to sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
