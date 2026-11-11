# Kitchen Buddy recipe photo provenance audit

Date: 2026-11-11 • PR #5 / health-curation beta

## Policy

- Never use AI-generated food images, general stock images, illustrative close-enough plates, or photos from a different recipe as though they depict Kitchen Buddy's cooking instructions.
- Show an original-dish source photograph only when its source recipe is the one documented for this Kitchen Buddy recipe, with credits and license metadata.
- Otherwise show `photo-pending.svg`. A blank, clearly labeled placeholder is more accurate than a wrong photo.
- Preserve photos the user directly uploads in the browser and keep their personal recipe data backed up.

## Changes

- Deleted **51 copies** of 17 generic/illustrative recipe pictures (`assets/recipes/` in root, preview, and layout). The originals remain in Git history, but are absent from the current branch and removed from the PWA asset cache list.
- Removed code that repeatedly installed mismatched illustrative photos into existing saved recipes; removed stock photo URL metadata from seeded recipes and the nine catalog additions.
- Added `recipe-photo-integrity.js` to root, layout and preview to migrate previous browser-stored illustrative photos to a placeholder, including archived bundled recipes, without touching user-uploaded data images.
- Original-dish source pictures remain from the publisher's own `public-domain-recipes` repository, which requires contributors to photograph the cooked recipe, disallows stock photos and licenses all submissions under Unlicense. The app retains recipe and photo credits. As with any externally sourced images, source provenance does not provide a forensic guarantee that every contributor followed the rules.
- The **four active health-screened Kitchen Buddy original recipes have no verified exact-dish photos yet**. They intentionally show a photo-pending placeholder; do not borrow a similar recipe's photograph.

## Traceable original-recipe photos retained (22)

| Kitchen Buddy dish | Original cook's recipe | Local bundled image | Credit |
|---|---|---|---|
| Cheesy Chicken Pasta Casserole | [Recipe](https://publicdomainrecipes.com/chicken-pasta-casserole/) | `./assets/verified/chicken-pasta-casserole.webp` | Miika Nissi · Public Domain Recipes |
| Sweet Potato & Chickpea Curry | [Recipe](https://publicdomainrecipes.com/fall-vegetable-and-chickpea-curry/) | `./assets/verified/fall-vegetable-and-chickpea-curry.webp` | Joel Maxuel · Public Domain Recipes |
| Spicy Tomato Arrabbiata Pasta | [Recipe](https://publicdomainrecipes.com/pasta-arrabbiata/) | `./assets/verified/pasta-arrabbiata.webp` | klisurovi4 · Public Domain Recipes |
| Golden Pan-Seared Chicken | [Recipe](https://publicdomainrecipes.com/pan-seared-chicken/) | `./assets/verified/pan-seared-chicken.webp` | yaroslav-smirnov · Public Domain Recipes |
| Skillet Shakshuka Eggs | [Recipe](https://publicdomainrecipes.com/shakshouka/) | `./assets/verified/shakshouka.webp` | jakub-korsak · Public Domain Recipes |
| Crispy Cheese & Bean Quesadilla | [Recipe](https://publicdomainrecipes.com/quesadilla/) | `./assets/verified/quesadilla.webp` | peebowo · Public Domain Recipes |
| Golden French Toast | [Recipe](https://publicdomainrecipes.com/french-toast/) | `./assets/verified/french-toast.webp` | ryan-wilson · Public Domain Recipes |
| Honey Sriracha Chicken Thighs | [Recipe](https://publicdomainrecipes.com/honey-sriracha-chicken-thighs/) | `./assets/verified/honey-sriracha-chicken-thighs.webp` | Kevin Anderson · Public Domain Recipes |
| Fresh Lime Guacamole | [Recipe](https://publicdomainrecipes.com/guacamole/) | `./assets/verified/guacamole.webp` | yaroslav-smirnov · Public Domain Recipes |
| Soft Chocolate Chip Cookies | [Recipe](https://publicdomainrecipes.com/chocolate-chip-cookies/) | `./assets/verified/chocolate-chip-cookies.webp` | mfed3 · Public Domain Recipes |
| Creamy Butter Chicken Masala | [Recipe](https://publicdomainrecipes.com/butter-chicken-masala/) | `./assets/verified/butter-chicken-masala.webp` | nihar-samantaray · Public Domain Recipes |
| Homestyle Cheesy Beef Lasagna | [Recipe](https://publicdomainrecipes.com/lasagna/) | `./assets/verified/lasagna.webp` | yiusa · Public Domain Recipes |
| Creamy Potato Leek Soup | [Recipe](https://publicdomainrecipes.com/potato-leek-soup/) | `./assets/verified/potato-leek-soup.webp` | cactar · Public Domain Recipes |
| Cinnamon-Rosemary Sweet Potato Fries | [Recipe](https://publicdomainrecipes.com/sweet-potato-fries/) | `./assets/verified/sweet-potato-fries.webp` | shane-kunz · Public Domain Recipes |
| Creamy Broccoli Baked Pasta | [Recipe](https://publicdomainrecipes.com/baked-pasta-with-broccoli/) | `./assets/verified/baked-pasta-with-broccoli.webp` | davide-costa · Public Domain Recipes |
| Silky Garlic-Lemon Hummus | [Recipe](https://publicdomainrecipes.com/hummus/) | `./assets/verified/hummus.webp` | jacob-smith · Public Domain Recipes |
| Old-Fashioned Apple Pie | [Recipe](https://publicdomainrecipes.com/apple-pie/) | `./assets/verified/apple-pie.webp` | mfed3 · Public Domain Recipes |
| Homemade Golden Waffles | [Recipe](https://publicdomainrecipes.com/basic-waffles/) | `./assets/verified/basic-waffles-01.webp` | logianer · Public Domain Recipes |
| Cheese-Stuffed Meatballs in Tomato Sauce | [Recipe](https://publicdomainrecipes.com/cheesy-meatballs/) | `./assets/verified/cheesy-meatballs.webp` | yaroslav-smirnov · Public Domain Recipes |
| Italian Egg-Drop Stracciatella Soup | [Recipe](https://publicdomainrecipes.com/stracciatella-soup/) | `./assets/verified/stracciatella-soup.webp` | pestanzul · Public Domain Recipes |
| Buttery Rosemary Parmesan Potatoes | [Recipe](https://publicdomainrecipes.com/parmesan-potatoes/) | `./assets/verified/parmesan-potatoes.webp` | yaroslav-smirnov · Public Domain Recipes |
| Simple Golden Yogurt Cake | [Recipe](https://publicdomainrecipes.com/yogurt-cake/) | `./assets/verified/yogurt-cake.webp` | pestanzul · Public Domain Recipes |

Source policy and license: [Public Domain Recipes repository](https://github.com/ronaldl29/public-domain-recipes) and [LICENSE](https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md).

## Migration safety

- Existing user photo uploads (data-image/blob or explicitly marked personal photos) remain unchanged.
- Old stock photos saved under recipe IDs are changed to placeholders; source credits from mismatched stock photos are removed.
- Saved meal plans, leftovers, shopping lists, user recipes, and other app state are not deleted by the image migration.
- Service-worker cache version changes from v8 to v9 to clear installed copies of obsolete food assets on upgrade.
