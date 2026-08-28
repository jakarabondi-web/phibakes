import { NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client, isStorageConfigured, missingStorageVars, publicUrlFor } from "@/lib/storage/r2";

/**
 * Setup diagnostic for gallery media storage — the R2 counterpart to
 * /api/health/db. "The R2 variables are set" is not the same claim as "R2
 * actually works": the account ID could be wrong, the API token could lack
 * permission on this bucket, or — the failure mode that matters most here —
 * the bucket's public access might not be turned on, in which case uploads
 * would appear to succeed in the dashboard while every image silently
 * 404s on the live site. This round-trips a real object through the
 * account's own credentials to catch exactly that, rather than taking
 * "configured" at face value.
 *
 * Never returns the credentials themselves — only booleans, HTTP status
 * codes, and error names/messages (which can quote the endpoint URL but
 * never a secret).
 *
 * Safe to delete once R2 setup is confirmed working.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isStorageConfigured()) {
    return NextResponse.json({
      configured: false,
      diagnosis: "Not all five CLOUDFLARE_R2_* variables are set.",
      missing: missingStorageVars(),
    });
  }

  const r2 = getR2Client();
  if (!r2) {
    // isStorageConfigured() and getR2Client() read the same env vars the same
    // way, so this should be unreachable — but report it plainly if it isn't.
    return NextResponse.json({ configured: true, connected: false, diagnosis: "Client init failed." });
  }

  const objectKey = `_health/${Date.now()}-${Math.random().toString(36).slice(2)}.txt`;
  const body = `phibakes storage health check — ${new Date().toISOString()}`;

  const result: {
    configured: true;
    put: { ok: boolean; error?: string };
    publicRead: { ok: boolean; status?: number; error?: string };
    directRead: { ok: boolean; error?: string };
    cleanup: { ok: boolean; error?: string };
  } = {
    configured: true,
    put: { ok: false },
    publicRead: { ok: false },
    directRead: { ok: false },
    cleanup: { ok: false },
  };

  try {
    await r2.client.send(
      new PutObjectCommand({
        Bucket: r2.config.bucket,
        Key: objectKey,
        Body: body,
        ContentType: "text/plain",
      })
    );
    result.put.ok = true;
  } catch (err) {
    result.put.error = String((err as Error).message ?? err).slice(0, 300);
  }

  if (result.put.ok) {
    // This is the check that actually matters: CLOUDFLARE_R2_PUBLIC_URL is
    // what every gallery <img>/<video> tag resolves to, so if the object
    // exists in the bucket but isn't reachable at that URL, every upload
    // will look successful and render as a broken image on the live site.
    try {
      const res = await fetch(publicUrlFor(objectKey), { cache: "no-store" });
      result.publicRead = { ok: res.ok, status: res.status };
    } catch (err) {
      result.publicRead = { ok: false, error: String((err as Error).message ?? err).slice(0, 300) };
    }

    try {
      const got = await r2.client.send(new GetObjectCommand({ Bucket: r2.config.bucket, Key: objectKey }));
      const text = await got.Body?.transformToString();
      result.directRead.ok = text === body;
      if (!result.directRead.ok) result.directRead.error = "Content didn't match what was written.";
    } catch (err) {
      result.directRead.error = String((err as Error).message ?? err).slice(0, 300);
    }

    try {
      await r2.client.send(new DeleteObjectCommand({ Bucket: r2.config.bucket, Key: objectKey }));
      result.cleanup.ok = true;
    } catch (err) {
      result.cleanup.error = String((err as Error).message ?? err).slice(0, 300);
    }
  }

  const diagnosis = !result.put.ok
    ? "Couldn't write to the bucket — check the account ID, API token, and that the token has write access to this bucket."
    : !result.directRead.ok
      ? "Wrote the object but couldn't read it back via the API — unusual; check the error detail."
      : !result.publicRead.ok
        ? `The object uploaded successfully but isn't publicly readable at CLOUDFLARE_R2_PUBLIC_URL (got HTTP ${result.publicRead.status ?? "no response"}). Uploads will appear to work but images and videos won't display on the site. Check the bucket's public access setting or custom domain.`
        : "Storage is fully working: uploads write, and the result is publicly reachable at CLOUDFLARE_R2_PUBLIC_URL.";

  return NextResponse.json({ ...result, diagnosis });
}
