// Simple bill-of-materials (BOM) tying select CAKES to INVENTORY items.
export type RecipeIngredient = { inventoryName: string; quantity: number; unit: string };

export type Recipe = {
  cakeName: string;
  yieldNote: string;
  ingredients: RecipeIngredient[];
  instructions: string[];
};

export const RECIPES: Recipe[] = [
  {
    cakeName: "Ivory Rose Wedding Tier",
    yieldNote: "3-tier, serves ~120",
    ingredients: [
      { inventoryName: "Wheat Flour", quantity: 9, unit: "kg" },
      { inventoryName: "White Sugar", quantity: 6, unit: "kg" },
      { inventoryName: "Unsalted Butter", quantity: 4, unit: "kg" },
      { inventoryName: "Free-range Eggs", quantity: 3, unit: "trays" },
      { inventoryName: "Fondant Icing", quantity: 6, unit: "kg" },
      { inventoryName: "Cake Boards (Gold, 12-inch)", quantity: 3, unit: "pieces" },
    ],
    instructions: [
      "Bake three tiers separately at 165°C; cool fully before stacking.",
      "Crumb-coat each tier, chill, then apply fondant and smooth with a bench scraper.",
      "Dowel and stack tiers on gold boards; finish with fresh floral piping detail.",
    ],
  },
  {
    cakeName: "Chocolate Drip Celebration Cake",
    yieldNote: "1kg round, serves ~12",
    ingredients: [
      { inventoryName: "Wheat Flour", quantity: 0.8, unit: "kg" },
      { inventoryName: "Dark Chocolate Couverture", quantity: 0.5, unit: "kg" },
      { inventoryName: "Fresh Cream", quantity: 0.4, unit: "litres" },
      { inventoryName: "Free-range Eggs", quantity: 0.5, unit: "trays" },
      { inventoryName: "Unsalted Butter", quantity: 0.3, unit: "kg" },
    ],
    instructions: [
      "Bake two chocolate sponge layers; cool and level.",
      "Fill and crumb-coat with chocolate ganache buttercream.",
      "Chill, then pour warm ganache drip around the edge and finish top.",
    ],
  },
  {
    cakeName: "Scholar's Cap Graduation Cake",
    yieldNote: "1kg sculpted, serves ~10",
    ingredients: [
      { inventoryName: "Wheat Flour", quantity: 0.7, unit: "kg" },
      { inventoryName: "White Sugar", quantity: 0.5, unit: "kg" },
      { inventoryName: "Fondant Icing", quantity: 0.6, unit: "kg" },
      { inventoryName: "Gel Food Colouring Set", quantity: 0.1, unit: "sets" },
    ],
    instructions: [
      "Bake and carve sponge into cap base and brim shapes.",
      "Cover in black fondant; sculpt tassel from gum paste.",
      "Airbrush gold detail on the mortarboard edge.",
    ],
  },
  {
    cakeName: "Signature Vanilla Cupcakes (Box of 12)",
    yieldNote: "Box of 12",
    ingredients: [
      { inventoryName: "Wheat Flour", quantity: 0.5, unit: "kg" },
      { inventoryName: "White Sugar", quantity: 0.4, unit: "kg" },
      { inventoryName: "Unsalted Butter", quantity: 0.3, unit: "kg" },
      { inventoryName: "Vanilla Extract", quantity: 0.05, unit: "litres" },
      { inventoryName: "Free-range Eggs", quantity: 0.25, unit: "trays" },
    ],
    instructions: [
      "Cream butter and sugar, fold in flour and vanilla, portion into liners.",
      "Bake at 175°C for 18 minutes; cool fully.",
      "Pipe vanilla buttercream swirl and box for pickup or delivery.",
    ],
  },
  {
    cakeName: "Today's Red Velvet Cake",
    yieldNote: "1kg round, serves ~10",
    ingredients: [
      { inventoryName: "Wheat Flour", quantity: 0.6, unit: "kg" },
      { inventoryName: "White Sugar", quantity: 0.5, unit: "kg" },
      { inventoryName: "Fresh Cream", quantity: 0.3, unit: "litres" },
      { inventoryName: "Gel Food Colouring Set", quantity: 0.05, unit: "sets" },
      { inventoryName: "Free-range Eggs", quantity: 0.4, unit: "trays" },
    ],
    instructions: [
      "Bake red velvet sponge layers; cool completely.",
      "Fill and coat with cream cheese frosting.",
      "Finish with red velvet crumb dusting around the base.",
    ],
  },
  {
    cakeName: "Executive Dessert Table",
    yieldNote: "Serves ~60 guests (assorted)",
    ingredients: [
      { inventoryName: "Dark Chocolate Couverture", quantity: 1.2, unit: "kg" },
      { inventoryName: "Wheat Flour", quantity: 1.5, unit: "kg" },
      { inventoryName: "Fresh Cream", quantity: 1, unit: "litres" },
      { inventoryName: "Cake Boxes (10-inch)", quantity: 4, unit: "pieces" },
    ],
    instructions: [
      "Prepare assorted tarts, brownies and mini cakes in batches.",
      "Plate on tiered stands with branded signage.",
      "Box surplus per dessert type for easy replenishment during the event.",
    ],
  },
];

export function getRecipeForCake(cakeName: string) {
  return RECIPES.find((r) => r.cakeName === cakeName);
}
