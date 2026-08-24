/**
 * Client-side avatar resizing.
 *
 * Runs entirely in the browser — draws the picked file onto a canvas, crops it
 * to a square, and re-encodes it small — so a phone photo (often several MB)
 * never gets uploaded at full size. There's no object storage configured for
 * this deployment (the Cloudflare R2 variables in .env.example are unset), so
 * the result is stored as a data URL directly on the user row rather than
 * uploaded anywhere; keeping it under ~150KB is what makes that reasonable.
 */

export const MAX_AVATAR_SOURCE_BYTES = 8 * 1024 * 1024; // reject absurd uploads before decoding
const OUTPUT_SIZE = 256;
const OUTPUT_QUALITY = 0.82;

export class AvatarImageError extends Error {}

export async function fileToAvatarDataUrl(file: File): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new AvatarImageError("Choose an image file (JPEG, PNG, or WebP).");
  }
  if (file.size > MAX_AVATAR_SOURCE_BYTES) {
    throw new AvatarImageError("That image is too large — please choose one under 8MB.");
  }

  const bitmap = await loadBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new AvatarImageError("Your browser can't process images here.");

    // Cover-crop to a centred square so the output is never stretched.
    const side = Math.min(bitmap.width, bitmap.height);
    const sx = (bitmap.width - side) / 2;
    const sy = (bitmap.height - side) / 2;
    ctx.drawImage(bitmap, sx, sy, side, side, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);

    return await encode(canvas);
  } finally {
    bitmap.close?.();
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file);
  } catch {
    throw new AvatarImageError("Couldn't read that image — try a different file.");
  }
}

function encode(canvas: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve, reject) => {
    const tryType = (type: string, fallback?: () => void) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            if (fallback) return fallback();
            reject(new AvatarImageError("Couldn't process that image."));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new AvatarImageError("Couldn't process that image."));
          reader.readAsDataURL(blob);
        },
        type,
        OUTPUT_QUALITY
      );
    };
    // WebP first for size; not every browser encodes it, so fall back to JPEG.
    tryType("image/webp", () => tryType("image/jpeg"));
  });
}
