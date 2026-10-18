// Kitchen Buddy original recipes. Idempotent: only add missing recipes;
// never replace saved favorites, personal photographs, or edited recipes.
(function(){
'use strict';
const incoming=[
  {
    "id": "kb-lemon-garlic-shrimp-scampi-rosemary-focaccia",
    "name": "Lemon Garlic Shrimp Scampi with Parmesan Angel Hair & Rosemary Focaccia",
    "description": "Made with frozen shrimp, whole wheat angel hair, lemon, Parmesan and rosemary garlic sourdough focaccia · 2 servings · about 30 minutes after thawing",
    "servings": 2,
    "categories": [
      "Dinner",
      "Seafood",
      "Pasta"
    ],
    "tags": [],
    "timeMinutes": 30,
    "photo": "./photo-pending.svg",
    "photoKind": "awaiting-actual-finished-dish-photo",
    "recipeOrigin": "kitchen-buddy-original",
    "recipeVersion": 1,
    "ingredients": [
      "10 oz frozen raw shrimp, thawed, peeled and deveined",
      "5 oz dry whole wheat angel hair pasta",
      "1 garlic clove, finely minced",
      "1 lemon, for zest and 1–2 tsp juice to start",
      "2 tbsp unsalted butter (or extra olive oil)",
      "1 tbsp olive oil",
      "2–3 tbsp grated Parmesan or Parmigiano-Reggiano",
      "4 oz Nature's Promise rosemary garlic sourdough focaccia, about 2 portions",
      "Black pepper and a pinch of salt, to taste",
      "½ cup pasta cooking water (reserved, not a shopping item)"
    ],
    "items": [
      {
        "name": "frozen raw shrimp, peeled and deveined",
        "qty": 10,
        "unit": "oz"
      },
      {
        "name": "whole wheat angel hair pasta, dry",
        "qty": 5,
        "unit": "oz"
      },
      {
        "name": "garlic clove",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "lemon",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "unsalted butter",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "grated Parmesan cheese",
        "qty": 3,
        "unit": "tbsp"
      },
      {
        "name": "Nature's Promise rosemary garlic sourdough focaccia",
        "qty": 4,
        "unit": "oz"
      },
      {
        "name": "black pepper",
        "qty": 0.125,
        "unit": "tsp"
      },
      {
        "name": "salt",
        "qty": 0.125,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Thaw and dry the shrimp",
        "body": "Thaw the shrimp completely following the package directions, or in a leakproof bag immersed in cold water. Keep it cold; never leave it at room temperature. Drain and pat dry, then lightly season with salt and black pepper. If your frozen shrimp are already COOKED, skip the raw-shrimp sauté step and add them only while tossing the hot pasta so they warm through.",
        "seconds": 0
      },
      {
        "title": "Bake the rosemary focaccia",
        "body": "Heat the oven and bake two portions of the Nature's Promise rosemary garlic sourdough focaccia according to its TAKE AND BAKE package directions. Set aside once warm and crisp. The package determines the oven temperature and bake time.",
        "seconds": 0
      },
      {
        "title": "Boil the whole wheat angel hair",
        "body": "Bring a pot of lightly salted water to a boil. Cook 5 oz dry whole wheat angel hair following its package directions, usually about 3–5 minutes, until just al dente. Before draining, reserve ½ cup of starchy pasta water.",
        "seconds": 240
      },
      {
        "title": "Sauté the raw shrimp",
        "body": "Heat 1 tbsp olive oil in a skillet over medium-high heat. Add the thawed RAW shrimp in a single layer. Cook about 1–2 minutes per side, adjusting for size, until opaque and cooked through (145°F if checking with a food thermometer). Transfer to a clean plate. If using precooked shrimp, skip this step.",
        "seconds": 240
      },
      {
        "title": "Gently toast the garlic in butter",
        "body": "Reduce skillet heat to medium-low. Add 2 tbsp unsalted butter (or olive oil), then the minced garlic clove. Stir for about 30–45 seconds, just until fragrant. Do not let the garlic brown.",
        "seconds": 45
      },
      {
        "title": "Build the lemon butter sauce",
        "body": "Stir in ¼ cup of the reserved pasta water and about ½ tsp finely grated lemon zest. Let it bubble gently for a few seconds while stirring. Keep the remaining pasta water for adjusting the sauce.",
        "seconds": 0
      },
      {
        "title": "Toss shrimp and pasta",
        "body": "Add drained angel hair and cooked shrimp to the skillet and toss over low heat for 1–2 minutes. Add reserved pasta water a splash at a time until the sauce looks silky instead of dry. Turn off the heat, add 1–2 tsp fresh lemon juice, then taste. Add more lemon only if you want it brighter.",
        "seconds": 90
      },
      {
        "title": "Add Parmesan and plate",
        "body": "Off the heat, sprinkle 2–3 tbsp grated Parmesan over the pasta. Toss gently and season with black pepper to taste. Divide between two bowls. Serve with the warm, crispy rosemary garlic focaccia for soaking up the sauce.",
        "seconds": 0
      },
      {
        "title": "Save leftovers safely",
        "body": "Refrigerate any leftovers promptly in shallow, covered containers within 2 hours. Reheat shrimp and pasta thoroughly; for best texture, add a splash of water while warming. You can record leftovers under My Fridge.",
        "seconds": 0
      }
    ]
  }
];
let added=0;
for (const recipe of incoming){
  if(!state.recipes.some(existing=>existing.id===recipe.id)){
    state.recipes.push(recipe);
    added++;
  }
}
if(added) save();
})();
