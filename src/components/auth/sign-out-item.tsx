"use client";

import { LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOut } from "@/lib/auth/actions";

/**
 * Sign-out as a real form submission rather than a client-side redirect — the
 * session cookie is httpOnly, so only the server can clear it.
 */
export function SignOutItem() {
  return (
    <form action={signOut}>
      <DropdownMenuItem
        variant="destructive"
        asChild
        onSelect={(e) => {
          // Let the form submit instead of the menu closing first and cancelling it.
          e.preventDefault();
          (e.currentTarget as HTMLElement).closest("form")?.requestSubmit();
        }}
      >
        <button type="submit" className="w-full cursor-pointer">
          <LogOut className="size-4" /> Sign out
        </button>
      </DropdownMenuItem>
    </form>
  );
}
