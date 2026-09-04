import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { AdminNotice } from "@/components/dashboard/admin-notice";
import { ProductsTable } from "@/components/dashboard/products/products-table";
import { Button } from "@/components/ui/button";
import { getDashboardProducts } from "@/lib/dashboard/products";
import { getCurrentUser } from "@/lib/auth/dal";
import { isDatabaseConfigured, databaseSetupHint } from "@/lib/db-status";

export const metadata = { title: "Products" };

export default async function ProductsPage() {
  const [user, { products, live }] = await Promise.all([getCurrentUser(), getDashboardProducts()]);
  const isOwner = user?.role === "OWNER";
  const databaseReady = isDatabaseConfigured();
  const canEdit = isOwner && databaseReady;

  return (
    <div>
      <PageHeader
        title="Products"
        description={
          live
            ? `${products.length} ${products.length === 1 ? "product" : "products"} in the catalog`
            : `${products.length} sample products (demo data)`
        }
        actions={
          canEdit ? (
            <Button asChild>
              <Link href="/dashboard/products/new">
                <Plus className="size-4" /> Add Product
              </Link>
            </Button>
          ) : undefined
        }
      />
      <AdminNotice
        isOwner={isOwner}
        databaseReady={databaseReady}
        databaseHint={databaseSetupHint()}
      />
      <ProductsTable products={products} canEdit={canEdit} />
    </div>
  );
}
