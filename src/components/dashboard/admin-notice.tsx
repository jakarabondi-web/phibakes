import { Lock, Database } from "lucide-react";

/**
 * Explains up front why a form on this page may refuse to save, rather than
 * letting the owner fill it in and only discover the problem on submit.
 */
export function AdminNotice({
  isOwner,
  databaseReady,
  databaseHint,
}: {
  isOwner: boolean;
  databaseReady: boolean;
  /** Why there's no database — see databaseSetupHint(). */
  databaseHint?: string | null;
}) {
  if (isOwner && databaseReady) return null;

  return (
    <div className="mb-5 flex flex-col gap-2">
      {!isOwner && (
        <p className="flex items-start gap-2 rounded-xl border border-border bg-secondary/60 px-3.5 py-3 text-sm text-foreground">
          <Lock className="mt-0.5 size-4 shrink-0 text-primary" />
          You&apos;re signed in as staff, so these settings are read-only. Only the owner can
          change them.
        </p>
      )}
      {!databaseReady && (
        <div className="flex items-start gap-2 rounded-xl border border-gold/40 bg-gold/10 px-3.5 py-3 text-sm text-foreground">
          <Database className="mt-0.5 size-4 shrink-0 text-gold-on-light" />
          <div>
            <p>
              No database is connected, so changes here can&apos;t be saved yet. The values below
              are the built-in defaults.
            </p>
            {databaseHint && <p className="mt-1 text-muted-foreground">{databaseHint}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
