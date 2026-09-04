import { notFound, redirect } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProductForm } from "@/components/dashboard/products/product-form";
import { getDashboardProductById } from "@/lib/dashboard/products";
import { updateProduct } from "@/lib/dashboard/product-actions";
import { getCurrentUser } from "@/lib/auth/dal";
import { isDatabaseConfigured } from "@/lib/db-status";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { product } = await getDashboardProductById(id);
  return { title: product ? `Edit ${product.name}` : "Edit Product" };
}

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role !== "OWNER" || !isDatabaseConfigured()) redirect("/dashboard/products");

  const { product } = await getDashboardProductById(id);
  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, id);

  return (
    <div>
      <PageHeader title={`Edit ${product.name}`} description={`/${product.slug}`} />
      <ProductForm
        action={boundUpdate}
        initial={product}
        heading={{ title: "Product details", description: "The essentials customers see first" }}
      />
    </div>
  );
}
