// Kitchen Buddy compact, photo-first cookbook library (feature branch preview).
// Uses existing state, planning, cooking and local storage; never resets saved data.
(function(){
'use strict';
let selectedCategory='All';
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
 const img=document.createElement('img');img.loading='lazy';img.decoding='async';img.src=r.photo||'../meal-placeholder.svg';img.alt=r.name;
 img.onerror=()=>{img.onerror=null;img.src='../meal-placeholder.svg'};
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
  const pill=build('span','kb-diet-tag',sym||tag);
  pill.setAttribute('aria-label',tag);pill.title=tag;meta.append(pill);
 }
 if(r.photoSource){
  const credit=build('a','kb-image-credit','ⓘ');credit.href=r.photoSource;credit.target='_blank';credit.rel='noopener noreferrer';
  credit.title='Photo by '+(r.photoCredit||'source photographer')+' · '+(r.photoLicense||'see source')+' · image may differ from this recipe';
  credit.setAttribute('aria-label',credit.title);meta.append(credit);
 }
 info.append(meta);
 const actions=build('div','kb-card-actions');
 const fav=build('button','kb-favorite',r.favorite?'♥':'♡');fav.type='button';
 fav.title=r.favorite?'Remove from favorites':'Save to favorites';fav.setAttribute('aria-label',fav.title);
 fav.onclick=()=>{r.favorite=!r.favorite;save();renderRecipes()};
 const add=build('button','kb-card-add','＋ Add');add.type='button';add.title='Add to meal plan';add.setAttribute('aria-label','Add '+r.name+' to meal plan');
 add.onclick=()=>addRecipeShopping(i);
 actions.append(fav,add);info.append(actions);root.append(info);return root;
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
renderRecipes=function(){
 const root=document.getElementById('recipes');
 if(!root)return;
 const q=(document.getElementById('recipeSearch')?.value||'').trim().toLowerCase();
 const all=state.recipes.filter(r=>!testRecipe(r)||q==='test'||q==='timer');
 root.innerHTML='';root.classList.add('kb-library');
 const count=document.getElementById('recipeCount');if(count)count.textContent=all.length+' guided recipes';
 const old=document.getElementById('cbCategoryFilters');if(old)old.hidden=true;
 const matches=all.filter(r=>!q||searchMatch(r,q));
 if(q){flatGrid(root,'Search results',matches);return}
 if(selectedCategory!=='All'){
   const match=matches.filter(r=>selectedCategory==='Favorites'?r.favorite:categories(r).includes(selectedCategory));
   flatGrid(root,selectedCategory,match);return;
 }
 const favorites=matches.filter(r=>r.favorite);
 const favSection=build('section','kb-recipe-section');
 favSection.append(heading('Favorites',favorites,true));
 if(favorites.length){const rail=build('div','kb-recipe-rail');for(const r of favorites)rail.append(card(r));favSection.append(rail)}
 else favSection.append(build('p','kb-empty','Tap ♡ on a recipe to keep your favorites here.'));
 root.append(favSection);
 for(const cat of ORDER){
  const items=matches.filter(r=>categories(r).includes(cat));
  if(!items.length)continue;
  const section=build('section','kb-recipe-section');
  section.append(heading(cat,items,true));
  const rail=build('div','kb-recipe-rail');
  for(const r of items)rail.append(card(r));
  section.append(rail);root.append(section);
 }
};
renderRecipes();
})();