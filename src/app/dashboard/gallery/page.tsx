import { Database, HardDrive } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { GalleryView } from "@/components/dashboard/gallery/gallery-view";
import { getAllGalleryItems } from "@/lib/gallery/data";
import { getCurrentUser } from "@/lib/auth/dal";
import { isStaffRole } from "@/lib/auth/session";
import { isDatabaseConfigured, databaseSetupHint } from "@/lib/db-status";
import { isStorageConfigured } from "@/lib/storage/r2";

export const metadata = { title: "Gallery" };

export default async function GalleryPage() {
  const user = await getCurrentUser();
  const isStaff = Boolean(user && isStaffRole(user.role));
  const databaseReady = isDatabaseConfigured();
  const storageReady = isStorageConfigured();
  const canManage = isStaff && databaseReady && storageReady;

  const items = await getAllGalleryItems();

  const disabledReason = !databaseReady
    ? `No database is connected, so uploads can't be saved yet. ${databaseSetupHint() ?? ""}`.trim()
    : !storageReady
      ? "Media storage isn't connected yet — set the CLOUDFLARE_R2_* variables to enable uploads."
      : !isStaff
        ? "Only staff can manage the gallery."
        : undefined;

  return (
    <div>
      <PageHeader title="Gallery" description="Manage the public-facing cake gallery" />

      {!canManage && (
        <div className="mb-5 flex flex-col gap-2">
          {!databaseReady && (
            <p className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
              <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
              No database is connected — the items below are the built-in demo set, and uploads
              can&apos;t be saved.
            </p>
          )}
          {databaseReady && !storageReady && (
            <p className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
              <HardDrive className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
              Media storage isn&apos;t connected. Set CLOUDFLARE_R2_ACCOUNT_ID,
              CLOUDFLARE_R2_ACCESS_KEY_ID, CLOUDFLARE_R2_SECRET_ACCESS_KEY,
              CLOUDFLARE_R2_BUCKET_NAME, and CLOUDFLARE_R2_PUBLIC_URL to enable photo and video
              uploads.
            </p>
          )}
        </div>
      )}

      <GalleryView items={items} canManage={canManage} disabledReason={disabledReason} />
    </div>
  );
}
