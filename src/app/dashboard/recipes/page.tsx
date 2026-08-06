import { PageHeader } from "@/components/dashboard/page-header";
import { RecipesList } from "@/components/dashboard/recipes/recipes-list";
import { CAKES } from "@/lib/data/cakes";

export const metadata = { title: "Recipes" };

export default function RecipesPage() {
  return (
    <div>
      <PageHeader title="Recipes & BOM" description="Ingredient breakdown per product, mapped to inventory." />
      <RecipesList cakes={CAKES} />
    </div>
  );
}
