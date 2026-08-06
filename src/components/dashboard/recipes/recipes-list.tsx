import Image from "next/image";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Cake } from "@/types";
import { getRecipeForCake } from "@/lib/data/recipes";

export function RecipesList({ cakes }: { cakes: Cake[] }) {
  const withRecipes = cakes.filter((c) => getRecipeForCake(c.name));

  return (
    <Card className="p-2 sm:p-4">
      <Accordion type="multiple" className="w-full">
        {withRecipes.map((cake) => {
          const recipe = getRecipeForCake(cake.name)!;
          return (
            <AccordionItem key={cake.id} value={cake.id}>
              <AccordionTrigger className="px-3">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 shrink-0 overflow-hidden rounded-lg">
                    <Image src={cake.images[0]} alt={cake.name} fill sizes="44px" className="object-cover" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium">{cake.name}</p>
                    <p className="text-xs text-muted-foreground">{recipe.yieldNote}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-3">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Ingredients (BOM)
                    </p>
                    <ul className="flex flex-col gap-1.5">
                      {recipe.ingredients.map((ing) => (
                        <li key={ing.inventoryName} className="flex items-center justify-between text-sm">
                          <span>{ing.inventoryName}</span>
                          <Badge variant="secondary">
                            {ing.quantity} {ing.unit}
                          </Badge>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Instructions
                    </p>
                    <ol className="flex list-decimal flex-col gap-1.5 pl-4 text-sm text-muted-foreground">
                      {recipe.instructions.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Card>
  );
}
