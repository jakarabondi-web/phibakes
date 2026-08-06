"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function RedeemButton({ title, affordable }: { title: string; affordable: boolean }) {
  return (
    <Button
      className="mt-4 w-full"
      variant={affordable ? "default" : "outline"}
      disabled={!affordable}
      onClick={() => toast.success(`Redeemed: ${title}. Check your email for your voucher code.`)}
    >
      {affordable ? "Redeem" : "Not enough points"}
    </Button>
  );
}
