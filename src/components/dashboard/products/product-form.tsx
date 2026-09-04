"use client";

import * as React from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Save, X, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { slugify } from "@/lib/utils";
import { ALL_SIZES, ALL_FLAVOURS, CATEGORY_OPTIONS } from "@/lib/dashboard/product-constants";
import type { ProductRow } from "@/lib/dashboard/products";
import type { ProductActionState } from "@/lib/dashboard/product-actions";

type FormAction = (prev: ProductActionState, formData: FormData) => Promise<ProductActionState>;

export function ProductForm({
  action,
  initial,
  heading,
}: {
  action: FormAction;
  initial?: ProductRow;
  heading: { title: string; description: string };
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState<ProductActionState, FormData>(action, {});

  const [name, setName] = React.useState(initial?.name ?? "");
  const [slug, setSlug] = React.useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = React.useState(Boolean(initial));
  const [sizes, setSizes] = React.useState<Set<string>>(new Set(initial?.sizes ?? []));
  const [flavours, setFlavours] = React.useState<Set<string>>(new Set(initial?.flavours ?? []));
  const [images, setImages] = React.useState<string[]>(initial?.images.length ? initial.images : [""]);

  React.useEffect(() => {
    if (state.ok) toast.success(initial ? "Product updated" : "Product created");
    else if (state.error) toast.error(state.error);
  }, [state, initial]);

  const err = state.fieldErrors ?? {};

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  function toggleSet(set: Set<string>, setter: (s: Set<string>) => void, value: string) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  return (
    <form action={formAction} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>{heading.title}</CardTitle>
              <CardDescription>{heading.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-4 p-0">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-name">Product name</Label>
                <Input
                  id="pf-name"
                  name="name"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Ivory Rose Wedding Tier"
                  required
                />
                {err.name && <p className="text-xs text-destructive">{err.name}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-slug">URL slug</Label>
                <Input
                  id="pf-slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => {
                    setSlugTouched(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="ivory-rose-wedding-tier"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Appears in the product&apos;s web address. Lowercase letters, numbers, and hyphens only.
                </p>
                {err.slug && <p className="text-xs text-destructive">{err.slug}</p>}
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-description">Description</Label>
                <Textarea
                  id="pf-description"
                  name="description"
                  defaultValue={initial?.description}
                  placeholder="What makes this cake worth ordering — flavours, occasion, what's included."
                  rows={4}
                  required
                />
                {err.description && <p className="text-xs text-destructive">{err.description}</p>}
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pf-category">Category</Label>
                  <Select name="categorySlug" defaultValue={initial?.categorySlug}>
                    <SelectTrigger id="pf-category">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORY_OPTIONS.map((c) => (
                        <SelectItem key={c.slug} value={c.slug}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {err.categorySlug && <p className="text-xs text-destructive">{err.categorySlug}</p>}
                </div>
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="pf-servings">Servings</Label>
                  <Input
                    id="pf-servings"
                    name="servings"
                    defaultValue={initial?.servings}
                    placeholder="e.g. 20-25 slices"
                    required
                  />
                  {err.servings && <p className="text-xs text-destructive">{err.servings}</p>}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Sizes &amp; flavours</CardTitle>
              <CardDescription>What a customer can choose when ordering this cake</CardDescription>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-5 p-0">
              <div>
                <Label className="mb-2 block">Sizes offered</Label>
                <div className="flex flex-wrap gap-3">
                  {ALL_SIZES.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        name="sizes"
                        value={s}
                        checked={sizes.has(s)}
                        onCheckedChange={() => toggleSet(sizes, setSizes, s)}
                      />
                      {s}
                    </label>
                  ))}
                </div>
                {err.sizes && <p className="mt-1.5 text-xs text-destructive">{err.sizes}</p>}
              </div>
              <div>
                <Label className="mb-2 block">Flavours offered</Label>
                <div className="flex flex-wrap gap-3">
                  {ALL_FLAVOURS.map((f) => (
                    <label key={f} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        name="flavours"
                        value={f}
                        checked={flavours.has(f)}
                        onCheckedChange={() => toggleSet(flavours, setFlavours, f)}
                      />
                      {f}
                    </label>
                  ))}
                </div>
                {err.flavours && <p className="mt-1.5 text-xs text-destructive">{err.flavours}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Images</CardTitle>
              <CardDescription>
                Paste image URLs — the first is used as the cover photo. Direct photo upload works
                the same way the gallery&apos;s does once storage is connected.
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-2 p-0">
              {images.map((url, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Input
                    name="images"
                    value={url}
                    onChange={(e) => setImages((prev) => prev.map((v, idx) => (idx === i ? e.target.value : v)))}
                    placeholder="https://… or /images/…"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    disabled={images.length === 1}
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                    aria-label="Remove image"
                  >
                    <X className="size-4" />
                  </Button>
                </div>
              ))}
              {err.images && <p className="text-xs text-destructive">{err.images}</p>}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-1 self-start"
                disabled={images.length >= 8}
                onClick={() => setImages((prev) => [...prev, ""])}
              >
                <Plus className="size-3.5" /> Add image
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-4 p-0">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-price">Price (KES)</Label>
                <Input
                  id="pf-price"
                  name="price"
                  type="number"
                  min={0}
                  step="1"
                  defaultValue={initial?.price}
                  required
                />
                {err.price && <p className="text-xs text-destructive">{err.price}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-compare">Compare-at price (optional)</Label>
                <Input
                  id="pf-compare"
                  name="compareAtPrice"
                  type="number"
                  min={0}
                  step="1"
                  defaultValue={initial?.compareAtPrice ?? undefined}
                />
                <p className="text-xs text-muted-foreground">Shown crossed out — for a discounted item.</p>
                {err.compareAtPrice && <p className="text-xs text-destructive">{err.compareAtPrice}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className="p-6 py-6">
            <CardHeader className="p-0">
              <CardTitle>Production</CardTitle>
            </CardHeader>
            <CardContent className="mt-4 flex flex-col gap-4 p-0">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-prep">Minimum lead time (hours)</Label>
                <Input
                  id="pf-prep"
                  name="prepTimeHours"
                  type="number"
                  min={1}
                  defaultValue={initial?.prepTimeHours ?? 24}
                  required
                />
                {err.prepTimeHours && <p className="text-xs text-destructive">{err.prepTimeHours}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-points">Production points</Label>
                <Input
                  id="pf-points"
                  name="productionPoints"
                  type="number"
                  min={1}
                  defaultValue={initial?.productionPoints ?? 1}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  How much of a day&apos;s baking capacity this one order uses.
                </p>
                {err.productionPoints && <p className="text-xs text-destructive">{err.productionPoints}</p>}
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="pf-tags">Tags</Label>
                <Input id="pf-tags" name="tags" defaultValue={initial?.tags.join(", ")} placeholder="bestseller, floral, tiered" />
                <p className="text-xs text-muted-foreground">Comma-separated. Used for search and filters.</p>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-border px-3.5 py-3">
                <div>
                  <p className="text-sm font-medium">Available for order</p>
                  <p className="text-xs text-muted-foreground">Off hides it from the storefront</p>
                </div>
                <Switch name="isAvailable" defaultChecked={initial?.isAvailable ?? true} />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button type="button" variant="outline" className="flex-1" onClick={() => router.push("/dashboard/products")}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={pending}>
              <Save className="size-4" /> {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
