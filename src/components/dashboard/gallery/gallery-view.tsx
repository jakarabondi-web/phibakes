"use client";

import * as React from "react";
import { toast } from "sonner";
import { Trash2, Upload, PlayCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { deleteGalleryItem } from "@/lib/gallery/actions";
import { uploadGalleryFile, GalleryUploadError } from "@/lib/gallery/upload-client";
import { ACCEPT_ATTRIBUTE, GALLERY_CATEGORIES } from "@/lib/gallery/media";
import type { GalleryItemView } from "@/lib/gallery/data";

type UploadStage =
  | { phase: "idle" }
  | { phase: "picked"; file: File; caption: string; category: string }
  | { phase: "uploading"; file: File; caption: string; category: string; progress: number };

export function GalleryView({
  items,
  canManage,
  disabledReason,
}: {
  items: GalleryItemView[];
  canManage: boolean;
  disabledReason?: string;
}) {
  const [list, setList] = React.useState(items);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [stage, setStage] = React.useState<UploadStage>({ phase: "idle" });
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  function openPicker() {
    if (!canManage) {
      toast.error(disabledReason ?? "Uploads aren't available yet.");
      return;
    }
    fileInputRef.current?.click();
  }

  function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setStage({ phase: "picked", file, caption: "", category: GALLERY_CATEGORIES[0].slug });
    setDialogOpen(true);
  }

  async function submitUpload() {
    if (stage.phase !== "picked") return;
    const { file, caption, category } = stage;
    if (caption.trim().length < 2) {
      toast.error("Add a short caption first.");
      return;
    }

    setStage({ phase: "uploading", file, caption, category, progress: 0 });
    try {
      const result = await uploadGalleryFile(file, { caption, category }, (progress) =>
        setStage((s) => (s.phase === "uploading" ? { ...s, progress } : s))
      );
      if (!result.ok) {
        toast.error(result.error ?? "Upload failed.");
        setStage({ phase: "picked", file, caption, category });
        return;
      }
      toast.success("Added to the gallery");
      setDialogOpen(false);
      setStage({ phase: "idle" });
      // The list is revalidated server-side too; refreshing locally avoids
      // waiting on a full navigation to see the new item.
      setList((prev) => [
        {
          id: `pending-${Date.now()}`,
          type: file.type.startsWith("video/") ? "VIDEO" : "IMAGE",
          url: URL.createObjectURL(file),
          posterUrl: null,
          caption,
          category,
          isPublished: true,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    } catch (err) {
      toast.error(err instanceof GalleryUploadError ? err.message : "Upload failed.");
      setStage({ phase: "picked", file, caption, category });
    }
  }

  async function handleDelete(id: string) {
    if (id.startsWith("pending-") || id.startsWith("demo-")) {
      // A demo row (no database) or the optimistic placeholder just inserted —
      // neither has a real row to delete server-side.
      setList((prev) => prev.filter((i) => i.id !== id));
      return;
    }
    setDeletingId(id);
    const result = await deleteGalleryItem(id);
    setDeletingId(null);
    if (result.ok) {
      setList((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed from the gallery");
    } else {
      toast.error(result.error ?? "Couldn't delete that item.");
    }
  }

  const uploading = stage.phase === "uploading";

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTRIBUTE}
        className="hidden"
        onChange={onFilePicked}
        aria-label="Choose a photo or video to upload"
      />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        <button
          onClick={openPicker}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
        >
          <Upload className="size-6" />
          <span className="text-sm font-medium">Upload Photo or Video</span>
        </button>

        {list.map((item) => (
          <Card key={item.id} className="group relative aspect-square overflow-hidden p-0">
            {item.type === "VIDEO" ? (
              <video
                src={item.url}
                muted
                preload="metadata"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- one-off local preview + external R2 URLs
              <img src={item.url} alt="Gallery item" className="absolute inset-0 size-full object-cover" />
            )}
            {item.type === "VIDEO" && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <PlayCircle className="size-9 text-cream drop-shadow" />
              </div>
            )}
            <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="flex justify-end">
                <Button
                  size="icon"
                  variant="destructive"
                  className="size-7"
                  disabled={deletingId === item.id}
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Remove ${item.caption}`}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
            <Badge variant="secondary" className="absolute bottom-2 left-2 text-[10px]">
              {item.category}
            </Badge>
          </Card>
        ))}
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (uploading) return; // don't let the sheet close mid-upload
          setDialogOpen(open);
          if (!open) setStage({ phase: "idle" });
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add to gallery</DialogTitle>
            <DialogDescription>
              {stage.phase !== "idle" ? stage.file.name : "Choose a caption and category."}
            </DialogDescription>
          </DialogHeader>

          {stage.phase !== "idle" && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="gallery-caption">Caption</Label>
                <Textarea
                  id="gallery-caption"
                  value={stage.caption}
                  disabled={uploading}
                  onChange={(e) =>
                    setStage((s) => (s.phase === "idle" ? s : { ...s, caption: e.target.value }))
                  }
                  placeholder="e.g. Three-tier wedding cake with sugar florals"
                  rows={2}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label>Category</Label>
                <Select
                  value={stage.category}
                  disabled={uploading}
                  onValueChange={(v) =>
                    setStage((s) => (s.phase === "idle" ? s : { ...s, category: v }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((c) => (
                      <SelectItem key={c.slug} value={c.slug}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {stage.phase === "uploading" && (
                <div className="flex flex-col gap-1.5">
                  <Progress value={stage.progress} />
                  <p className="text-xs text-muted-foreground">Uploading… {stage.progress}%</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" disabled={uploading} onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitUpload} disabled={uploading}>
              {uploading ? "Uploading…" : "Add to gallery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
