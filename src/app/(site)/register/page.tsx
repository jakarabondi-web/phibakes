import type { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RegisterForm } from "./register-form";
import { GoogleButton } from "./google-button";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a PhiBakes account to order custom cakes, track deliveries, and save your favourites.",
};

export default function RegisterPage() {
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
              Create your <span className="italic text-berry">account</span>
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Order, track, and manage your cakes in one place.
            </p>
          </div>

          <Card className="p-2 sm:p-4">
            <CardHeader className="pb-0">
              <GoogleButton />
              <div className="my-2 flex items-center gap-3">
                <Separator className="flex-1" />
                <span className="text-xs text-muted-foreground">or sign up with email</span>
                <Separator className="flex-1" />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <RegisterForm />
            </CardContent>
          </Card>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-berry hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
