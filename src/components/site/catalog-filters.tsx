"use client";

import * as React from "react";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CakeCard } from "@/components/site/cake-card";
import { CATEGORIES } from "@/lib/data";
import type { Cake, CakeCategorySlug, CakeFlavour, CakeSize } from "@/types";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Highest Rated" },
] as const;

type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export function CatalogFilters({ cakes }: { cakes: Cake[] }) {
  const [category, setCategory] = React.useState<CakeCategorySlug | "all">("all");
  const [flavour, setFlavour] = React.useState<CakeFlavour | "all">("all");
  const [size, setSize] = React.useState<CakeSize | "all">("all");
  const [sort, setSort] = React.useState<SortValue>("featured");

  const flavours = React.useMemo(
    () => Array.from(new Set(cakes.flatMap((c) => c.flavours))).sort(),
    [cakes]
  );
  const sizes = React.useMemo(
    () => Array.from(new Set(cakes.flatMap((c) => c.sizes))).sort(),
    [cakes]
  );

  const filtered = React.useMemo(() => {
    let list = cakes.filter((c) => {
      if (category !== "all" && c.category !== category) return false;
      if (flavour !== "all" && !c.flavours.includes(flavour)) return false;
      if (size !== "all" && !c.sizes.includes(size)) return false;
      return true;
    });

    list = [...list];
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => Number(b.tags.includes("Bestseller")) - Number(a.tags.includes("Bestseller")));

    return list;
  }, [cakes, category, flavour, size, sort]);

  const hasActiveFilters = category !== "all" || flavour !== "all" || size !== "all";

  const resetFilters = () => {
    setCategory("all");
    setFlavour("all");
    setSize("all");
  };

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <SlidersHorizontal className="size-4 text-berry" />
          Filter &amp; Sort
        </div>

        <Select value={category} onValueChange={(v) => setCategory(v as CakeCategorySlug | "all")}>
          <SelectTrigger size="sm" aria-label="Filter by category" className="w-full sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {CATEGORIES.map((c) => (
              <SelectItem key={c.slug} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={flavour} onValueChange={(v) => setFlavour(v as CakeFlavour | "all")}>
          <SelectTrigger size="sm" aria-label="Filter by price" className="w-full sm:w-40">
            <SelectValue placeholder="Flavour" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Flavours</SelectItem>
            {flavours.map((f) => (
              <SelectItem key={f} value={f}>
                {f}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={size} onValueChange={(v) => setSize(v as CakeSize | "all")}>
          <SelectTrigger size="sm" aria-label="Sort cakes" className="w-full sm:w-36">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sizes</SelectItem>
            {sizes.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="sm:ml-auto sm:flex sm:items-center sm:gap-3">
          <Select value={sort} onValueChange={(v) => setSort(v as SortValue)}>
            <SelectTrigger size="sm" aria-label="Filter by occasion" className="w-full sm:w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {category !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1.5">
              {CATEGORIES.find((c) => c.slug === category)?.name}
              <button onClick={() => setCategory("all")} aria-label="Clear category filter">
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {flavour !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1.5">
              {flavour}
              <button onClick={() => setFlavour("all")} aria-label="Clear flavour filter">
                <X className="size-3" />
              </button>
            </Badge>
          )}
          {size !== "all" && (
            <Badge variant="secondary" className="gap-1.5 pr-1.5">
              {size}
              <button onClick={() => setSize("all")} aria-label="Clear size filter">
                <X className="size-3" />
              </button>
            </Badge>
          )}
          <Button variant="link" size="sm" onClick={resetFilters} className="h-auto p-0 text-xs">
            Clear all
          </Button>
        </div>
      )}

      <p className="mt-6 text-sm text-muted-foreground">
        Showing <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
        {filtered.length === 1 ? "cake" : "cakes"}
      </p>

      {filtered.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((cake) => (
            <CakeCard key={cake.id} cake={cake} />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
          <p className="font-display text-lg font-semibold text-foreground">No cakes match your filters</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Try adjusting your filters, or explore our full collection.
          </p>
          <Button className="mt-6" variant="outline" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </div>
  );
}
