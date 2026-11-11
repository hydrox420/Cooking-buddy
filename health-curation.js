// Kitchen Buddy conservative recipe review — November 11, 2026.
// Goals: simpler, balanced everyday meals; cautious reflux-aware defaults.
// This is an ingredient-level screen, NOT a medical guarantee or GERD diagnosis.
// Protects the user's custom recipes, personal photos, pantry, fridge and prior plans in the saved backup.
(function(){
'use strict';
const VERSION='reflux-conscious-2026-11-11-v1';
const APPROVED={
  "garlic-chicken-rice": "Lean chicken, broccoli and brown rice; small cheese and butter portions",
  "easy-spinach-egg-cheese-wraps": "Eggs, spinach and modest cheese; a balanced mild breakfast",
  "kb-garlic-paprika-turkey-rice-bowl": "Lean turkey, broccoli, peppers and brown rice with minimal oil",
  "kb-baked-salmon-sweet-potato-broccoli": "Salmon, broccoli and sweet potato; minimal added fat and no citrus"
};
const EXCLUDED_REASON={
  "lemon-garlic-tilapia-broccoli-rice": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "mochis-five-second-timer-test": "Timer diagnostic, not a meal",
  "easy-honey-garlic-chicken-broccoli-rice": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "easy-turkey-taco-rice-bowls": "Tomato-based acidic ingredients are common reflux triggers",
  "easy-sheet-pan-sausage-potatoes-peppers": "Rich/high-fat preparation or processed meat",
  "easy-tomato-spinach-chickpea-pasta": "Tomato-based acidic ingredients are common reflux triggers",
  "easy-garlic-shrimp-green-bean-rice": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "kb-overnight-oats-berry": "Oatmeal is a stated food dislike",
  "kb-chana-masala": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-korean-bibimbap": "Spicy sauce or seasoning can aggravate reflux",
  "kb-chicken-teriyaki": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "kb-chicken-fajitas": "Spicy sauce or seasoning can aggravate reflux",
  "kb-chicken-adobo": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "kb-lentil-soup": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-salt-onigiri": "Side/snack rather than a balanced standalone meal",
  "kb-easy-pad-thai-tofu": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "kb-pd-chicken-pasta-casserole": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-fall-chickpea-curry": "Spicy sauce or seasoning can aggravate reflux",
  "kb-pd-pasta-arrabbiata": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-pan-seared-chicken": "Protein-only recipe lacks a vegetable or whole-grain side",
  "kb-pd-shakshouka": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-quesadilla": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-french-toast": "Dessert or sweet breakfast, not a balanced everyday meal",
  "kb-pd-honey-sriracha-chicken-thighs": "Spicy sauce or seasoning can aggravate reflux",
  "kb-pd-guacamole": "Side/snack rather than a balanced standalone meal",
  "kb-pd-chocolate-chip-cookies": "Dessert or sweet breakfast, not a balanced everyday meal",
  "kb-pd-butter-chicken-masala": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-lasagna": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-potato-leek-soup": "Rich/high-fat preparation or processed meat",
  "kb-pd-sweet-potato-fries": "Side/snack rather than a balanced standalone meal",
  "kb-pd-baked-pasta-with-broccoli": "Rich/high-fat preparation or processed meat",
  "kb-pd-hummus": "Side/snack rather than a balanced standalone meal",
  "kb-pd-apple-pie": "Dessert or sweet breakfast, not a balanced everyday meal",
  "kb-pd-basic-waffles": "Dessert or sweet breakfast, not a balanced everyday meal",
  "kb-pd-cheesy-meatballs": "Tomato-based acidic ingredients are common reflux triggers",
  "kb-pd-stracciatella-soup": "Broth and eggs alone are not a balanced standalone meal",
  "kb-pd-parmesan-potatoes": "Side/snack rather than a balanced standalone meal",
  "kb-pd-yogurt-cake": "Dessert or sweet breakfast, not a balanced everyday meal",
  "kb-lemon-garlic-shrimp-scampi-rosemary-focaccia": "Citrus or acidic dressing/sauce is unsuitable for the cautious default",
  "kb-shrimp-okra-kidney-bean-pasta": "Tomato-based acidic ingredients are common reflux triggers"
};
const trigger=/(?:tomato(?:es)?|marinara|salsa|hot sauce|sriracha|gochujang|chili powder|chili flakes|curry paste|lemon|lime|citrus|heavy cream)/i;
if(typeof state==='undefined'||!Array.isArray(state.recipes))return;
const archive=(state.healthReviewArchive&&typeof state.healthReviewArchive==='object'&&!Array.isArray(state.healthReviewArchive))?{...state.healthReviewArchive}:{};
const savedPlans=Array.isArray(state.healthReviewArchivedPlans)?state.healthReviewArchivedPlans.slice():[];
const active=[],rejected=[];
for(const recipe of state.recipes){
 const ingredientText=Array.isArray(recipe.ingredients)?recipe.ingredients.join(' '):'';
 const valid=Boolean(APPROVED[recipe.id])&&Array.isArray(recipe.steps)&&recipe.steps.length>0&&
  ingredientText.length>0&&!trigger.test(ingredientText);
 if(valid){
  active.push({...recipe,healthReview:{version:VERSION,label:'Reflux-conscious review',note:APPROVED[recipe.id]}});
 }else{
  const why=EXCLUDED_REASON[recipe.id]||
   (APPROVED[recipe.id]?'Recipe was changed or incomplete; needs another review':'Not individually reviewed for the current meal guidelines');
  if(!Object.prototype.hasOwnProperty.call(archive,recipe.id)){
   archive[recipe.id]={recipe,reason:why,archivedAt:'2026-11-11'};
  }
  rejected.push(recipe);
 }
}
const allowed=new Set(active.map(r=>r.id));
const plans=Array.isArray(state.planned)?state.planned:[];
const keptPlans=[];
for(const plan of plans){
 if(allowed.has(plan.recipeId)){keptPlans.push(plan);continue}
 const fingerprint=JSON.stringify(plan);
 if(!savedPlans.some(x=>JSON.stringify(x)===fingerprint))savedPlans.push(plan);
}
const next={...state,recipes:active,planned:keptPlans,healthReviewArchive:archive,
 healthReviewArchivedPlans:savedPlans,healthReviewVersion:VERSION};
try{
 // Write the complete backup and edited library together; do not delete unsaved personal work.
 localStorage.setItem('cookingBuddy_v1',JSON.stringify(next));
 state=next;
}catch(error){
 console.error('Health review could not safely save the archive; the original recipe library was left untouched.',error);
 return;
}
window.kbHealthReviewSummary={version:VERSION,active:active.length,archived:Object.keys(archive).length,
 reviewedIDs:Object.keys(APPROVED)};
const home=document.querySelector('#home .library-intro')||document.querySelector('.library-intro');
if(home&&!document.querySelector('#kbReviewNotice')){
 const note=document.createElement('p');note.id='kbReviewNotice';note.className='kb-review-notice';
 note.textContent='✓ '+active.length+' meals reviewed for a mild, balanced, reflux-conscious starting menu. Individual food triggers can differ.';
 home.append(note);
}
const settings=document.getElementById('settings');
if(settings&&!document.getElementById('kbReviewArchive')){
 const details=document.createElement('details');details.id='kbReviewArchive';details.className='cb-panel';
 const heading=document.createElement('summary');heading.textContent='Recipe health review — '+active.length+' kept, '+Object.keys(archive).length+' archived';
 const intro=document.createElement('p');intro.textContent='Archived recipes are removed from the active cookbook and meal plan, but retained in your browser backup. New personal imports are held for review. No dietary screen can guarantee zero reflux symptoms.';
 details.append(heading,intro);
 const list=document.createElement('ul');
 for(const entry of Object.values(archive)){
  const li=document.createElement('li');
  li.textContent=(entry.recipe?.name||'Unnamed recipe')+' — '+entry.reason;
  list.append(li);
 }
 details.append(list);settings.append(details);
}
const style=document.createElement('style');
style.textContent='.kb-review-notice{font-size:13px;color:#c4e9bc;line-height:1.5;margin:8px 0 13px}.kb-reviewed-chip{font-size:11px;background:#31533c;color:#e3f2dc;padding:4px 7px;border-radius:20px;white-space:nowrap}#kbReviewArchive ul{padding-left:20px;line-height:1.55;font-size:13px}';
document.head.append(style);
if(typeof renderPlanned==='function')renderPlanned();
if(typeof renderShopping==='function')renderShopping();
})();
