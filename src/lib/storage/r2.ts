import "server-only";

import { S3Client } from "@aws-sdk/client-s3";

/**
 * Cloudflare R2 configuration and client.
 *
 * Mirrors the database's own configured/not-configured split (see
 * lib/db-status.ts): a fresh clone or a deployment without a bucket must keep
 * working — gallery uploads just stay unavailable with a clear reason, rather
 * than the build or the page crashing on a missing credential.
 */

type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  publicUrl: string; // no trailing slash
};

function readConfig(): R2Config | null {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY?.trim();
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME?.trim();
  const publicUrlRaw = process.env.CLOUDFLARE_R2_PUBLIC_URL?.trim();

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicUrlRaw) return null;

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucket,
    publicUrl: publicUrlRaw.replace(/\/+$/, ""),
  };
}

export function isStorageConfigured(): boolean {
  return readConfig() !== null;
}

/** Which env variable names are missing, for the admin-facing diagnostic. Never returns values. */
export function missingStorageVars(): string[] {
  const required = [
    "CLOUDFLARE_R2_ACCOUNT_ID",
    "CLOUDFLARE_R2_ACCESS_KEY_ID",
    "CLOUDFLARE_R2_SECRET_ACCESS_KEY",
    "CLOUDFLARE_R2_BUCKET_NAME",
    "CLOUDFLARE_R2_PUBLIC_URL",
  ];
  return required.filter((name) => !process.env[name]?.trim());
}

let cachedClient: { client: S3Client; config: R2Config } | null = null;

function getClient(): { client: S3Client; config: R2Config } | null {
  const config = readConfig();
  if (!config) return null;
  if (cachedClient && cachedClient.config.accountId === config.accountId) return cachedClient;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey },
  });
  cachedClient = { client, config };
  return cachedClient;
}

export function publicUrlFor(objectKey: string): string {
  const config = readConfig();
  if (!config) throw new Error("Storage isn't configured.");
  return `${config.publicUrl}/${objectKey}`;
}

export { getClient as getR2Client };
