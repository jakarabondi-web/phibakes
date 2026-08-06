"use client";

import { toast } from "sonner";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ExportMenu({ label = "Export" }: { label?: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="size-4" /> {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toast.success("Export started — CSV will download shortly")}>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Export started — Excel file will download shortly")}>
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Export started — PDF will download shortly")}>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
