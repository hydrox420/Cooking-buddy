// Kitchen Buddy original recipes. Idempotent: only add missing recipes;
// never replace saved favorites, personal photographs, or edited recipes.
(function(){
'use strict';
const incoming=[
{
  "id": "kb-garlic-paprika-turkey-rice-bowl",
  "name": "Garlic & Paprika Turkey Rice Bowl",
  "description": "Mild ground turkey, brown rice, broccoli and peppers; meal-prep friendly · 1 serving · 25–30 min with cooked rice (allow 35–45 min more for dry brown rice).",
  "servings": 1,
  "categories": [
    "Dinner",
    "Meal Prep"
  ],
  "tags": [
    "High protein",
    "Work lunch",
    "Mild"
  ],
  "timeMinutes": 30,
  "photo": "./photo-pending.svg",
  "recipeOrigin": "kitchen-buddy-original",
  "recipeVersion": 1,
  "ingredients": [
    "5–6 oz raw ground turkey",
    "¾ cup COOKED brown rice (or prepare dry rice per package first)",
    "1 cup broccoli, fresh or frozen",
    "½ bell pepper, diced",
    "1 tsp cooking oil",
    "¼ tsp garlic powder",
    "¼ tsp paprika",
    "Black pepper to taste",
    "Small pinch of salt (optional)"
  ],
  "items": [
    {
      "name": "ground turkey",
      "qty": 6,
      "unit": "oz"
    },
    {
      "name": "brown rice, cooked",
      "qty": 0.75,
      "unit": "cup"
    },
    {
      "name": "broccoli florets",
      "qty": 1,
      "unit": "cup"
    },
    {
      "name": "bell pepper",
      "qty": 0.5,
      "unit": "each"
    },
    {
      "name": "cooking oil",
      "qty": 1,
      "unit": "tsp"
    },
    {
      "name": "garlic powder",
      "qty": 0.25,
      "unit": "tsp"
    },
    {
      "name": "paprika",
      "qty": 0.25,
      "unit": "tsp"
    }
  ],
  "steps": [
    {
      "title": "Prepare the rice",
      "body": "If rice is not already cooked, cook brown rice according to package directions first (typically 35–45 minutes). For refrigerated cooked rice, keep chilled until ready to reheat.",
      "seconds": 0
    },
    {
      "title": "Brown and cook the turkey",
      "body": "Heat 1 tsp oil in a skillet over medium heat. Add 5–6 oz RAW ground turkey, break into small pieces, and season with garlic powder, paprika and black pepper. Cook about 8–10 minutes, stirring, until the turkey reaches 165°F internally.",
      "seconds": 600
    },
    {
      "title": "Cook peppers and broccoli",
      "body": "Add diced half bell pepper and 1 cup broccoli. If using FROZEN broccoli, add straight from frozen with a splash of water. Cover and steam 3–4 minutes, then uncover and cook another 2–3 minutes until tender and hot.",
      "seconds": 420
    },
    {
      "title": "Heat the rice and combine",
      "body": "Reheat ¾ cup previously cooked brown rice until steaming hot. Combine with the cooked turkey and vegetables. If using freshly cooked rice, add it directly.",
      "seconds": 180
    },
    {
      "title": "Pack safely for work",
      "body": "Transfer the meal to a shallow food container and refrigerate promptly (within 2 hours of cooking). Transport cold with frozen ice packs or keep refrigerated at work. Reheat the meal to 165°F before eating.",
      "seconds": 0
    }
  ]
},
{
  "id": "kb-baked-salmon-sweet-potato-broccoli",
  "name": "Baked Salmon, Sweet Potato & Broccoli",
  "description": "Made for FROZEN sockeye salmon; no thaw needed · 1 serving · about 45–55 minutes. Thawed salmon alternative included.",
  "servings": 1,
  "categories": [
    "Dinner",
    "Seafood"
  ],
  "tags": [
    "High protein",
    "No butter"
  ],
  "timeMinutes": 50,
  "photo": "./photo-pending.svg",
  "photoKind": "awaiting-actual-finished-dish-photo",
  "recipeOrigin": "kitchen-buddy-original",
  "recipeVersion": 2,
  "ingredients": [
    "5–6 oz FROZEN sockeye salmon (or thawed; see cooking step)",
    "1 medium sweet potato, cut into small cubes",
    "1–2 cups broccoli florets",
    "¼ tsp garlic powder (optional)",
    "¼ tsp paprika (optional)",
    "Black pepper (optional)",
    "1 tsp cooking oil (optional)",
    "Water for steaming broccoli"
  ],
  "items": [
    {
      "name": "frozen sockeye salmon",
      "qty": 6,
      "unit": "oz"
    },
    {
      "name": "sweet potato",
      "qty": 1,
      "unit": "each"
    },
    {
      "name": "broccoli florets",
      "qty": 1.5,
      "unit": "cup"
    },
    {
      "name": "garlic powder",
      "qty": 0.25,
      "unit": "tsp"
    },
    {
      "name": "paprika",
      "qty": 0.25,
      "unit": "tsp"
    },
    {
      "name": "cooking oil (optional)",
      "qty": 1,
      "unit": "tsp"
    }
  ],
  "steps": [
    {
      "title": "Preheat and check packaging",
      "body": "Heat oven to 425°F. This recipe assumes salmon is FROZEN. Remove all store wrapping, plastic and absorbent pads before cooking. Use a baking sheet lined with parchment or foil. If the fish is already thawed, use the shorter timing in step 3.",
      "seconds": 0
    },
    {
      "title": "Start roasting sweet potato",
      "body": "Cut one medium sweet potato into small even cubes. Spread on the sheet and toss with up to 1 tsp oil if available. Roast for 15 minutes.",
      "seconds": 900
    },
    {
      "title": "Add FROZEN salmon (or thawed alternative)",
      "body": "Move the sweet potato to one side. Put the FROZEN 5–6 oz salmon on the sheet, skin-side down if it has skin. Loosely cover the fish with foil (not plastic). Roast 15 minutes. If salmon is THAWED instead, skip this covered stage: season it and roast uncovered about 12–15 minutes total, checking temperature.",
      "seconds": 900
    },
    {
      "title": "Uncover, season and finish frozen salmon",
      "body": "For FROZEN salmon: remove foil carefully, season with optional garlic powder, paprika and black pepper, then roast uncovered about 10–15 more minutes. Check the thickest center with a thermometer: salmon must reach 145°F. Thickness varies; continue in short intervals until done. Remove sweet potato earlier if tender so it doesn't burn. For THAWED salmon, skip this extra cooking stage.",
      "seconds": 720
    },
    {
      "title": "Steam broccoli",
      "body": "During the final 5–7 minutes of salmon cooking, steam 1–2 cups broccoli with a splash of water in a covered microwave-safe bowl or saucepan until tender and hot.",
      "seconds": 360
    },
    {
      "title": "Serve and store",
      "body": "Plate salmon with sweet potato and broccoli. Refrigerate leftovers within 2 hours.",
      "seconds": 0
    }
  ]
},
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
,
{
  "id": "kb-shrimp-okra-kidney-bean-pasta",
  "name": "Shrimp, Okra & Kidney Bean Pasta",
  "description": "Whole-wheat penne with shrimp, okra, kidney beans, mixed vegetables and Classico tomato sauce. Two servings, about 30 minutes after shrimp are thawed.",
  "servings": 2,
  "categories": [
    "Dinner",
    "Seafood",
    "Pasta",
    "Vegetables"
  ],
  "tags": [
    "High protein",
    "Fiber-rich",
    "Use what you have"
  ],
  "timeMinutes": 30,
  "photo": "./photo-pending.svg",
  "photoKind": "custom-photo-created-awaiting-app-asset",
  "recipeOrigin": "kitchen-buddy-original",
  "recipeVersion": 1,
  "ingredients": [
    "4 oz dry whole-wheat penne pasta",
    "8 oz raw shrimp, fully thawed, peeled and deveined (or already-cooked shrimp)",
    "1 cup frozen sliced okra",
    "1 cup frozen broccoli, cauliflower and carrot mix",
    "1 cup canned kidney beans, drained and rinsed",
    "¾ cup Classico tomato pasta sauce",
    "½ tsp garlic powder",
    "¼ tsp paprika",
    "Black pepper, optional",
    "2–3 tbsp water, if sauce needs thinning"
  ],
  "items": [
    {
      "name": "whole-wheat penne pasta, dry",
      "qty": 4,
      "unit": "oz"
    },
    {
      "name": "raw shrimp, peeled and deveined",
      "qty": 8,
      "unit": "oz"
    },
    {
      "name": "frozen cut okra",
      "qty": 1,
      "unit": "cup"
    },
    {
      "name": "frozen broccoli cauliflower carrot mix",
      "qty": 1,
      "unit": "cup"
    },
    {
      "name": "canned kidney beans, drained and rinsed",
      "qty": 1,
      "unit": "cup"
    },
    {
      "name": "Classico tomato pasta sauce",
      "qty": 0.75,
      "unit": "cup"
    },
    {
      "name": "garlic powder",
      "qty": 0.5,
      "unit": "tsp"
    },
    {
      "name": "paprika",
      "qty": 0.25,
      "unit": "tsp"
    },
    {
      "name": "black pepper",
      "qty": 0.125,
      "unit": "tsp"
    }
  ],
  "steps": [
    {
      "title": "Thaw the shrimp safely",
      "body": "If the shrimp are frozen, thaw according to package instructions in the refrigerator, or in a leakproof bag under cold running water. Never thaw on the counter. Check whether your shrimp are raw or precooked: that changes when you add them.",
      "seconds": 0
    },
    {
      "title": "Boil whole-wheat pasta",
      "body": "Bring water to a boil. Cook 4 oz dry whole-wheat penne according to the box instructions until al dente. Save a few tablespoons of pasta water before draining. No extra salt is needed.",
      "seconds": 0
    },
    {
      "title": "Cook the frozen okra",
      "body": "In a large nonstick skillet over medium heat, add 1 cup frozen okra and cook for about 5–7 minutes, stirring occasionally, until hot and much of its moisture evaporates. A little stickiness is normal.",
      "seconds": 420
    },
    {
      "title": "Add mixed vegetables",
      "body": "Add 1 cup frozen broccoli, cauliflower and carrots. Add 2 tbsp water if the skillet looks dry, cover and cook 4–5 minutes until the vegetables are fully heated and tender.",
      "seconds": 300
    },
    {
      "title": "Cook the raw shrimp",
      "body": "Move the vegetables to one side of the skillet. Add 8 oz thawed RAW shrimp and cook about 2 minutes per side depending on size. Check the thickest shrimp reaches 145°F / 63°C, or is opaque and firm. If using already-cooked shrimp, skip this step and add it later just to reheat.",
      "seconds": 240
    },
    {
      "title": "Add beans and sauce",
      "body": "Rinse and drain 1 cup canned kidney beans. Add them with ¾ cup Classico tomato sauce, ½ tsp garlic powder, and ¼ tsp paprika. Stir and heat gently for 2–3 minutes. If using precooked shrimp, add it now and warm thoroughly without overcooking. Taste and add optional black pepper only if tolerated.",
      "seconds": 180
    },
    {
      "title": "Toss with pasta",
      "body": "Add drained whole-wheat pasta and toss to coat. Add reserved pasta water a spoonful at a time if needed. Turn off the heat once everything is hot. Divide into two bowls.",
      "seconds": 60
    },
    {
      "title": "Save leftovers",
      "body": "Refrigerate leftovers in shallow covered containers within 2 hours. Plan to use cooked pasta and shrimp within 3–4 days. Refrigerate the opened pasta sauce promptly, following its label, and store unused beans in a covered container in the fridge.",
      "seconds": 0
    }
  ]
}
];
let added=0;
for (const recipe of incoming){
  const existing=state.recipes.find(item=>item.id===recipe.id);
  if(!existing){state.recipes.push(recipe);added++;}
  else if(recipe.id==="kb-baked-salmon-sweet-potato-broccoli" && (existing.recipeVersion||0)<2){
    Object.assign(existing,{description:recipe.description,timeMinutes:recipe.timeMinutes,ingredients:recipe.ingredients,items:recipe.items,steps:recipe.steps,recipeVersion:2});
    added++;
  }
}
if(added) save();
})();
