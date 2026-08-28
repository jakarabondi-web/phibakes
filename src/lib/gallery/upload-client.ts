"use client";

import { requestGalleryUpload, createGalleryItem, type ActionState } from "./actions";
import { validateGalleryUpload } from "./media";

export class GalleryUploadError extends Error {}

/**
 * Sends the file straight to R2 via a presigned URL using XHR rather than
 * fetch, purely so upload progress is observable — fetch has no progress
 * events for a request body, and a multi-hundred-MB video with no feedback
 * reads as a hung page.
 */
function putWithProgress(url: string, file: File, onProgress: (pct: number) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.setRequestHeader("Content-Type", file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new GalleryUploadError(`Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new GalleryUploadError("Upload failed — check your connection."));
    xhr.send(file);
  });
}

export async function uploadGalleryFile(
  file: File,
  meta: { caption: string; category: string },
  onProgress: (pct: number) => void
): Promise<ActionState> {
  const validationError = validateGalleryUpload(file.type, file.size);
  if (validationError) throw new GalleryUploadError(validationError);

  const ticket = await requestGalleryUpload({ contentType: file.type, sizeBytes: file.size });
  if (!ticket.ok) throw new GalleryUploadError(ticket.error);

  await putWithProgress(ticket.uploadUrl, file, onProgress);

  return createGalleryItem({
    objectKey: ticket.objectKey,
    contentType: file.type,
    caption: meta.caption,
    category: meta.category,
  });
}
