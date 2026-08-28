"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getR2Client, isStorageConfigured, publicUrlFor } from "@/lib/storage/r2";
import { getCurrentUser } from "@/lib/auth/dal";
import { isStaffRole } from "@/lib/auth/session";
import {
  extensionFor,
  isGalleryCategorySlug,
  mediaKindFor,
  validateGalleryUpload,
} from "./media";

export type ActionState = { ok?: boolean; error?: string; fieldErrors?: Record<string, string> };

export type UploadTicket = { ok: true; uploadUrl: string; objectKey: string } | { ok: false; error: string };

const NO_DB = "Connect a database to manage the gallery.";
const NO_STORAGE =
  "Media storage isn't connected yet — set the CLOUDFLARE_R2_* variables to enable uploads.";

type StaffCheck = { ok: true; userId: string } | { ok: false; error: string };

/** Any staff member can curate the gallery — it's editorial, not access or money, unlike settings/staff. */
async function requireStaff(): Promise<StaffCheck> {
  const user = await getCurrentUser();
  if (!user) return { ok: false, error: "You're signed out. Sign in again to continue." };
  if (!isStaffRole(user.role)) return { ok: false, error: "Only staff can manage the gallery." };
  return { ok: true, userId: user.id };
}

/**
 * Step 1 of an upload: mint a short-lived presigned PUT URL so the browser
 * sends the file straight to R2. Serverless functions on Vercel cap request
 * bodies well under what a video needs, so the file never passes through our
 * own server at all — only this small JSON ticket does.
 */
export async function requestGalleryUpload(input: {
  contentType: string;
  sizeBytes: number;
}): Promise<UploadTicket> {
  const staff = await requireStaff();
  if (!staff.ok) return { ok: false, error: staff.error };
  if (!isStorageConfigured()) return { ok: false, error: NO_STORAGE };

  const validationError = validateGalleryUpload(input.contentType, input.sizeBytes);
  if (validationError) return { ok: false, error: validationError };

  const ext = extensionFor(input.contentType);
  const kind = mediaKindFor(input.contentType);
  if (!ext || !kind) return { ok: false, error: "Unsupported file type." };

  const objectKey = `gallery/${new Date().getFullYear()}/${randomUUID()}.${ext}`;

  try {
    const r2 = getR2Client();
    if (!r2) return { ok: false, error: NO_STORAGE };
    const command = new PutObjectCommand({
      Bucket: r2.config.bucket,
      Key: objectKey,
      ContentType: input.contentType,
      ContentLength: input.sizeBytes,
    });
    const uploadUrl = await getSignedUrl(r2.client, command, { expiresIn: 300 });
    return { ok: true, uploadUrl, objectKey };
  } catch (err) {
    console.error("[gallery] presign failed:", err);
    return { ok: false, error: "Couldn't prepare that upload. Please try again." };
  }
}

const createSchema = z.object({
  objectKey: z.string().min(1),
  contentType: z.string().min(1),
  caption: z.string().trim().min(2, "Add a short caption.").max(160),
  category: z.string().refine(isGalleryCategorySlug, "Choose a category."),
});

/** Step 2: the browser's direct PUT to R2 has already succeeded — persist the row. */
export async function createGalleryItem(input: {
  objectKey: string;
  contentType: string;
  caption: string;
  category: string;
}): Promise<ActionState> {
  const staff = await requireStaff();
  if (!staff.ok) return { error: staff.error };
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const parsed = createSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      if (issue.path[0]) fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { fieldErrors };
  }

  const kind = mediaKindFor(parsed.data.contentType);
  if (!kind) return { error: "Unsupported file type." };
  // Every upload goes through gallery/<year>/<uuid>.<ext> from requestGalleryUpload
  // above — reject anything else so this can't be used to point a row at an
  // arbitrary key some other part of the bucket owns.
  if (!parsed.data.objectKey.startsWith("gallery/")) {
    return { error: "That upload wasn't recognised. Please upload again." };
  }

  try {
    await prisma.galleryItem.create({
      data: {
        type: kind,
        url: publicUrlFor(parsed.data.objectKey),
        objectKey: parsed.data.objectKey,
        caption: parsed.data.caption.trim(),
        category: parsed.data.category,
        uploadedById: staff.userId,
      },
    });
  } catch (err) {
    console.error("[gallery] create failed:", err);
    return { error: "The file uploaded, but saving it to the gallery failed. Please try again." };
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}

export async function deleteGalleryItem(id: string): Promise<ActionState> {
  const staff = await requireStaff();
  if (!staff.ok) return { error: staff.error };
  if (!isDatabaseConfigured()) return { error: NO_DB };

  try {
    const row = await prisma.galleryItem.findUnique({ where: { id }, select: { objectKey: true } });
    if (!row) return { error: "That item is already gone." };

    const r2 = getR2Client();
    if (r2) {
      try {
        await r2.client.send(new DeleteObjectCommand({ Bucket: r2.config.bucket, Key: row.objectKey }));
      } catch (err) {
        // An orphaned object in the bucket costs nothing to leave behind; a
        // delete that appears to fail because storage hiccupped, while the
        // item still shows on the site, is the worse failure mode — remove
        // the row regardless and move on.
        console.error("[gallery] R2 object delete failed, removing row anyway:", err);
      }
    }

    await prisma.galleryItem.delete({ where: { id } });
  } catch (err) {
    console.error("[gallery] delete failed:", err);
    return { error: "Couldn't delete that item. Please try again." };
  }

  revalidatePath("/dashboard/gallery");
  revalidatePath("/gallery");
  return { ok: true };
}
