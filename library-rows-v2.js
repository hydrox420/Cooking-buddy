// Kitchen Buddy compact, photo-first cookbook library (feature branch preview).
// Uses existing state, planning, cooking and local storage; never resets saved data.
(function(){
'use strict';
let selectedCategory='All';
// The 17 older recipes now use existing bundled illustrative food images.
// Images may be AI-generated or imperfect dish matches. Never overwrite user photos.
const originals={
  "garlic-chicken-rice": {
    "oldRemote": "https://images.pexels.com/photos/30635713/pexels-photo-30635713.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/garlic-chicken-rice.webp",
    "remote": "https://images.pexels.com/photos/36275016/pexels-photo-36275016.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/garlic-chicken-rice.webp?v=4",
    "source": "https://www.pexels.com/photo/delicious-chicken-meal-with-rice-and-broccoli-36275016/",
    "credit": "Evans Joel / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "lemon-garlic-tilapia-broccoli-rice": {
    "oldRemote": "https://images.pexels.com/photos/6200044/pexels-photo-6200044.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/lemon-garlic-tilapia-broccoli-rice.webp",
    "remote": "https://images.pexels.com/photos/30635698/pexels-photo-30635698.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/lemon-garlic-tilapia-broccoli-rice.webp?v=4",
    "source": "https://www.pexels.com/photo/grilled-tilapia-fillets-with-fresh-lime-wedges-30635698/",
    "credit": "IARA MELO / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-honey-garlic-chicken-broccoli-rice": {
    "oldRemote": "https://images.pexels.com/photos/105588/pexels-photo-105588.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-honey-garlic-chicken-broccoli-rice.webp",
    "remote": "https://images.pexels.com/photos/105588/pexels-photo-105588.jpeg?auto=compress&cs=tinysrgb&w=850",
    "local": "./assets/recipes/easy-honey-garlic-chicken-broccoli-rice.webp?v=4",
    "source": "https://www.pexels.com/photo/white-rice-chicken-and-broccoli-on-black-non-stick-pan-105588/",
    "credit": "Keegan Evans / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-turkey-taco-rice-bowls": {
    "oldRemote": "https://images.pexels.com/photos/8363975/pexels-photo-8363975.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-turkey-taco-rice-bowls.webp",
    "remote": "https://images.pexels.com/photos/14302291/pexels-photo-14302291.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/easy-turkey-taco-rice-bowls.webp?v=4",
    "source": "https://www.pexels.com/photo/bowl-with-mexican-food-14302291/",
    "credit": "Steve House / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-sheet-pan-sausage-potatoes-peppers": {
    "oldRemote": "https://images.pexels.com/photos/37275057/pexels-photo-37275057.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-sheet-pan-sausage-potatoes-peppers.webp",
    "remote": "https://images.pexels.com/photos/37275057/pexels-photo-37275057.jpeg?auto=compress&cs=tinysrgb&w=850",
    "local": "./assets/recipes/easy-sheet-pan-sausage-potatoes-peppers.webp?v=4",
    "source": "https://www.pexels.com/photo/rustic-potato-and-sausage-dish-on-checkered-cloth-37275057/",
    "credit": "cami / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-spinach-egg-cheese-wraps": {
    "oldRemote": "https://images.pexels.com/photos/4869465/pexels-photo-4869465.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-spinach-egg-cheese-wraps.webp",
    "remote": "https://images.pexels.com/photos/5848057/pexels-photo-5848057.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/easy-spinach-egg-cheese-wraps.webp?v=4",
    "source": "https://www.pexels.com/photo/wrap-with-chicken-and-cheese-5848057/",
    "credit": "Polina Tankilevitch / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-tomato-spinach-chickpea-pasta": {
    "oldRemote": "https://images.pexels.com/photos/19805084/pexels-photo-19805084.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-tomato-spinach-chickpea-pasta.webp",
    "remote": "https://images.pexels.com/photos/19805084/pexels-photo-19805084.jpeg?auto=compress&cs=tinysrgb&w=850",
    "local": "./assets/recipes/easy-tomato-spinach-chickpea-pasta.webp?v=4",
    "source": "https://www.pexels.com/photo/tomato-pasta-on-a-black-plate-19805084/",
    "credit": "mustafa türkeri / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "easy-garlic-shrimp-green-bean-rice": {
    "oldRemote": "https://images.pexels.com/photos/11015917/pexels-photo-11015917.jpeg?auto=compress&cs=tinysrgb&w=850",
    "oldLocal": "./assets/recipes/easy-garlic-shrimp-green-bean-rice.webp",
    "remote": "https://commons.wikimedia.org/wiki/Special:FilePath/DFC%202196%20Close-up%20of%20a%20stir-fry%20featuring%20shrimp%20tossed%20with%20sliced%20green%20beans%20and%20carrots%20in%20a%20savory%20sauce.jpg?width=1200",
    "local": "./assets/recipes/easy-garlic-shrimp-green-bean-rice.webp?v=4",
    "source": "https://commons.wikimedia.org/wiki/File:DFC_2196_Close-up_of_a_stir-fry_featuring_shrimp_tossed_with_sliced_green_beans_and_carrots_in_a_savory_sauce.jpg",
    "credit": "PattayaPatrol",
    "license": "CC BY-SA 4.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/4.0/",
    "recipeSourceUrl": null,
    "photoMatchNote": "Dish photo depicts shrimp and sliced green vegetables; rice is not pictured, and carrots are extra.",
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-overnight-oats-berry": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Protein%20overnight%20oats.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-overnight-oats-berry.webp",
    "remote": "https://images.pexels.com/photos/27850091/pexels-photo-27850091.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-overnight-oats-berry.webp?v=4",
    "source": "https://www.pexels.com/photo/a-bowl-of-oatmeal-with-berries-and-milk-27850091/",
    "credit": "Livilla Latini / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-chana-masala": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Channa%20Masala.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-chana-masala.webp",
    "remote": "https://images.pexels.com/photos/6544375/pexels-photo-6544375.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-chana-masala.webp?v=4",
    "source": "https://www.pexels.com/photo/food-healthy-beans-dinner-6544375/",
    "credit": "Alesia Kozik / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-korean-bibimbap": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/The%20Bibimbap.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-korean-bibimbap.webp",
    "remote": "https://images.pexels.com/photos/5773960/pexels-photo-5773960.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-korean-bibimbap.webp?v=4",
    "source": "https://www.pexels.com/photo/egg-on-top-of-a-bibimbap-5773960/",
    "credit": "Luis Becerra Fotógrafo / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-chicken-teriyaki": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20teriyaki.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-chicken-teriyaki.webp",
    "remote": "https://images.pexels.com/photos/28442544/pexels-photo-28442544.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-chicken-teriyaki.webp?v=4",
    "source": "https://www.pexels.com/photo/delicious-teriyaki-chicken-rice-bowl-close-up-28442544/",
    "credit": "Nadin Sh / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-chicken-fajitas": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20fajitas.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-chicken-fajitas.webp",
    "remote": "https://images.pexels.com/photos/32371267/pexels-photo-32371267.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-chicken-fajitas.webp?v=4",
    "source": "https://www.pexels.com/photo/grilled-chicken-fajitas-with-fresh-peppers-32371267/",
    "credit": "DΛVΞ GΛRCIΛ / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-chicken-adobo": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken%20adobo.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-chicken-adobo.webp",
    "remote": "https://commons.wikimedia.org/wiki/Special:FilePath/Filipino%20Chicken%20Adobo%20with%20rice.jpg?width=1200",
    "local": "./assets/recipes/kb-chicken-adobo.webp?v=4",
    "source": "https://commons.wikimedia.org/wiki/File:Filipino_Chicken_Adobo_with_rice.jpg",
    "credit": "Obsidian Soul",
    "license": "CC BY-SA 3.0",
    "licenseUrl": "https://creativecommons.org/licenses/by-sa/3.0/",
    "recipeSourceUrl": null,
    "photoMatchNote": "Chicken adobo served with white rice; preparation may differ from Kitchen Buddy's boneless version.",
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-lentil-soup": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Lentil%20Soup.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-lentil-soup.webp",
    "remote": "https://commons.wikimedia.org/wiki/Special:FilePath/Lentil_soup.JPG?width=1200",
    "local": "./assets/recipes/kb-lentil-soup.webp?v=4",
    "source": "https://commons.wikimedia.org/wiki/File:Lentil_soup.JPG",
    "credit": "Lemur12",
    "license": "CC BY-SA 3.0",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-salt-onigiri": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Onigiri.JPG?width=800",
    "oldLocal": "./assets/recipes/kb-salt-onigiri.webp",
    "remote": "https://images.pexels.com/photos/30874708/pexels-photo-30874708.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-salt-onigiri.webp?v=4",
    "source": "https://www.pexels.com/photo/delicious-onigiri-on-wooden-board-close-up-30874708/",
    "credit": "Airam Dato-on / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  },
  "kb-easy-pad-thai-tofu": {
    "oldRemote": "https://commons.wikimedia.org/wiki/Special:FilePath/Pad%20thai.jpg?width=800",
    "oldLocal": "./assets/recipes/kb-easy-pad-thai-tofu.webp",
    "remote": "https://images.pexels.com/photos/32083373/pexels-photo-32083373.jpeg?auto=compress&cs=tinysrgb&w=1200",
    "local": "./assets/recipes/kb-easy-pad-thai-tofu.webp?v=4",
    "source": "https://www.pexels.com/photo/delicious-pad-thai-with-tofu-and-fresh-herbs-32083373/",
    "credit": "Valeria Boltneva / Pexels",
    "license": "Pexels License",
    "licenseUrl": null,
    "recipeSourceUrl": null,
    "photoMatchNote": null,
    "kind": "licensed-illustrative-dish-photo"
  }
};
const photoPending='./photo-pending.svg';
let localDefaultChanges=0;
for(const r of state.recipes){
 const entry=originals[r.id];if(!entry)continue;
 // Migrate only built-in pictures or the old pending placeholder, not user uploads.
 const isBuiltIn=typeof r.photo==='string'&&(
  (r.photo.startsWith('./assets/recipes/')&&r.photo.split('?')[0]===entry.oldLocal)||
  r.photo===entry.oldRemote||r.photo===entry.remote||r.photo===entry.local||
  r.photo===photoPending
 );
 if(!r.photo||isBuiltIn){
  if(r.photo!==entry.local||r.photoSource!==entry.source||r.photoCredit!==entry.credit||r.photoKind!=='illustrative-recipe-image'){
   r.photo=entry.local;
   r.photoSource=entry.source;
   r.photoCredit=entry.credit;
   r.photoLicense=entry.license;
   if(entry.licenseUrl)r.photoLicenseUrl=entry.licenseUrl;else delete r.photoLicenseUrl;
   if(entry.photoMatchNote)r.photoMatchNote=entry.photoMatchNote;else delete r.photoMatchNote;
   r.photoKind='illustrative-recipe-image';
   localDefaultChanges++;
  }
 }
}
if(localDefaultChanges)save();

const ORDER=['Breakfast','Quick Meals','Dinner','Lunch','Indian','Korean','Japanese','Mexican','Italian','Chinese','Thai','Filipino','Mediterranean','Seafood','Soups & Stews','Vegetarian & Vegan','Snacks & Sides','Desserts','Other Recipes'];
const byName={
 'garlic-chicken-rice':['Dinner','Quick Meals'],
 'lemon-garlic-tilapia-broccoli-rice':['Dinner','Seafood'],
 'easy-honey-garlic-chicken-broccoli-rice':['Dinner','Quick Meals'],
 'easy-turkey-taco-rice-bowls':['Mexican','Dinner','Lunch'],
 'easy-sheet-pan-sausage-potatoes-peppers':['Dinner'],
 'easy-spinach-egg-cheese-wraps':['Breakfast','Quick Meals','Lunch'],
 'easy-tomato-spinach-chickpea-pasta':['Italian','Dinner','Lunch'],
 'easy-garlic-shrimp-green-bean-rice':['Seafood','Dinner','Quick Meals']
};
function categories(r){
 if(Array.isArray(r.categories)&&r.categories.length)return r.categories;
 if(byName[r.id])return byName[r.id];
 const name=r.name.toLowerCase();
 if(/tilapia|shrimp|salmon|fish/.test(name))return ['Seafood','Dinner'];
 if(/breakfast|pancake|egg|oat/.test(name))return ['Breakfast','Quick Meals'];
 if(/taco|fajita|burrito|enchilada/.test(name))return ['Mexican','Dinner'];
 if(/noodle|pasta|lasagna/.test(name))return ['Italian','Dinner'];
 return ['Other Recipes'];
}
function testRecipe(r){return r.id==='mochis-five-second-timer-test'}
function build(tag,cls,txt){const el=document.createElement(tag);if(cls)el.className=cls;if(txt!==undefined)el.textContent=txt;return el}
function card(r){
 const i=state.recipes.indexOf(r);
 const root=build('article','kb-compact-card');
 const photo=build('button','kb-card-picture');
 photo.type='button';photo.setAttribute('aria-label','Open '+r.name);photo.onclick=()=>openCookingRecipe(i);
 const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=r.photo||'./meal-placeholder.svg';img.alt=r.name;
 img.onerror=()=>{img.onerror=null;img.src=photoPending};
 photo.append(img);root.append(photo);
 const info=build('div','kb-compact-info');
 const title=build('button','kb-card-title',r.name);title.type='button';title.onclick=()=>openCookingRecipe(i);
 info.append(title);
 const meta=build('div','kb-card-meta');
 if(Number(r.timeMinutes)>0)meta.append(build('span','kb-card-time','◷ '+r.timeMinutes+' min'));
 else meta.append(build('span','kb-card-time',r.steps.length+' steps'));
 const tags=Array.isArray(r.tags)?r.tags:[];
 for(const tag of tags.slice(0,2)){
  let sym={'Vegan':'🌱','Vegetarian':'🥬','Gluten-free':'GF','Dairy-free':'DF','Spicy':'🌶️'}[tag]||'';
  const pill=build('button','kb-diet-tag',sym||tag);pill.type='button';
  pill.dataset.kind=tag.toLowerCase().replace(/[^a-z]+/g,'-');
  pill.setAttribute('aria-label','What does '+tag+' mean?');
  pill.setAttribute('aria-expanded','false');pill.title='Tap to explain '+tag;
  pill.onclick=event=>{event.stopPropagation();window.kbShowDietInfo?.(pill,tag)};
  meta.append(pill);
 }
 info.append(meta);
 // One plus action to add a meal, with favorites reserved for the recipe detail screen.
 const plus=build('button','kb-card-plan','+');plus.type='button';
 plus.title='Add to meal plan';
 plus.setAttribute('aria-label','Add '+r.name+' to meal plan');
 plus.onclick=()=>addRecipeShopping(i);
 root.append(info,plus);return root;
}
function heading(name,list,viewAll){
 const row=build('div','kb-row-heading');row.append(build('h3','',name+(name==='Favorites'?' ♥':'')));
 const btn=build('button','kb-see-all',viewAll?'See all ›':'');btn.type='button';
 if(viewAll){btn.onclick=()=>{selectedCategory=name;renderRecipes();document.getElementById('recipes').scrollIntoView({block:'start',behavior:'smooth'})};row.append(btn)}
 return row;
}
function flatGrid(root,title,recipes){
 const topline=build('div','kb-selected-heading');
 const back=build('button','kb-see-all','← All categories');back.onclick=()=>{selectedCategory='All';renderRecipes()};
 topline.append(back,build('h3','',title));root.append(topline);
 const grid=build('div','kb-recipe-grid');
 if(recipes.length)for(const r of recipes)grid.append(card(r));
 else grid.append(build('p','kb-empty','No recipes here yet.'));
 root.append(grid);
}
function searchMatch(r,q){
 return (r.name+' '+(r.description||'')+' '+r.ingredients.join(' ')+' '+categories(r).join(' ')).toLowerCase().includes(q);
}
function isPhotographed(r){
 return Boolean(r.photo && typeof r.photo==='string' && !r.photo.includes('photo-pending.svg') && !r.photo.includes('meal-placeholder.svg'));
}
function savedRecipeShelf(root,recipes){
 if(!recipes.length)return;
 const details=build('details','kb-unpictured-shelf');
 const label=build('summary','',recipes.length+' saved recipes without photographs');
 details.append(label);
 const list=build('div','kb-shelf-list');
 for(const r of recipes){
  const button=build('button','',r.name);button.type='button';
  button.setAttribute('aria-label','Open saved recipe: '+r.name);
  button.onclick=()=>openCookingRecipe(state.recipes.indexOf(r));
  list.append(button);
 }
 details.append(list);root.append(details);
}
renderRecipes=function(){
 const root=document.getElementById('recipes');
 if(!root)return;
 const q=(document.getElementById('recipeSearch')?.value||'').trim().toLowerCase();
 const all=state.recipes.filter(r=>!testRecipe(r)||q==='test'||q==='timer');
 const pictured=all.filter(isPhotographed);
 const unpictured=all.filter(r=>!isPhotographed(r));
 root.innerHTML='';root.classList.add('kb-library');
 const count=document.getElementById('recipeCount');if(count)count.textContent=pictured.length+' recipes';
 const old=document.getElementById('cbCategoryFilters');if(old)old.hidden=true;
 const matches=pictured.filter(r=>!q||searchMatch(r,q));
 const hiddenMatches=unpictured.filter(r=>!q||searchMatch(r,q));
 if(q){
  if(matches.length)flatGrid(root,'Search results',matches);
  savedRecipeShelf(root,hiddenMatches);
  if(!matches.length&&!hiddenMatches.length)root.append(build('p','kb-empty','No matching recipes yet.'));
  return;
 }
 if(selectedCategory!=='All'){
   const match=matches.filter(r=>selectedCategory==='Favorites'?r.favorite:categories(r).includes(selectedCategory));
   flatGrid(root,selectedCategory,match);
   const older=hiddenMatches.filter(r=>selectedCategory==='Favorites'?r.favorite:categories(r).includes(selectedCategory));
   savedRecipeShelf(root,older);
   return;
 }
 // Browse directly by food category without a duplicate discovery rail.
 const favorites=matches.filter(r=>r.favorite);
 if(favorites.length){
  const favSection=build('section','kb-recipe-section');
  favSection.append(heading('Favorites',favorites,true));
  const rail=build('div','kb-recipe-rail');for(const r of favorites)rail.append(card(r));
  favSection.append(rail);root.append(favSection);
 }
 for(const cat of ORDER){
  const items=matches.filter(r=>categories(r).includes(cat));
  if(!items.length)continue;
  const section=build('section','kb-recipe-section');
  section.append(heading(cat,items,true));
  const rail=build('div','kb-recipe-rail');
  for(const r of items)rail.append(card(r));
  section.append(rail);root.append(section);
 }
 savedRecipeShelf(root,hiddenMatches);
};
// Photo credits live in Profile, away from compact recipe cards.
function displayCredits(){
 const list=document.getElementById('kbPhotoCreditsList');if(!list)return;
 list.replaceChildren();
 const entries=state.recipes.filter(r=>r.photoSource && /^https:\/\//i.test(r.photoSource));
 if(!entries.length){list.append(build('p','kb-empty','No external photo credits recorded yet.'));return}
 entries.sort((a,b)=>a.name.localeCompare(b.name));
 for(const r of entries){
  const item=build('div','kb-credit-row');
  item.append(build('strong','kb-credit-title',r.name));
  const byline=build('div','kb-credit-byline','Photo: '+(r.photoCredit||'Source photographer')+(r.photoLicense?' · '+r.photoLicense:''));
  item.append(byline);
  if(r.photoMatchNote)item.append(build('div','kb-credit-byline',r.photoMatchNote));
  if(r.photoLicenseUrl && /^https:\/\//i.test(r.photoLicenseUrl)){
    const license=build('a','kb-credit-link','View license ↗');
    license.href=r.photoLicenseUrl;license.target='_blank';license.rel='noopener noreferrer';item.append(license);
  }
  if(r.recipeSourceUrl && /^https:\/\//i.test(r.recipeSourceUrl)){
    const recipeLink=build('a','kb-credit-link','Original recipe ↗');
    recipeLink.href=r.recipeSourceUrl;recipeLink.target='_blank';recipeLink.rel='noopener noreferrer';item.append(recipeLink);
  }
  const link=build('a','kb-credit-link','View original photo ↗');
  link.href=r.photoSource;link.target='_blank';link.rel='noopener noreferrer';
  link.setAttribute('aria-label','View original photo for '+r.name);
  item.append(link);
  list.append(item);
 }
}
const profile=document.getElementById('settings');
if(profile && !document.getElementById('kbPhotoCredits')){
 const details=build('details','cb-panel kb-credits');
 details.id='kbPhotoCredits';
 const summary=build('summary','', 'Photo Credits');
 details.append(summary);
 details.append(build('p','kb-credit-explainer','Food images are illustrative, may be AI-generated, and may differ from the finished recipe. Source links and credits are listed when available.'));
 details.append(build('div','kb-credits-list'));
 details.lastElementChild.id='kbPhotoCreditsList';
 details.addEventListener('toggle',()=>{if(details.open)displayCredits()});
 profile.append(details);
}
renderRecipes();
})();