// Kitchen Buddy: real recipe photographs only — 2026-11-11.
// Source photos are actual finished-dish submissions from publicdomainrecipes.com.
// No generic stock/AI/illustrative substitutes. Preserve personal data:image uploads.
// Never replace recipes or their photos with something that depicts another dish.
(function(){'use strict';
const PENDING='./photo-pending.svg';
const VERIFIED={
  "kb-pd-chicken-pasta-casserole": {
    "photo": "./assets/verified/chicken-pasta-casserole.webp",
    "recipeUrl": "https://publicdomainrecipes.com/chicken-pasta-casserole/",
    "credit": "Miika Nissi · Public Domain Recipes",
    "license": "Unlicense / public domain, as stated by the source project",
    "photoSource": "https://publicdomainrecipes.com/chicken-pasta-casserole/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-fall-chickpea-curry": {
    "photo": "./assets/verified/fall-vegetable-and-chickpea-curry.webp",
    "recipeUrl": "https://publicdomainrecipes.com/fall-vegetable-and-chickpea-curry/",
    "credit": "Joel Maxuel · Public Domain Recipes",
    "license": "Unlicense / public domain, as stated by the source project",
    "photoSource": "https://publicdomainrecipes.com/fall-vegetable-and-chickpea-curry/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-pasta-arrabbiata": {
    "photo": "./assets/verified/pasta-arrabbiata.webp",
    "recipeUrl": "https://publicdomainrecipes.com/pasta-arrabbiata/",
    "credit": "klisurovi4 · Public Domain Recipes",
    "license": "Unlicense / public domain, as stated by the source project",
    "photoSource": "https://publicdomainrecipes.com/pasta-arrabbiata/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-pan-seared-chicken": {
    "photo": "./assets/verified/pan-seared-chicken.webp",
    "recipeUrl": "https://publicdomainrecipes.com/pan-seared-chicken/",
    "credit": "yaroslav-smirnov · Public Domain Recipes",
    "license": "Unlicense / public domain, as stated by the source project",
    "photoSource": "https://publicdomainrecipes.com/pan-seared-chicken/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-shakshouka": {
    "photo": "./assets/verified/shakshouka.webp",
    "recipeUrl": "https://publicdomainrecipes.com/shakshouka/",
    "credit": "jakub-korsak · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/shakshouka/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-quesadilla": {
    "photo": "./assets/verified/quesadilla.webp",
    "recipeUrl": "https://publicdomainrecipes.com/quesadilla/",
    "credit": "peebowo · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/quesadilla/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-french-toast": {
    "photo": "./assets/verified/french-toast.webp",
    "recipeUrl": "https://publicdomainrecipes.com/french-toast/",
    "credit": "ryan-wilson · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/french-toast/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-honey-sriracha-chicken-thighs": {
    "photo": "./assets/verified/honey-sriracha-chicken-thighs.webp",
    "recipeUrl": "https://publicdomainrecipes.com/honey-sriracha-chicken-thighs/",
    "credit": "Kevin Anderson · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/honey-sriracha-chicken-thighs/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-guacamole": {
    "photo": "./assets/verified/guacamole.webp",
    "recipeUrl": "https://publicdomainrecipes.com/guacamole/",
    "credit": "yaroslav-smirnov · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/guacamole/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-chocolate-chip-cookies": {
    "photo": "./assets/verified/chocolate-chip-cookies.webp",
    "recipeUrl": "https://publicdomainrecipes.com/chocolate-chip-cookies/",
    "credit": "mfed3 · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/chocolate-chip-cookies/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-butter-chicken-masala": {
    "photo": "./assets/verified/butter-chicken-masala.webp",
    "recipeUrl": "https://publicdomainrecipes.com/butter-chicken-masala/",
    "credit": "nihar-samantaray · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/butter-chicken-masala/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-lasagna": {
    "photo": "./assets/verified/lasagna.webp",
    "recipeUrl": "https://publicdomainrecipes.com/lasagna/",
    "credit": "yiusa · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/lasagna/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-potato-leek-soup": {
    "photo": "./assets/verified/potato-leek-soup.webp",
    "recipeUrl": "https://publicdomainrecipes.com/potato-leek-soup/",
    "credit": "cactar · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/potato-leek-soup/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-sweet-potato-fries": {
    "photo": "./assets/verified/sweet-potato-fries.webp",
    "recipeUrl": "https://publicdomainrecipes.com/sweet-potato-fries/",
    "credit": "shane-kunz · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/sweet-potato-fries/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-baked-pasta-with-broccoli": {
    "photo": "./assets/verified/baked-pasta-with-broccoli.webp",
    "recipeUrl": "https://publicdomainrecipes.com/baked-pasta-with-broccoli/",
    "credit": "davide-costa · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/baked-pasta-with-broccoli/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-hummus": {
    "photo": "./assets/verified/hummus.webp",
    "recipeUrl": "https://publicdomainrecipes.com/hummus/",
    "credit": "jacob-smith · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/hummus/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-apple-pie": {
    "photo": "./assets/verified/apple-pie.webp",
    "recipeUrl": "https://publicdomainrecipes.com/apple-pie/",
    "credit": "mfed3 · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/apple-pie/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-basic-waffles": {
    "photo": "./assets/verified/basic-waffles-01.webp",
    "recipeUrl": "https://publicdomainrecipes.com/basic-waffles/",
    "credit": "logianer · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/basic-waffles/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-cheesy-meatballs": {
    "photo": "./assets/verified/cheesy-meatballs.webp",
    "recipeUrl": "https://publicdomainrecipes.com/cheesy-meatballs/",
    "credit": "yaroslav-smirnov · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/cheesy-meatballs/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-stracciatella-soup": {
    "photo": "./assets/verified/stracciatella-soup.webp",
    "recipeUrl": "https://publicdomainrecipes.com/stracciatella-soup/",
    "credit": "pestanzul · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/stracciatella-soup/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-parmesan-potatoes": {
    "photo": "./assets/verified/parmesan-potatoes.webp",
    "recipeUrl": "https://publicdomainrecipes.com/parmesan-potatoes/",
    "credit": "yaroslav-smirnov · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/parmesan-potatoes/",
    "photoKind": "original-recipe-source-photo"
  },
  "kb-pd-yogurt-cake": {
    "photo": "./assets/verified/yogurt-cake.webp",
    "recipeUrl": "https://publicdomainrecipes.com/yogurt-cake/",
    "credit": "pestanzul · Public Domain Recipes",
    "license": "Unlicense / public domain",
    "photoSource": "https://publicdomainrecipes.com/yogurt-cake/",
    "photoKind": "original-recipe-source-photo"
  }
};
const ILLUSTRATED_IDS=new Set(["garlic-chicken-rice","lemon-garlic-tilapia-broccoli-rice","easy-honey-garlic-chicken-broccoli-rice","easy-turkey-taco-rice-bowls","easy-sheet-pan-sausage-potatoes-peppers","easy-spinach-egg-cheese-wraps","easy-tomato-spinach-chickpea-pasta","easy-garlic-shrimp-green-bean-rice","kb-overnight-oats-berry","kb-chana-masala","kb-korean-bibimbap","kb-chicken-teriyaki","kb-chicken-fajitas","kb-chicken-adobo","kb-lentil-soup","kb-salt-onigiri","kb-easy-pad-thai-tofu"]);
const UPLOADED_PHOTO=/^(?:data:image\/|blob:)/i;
const USER_PHOTO_KINDS=new Set(['user-uploaded-photo','user-selected-photo','personal-photo']);
function photoOwnedByUser(recipe){
 const photo=String(recipe?.photo||'');
 return UPLOADED_PHOTO.test(photo) || (USER_PHOTO_KINDS.has(recipe?.photoKind)&&photo&&!/\/assets\/(?:recipes|verified)\//i.test(photo));
}
function scrub(recipe){
 if(!recipe||typeof recipe!=='object'||photoOwnedByUser(recipe))return false;
 const expected=VERIFIED[recipe.id];
 if(expected&&recipe.recipeSourceUrl===expected.recipeUrl){
  // Exact source recipe: restore the photo AND accurate recipe-specific credit.
  const changes=recipe.photo!==expected.photo||recipe.photoSource!==expected.photoSource||
    recipe.photoKind!=='original-recipe-source-photo'||recipe.photoCredit!==expected.credit||
    recipe.photoIsIllustrative===true;
  if(changes){
   recipe.photo=expected.photo;recipe.photoSource=expected.photoSource;
   recipe.photoCredit=expected.credit;recipe.photoKind='original-recipe-source-photo';
   recipe.photoLicense=expected.license;recipe.photoLicenseUrl='https://github.com/ronaldl29/public-domain-recipes/blob/main/LICENSE.md';
   delete recipe.photoIsIllustrative;delete recipe.photoMatchNote;
  }
  return changes;
 }
 const img=String(recipe.photo||'');
 const unsafe=ILLUSTRATED_IDS.has(recipe.id)||
  /^https?:/i.test(img)||/\/assets\/recipes\//i.test(img)||
  recipe.photoIsIllustrative===true||recipe.photoKind==='illustrative-recipe-image'||
  /\/assets\/verified\//i.test(img);
 const held=recipe.healthReview?.version||recipe.recipeOrigin==='kitchen-buddy-original';
 if(!unsafe&&!held)return false;
 const hasStaleMetadata=Boolean(recipe.photoSource||recipe.photoCredit||recipe.photoLicense||recipe.photoLicenseUrl||recipe.photoIsIllustrative||recipe.photoMatchNote);
 if(img===PENDING&&!hasStaleMetadata&&recipe.photoKind==='awaiting-actual-finished-dish-photo')return false;
 recipe.photo=PENDING;recipe.photoKind='awaiting-actual-finished-dish-photo';
 delete recipe.photoSource;delete recipe.photoCredit;delete recipe.photoLicense;
 delete recipe.photoLicenseUrl;delete recipe.photoIsIllustrative;delete recipe.photoMatchNote;
 return true;
}
function enforce(){
 if(typeof state==='undefined'||!Array.isArray(state.recipes))return {updated:0};
 let changed=0;
 for(const recipe of state.recipes)if(scrub(recipe))changed++;
 const archive=state.healthReviewArchive;
 if(archive&&typeof archive==='object'){
  for(const entry of Object.values(archive))if(scrub(entry?.recipe))changed++;
 }
 if(changed){
  try{save()}catch(error){console.warn('Could not save recipe-photo audit',error)}
 }
 if(typeof renderRecipes==='function')renderRecipes();
 return {updated:changed,verifiedSourceRecipes:Object.keys(VERIFIED).length};
}
window.kbApplyRecipePhotoPolicy=enforce;
enforce();
})();
