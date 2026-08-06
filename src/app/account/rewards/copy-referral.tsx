"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CopyReferral({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);
  const link = `https://phibakes.co.ke/r/${code}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      toast.success("Referral link copied to clipboard.");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy the link manually.");
    }
  }

  return (
    <div className="flex flex-col gap-2 sm:flex-row">
      <Input readOnly value={link} className="font-mono text-xs sm:text-sm" />
      <Button onClick={copy} variant={copied ? "secondary" : "gold"} className="shrink-0">
        {copied ? <Check /> : <Copy />} {copied ? "Copied" : "Copy Link"}
      </Button>
    </div>
  );
}
