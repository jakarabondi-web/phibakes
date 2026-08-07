import "server-only";

/**
 * Google OAuth 2.0 (authorization-code flow).
 *
 * Everything is wired; the button goes live the moment GOOGLE_CLIENT_ID and
 * GOOGLE_CLIENT_SECRET are set. Until then `isGoogleConfigured()` is false and
 * the UI says so rather than offering a button that silently fails.
 */

const AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const USERINFO_ENDPOINT = "https://www.googleapis.com/oauth2/v3/userinfo";

export const GOOGLE_STATE_COOKIE = "phibakes_oauth_state";

export function isGoogleConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}

export function googleRedirectUri(origin: string): string {
  // Prefer an explicit site URL in production so the redirect URI matches what's
  // registered in the Google console even behind a proxy.
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? origin;
  return `${base}/api/auth/google/callback`;
}

export function buildAuthUrl(params: { state: string; redirectUri: string }): string {
  const url = new URL(AUTH_ENDPOINT);
  url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!);
  url.searchParams.set("redirect_uri", params.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", params.state);
  url.searchParams.set("access_type", "online");
  url.searchParams.set("prompt", "select_account");
  return url.toString();
}

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string;
  picture?: string;
};

export async function exchangeCodeForProfile(
  code: string,
  redirectUri: string
): Promise<GoogleProfile> {
  const tokenRes = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    throw new Error(`Google token exchange failed (${tokenRes.status})`);
  }

  const { access_token: accessToken } = (await tokenRes.json()) as { access_token?: string };
  if (!accessToken) throw new Error("Google token response had no access_token");

  const profileRes = await fetch(USERINFO_ENDPOINT, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!profileRes.ok) throw new Error(`Google userinfo failed (${profileRes.status})`);

  const p = (await profileRes.json()) as {
    sub: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
    picture?: string;
  };

  if (!p.email) throw new Error("Google profile had no email");

  return {
    sub: p.sub,
    email: p.email.toLowerCase(),
    emailVerified: Boolean(p.email_verified),
    name: p.name ?? p.email.split("@")[0],
    picture: p.picture,
  };
}
