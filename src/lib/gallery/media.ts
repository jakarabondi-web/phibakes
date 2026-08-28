/**
 * Upload constraints shared between the browser (pre-check before even asking
 * for a presigned URL) and the server action (the authoritative check — the
 * client-side one is only a courtesy, since a request can always bypass it).
 * No "server-only" here on purpose: this file is imported from client
 * components too.
 */

export type GalleryMediaKind = "IMAGE" | "VIDEO";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

const VIDEO_TYPES: Record<string, string> = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};

export const MAX_IMAGE_BYTES = 15 * 1024 * 1024; // 15MB
export const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300MB

export const ACCEPT_ATTRIBUTE = [...Object.keys(IMAGE_TYPES), ...Object.keys(VIDEO_TYPES)].join(",");

export function mediaKindFor(contentType: string): GalleryMediaKind | null {
  if (contentType in IMAGE_TYPES) return "IMAGE";
  if (contentType in VIDEO_TYPES) return "VIDEO";
  return null;
}

export function extensionFor(contentType: string): string | null {
  return IMAGE_TYPES[contentType] ?? VIDEO_TYPES[contentType] ?? null;
}

/** Returns a user-facing error message, or null when the file is acceptable. */
export function validateGalleryUpload(contentType: string, sizeBytes: number): string | null {
  const kind = mediaKindFor(contentType);
  if (!kind) {
    return "That file type isn't supported. Use JPEG, PNG, WebP, GIF, MP4, WebM, or MOV.";
  }
  const max = kind === "IMAGE" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (sizeBytes > max) {
    const label = kind === "IMAGE" ? "15MB" : "300MB";
    return `That file is too large — ${kind === "IMAGE" ? "images" : "videos"} are limited to ${label}.`;
  }
  if (sizeBytes <= 0) {
    return "That file looks empty.";
  }
  return null;
}

/** Fixed category list so the admin uploader and the public filter tabs agree. */
export const GALLERY_CATEGORIES = [
  { slug: "wedding", label: "Wedding" },
  { slug: "birthday", label: "Birthday" },
  { slug: "corporate", label: "Corporate" },
  { slug: "graduation", label: "Graduation" },
  { slug: "cupcakes", label: "Cupcakes & Desserts" },
] as const;

export type GalleryCategorySlug = (typeof GALLERY_CATEGORIES)[number]["slug"];

export function isGalleryCategorySlug(value: string): value is GalleryCategorySlug {
  return GALLERY_CATEGORIES.some((c) => c.slug === value);
}
