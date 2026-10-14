// Kitchen Buddy Batch 3 — 12 actual home-cook recipe pages and their own finished-dish photos.
// Source instructions reworded as clear guided steps; photo license: source project's Unlicense.
// Guard against overwriting user-created recipes or user-uploaded photos.
(function(){'use strict';
const incoming=[
  {
    "id": "kb-pd-butter-chicken-masala",
    "name": "Creamy Butter Chicken Masala",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 2,
    "categories": [
      "Dinner",
      "Indian"
    ],
    "tags": [],
    "timeMinutes": 75,
    "photo": "./assets/verified/butter-chicken-masala.webp",
    "photoSource": "https://publicdomainrecipes.com/butter-chicken-masala/",
    "photoCredit": "nihar-samantaray · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/butter-chicken-masala/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "0.5 lb boneless chicken breast",
      "2 tbsp butter",
      "2 each onion",
      "2 each tomatoes",
      "2 tbsp vegetable oil",
      "1 tbsp lemon juice",
      "3 clove garlic",
      "1 tbsp fresh ginger",
      "1 tbsp garam masala",
      "4 tbsp heavy cream",
      "1 tsp chili powder",
      "0.75 tsp turmeric",
      "0.75 tsp dried fenugreek",
      "0.25 cup fresh cilantro"
    ],
    "items": [
      {
        "name": "boneless chicken breast",
        "qty": 0.5,
        "unit": "lb"
      },
      {
        "name": "butter",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "onion",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "tomatoes",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "vegetable oil",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "lemon juice",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "garlic",
        "qty": 3,
        "unit": "clove"
      },
      {
        "name": "fresh ginger",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "garam masala",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "heavy cream",
        "qty": 4,
        "unit": "tbsp"
      },
      {
        "name": "chili powder",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "turmeric",
        "qty": 0.75,
        "unit": "tsp"
      },
      {
        "name": "dried fenugreek",
        "qty": 0.75,
        "unit": "tsp"
      },
      {
        "name": "fresh cilantro",
        "qty": 0.25,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Cut and marinate the chicken",
        "body": "Cut ½ lb boneless chicken into bite-size cubes. Toss with 1 tbsp lemon juice, half the minced ginger, half the minced garlic, ½ tsp chili powder and ¼ tsp turmeric. Refrigerate for 30 minutes; clean all raw-chicken surfaces.",
        "seconds": 0
      },
      {
        "title": "Prepare the sauce vegetables",
        "body": "Finely dice 2 onions, puree or finely chop 2 tomatoes, and mince the remaining garlic and ginger. Measure spices and cream.",
        "seconds": 0
      },
      {
        "title": "Sear the chicken",
        "body": "Heat 1 tbsp oil in a nonstick pan over medium-high. Brown chicken cubes for 4–6 minutes, turning often. They will finish cooking in the sauce.",
        "seconds": 360
      },
      {
        "title": "Cook the onions and spices",
        "body": "In a deep skillet heat 1 tbsp oil and 2 tbsp butter. Cook onion over medium heat until soft, about 7 minutes. Add garlic, ginger, 1 tbsp garam masala, remaining turmeric and chili powder; stir 30 seconds.",
        "seconds": 450
      },
      {
        "title": "Simmer tomato sauce",
        "body": "Add pureed tomatoes and a pinch of salt. Stir over low-medium heat 8–10 minutes until thicker.",
        "seconds": 600
      },
      {
        "title": "Finish safely",
        "body": "Add browned chicken and ¾ tsp dried fenugreek. Simmer 8–12 minutes until all chicken reaches **165°F (74°C)**. Lower heat, stir in 4 tbsp heavy cream and warm gently.",
        "seconds": 720
      },
      {
        "title": "Garnish",
        "body": "Top with chopped cilantro. Serve with separately prepared rice or naan if desired. Store leftovers promptly.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-lasagna",
    "name": "Homestyle Cheesy Beef Lasagna",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 6,
    "categories": [
      "Dinner",
      "Italian"
    ],
    "tags": [],
    "timeMinutes": 100,
    "photo": "./assets/verified/lasagna.webp",
    "photoSource": "https://publicdomainrecipes.com/lasagna/",
    "photoCredit": "yiusa · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/lasagna/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "1 lb ground beef",
      "24 oz jarred marinara sauce",
      "12 oz lasagna noodles",
      "15 oz ricotta cheese",
      "10 oz mozzarella cheese",
      "0.33 cup Parmesan cheese"
    ],
    "items": [
      {
        "name": "ground beef",
        "qty": 1,
        "unit": "lb"
      },
      {
        "name": "jarred marinara sauce",
        "qty": 24,
        "unit": "oz"
      },
      {
        "name": "lasagna noodles",
        "qty": 12,
        "unit": "oz"
      },
      {
        "name": "ricotta cheese",
        "qty": 15,
        "unit": "oz"
      },
      {
        "name": "mozzarella cheese",
        "qty": 10,
        "unit": "oz"
      },
      {
        "name": "Parmesan cheese",
        "qty": 0.33,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Heat oven and gather ingredients",
        "body": "Preheat oven to 350°F (175°C). Use a 9×13-inch baking dish. If noodles are not oven-ready, boil them first according to package directions.",
        "seconds": 0
      },
      {
        "title": "Make the meat sauce",
        "body": "In a skillet over medium heat brown 1 lb ground beef until no pink remains and the meat reaches **160°F (71°C)**. Drain fat, then stir in 24 oz marinara sauce.",
        "seconds": 720
      },
      {
        "title": "Layer the lasagna",
        "body": "Spoon a thin layer of sauce on the bottom. Add noodles, half the ricotta, some meat sauce and some mozzarella. Repeat, ending with sauce and remaining mozzarella and Parmesan. Follow package instructions about added water for oven-ready noodles.",
        "seconds": 0
      },
      {
        "title": "Cover and bake",
        "body": "Cover tightly with foil; bake 35 minutes at 350°F.",
        "seconds": 2100
      },
      {
        "title": "Brown the top",
        "body": "Carefully uncover using oven mitts. Bake another 10–15 minutes until bubbling, the cheese is browned, and the center is thoroughly hot.",
        "seconds": 900
      },
      {
        "title": "Rest then slice",
        "body": "Cover loosely and let rest 10 minutes before cutting. Refrigerate leftovers within two hours.",
        "seconds": 600
      }
    ]
  },
  {
    "id": "kb-pd-potato-leek-soup",
    "name": "Creamy Potato Leek Soup",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 3,
    "categories": [
      "Lunch",
      "Soups & Stews",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 55,
    "photo": "./assets/verified/potato-leek-soup.webp",
    "photoSource": "https://publicdomainrecipes.com/potato-leek-soup/",
    "photoCredit": "cactar · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/potato-leek-soup/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "3 tbsp unsalted butter",
      "2 each leeks",
      "4 cup vegetable broth",
      "11 oz waxy potatoes",
      "1 each bay leaf",
      "0.75 cup heavy cream",
      "0.25 tsp white pepper",
      "0.5 tsp dried dill"
    ],
    "items": [
      {
        "name": "unsalted butter",
        "qty": 3,
        "unit": "tbsp"
      },
      {
        "name": "leeks",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "vegetable broth",
        "qty": 4,
        "unit": "cup"
      },
      {
        "name": "waxy potatoes",
        "qty": 11,
        "unit": "oz"
      },
      {
        "name": "bay leaf",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "heavy cream",
        "qty": 0.75,
        "unit": "cup"
      },
      {
        "name": "white pepper",
        "qty": 0.25,
        "unit": "tsp"
      },
      {
        "name": "dried dill",
        "qty": 0.5,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Clean the leeks well",
        "body": "Trim away tough dark-green ends. Slice 2 leeks lengthwise and rinse carefully between layers to remove trapped grit. Chop. Peel and dice 11 oz potatoes.",
        "seconds": 0
      },
      {
        "title": "Soften in butter",
        "body": "Melt 3 tbsp butter in a soup pot over medium-low heat. Add leeks and diced potatoes and stir for about 8 minutes without browning.",
        "seconds": 480
      },
      {
        "title": "Simmer until tender",
        "body": "Add 4 cups vegetable broth, one bay leaf, white pepper, and ½ tsp dill. Bring to a gentle simmer and cook about 25 minutes, until potatoes can be pierced easily with a fork.",
        "seconds": 1500
      },
      {
        "title": "Blend without splashing",
        "body": "Remove bay leaf. Let cool briefly. Use an immersion blender cautiously in the pot or blend small batches in a heat-rated blender with the lid vented for steam.",
        "seconds": 0
      },
      {
        "title": "Finish creamy",
        "body": "Return to low heat and stir in ¾ cup heavy cream. Heat until steaming, season to taste, and serve. Do not boil vigorously after adding cream.",
        "seconds": 180
      }
    ]
  },
  {
    "id": "kb-pd-sweet-potato-fries",
    "name": "Cinnamon-Rosemary Sweet Potato Fries",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 2,
    "categories": [
      "Snacks & Sides",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan",
      "Gluten-free"
    ],
    "timeMinutes": 45,
    "photo": "./assets/verified/sweet-potato-fries.webp",
    "photoSource": "https://publicdomainrecipes.com/sweet-potato-fries/",
    "photoCredit": "shane-kunz · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/sweet-potato-fries/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "2 each sweet potatoes",
      "1.5 tbsp olive oil",
      "0.5 tsp ground cinnamon",
      "0.5 tsp dried rosemary",
      "0.25 tsp salt"
    ],
    "items": [
      {
        "name": "sweet potatoes",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "olive oil",
        "qty": 1.5,
        "unit": "tbsp"
      },
      {
        "name": "ground cinnamon",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "dried rosemary",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "salt",
        "qty": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Heat the oven",
        "body": "Preheat oven to 425°F (220°C). Line a large baking tray with parchment paper.",
        "seconds": 0
      },
      {
        "title": "Cut evenly",
        "body": "Wash and scrub 2 sweet potatoes. Cut carefully into long fries about ¼–½ inch thick so they cook at a similar rate.",
        "seconds": 0
      },
      {
        "title": "Season",
        "body": "On the tray toss fries with 1½ tbsp olive oil, ½ tsp cinnamon, ½ tsp rosemary and ¼ tsp salt. Spread in a single layer.",
        "seconds": 0
      },
      {
        "title": "Roast first side",
        "body": "Bake 20 minutes, then use a spatula to flip the fries.",
        "seconds": 1200
      },
      {
        "title": "Roast until browned",
        "body": "Bake another 10–20 minutes until golden at edges and tender inside. Thicker pieces may take longer.",
        "seconds": 900
      },
      {
        "title": "Serve",
        "body": "Cool briefly before eating; hot sweet potatoes can burn your mouth.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-baked-pasta-with-broccoli",
    "name": "Creamy Broccoli Baked Pasta",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 4,
    "categories": [
      "Dinner",
      "Italian",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 65,
    "photo": "./assets/verified/baked-pasta-with-broccoli.webp",
    "photoSource": "https://publicdomainrecipes.com/baked-pasta-with-broccoli/",
    "photoCredit": "davide-costa · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/baked-pasta-with-broccoli/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "1 lb dry penne pasta",
      "1 lb broccoli florets",
      "4 each eggs",
      "7 oz scamorza cheese",
      "1.5 cup milk",
      "2 tbsp butter",
      "2 tbsp all-purpose flour",
      "0.25 cup Parmesan cheese",
      "0.25 tsp dried sage"
    ],
    "items": [
      {
        "name": "dry penne pasta",
        "qty": 1,
        "unit": "lb"
      },
      {
        "name": "broccoli florets",
        "qty": 1,
        "unit": "lb"
      },
      {
        "name": "eggs",
        "qty": 4,
        "unit": "each"
      },
      {
        "name": "scamorza cheese",
        "qty": 7,
        "unit": "oz"
      },
      {
        "name": "milk",
        "qty": 1.5,
        "unit": "cup"
      },
      {
        "name": "butter",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "all-purpose flour",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "Parmesan cheese",
        "qty": 0.25,
        "unit": "cup"
      },
      {
        "name": "dried sage",
        "qty": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Preheat and boil",
        "body": "Preheat oven to 350°F (180°C). Bring two saucepans of water to a boil. Boil 4 eggs until hard cooked, about 10–12 minutes, then cool under cold water and peel.",
        "seconds": 720
      },
      {
        "title": "Cook pasta and broccoli",
        "body": "Boil 1 lb pasta in salted water 2 minutes less than the package recommends. In the final 4 minutes add 1 lb broccoli florets. Drain well.",
        "seconds": 600
      },
      {
        "title": "Make quick béchamel",
        "body": "In a saucepan melt 2 tbsp butter over medium-low heat. Stir in 2 tbsp flour for a minute. Whisk in 1½ cups milk gradually; simmer 4–5 minutes until creamy and no flour taste remains.",
        "seconds": 360
      },
      {
        "title": "Layer the casserole",
        "body": "Slice hard-boiled eggs and dice 7 oz scamorza. In a baking dish layer some béchamel, pasta, broccoli, egg slices and cheese; repeat until used. Sprinkle optional Parmesan and sage on top.",
        "seconds": 0
      },
      {
        "title": "Bake",
        "body": "Bake uncovered for 20–25 minutes until bubbling and lightly browned on top. If using broiler at end, watch continuously to avoid burning.",
        "seconds": 1500
      },
      {
        "title": "Cool before serving",
        "body": "Rest 5 minutes so the cheese sets a little. Refrigerate leftovers promptly.",
        "seconds": 300
      }
    ]
  },
  {
    "id": "kb-pd-hummus",
    "name": "Silky Garlic-Lemon Hummus",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 4,
    "categories": [
      "Snacks & Sides",
      "Mediterranean",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan",
      "Gluten-free"
    ],
    "timeMinutes": 35,
    "photo": "./assets/verified/hummus.webp",
    "photoSource": "https://publicdomainrecipes.com/hummus/",
    "photoCredit": "jacob-smith · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/hummus/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "1 can canned chickpeas",
      "0.5 tsp baking soda",
      "0.5 cup tahini",
      "0.25 cup lemon juice",
      "1 clove garlic",
      "0.25 tsp ground cumin",
      "1 tbsp olive oil",
      "0.25 tsp salt"
    ],
    "items": [
      {
        "name": "canned chickpeas",
        "qty": 1,
        "unit": "can"
      },
      {
        "name": "baking soda",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "tahini",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "lemon juice",
        "qty": 0.25,
        "unit": "cup"
      },
      {
        "name": "garlic",
        "qty": 1,
        "unit": "clove"
      },
      {
        "name": "ground cumin",
        "qty": 0.25,
        "unit": "tsp"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "salt",
        "qty": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Rinse chickpeas",
        "body": "Drain and rinse one 15-oz can of chickpeas. Place in a small pot with ½ tsp baking soda and enough water to cover by about 2 inches.",
        "seconds": 0
      },
      {
        "title": "Soften the beans",
        "body": "Bring to a boil, then simmer around 20 minutes until the chickpeas are very soft. Drain and rinse thoroughly.",
        "seconds": 1200
      },
      {
        "title": "Mellow the garlic",
        "body": "In a food processor pulse 1 peeled garlic clove with ¼ cup lemon juice and ¼ tsp salt until finely chopped. Let sit about 5 minutes.",
        "seconds": 300
      },
      {
        "title": "Whip tahini",
        "body": "Add ½ cup tahini and blend smooth. While processing, add cold water 1 tbsp at a time until thick but creamy.",
        "seconds": 0
      },
      {
        "title": "Blend hummus",
        "body": "Add soft chickpeas and ¼ tsp cumin. Blend while drizzling in 1 tbsp olive oil. Scrape sides and continue until smooth, 1–3 minutes.",
        "seconds": 180
      },
      {
        "title": "Serve",
        "body": "Taste, adjust salt or lemon, and serve with vegetables or pita. Refrigerate leftovers promptly in a covered container.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-apple-pie",
    "name": "Old-Fashioned Apple Pie",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 8,
    "categories": [
      "Desserts"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 115,
    "photo": "./assets/verified/apple-pie.webp",
    "photoSource": "https://publicdomainrecipes.com/apple-pie/",
    "photoCredit": "mfed3 · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/apple-pie/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "5 each apples",
      "1 tbsp lemon juice",
      "0.33 cup white sugar",
      "0.33 cup brown sugar",
      "1 tsp ground cinnamon",
      "0.25 tsp nutmeg",
      "1 tbsp cornstarch",
      "2.75 cup all-purpose flour",
      "1 cup unsalted butter",
      "1 tsp salt",
      "0.33 cup ice water"
    ],
    "items": [
      {
        "name": "apples",
        "qty": 5,
        "unit": "each"
      },
      {
        "name": "lemon juice",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "white sugar",
        "qty": 0.33,
        "unit": "cup"
      },
      {
        "name": "brown sugar",
        "qty": 0.33,
        "unit": "cup"
      },
      {
        "name": "ground cinnamon",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "nutmeg",
        "qty": 0.25,
        "unit": "tsp"
      },
      {
        "name": "cornstarch",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "all-purpose flour",
        "qty": 2.75,
        "unit": "cup"
      },
      {
        "name": "unsalted butter",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "salt",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "ice water",
        "qty": 0.33,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Chill the butter and prepare apples",
        "body": "Keep 1 cup butter cold. Peel, core and thinly slice 5 apples. Toss with 1 tbsp lemon juice, ⅓ cup white sugar, ⅓ cup brown sugar, 1 tsp cinnamon, ¼ tsp nutmeg and 1 tbsp cornstarch. Let sit 15 minutes.",
        "seconds": 900
      },
      {
        "title": "Make the pastry",
        "body": "In a bowl blend 2¾ cups flour and 1 tsp salt with 1 cup very cold cubed butter until crumbly. Add cold water, a spoonful at a time, just until dough holds. Divide into two disks; chill 20 minutes.",
        "seconds": 1200
      },
      {
        "title": "Prepare the filling",
        "body": "If apples have released a lot of juice, pour juices into a saucepan and simmer about 5 minutes to reduce slightly; mix back into apples. Keep fruit pieces intact.",
        "seconds": 300
      },
      {
        "title": "Preheat and line pie dish",
        "body": "Heat oven to 350°F (175°C). Roll one dough disk into a circle big enough to line a 9-inch pie plate. Transfer carefully and trim excess.",
        "seconds": 0
      },
      {
        "title": "Fill and cover",
        "body": "Fill crust with apples. Roll out the second disk, cover, crimp edges firmly and cut 3–4 steam vents in the top.",
        "seconds": 0
      },
      {
        "title": "Bake until bubbling",
        "body": "Bake 45–60 minutes until crust is golden brown and thick apple juices bubble in the vents. Shield edges with foil if browning too fast.",
        "seconds": 3300
      },
      {
        "title": "Cool before slicing",
        "body": "Allow pie to cool at least an hour so the filling sets and does not burn your mouth.",
        "seconds": 3600
      }
    ]
  },
  {
    "id": "kb-pd-basic-waffles",
    "name": "Homemade Golden Waffles",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 6,
    "categories": [
      "Breakfast",
      "Desserts"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 40,
    "photo": "./assets/verified/basic-waffles-01.webp",
    "photoSource": "https://publicdomainrecipes.com/basic-waffles/",
    "photoCredit": "logianer · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/basic-waffles/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "2 cup all-purpose flour",
      "0.5 cup butter",
      "0.5 cup white sugar",
      "3 each eggs",
      "1 tbsp baking powder",
      "1.5 cup milk",
      "2 tsp vanilla extract"
    ],
    "items": [
      {
        "name": "all-purpose flour",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "butter",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "white sugar",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "eggs",
        "qty": 3,
        "unit": "each"
      },
      {
        "name": "baking powder",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "milk",
        "qty": 1.5,
        "unit": "cup"
      },
      {
        "name": "vanilla extract",
        "qty": 2,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Get waffle maker ready",
        "body": "Plug in waffle iron and preheat according to the manufacturer's instructions. The plates become very hot.",
        "seconds": 0
      },
      {
        "title": "Whisk the wet ingredients",
        "body": "In a large bowl beat 3 eggs with ½ cup sugar and 2 tsp vanilla until combined. Stir in ½ cup melted but cooled butter.",
        "seconds": 0
      },
      {
        "title": "Add dry ingredients",
        "body": "In another bowl combine 2 cups flour with 1 tbsp baking powder. Mix a little flour and 1½ cups milk into the egg mixture in alternating additions until batter is just blended.",
        "seconds": 0
      },
      {
        "title": "Rest the batter",
        "body": "Let batter rest 5 minutes while the waffle iron finishes warming. Stir gently once before cooking.",
        "seconds": 300
      },
      {
        "title": "Cook batches",
        "body": "Lightly grease the waffle iron if needed. Pour in enough batter for your machine without overflowing. Close lid and cook each waffle until golden and steam slows, about 3–5 minutes; use a heat-safe tool to lift.",
        "seconds": 300
      },
      {
        "title": "Serve",
        "body": "Place waffles on a rack so they stay crisp. Add fruit or syrup if desired. Refrigerate leftovers promptly.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-cheesy-meatballs",
    "name": "Cheese-Stuffed Meatballs in Tomato Sauce",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 2,
    "categories": [
      "Dinner",
      "Italian"
    ],
    "tags": [],
    "timeMinutes": 45,
    "photo": "./assets/verified/cheesy-meatballs.webp",
    "photoSource": "https://publicdomainrecipes.com/cheesy-meatballs/",
    "photoCredit": "yaroslav-smirnov · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/cheesy-meatballs/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "0.85 lb ground beef",
      "0.25 each onion",
      "2.5 oz Gouda cheese",
      "2 tbsp fresh parsley",
      "2 clove garlic",
      "1 each eggs",
      "0.25 cup breadcrumbs",
      "0.5 cup tomato paste",
      "1 cup water",
      "0.5 tsp dried oregano",
      "0.5 tsp dried basil",
      "1 tbsp olive oil"
    ],
    "items": [
      {
        "name": "ground beef",
        "qty": 0.85,
        "unit": "lb"
      },
      {
        "name": "onion",
        "qty": 0.25,
        "unit": "each"
      },
      {
        "name": "Gouda cheese",
        "qty": 2.5,
        "unit": "oz"
      },
      {
        "name": "fresh parsley",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "garlic",
        "qty": 2,
        "unit": "clove"
      },
      {
        "name": "eggs",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "breadcrumbs",
        "qty": 0.25,
        "unit": "cup"
      },
      {
        "name": "tomato paste",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "water",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "dried oregano",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "dried basil",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      }
    ],
    "steps": [
      {
        "title": "Make the mixture",
        "body": "In a large bowl beat one egg. Add 0.85 lb ground beef, ¼ cup breadcrumbs, ¼ finely diced onion, 2 minced garlic cloves, 2 tbsp chopped parsley and salt. Mix gently.",
        "seconds": 0
      },
      {
        "title": "Wrap around the cheese",
        "body": "Cut 2½ oz Gouda into small cubes. Enclose one cube in each portion of beef and roll into golf-ball-sized meatballs with cheese fully sealed inside. Wash hands and clean raw-meat surfaces.",
        "seconds": 0
      },
      {
        "title": "Brown carefully",
        "body": "Heat 1 tbsp olive oil in a skillet over medium heat. Turn the meatballs gently until browned all around, about 8 minutes; they are not cooked through yet.",
        "seconds": 480
      },
      {
        "title": "Make the tomato sauce",
        "body": "Whisk ½ cup tomato paste with 1 cup water, ½ tsp oregano, ½ tsp basil and black pepper. Pour into skillet around meatballs.",
        "seconds": 0
      },
      {
        "title": "Simmer until safe",
        "body": "Cover and simmer around 12–18 minutes, turning meatballs occasionally. Test meat centers with a food thermometer: ground beef must reach **160°F (71°C)**. Sauce should bubble gently.",
        "seconds": 900
      },
      {
        "title": "Serve",
        "body": "Serve over separately prepared rice or pasta if you wish. Watch for hot melted cheese inside.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-stracciatella-soup",
    "name": "Italian Egg-Drop Stracciatella Soup",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 1,
    "categories": [
      "Lunch",
      "Soups & Stews",
      "Quick Meals",
      "Italian"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 15,
    "photo": "./assets/verified/stracciatella-soup.webp",
    "photoSource": "https://publicdomainrecipes.com/stracciatella-soup/",
    "photoCredit": "pestanzul · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/stracciatella-soup/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "2 each eggs",
      "2 cup vegetable broth",
      "1 tsp olive oil"
    ],
    "items": [
      {
        "name": "eggs",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "vegetable broth",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Beat the eggs",
        "body": "Crack 2 eggs into a bowl. Beat thoroughly until the yolks and whites are fully blended.",
        "seconds": 0
      },
      {
        "title": "Heat the broth",
        "body": "Pour 2 cups vegetable broth into a small pot. Bring it to a gentle boil over medium-high heat.",
        "seconds": 300
      },
      {
        "title": "Add the egg ribbons",
        "body": "Slowly drizzle beaten egg into the boiling broth while stirring the liquid in a circular motion. Keep simmering until the egg strands are fully set, about 2 minutes.",
        "seconds": 120
      },
      {
        "title": "Serve warm",
        "body": "Ladle into a bowl. Add 1 tsp olive oil if desired. Serve with toasted bread; the broth is hot.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-parmesan-potatoes",
    "name": "Buttery Rosemary Parmesan Potatoes",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 2,
    "categories": [
      "Snacks & Sides",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 35,
    "photo": "./assets/verified/parmesan-potatoes.webp",
    "photoSource": "https://publicdomainrecipes.com/parmesan-potatoes/",
    "photoCredit": "yaroslav-smirnov · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/parmesan-potatoes/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "3 each potatoes",
      "1.5 tbsp butter",
      "0.33 cup Parmesan cheese",
      "1 tsp dried rosemary",
      "0.25 tsp salt",
      "0.25 tsp black pepper"
    ],
    "items": [
      {
        "name": "potatoes",
        "qty": 3,
        "unit": "each"
      },
      {
        "name": "butter",
        "qty": 1.5,
        "unit": "tbsp"
      },
      {
        "name": "Parmesan cheese",
        "qty": 0.33,
        "unit": "cup"
      },
      {
        "name": "dried rosemary",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "salt",
        "qty": 0.25,
        "unit": "tsp"
      },
      {
        "name": "black pepper",
        "qty": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Dice evenly",
        "body": "Wash and cut 3 medium potatoes into ½-inch cubes so they cook at the same speed. Pat very dry with paper towels.",
        "seconds": 0
      },
      {
        "title": "Melt butter",
        "body": "Heat a large skillet over medium heat; melt 1½ tbsp butter without burning it.",
        "seconds": 90
      },
      {
        "title": "Cook potatoes",
        "body": "Add the potato cubes in a single layer, sprinkle with salt and cook around 18–22 minutes, stirring or flipping every few minutes until golden and fork-tender.",
        "seconds": 1200
      },
      {
        "title": "Add rosemary",
        "body": "In the final 3–5 minutes, add 1 tsp dried rosemary and stir. Check that the centers are soft.",
        "seconds": 240
      },
      {
        "title": "Top and serve",
        "body": "Transfer to a serving bowl, grate or sprinkle ⅓ cup Parmesan over hot potatoes, and add black pepper.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-pd-yogurt-cake",
    "name": "Simple Golden Yogurt Cake",
    "description": "Actual recipe-maker's finished-dish photograph · beginner guided recipe",
    "servings": 12,
    "categories": [
      "Desserts"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 75,
    "photo": "./assets/verified/yogurt-cake.webp",
    "photoSource": "https://publicdomainrecipes.com/yogurt-cake/",
    "photoCredit": "pestanzul · Public Domain Recipes",
    "photoLicense": "Unlicense / public domain",
    "photoLicenseUrl": "https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md",
    "photoKind": "original-recipe-source-photo",
    "recipeSourceUrl": "https://publicdomainrecipes.com/yogurt-cake/",
    "recipeSourceName": "Public Domain Recipes",
    "recipeOrigin": "adapted-original-cooking-source",
    "ingredients": [
      "2.5 cup all-purpose flour",
      "0.75 cup white sugar",
      "3 each eggs",
      "0.5 cup butter",
      "0.75 cup plain yogurt",
      "2 tsp baking powder",
      "0.33 cup raisins"
    ],
    "items": [
      {
        "name": "all-purpose flour",
        "qty": 2.5,
        "unit": "cup"
      },
      {
        "name": "white sugar",
        "qty": 0.75,
        "unit": "cup"
      },
      {
        "name": "eggs",
        "qty": 3,
        "unit": "each"
      },
      {
        "name": "butter",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "plain yogurt",
        "qty": 0.75,
        "unit": "cup"
      },
      {
        "name": "baking powder",
        "qty": 2,
        "unit": "tsp"
      },
      {
        "name": "raisins",
        "qty": 0.33,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Heat oven and prepare pan",
        "body": "Preheat oven to 350°F (180°C). Grease a 9×5-inch loaf pan or a similarly sized cake pan and line with parchment.",
        "seconds": 0
      },
      {
        "title": "Mix eggs and sugar",
        "body": "Beat 3 eggs with ¾ cup sugar in a bowl for a few minutes until frothy. Stir in ½ cup melted and slightly cooled butter.",
        "seconds": 180
      },
      {
        "title": "Add yogurt and flour",
        "body": "Stir in ¾ cup plain yogurt. In another bowl combine 2½ cups flour with 2 tsp baking powder; fold into the wet ingredients just until smooth.",
        "seconds": 0
      },
      {
        "title": "Add fruit",
        "body": "Gently stir in ⅓ cup raisins if desired to resemble the original recipe's sliced cake. The batter should be thick but spreadable.",
        "seconds": 0
      },
      {
        "title": "Bake the cake",
        "body": "Pour into pan and bake about 40–50 minutes. Check at 40 minutes: a toothpick in the center should come out clean or with only dry crumbs.",
        "seconds": 2700
      },
      {
        "title": "Cool before cutting",
        "body": "Cool in pan around 10 minutes, then transfer to a rack to cool further. Keep covered once cooled.",
        "seconds": 600
      }
    ]
  }
];
let added=0;
for(const r of incoming){
 if(!state.recipes.some(existing=>existing.id===r.id)){state.recipes.push(r);added++}
}
if(added)save();
})();