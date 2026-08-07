import { Button } from "@/components/ui/button";
import { isGoogleConfigured } from "@/lib/auth/google";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.52 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.47c-.28 1.5-1.13 2.77-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.96-1.07 7.95-2.92l-3.88-3c-1.08.72-2.45 1.15-4.07 1.15-3.13 0-5.78-2.11-6.73-4.95H1.26v3.11C3.24 21.3 7.28 24 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.27 14.28A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.37-2.28V6.61H1.26A11.98 11.98 0 0 0 0 12c0 1.93.46 3.76 1.26 5.39l4-3.11Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.77c1.76 0 3.35.61 4.6 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0 7.28 0 3.24 2.7 1.26 6.61l4 3.11C6.22 6.88 8.87 4.77 12 4.77Z"
      />
    </svg>
  );
}

/**
 * Server component so it can read whether Google credentials are present. The
 * flow is fully implemented; without GOOGLE_CLIENT_ID/SECRET the button is
 * disabled and says why, rather than starting a sign-in that can't complete.
 */
export function GoogleButton() {
  if (!isGoogleConfigured()) {
    return (
      <div className="flex flex-col gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="lg"
          className="w-full"
          disabled
          title="Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in"
        >
          <GoogleIcon /> Continue with Google
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Google sign-in isn&apos;t configured yet.
        </p>
      </div>
    );
  }

  return (
    <Button asChild variant="outline" size="lg" className="w-full">
      <a href="/api/auth/google">
        <GoogleIcon /> Continue with Google
      </a>
    </Button>
  );
}
