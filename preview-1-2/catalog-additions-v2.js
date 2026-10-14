// Kitchen Buddy catalog expansion: curated beginner-friendly recipes and photo credits.
// Idempotent: adds missing IDs without replacing user recipes, favorites, photos, or plan.
(function(){
'use strict';
const incoming=[
  {
    "id": "kb-overnight-oats-berry",
    "name": "Berry Overnight Oats",
    "description": "No-cook breakfast · prep tonight, enjoy tomorrow",
    "servings": 2,
    "categories": [
      "Breakfast",
      "Quick Meals",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 10,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Protein%20overnight%20oats.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Protein_overnight_oats.jpg",
    "photoCredit": "Nervy8924",
    "photoLicense": "CC BY-SA 4.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "1 cup rolled oats",
      "1 cup milk",
      "½ cup plain yogurt",
      "1 cup berries",
      "1 tbsp chia seeds",
      "1 tsp honey"
    ],
    "items": [
      {
        "name": "rolled oats",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "milk",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "plain yogurt",
        "qty": 0.5,
        "unit": "cup"
      },
      {
        "name": "berries",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "chia seeds",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "honey",
        "qty": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Mix the base",
        "body": "Divide the oats, milk, yogurt and chia seeds between two jars. Stir until all the oats are moistened.",
        "seconds": 0
      },
      {
        "title": "Add fruit and sweetness",
        "body": "Top with berries and drizzle ½ teaspoon honey into each jar.",
        "seconds": 0
      },
      {
        "title": "Refrigerate overnight",
        "body": "Cover both jars and refrigerate for at least 4 hours, ideally overnight. Keep chilled at 40°F / 4°C or below.",
        "seconds": 0
      },
      {
        "title": "Serve cold",
        "body": "Stir again before eating. Add a splash of milk if it is too thick. Keep leftovers refrigerated and use within 3–4 days.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-chana-masala",
    "name": "Easy Chana Masala",
    "description": "Spiced chickpeas in tomato sauce · about 30 minutes",
    "servings": 2,
    "categories": [
      "Indian",
      "Dinner",
      "Lunch",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan"
    ],
    "timeMinutes": 30,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Channa%20Masala.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Channa_Masala.jpg",
    "photoCredit": "Bhavana Homecook",
    "photoLicense": "CC BY-SA 4.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "1 can chickpeas (15 oz), drained and rinsed",
      "1 cup canned crushed tomatoes",
      "½ onion, diced",
      "2 cloves garlic, minced",
      "1 tsp grated ginger",
      "1 tbsp olive oil",
      "1 tsp garam masala",
      "½ tsp cumin",
      "½ tsp turmeric",
      "½ cup water",
      "1 cup cooked rice to serve"
    ],
    "items": [
      {
        "name": "canned chickpeas",
        "qty": 1,
        "unit": "can"
      },
      {
        "name": "crushed tomatoes",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "onion",
        "qty": 0.5,
        "unit": "each"
      },
      {
        "name": "garlic",
        "qty": 2,
        "unit": "clove"
      },
      {
        "name": "ginger",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "garam masala",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "cumin",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "turmeric",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "cooked rice",
        "qty": 1,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Prepare ingredients",
        "body": "Drain and rinse the chickpeas. Dice the onion, mince garlic, grate ginger, and measure all the spices.",
        "seconds": 0
      },
      {
        "title": "Soften onion",
        "body": "Heat olive oil in a saucepan over medium heat. Cook onion for 5 minutes, stirring, until soft.",
        "seconds": 300
      },
      {
        "title": "Toast spices",
        "body": "Add garlic, ginger, garam masala, cumin and turmeric. Stir for 1 minute so the garlic does not burn.",
        "seconds": 60
      },
      {
        "title": "Simmer chickpeas",
        "body": "Add crushed tomatoes, chickpeas and ½ cup water. Simmer gently, partly covered, for about 12–15 minutes, stirring now and then.",
        "seconds": 900
      },
      {
        "title": "Serve over rice",
        "body": "Heat cooked rice according to its package instructions. Divide rice between two bowls and spoon hot chana masala on top. Refrigerate leftovers promptly.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-korean-bibimbap",
    "name": "Easy Vegetable Bibimbap",
    "description": "Korean-inspired rice bowl with vegetables and eggs",
    "servings": 2,
    "categories": [
      "Korean",
      "Lunch",
      "Dinner",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegetarian"
    ],
    "timeMinutes": 30,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Bibimbap.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:The_Bibimbap.jpg",
    "photoCredit": "Loozrboy",
    "photoLicense": "CC BY-SA 2.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "2 cups cooked rice",
      "2 eggs",
      "1 carrot, julienned",
      "1 cup mushrooms, sliced",
      "2 cups baby spinach",
      "2 tsp sesame oil",
      "1 tbsp soy sauce",
      "1 tbsp gochujang, optional",
      "1 tsp olive oil"
    ],
    "items": [
      {
        "name": "cooked rice",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "eggs",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "carrot",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "mushrooms",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "baby spinach",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "sesame oil",
        "qty": 2,
        "unit": "tsp"
      },
      {
        "name": "soy sauce",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "gochujang",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Get ingredients ready",
        "body": "Wash vegetables. Cut carrot into thin strips and slice the mushrooms. Warm cooked rice according to package instructions.",
        "seconds": 0
      },
      {
        "title": "Cook the vegetables",
        "body": "Heat olive oil in a large skillet over medium heat. Cook carrots for 3 minutes, add mushrooms for 4 minutes, then wilt spinach for 1–2 minutes. Keep vegetables separate on a clean plate.",
        "seconds": 540
      },
      {
        "title": "Cook the eggs",
        "body": "In the same skillet, cook eggs over medium heat until both whites and yolks are firm, or to your preferred food-safe doneness.",
        "seconds": 240
      },
      {
        "title": "Mix sauce",
        "body": "Stir together sesame oil, soy sauce and optional gochujang in a small bowl. Gochujang can be spicy and some brands contain wheat.",
        "seconds": 0
      },
      {
        "title": "Assemble bowls",
        "body": "Divide rice between two bowls, arrange vegetables in sections, top with an egg, and drizzle on sauce. Serve immediately.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-chicken-teriyaki",
    "name": "Chicken Teriyaki Rice Bowls",
    "description": "Sweet-savory chicken with broccoli and rice",
    "servings": 2,
    "categories": [
      "Japanese",
      "Dinner",
      "Lunch"
    ],
    "tags": [],
    "timeMinutes": 30,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20teriyaki.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Chicken_teriyaki.jpg",
    "photoCredit": "Blue Lotus",
    "photoLicense": "Creative Commons (see source)",
    "photoIsIllustrative": true,
    "ingredients": [
      "12 oz boneless skinless chicken breast",
      "2 cups broccoli florets",
      "2 cups cooked rice",
      "2 tbsp soy sauce",
      "1 tbsp honey",
      "1 tbsp rice vinegar",
      "1 tsp cornstarch",
      "1 tbsp olive oil"
    ],
    "items": [
      {
        "name": "boneless skinless chicken breast",
        "qty": 12,
        "unit": "oz"
      },
      {
        "name": "broccoli florets",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "cooked rice",
        "qty": 2,
        "unit": "cup"
      },
      {
        "name": "soy sauce",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "honey",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "rice vinegar",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "cornstarch",
        "qty": 1,
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
        "title": "Prepare chicken and sauce",
        "body": "Wash hands and prepare a clean cutting board for raw chicken. Cut chicken into bite-sized pieces. In a separate bowl stir soy sauce, honey, vinegar, cornstarch and 2 tablespoons water.",
        "seconds": 0
      },
      {
        "title": "Cook broccoli",
        "body": "Steam broccoli with a splash of water for 4–5 minutes, until hot and fork-tender. Transfer to a clean plate.",
        "seconds": 300
      },
      {
        "title": "Cook chicken safely",
        "body": "Heat olive oil in a skillet over medium heat. Cook chicken pieces 6–9 minutes, stirring, until the thickest piece reaches 165°F (74°C). Avoid cross-contamination with raw chicken utensils.",
        "seconds": 540
      },
      {
        "title": "Glaze chicken",
        "body": "Pour the sauce into the skillet and stir over medium-low heat for 1–2 minutes until thick and glossy. Bring sauce to a simmer after it has contacted the chicken.",
        "seconds": 120
      },
      {
        "title": "Fill bowls",
        "body": "Heat rice using package instructions. Serve chicken with broccoli and rice, and refrigerate leftovers within 2 hours.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-chicken-fajitas",
    "name": "Chicken Fajitas",
    "description": "Colorful peppers and sizzling chicken · about 30 minutes",
    "servings": 2,
    "categories": [
      "Mexican",
      "Dinner",
      "Quick Meals"
    ],
    "tags": [],
    "timeMinutes": 30,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20fajitas.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Chicken_fajitas.jpg",
    "photoCredit": "jeffreyw",
    "photoLicense": "CC BY 2.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "12 oz boneless skinless chicken breast",
      "2 bell peppers, sliced",
      "½ onion, sliced",
      "4 small tortillas",
      "1 tbsp olive oil",
      "1 tsp chili powder",
      "½ tsp cumin",
      "½ tsp garlic powder",
      "½ lime"
    ],
    "items": [
      {
        "name": "boneless skinless chicken breast",
        "qty": 12,
        "unit": "oz"
      },
      {
        "name": "bell pepper",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "onion",
        "qty": 0.5,
        "unit": "each"
      },
      {
        "name": "tortillas",
        "qty": 4,
        "unit": "each"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "chili powder",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "cumin",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "garlic powder",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "lime",
        "qty": 0.5,
        "unit": "each"
      }
    ],
    "steps": [
      {
        "title": "Prep chicken and vegetables",
        "body": "Wash peppers, cut into thin strips, and slice onion. On a separate board, cut raw chicken into thin strips. Wash hands and sanitize work surfaces afterward.",
        "seconds": 0
      },
      {
        "title": "Season chicken",
        "body": "Toss raw chicken with chili powder, cumin and garlic powder using utensils that will not touch ready-to-eat foods.",
        "seconds": 0
      },
      {
        "title": "Cook chicken",
        "body": "Heat half the oil in a skillet over medium-high heat. Cook chicken 6–9 minutes until every piece reaches 165°F (74°C) at its thickest point. Move to a clean plate.",
        "seconds": 540
      },
      {
        "title": "Cook peppers and onions",
        "body": "Add remaining oil and cook sliced peppers and onion for 6–8 minutes, stirring, until tender. Return cooked chicken to the pan and heat everything together.",
        "seconds": 480
      },
      {
        "title": "Warm tortillas and serve",
        "body": "Warm tortillas as package instructs. Fill with chicken and vegetables, squeeze lime over top, and serve. Refrigerate leftovers promptly.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-chicken-adobo",
    "name": "Filipino Chicken Adobo",
    "description": "Savory vinegar-soy braised chicken with rice",
    "servings": 2,
    "categories": [
      "Filipino",
      "Dinner"
    ],
    "tags": [],
    "timeMinutes": 45,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20adobo.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Chicken_adobo.jpg",
    "photoCredit": "dbgg1979",
    "photoLicense": "CC BY 2.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "1 lb boneless chicken thighs",
      "⅓ cup soy sauce",
      "¼ cup white vinegar",
      "4 garlic cloves, crushed",
      "2 bay leaves",
      "½ tsp black pepper",
      "1 tsp cooking oil",
      "1 cup water",
      "2 cups cooked rice"
    ],
    "items": [
      {
        "name": "boneless chicken thighs",
        "qty": 1,
        "unit": "lb"
      },
      {
        "name": "soy sauce",
        "qty": 0.333,
        "unit": "cup"
      },
      {
        "name": "white vinegar",
        "qty": 0.25,
        "unit": "cup"
      },
      {
        "name": "garlic",
        "qty": 4,
        "unit": "clove"
      },
      {
        "name": "bay leaves",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "black pepper",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "cooking oil",
        "qty": 1,
        "unit": "tsp"
      },
      {
        "name": "cooked rice",
        "qty": 2,
        "unit": "cup"
      }
    ],
    "steps": [
      {
        "title": "Measure the sauce",
        "body": "Combine soy sauce, vinegar, crushed garlic, bay leaves and black pepper in a bowl. Prepare raw chicken separately and wash hands after handling.",
        "seconds": 0
      },
      {
        "title": "Brown chicken",
        "body": "Heat oil in a covered skillet or saucepan over medium heat. Add chicken and brown each side 2–3 minutes, using raw-chicken utensils only for raw meat.",
        "seconds": 360
      },
      {
        "title": "Braise chicken",
        "body": "Pour in sauce and 1 cup water. Bring to a simmer, cover loosely, and cook for 20–25 minutes, turning pieces occasionally.",
        "seconds": 1500
      },
      {
        "title": "Check doneness",
        "body": "Use a food thermometer in the thickest piece: chicken must reach at least 165°F (74°C). Simmer longer if needed. Reduce sauce uncovered briefly if too thin.",
        "seconds": 0
      },
      {
        "title": "Serve with rice",
        "body": "Heat rice according to package instructions and divide onto two plates. Serve chicken with a spoon of the hot braising sauce; discard bay leaves.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-lentil-soup",
    "name": "Cozy Lentil Vegetable Soup",
    "description": "Budget-friendly soup that makes satisfying leftovers",
    "servings": 2,
    "categories": [
      "Soups & Stews",
      "Dinner",
      "Lunch",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan"
    ],
    "timeMinutes": 45,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Lentil%20Soup.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Lentil_Soup.jpg",
    "photoCredit": "Serine Ben Brahim",
    "photoLicense": "CC BY-SA 4.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "¾ cup dry brown lentils, rinsed",
      "1 carrot, diced",
      "1 celery stalk, diced",
      "½ onion, diced",
      "1 can diced tomatoes (14 oz)",
      "3 cups vegetable broth",
      "1 tbsp olive oil",
      "½ tsp ground cumin",
      "1 tsp lemon juice"
    ],
    "items": [
      {
        "name": "dry lentils",
        "qty": 0.75,
        "unit": "cup"
      },
      {
        "name": "carrot",
        "qty": 1,
        "unit": "each"
      },
      {
        "name": "celery",
        "qty": 1,
        "unit": "stalk"
      },
      {
        "name": "onion",
        "qty": 0.5,
        "unit": "each"
      },
      {
        "name": "diced tomatoes",
        "qty": 1,
        "unit": "can"
      },
      {
        "name": "vegetable broth",
        "qty": 3,
        "unit": "cup"
      },
      {
        "name": "olive oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "cumin",
        "qty": 0.5,
        "unit": "tsp"
      },
      {
        "name": "lemon juice",
        "qty": 1,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Rinse and prep",
        "body": "Rinse lentils in a fine sieve and check for debris. Dice carrot, celery and onion.",
        "seconds": 0
      },
      {
        "title": "Soften vegetables",
        "body": "Heat olive oil in a pot over medium heat. Add onion, carrot and celery and cook for about 6 minutes, stirring occasionally.",
        "seconds": 360
      },
      {
        "title": "Start simmering",
        "body": "Add lentils, broth, tomatoes and cumin. Bring to a boil, then reduce to a gentle simmer.",
        "seconds": 0
      },
      {
        "title": "Cook until tender",
        "body": "Partly cover and simmer 25–30 minutes, stirring occasionally. Add water if it becomes too thick; lentils should be soft throughout.",
        "seconds": 1800
      },
      {
        "title": "Finish and store",
        "body": "Stir in lemon juice and serve hot. Cool leftovers promptly in shallow containers, refrigerate within 2 hours, and eat within 3–4 days.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-salt-onigiri",
    "name": "Simple Japanese Onigiri",
    "description": "Rice balls wrapped in seaweed · great for lunch",
    "servings": 2,
    "categories": [
      "Japanese",
      "Lunch",
      "Snacks & Sides",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan"
    ],
    "timeMinutes": 25,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Onigiri.JPG?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Onigiri.JPG",
    "photoCredit": "Pcs34560",
    "photoLicense": "Public domain",
    "photoIsIllustrative": true,
    "ingredients": [
      "1 cup uncooked Japanese short-grain rice",
      "1¼ cups water (or as directed by rice package)",
      "2 sheets nori seaweed",
      "¼ tsp salt"
    ],
    "items": [
      {
        "name": "Japanese short grain rice",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "nori sheets",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "salt",
        "qty": 0.25,
        "unit": "tsp"
      }
    ],
    "steps": [
      {
        "title": "Rinse rice",
        "body": "Put short-grain rice into a bowl and rinse with cold water several times until water is less cloudy. Drain.",
        "seconds": 0
      },
      {
        "title": "Cook rice",
        "body": "Cook rice with the amount of water specified on the package or rice-cooker instructions. Allow to rest covered for 5 minutes when done.",
        "seconds": 0
      },
      {
        "title": "Cool enough to handle",
        "body": "Transfer rice to a clean bowl and allow it to cool briefly until comfortable to touch; do not leave cooked rice at room temperature for more than 2 hours.",
        "seconds": 0
      },
      {
        "title": "Shape rice balls",
        "body": "With freshly washed, slightly damp hands, sprinkle a little salt onto palms. Shape warm rice into 4 compact triangles or rounds.",
        "seconds": 0
      },
      {
        "title": "Add nori and serve",
        "body": "Cut nori into strips and wrap the onigiri. Eat promptly or chill rapidly, covered, and keep refrigerated until serving. Rice needs careful time-temperature control.",
        "seconds": 0
      }
    ]
  },
  {
    "id": "kb-easy-pad-thai-tofu",
    "name": "Easy Tofu Pad Thai",
    "description": "Thai-inspired rice noodles, tofu and lime",
    "servings": 2,
    "categories": [
      "Thai",
      "Dinner",
      "Lunch",
      "Vegetarian & Vegan"
    ],
    "tags": [
      "Vegan"
    ],
    "timeMinutes": 30,
    "photo": "https://commons.wikimedia.org/wiki/Special:FilePath/Pad%20thai.jpg?width=800",
    "photoSource": "https://commons.wikimedia.org/wiki/File:Pad_thai.jpg",
    "photoCredit": "BenFrantzDale",
    "photoLicense": "CC BY-SA 3.0",
    "photoIsIllustrative": true,
    "ingredients": [
      "6 oz dry rice noodles",
      "8 oz firm tofu, pressed and diced",
      "1 cup bean sprouts",
      "2 scallions, sliced",
      "2 tbsp soy sauce",
      "1 tbsp brown sugar",
      "1 tbsp lime juice",
      "1 tbsp cooking oil",
      "2 tbsp chopped peanuts"
    ],
    "items": [
      {
        "name": "dry rice noodles",
        "qty": 6,
        "unit": "oz"
      },
      {
        "name": "firm tofu",
        "qty": 8,
        "unit": "oz"
      },
      {
        "name": "bean sprouts",
        "qty": 1,
        "unit": "cup"
      },
      {
        "name": "scallions",
        "qty": 2,
        "unit": "each"
      },
      {
        "name": "soy sauce",
        "qty": 2,
        "unit": "tbsp"
      },
      {
        "name": "brown sugar",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "lime juice",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "cooking oil",
        "qty": 1,
        "unit": "tbsp"
      },
      {
        "name": "peanuts",
        "qty": 2,
        "unit": "tbsp"
      }
    ],
    "steps": [
      {
        "title": "Prep noodles and sauce",
        "body": "Cook or soak rice noodles according to package instructions. Drain. In a bowl whisk soy sauce, sugar, lime juice and 2 tablespoons water.",
        "seconds": 0
      },
      {
        "title": "Prepare tofu",
        "body": "Drain, press and dice tofu. Wash bean sprouts and scallions.",
        "seconds": 0
      },
      {
        "title": "Brown tofu",
        "body": "Heat cooking oil in a large nonstick skillet over medium-high heat. Cook tofu 5–7 minutes until edges are golden, turning gently.",
        "seconds": 420
      },
      {
        "title": "Toss with noodles",
        "body": "Add cooked noodles and sauce, tossing for 2–3 minutes until the sauce coats everything. Add a splash of water if noodles stick.",
        "seconds": 180
      },
      {
        "title": "Finish and serve",
        "body": "Add bean sprouts and scallions; cook 1–2 minutes until hot. Divide between bowls and top with peanuts. Note this is a simplified Pad Thai inspired by the original dish.",
        "seconds": 120
      }
    ]
  }
];
let added=0;
for(const r of incoming){if(!state.recipes.some(existing=>existing.id===r.id)){state.recipes.push(r);added++}}
if(added)save();
})();
