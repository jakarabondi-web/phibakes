"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/db-status";
import { getCurrentUser } from "@/lib/auth/dal";
import { ALL_FLAVOURS, ALL_SIZES, CATEGORY_OPTIONS, SIZE_ENUM } from "./product-constants";
import { ensureCategory } from "./products";

/**
 * Product catalog mutations. Owner-gated: price and availability are money
 * decisions in the same category as delivery rates (see admin/actions.ts),
 * not day-to-day operations any staff member should be able to change.
 */

export type ProductActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const NO_DB = "Connect a database to manage products — this console is showing the demo catalog.";

async function requireOwner(): Promise<ProductActionState | null> {
  const user = await getCurrentUser();
  if (!user) return { error: "You're signed out. Sign in again to continue." };
  if (user.role !== "OWNER") return { error: "Only the owner can manage the product catalog." };
  return null;
}

function revalidateProductViews(id?: string) {
  revalidatePath("/dashboard/products");
  if (id) revalidatePath(`/dashboard/products/${id}`);
  // There's no layout.tsx under /cakes, so a "layout"-type revalidation has
  // nothing to cascade through — it only refreshes /cakes itself and
  // silently leaves the category and detail pages stale. Each page pattern
  // has to be targeted directly instead; "page" type matches every dynamic
  // instance (every category, every product), not just one literal path —
  // correct even when a product's category changes, since both the old and
  // new category listings need invalidating either way.
  revalidatePath("/cakes");
  revalidatePath("/(site)/cakes/[category]", "page");
  revalidatePath("/(site)/cakes/[category]/[slug]", "page");
  // The homepage's Featured Cakes and Ready Today sections read live
  // products too (lib/catalog.ts) — a "Featured" tag or availability flip
  // needs to show up there as well, not just on the catalog pages.
  revalidatePath("/");
}

const categorySlugs = CATEGORY_OPTIONS.map((c) => c.slug) as [string, ...string[]];

const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Enter a URL slug.")
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  description: z.string().trim().min(10, "Add a short description (at least 10 characters)."),
  categorySlug: z.enum(categorySlugs, { message: "Choose a category." }),
  price: z.coerce.number().positive("Enter a price above zero."),
  compareAtPrice: z.union([z.coerce.number().positive(), z.literal("")]).optional(),
  servings: z.string().trim().min(1, "Enter a servings estimate, e.g. \"20-25 slices\"."),
  prepTimeHours: z.coerce.number().int().min(1, "At least 1 hour."),
  productionPoints: z.coerce.number().int().min(1, "At least 1."),
  isAvailable: z.coerce.boolean(),
  sizes: z.array(z.enum(ALL_SIZES as [string, ...string[]])).min(1, "Select at least one size."),
  flavours: z.array(z.enum(ALL_FLAVOURS as [string, ...string[]])).min(1, "Select at least one flavour."),
  images: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .refine(
          (v) => v.startsWith("/") || /^https?:\/\//.test(v),
          "Each image must be a full URL (https://…) or a site path starting with /."
        )
    )
    .min(1, "Add at least one image.")
    .max(8, "Up to 8 images."),
  tags: z.array(z.string().trim().min(1)).max(10, "Up to 10 tags."),
});

function fieldErrorsFrom(err: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of err.issues) {
    if (issue.path[0]) out[String(issue.path[0])] = issue.message;
  }
  return out;
}

/** Pulls the repeated array fields (sizes[], flavours[], images[], tags[])
 * and the checkbox out of a plain FormData submission. */
function parseProductForm(formData: FormData) {
  return {
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    categorySlug: formData.get("categorySlug"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || "",
    servings: formData.get("servings"),
    prepTimeHours: formData.get("prepTimeHours"),
    productionPoints: formData.get("productionPoints"),
    isAvailable: formData.get("isAvailable") === "on",
    sizes: formData.getAll("sizes"),
    flavours: formData.getAll("flavours"),
    images: formData
      .getAll("images")
      .map((v) => String(v).trim())
      .filter(Boolean),
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
  };
}

export async function createProduct(
  _prev: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  const data = parsed.data;

  let newId: string;
  try {
    const existing = await prisma.product.findUnique({ where: { slug: data.slug }, select: { id: true } });
    if (existing) return { fieldErrors: { slug: "That URL slug is already in use." } };

    const category = await ensureCategory(data.categorySlug);
    const created = await prisma.product.create({
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        categoryId: category.id,
        price: data.price,
        compareAtPrice: data.compareAtPrice === "" ? null : data.compareAtPrice,
        servings: data.servings,
        prepTimeHours: data.prepTimeHours,
        productionPoints: data.productionPoints,
        isAvailable: data.isAvailable,
        sizes: data.sizes.map((s) => SIZE_ENUM[s as keyof typeof SIZE_ENUM]),
        flavours: data.flavours,
        images: data.images,
        tags: data.tags,
      },
      select: { id: true },
    });
    newId = created.id;
  } catch (err) {
    console.error("[products] create failed:", err);
    return { error: "Couldn't create that product. Please try again." };
  }

  revalidateProductViews(newId);
  redirect("/dashboard/products");
}

export async function updateProduct(
  id: string,
  _prev: ProductActionState,
  formData: FormData
): Promise<ProductActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  const parsed = productSchema.safeParse(parseProductForm(formData));
  if (!parsed.success) return { fieldErrors: fieldErrorsFrom(parsed.error) };
  const data = parsed.data;

  try {
    const existing = await prisma.product.findFirst({
      where: { slug: data.slug, NOT: { id } },
      select: { id: true },
    });
    if (existing) return { fieldErrors: { slug: "That URL slug is already in use." } };

    const category = await ensureCategory(data.categorySlug);
    await prisma.product.update({
      where: { id },
      data: {
        slug: data.slug,
        name: data.name,
        description: data.description,
        categoryId: category.id,
        price: data.price,
        compareAtPrice: data.compareAtPrice === "" ? null : data.compareAtPrice,
        servings: data.servings,
        prepTimeHours: data.prepTimeHours,
        productionPoints: data.productionPoints,
        isAvailable: data.isAvailable,
        sizes: data.sizes.map((s) => SIZE_ENUM[s as keyof typeof SIZE_ENUM]),
        flavours: data.flavours,
        images: data.images,
        tags: data.tags,
      },
    });
  } catch (err) {
    console.error("[products] update failed:", err);
    return { error: "Couldn't save those changes. Please try again." };
  }

  revalidateProductViews(id);
  return { ok: true };
}

export async function setProductAvailability(id: string, isAvailable: boolean): Promise<ProductActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  try {
    await prisma.product.update({ where: { id }, data: { isAvailable } });
  } catch (err) {
    console.error("[products] availability toggle failed:", err);
    return { error: "Couldn't update availability. Please try again." };
  }

  revalidateProductViews(id);
  return { ok: true };
}

export async function deleteProduct(id: string): Promise<ProductActionState> {
  const denied = await requireOwner();
  if (denied) return denied;
  if (!isDatabaseConfigured()) return { error: NO_DB };

  try {
    // Past order items keep their own name/price snapshot and only lose the
    // productId back-reference (schema: ON DELETE SET NULL) — deleting a
    // discontinued product never rewrites what a customer was actually sold.
    await prisma.product.delete({ where: { id } });
  } catch (err) {
    console.error("[products] delete failed:", err);
    return { error: "Couldn't delete that product. Please try again." };
  }

  revalidateProductViews();
  return { ok: true };
}
