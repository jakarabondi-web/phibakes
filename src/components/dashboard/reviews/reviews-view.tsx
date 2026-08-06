"use client";

import * as React from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatDate, initials } from "@/lib/utils";
import type { CakeReview } from "@/types";

type Row = CakeReview & { cakeName: string };

export function ReviewsView({ reviews }: { reviews: Row[] }) {
  const [ratingFilter, setRatingFilter] = React.useState("all");
  const [drafts, setDrafts] = React.useState<Record<string, string>>({});
  const [replied, setReplied] = React.useState<Record<string, string>>({});

  const filtered = reviews.filter((r) => ratingFilter === "all" || String(r.rating) === ratingFilter);

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="All ratings" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All ratings</SelectItem>
            {[5, 4, 3, 2, 1].map((r) => (
              <SelectItem key={r} value={String(r)}>
                {r} stars
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map((r) => {
          const ownerReply = replied[r.id] ?? r.ownerReply;
          return (
            <Card key={r.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <Avatar className="size-9">
                    <AvatarImage src={r.avatar} alt={r.customerName} />
                    <AvatarFallback>{initials(r.customerName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{r.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {r.cakeName} · {formatDate(r.date)}
                    </p>
                    <div className="mt-1 flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`size-3.5 ${i < r.rating ? "fill-gold text-gold" : "text-border"}`} />
                      ))}
                    </div>
                  </div>
                </div>
                {r.verified && <Badge variant="secondary">Verified</Badge>}
              </div>
              <p className="mt-3 text-sm text-foreground/90">{r.comment}</p>

              {ownerReply ? (
                <div className="mt-3 rounded-lg bg-secondary/60 p-3 text-sm">
                  <p className="text-xs font-semibold text-primary">PhiBakes team reply</p>
                  <p className="mt-1 text-muted-foreground">{ownerReply}</p>
                </div>
              ) : (
                <div className="mt-3 flex flex-col gap-2">
                  <Textarea
                    rows={2}
                    placeholder="Write a reply…"
                    value={drafts[r.id] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.id]: e.target.value }))}
                  />
                  <Button
                    size="sm"
                    className="self-start"
                    onClick={() => {
                      const text = drafts[r.id]?.trim();
                      if (!text) {
                        toast.error("Write a reply before submitting");
                        return;
                      }
                      setReplied((rep) => ({ ...rep, [r.id]: text }));
                      toast.success("Reply posted");
                    }}
                  >
                    Post Reply
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
        {filtered.length === 0 && (
          <Card className="p-8 text-center text-sm text-muted-foreground">No reviews match this filter.</Card>
        )}
      </div>
    </div>
  );
}
