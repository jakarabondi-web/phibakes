"use client";

import * as React from "react";
import Image from "next/image";
import { UploadCloud, X, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuilderPhoto } from "./types";

export function StepPhotos({
  value,
  onChange,
}: {
  value: BuilderPhoto[];
  onChange: (v: BuilderPhoto[]) => void;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = React.useState(false);

  function addFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const next: BuilderPhoto[] = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        url: URL.createObjectURL(f),
        name: f.name,
      }));
    onChange([...value, ...next]);
  }

  function removePhoto(id: string) {
    const target = value.find((p) => p.id === id);
    if (target) URL.revokeObjectURL(target.url);
    onChange(value.filter((p) => p.id !== id));
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-foreground">Upload inspiration photos</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Optional, but helpful — share reference photos of cakes or themes you love so our decorators
        can match the look.
      </p>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "mt-8 flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition-colors",
          dragging ? "border-primary bg-blush" : "border-border bg-secondary/30 hover:bg-secondary/50"
        )}
      >
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-berry">
          <UploadCloud className="size-6" />
        </div>
        <p className="text-sm font-medium text-foreground">
          Click to browse or drag &amp; drop photos here
        </p>
        <p className="text-xs text-muted-foreground">PNG, JPG up to a few photos — stored locally in your browser</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {value.length > 0 ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {value.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border">
              <Image src={p.url} alt={p.name} fill unoptimized className="object-cover" />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(p.id);
                }}
                className="absolute top-2 right-2 flex size-7 items-center justify-center rounded-full bg-charcoal/70 text-cream opacity-0 transition-opacity group-hover:opacity-100"
                aria-label={`Remove ${p.name}`}
              >
                <X className="size-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
          <ImageIcon className="size-4" /> No photos uploaded yet — this step is optional.
        </div>
      )}
    </div>
  );
}
