"use client";

import * as React from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Trash2, Upload } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/data/categories";

export function GalleryView({ images }: { images: string[] }) {
  const [items, setItems] = React.useState(
    images.map((src, i) => ({ src, category: CATEGORIES[i % CATEGORIES.length].name }))
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      <button
        onClick={() => toast.info("Upload flow is a demo — connect storage to enable uploads.")}
        className="flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
      >
        <Upload className="size-6" />
        <span className="text-sm font-medium">Upload Image</span>
      </button>

      {items.map((item, i) => (
        <Card key={i} className="group relative aspect-square overflow-hidden p-0">
          <Image src={item.src} alt="Gallery item" fill sizes="220px" className="object-cover" />
          <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-t from-black/60 via-transparent to-transparent p-2.5 opacity-0 transition-opacity group-hover:opacity-100">
            <div className="flex justify-end">
              <Button
                size="icon"
                variant="destructive"
                className="size-7"
                onClick={() => {
                  setItems((prev) => prev.filter((_, idx) => idx !== i));
                  toast.success("Image removed from gallery");
                }}
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
  );
}
