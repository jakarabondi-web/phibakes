import { redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductForm } from "@/components/dashboard/products/product-form";
import { createProduct } from "@/lib/dashboard/product-actions";
import { getCurrentUser } from "@/lib/auth/dal";
import { isDatabaseConfigured } from "@/lib/db-status";

export const metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const user = await getCurrentUser();
  // Mirrors the server action's own gate — this just avoids showing a form
  // that would only fail on submit.
  if (user?.role !== "OWNER" || !isDatabaseConfigured()) redirect("/dashboard/products");

  return (
    <div>
      <PageHeader title="Add Product" description="Create a new cake in the catalog" />
      <ProductForm
        action={createProduct}
        heading={{ title: "Product details", description: "The essentials customers see first" }}
      />
    </div>
  );
}
