"use client";

import * as React from "react";
import { Bookmark, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatKes, formatDate } from "@/lib/utils";
import { useCart, type CartItem } from "@/lib/cart-context";
import { getSavedCarts, saveCart, deleteSavedCart, type SavedCart } from "@/lib/saved-carts";

/**
 * Lets a customer park the current cart under a name and restore it later —
 * useful when they're pricing up several event options before committing.
 */
export function SavedCartsPanel() {
  const { items, addItem } = useCart();
  const [saved, setSaved] = React.useState<SavedCart[]>([]);
  const [name, setName] = React.useState("");
  const [hydrated, setHydrated] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage read must happen post-mount
    setSaved(getSavedCarts());
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    const cart = saveCart(name, items);
    setSaved((prev) => [cart, ...prev]);
    setName("");
    toast.success(`Saved "${cart.name}" — restore it any time.`);
  }

  function handleRestore(cart: SavedCart) {
    cart.items.forEach((item: CartItem) => addItem(item));
    toast.success(`Restored "${cart.name}" into your cart.`);
  }

  function handleDelete(id: string, cartName: string) {
    deleteSavedCart(id);
    setSaved((prev) => prev.filter((c) => c.id !== id));
    toast.message(`Deleted "${cartName}".`);
  }

  if (!hydrated) return null;

  return (
    <Card className="gap-5 p-6">
      <CardHeader className="p-0">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bookmark className="size-4 text-berry" />
          Saved Carts
        </CardTitle>
        <CardDescription>
          Comparing options? Park this cart and come back to it later.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 p-0">
        {items.length > 0 && (
          <form onSubmit={handleSave} className="flex gap-2">
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Mum's birthday options"
              aria-label="Name this cart"
            />
            <Button type="submit" variant="outline" className="shrink-0">
              Save cart
            </Button>
          </form>
        )}

        {saved.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nothing saved yet. Name the cart above to keep it for later.
          </p>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {saved.map((cart) => (
              <li
                key={cart.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border/70 p-3.5"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{cart.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {cart.items.length} {cart.items.length === 1 ? "item" : "items"} &middot;{" "}
                    {formatKes(cart.subtotal)} &middot; saved {formatDate(cart.savedAt)}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleRestore(cart)}
                    aria-label={`Restore ${cart.name}`}
                  >
                    <RotateCcw className="size-4" />
                    Restore
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(cart.id, cart.name)}
                    aria-label={`Delete ${cart.name}`}
                  >
                    <Trash2 className="size-4 text-destructive" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
