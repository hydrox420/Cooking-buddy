/* Kitchen Buddy /layout-test/ UI refinements (isolated preview only). */
(function(){
'use strict';
const byId=id=>document.getElementById(id);
const fallback='../meal-placeholder.svg';
const realRecipePages={
 'garlic-chicken-rice':'https://unboundwellness.com/one-pot-broccoli-cheddar-chicken-and-rice/',
 'lemon-garlic-tilapia-broccoli-rice':'https://www.skinnytaste.com/broiled-garlic-tilapia/',
 'easy-honey-garlic-chicken-broccoli-rice':'https://www.familyfoodonthetable.com/honey-garlic-chicken-rice-bowls/',
 'easy-turkey-taco-rice-bowls':'https://www.fromvalerieskitchen.com/southwest-turkey-taco-bowls/',
 'easy-sheet-pan-sausage-potatoes-peppers':'https://www.powellfamilycooking.com/sheet-pan-sausage-and-potatoes/',
 'easy-spinach-egg-cheese-wraps':'https://www.thetastybiteblog.com/spinach-egg-cheese-breakfast-wrap/',
 'easy-tomato-spinach-chickpea-pasta':'https://www.frontrangefed.com/pasta-with-chickpeas-spinach-and-tomatoes-pasta-e-ceci/',
 'easy-garlic-shrimp-green-bean-rice':'https://www.self.com/recipe/tomatoey-shrimp-and-green-beans',
 'kb-overnight-oats-berry':'https://simplymacros.com/mixed-berry-overnight-oats/',
 'kb-chana-masala':'https://www.vegrecipesofindia.com/chana-masala-recipe/',
 'kb-korean-bibimbap':'https://www.funkyasiankitchen.com/blog/vegetarian-bibimbap/',
 'kb-chicken-teriyaki':'https://feelgoodfoodie.net/recipe/chicken-teriyaki-brown-rice-and-broccoli/',
 'kb-chicken-fajitas':'https://www.budgetbytes.com/stovetop-chicken-fajitas/',
 'kb-chicken-adobo':'https://panlasangpinoy.com/how-to-cook-chicken-adobo-using-boneless-chicken/',
 'kb-lentil-soup':'https://feelgoodfoodie.net/recipe/tomato-lentil-soup/',
 'kb-salt-onigiri':'https://sudachirecipes.com/salted-onigiri-recipe/',
 'kb-easy-pad-thai-tofu':'https://simpleveganblog.com/vegan-pad-thai/'
};

/* A search icon replaces the always-open search field. */
const searchToggle=byId('kbSearchToggle'), searchField=byId('kbSearchField'), searchInput=byId('recipeSearch');
if(searchToggle&&searchField&&searchInput){
 const setSearchOpen=open=>{
   searchField.hidden=!open;
   searchToggle.setAttribute('aria-expanded',String(open));
   searchToggle.setAttribute('aria-label',open?'Close recipe search':'Search recipes');
   searchToggle.title=open?'Close search':'Search recipes';
   if(open)searchInput.focus();
   else if(searchInput.value){searchInput.value='';renderRecipes();}
 };
 searchToggle.addEventListener('click',()=>setSearchOpen(searchField.hidden));
 searchInput.addEventListener('keydown',e=>{
   if(e.key==='Escape'){e.preventDefault();setSearchOpen(false);searchToggle.focus()}
 });
}

/* Small, tappable explanations for dietary symbols. */
const explanations={
 'Vegan':'No animal-derived ingredients are listed. Check package labels and preparation if you have dietary restrictions.',
 'Vegetarian':'No meat or fish are listed. Dairy and eggs may still be included.',
 'Gluten-free':'No gluten-containing ingredients are identified in this version. Verify sauces, packaged ingredients, and cross-contact before relying on this label.',
 'Dairy-free':'No milk-based ingredients are listed. Check packaged products and labels.',
 'Spicy':'This recipe has spicy ingredients or seasonings. Adjust heat to your taste.'
};
let tip=null,tipButton=null;
function hideDietTip(){
 if(tip){tip.remove();tip=null}
 if(tipButton){tipButton.setAttribute('aria-expanded','false');tipButton.removeAttribute('aria-describedby');tipButton=null}
}
window.kbShowDietInfo=function(btn,tag){
 if(tipButton===btn){hideDietTip();return}
 hideDietTip();
 const el=document.createElement('div');
 el.id='kbDietTip';el.className='kb-diet-popover';el.setAttribute('role','tooltip');
 const title=document.createElement('strong');title.textContent=tag;
 const info=document.createElement('p');info.textContent=explanations[tag]||'Recipe label: '+tag+'. Check ingredients and product labels.';
 const done=document.createElement('button');done.type='button';done.textContent='Got it';
 done.addEventListener('click',hideDietTip);
 el.append(title,info,done);document.body.append(el);
 const box=btn.getBoundingClientRect();
 const width=Math.min(280,window.innerWidth-24);
 el.style.width=width+'px';
 el.style.left=Math.max(12,Math.min(box.left,window.innerWidth-width-12))+'px';
 const height=el.getBoundingClientRect().height;
 el.style.top=(box.bottom+height+8<window.innerHeight?box.bottom+7:Math.max(8,box.top-height-7))+'px';
 tip=el;tipButton=btn;btn.setAttribute('aria-expanded','true');btn.setAttribute('aria-describedby',el.id);
};
document.addEventListener('pointerdown',e=>{
 if(tip && !tip.contains(e.target) && e.target!==tipButton)hideDietTip();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hideDietTip()});
// Keep explanations open while the page scrolls; close on tap outside or Escape.

/* Real recipe photography isn't finalized yet; keep the same provisional photo
   visible on opening a recipe and during all instruction / ingredients / cookware views. */
let lightbox=null;
function getActiveRecipe(){
 const name=(byId('recipeTitle')?.textContent||'').trim();
 if(!name || typeof state==='undefined' || !Array.isArray(state.recipes))return null;
 return state.recipes.find(r=>r.name===name)||null;
}
function safeImg(img,src){
 img.src=src||fallback;
 img.onerror=()=>{img.onerror=null;img.src=fallback};
}
function showPhotoLarge(recipe){
 if(lightbox){lightbox.close?.();lightbox.remove();lightbox=null}
 const dlg=document.createElement('dialog');dlg.className='kb-dish-lightbox';
 dlg.setAttribute('aria-label','Reference photo for '+recipe.name);
 const top=document.createElement('div');top.className='kb-lightbox-top';
 const label=document.createElement('strong');label.textContent=recipe.name;
 const close=document.createElement('button');close.type='button';close.className='kb-lightbox-close';close.setAttribute('aria-label','Close recipe photo');close.textContent='×';
 close.onclick=()=>dlg.close();
 top.append(label,close);
 const img=document.createElement('img');img.alt='Larger reference photo of '+recipe.name;
 safeImg(img,recipe.photo);
 dlg.append(top,img);
 dlg.onclick=e=>{if(e.target===dlg)dlg.close()};
 dlg.addEventListener('close',()=>{dlg.remove();if(lightbox===dlg)lightbox=null},{once:true});
 document.body.append(dlg);lightbox=dlg;
 if(typeof dlg.showModal==='function')dlg.showModal();else dlg.setAttribute('open','');
}
function renderCookPhoto(){
 const cook=byId('cook'),head=byId('cbRecipeHead');
 if(!cook||!head||cook.classList.contains('hide'))return;
 const recipe=getActiveRecipe();if(!recipe)return;
 let hero=byId('kbDishPhoto');
 if(!hero){
   hero=document.createElement('button');hero.id='kbDishPhoto';hero.className='kb-dish-photo';hero.type='button';
   const img=document.createElement('img');img.alt='Finished dish reference photo';
   const caption=document.createElement('span');caption.className='kb-dish-caption';
   hero.append(img,caption);
   head.before(hero);
 }
 const src=recipe.photo||fallback;
 if(hero.dataset.photo!==src){
   safeImg(hero.querySelector('img'),src);
   hero.dataset.photo=src;
 }
 const pending=src==='./photo-pending.svg';
 const caption=hero.querySelector('.kb-dish-caption');
 if(caption)caption.textContent=pending?'Original recipe photo not licensed yet':'Finished-dish reference · tap to enlarge';
 hero.querySelector('img').alt=pending?'Photo not yet selected for '+recipe.name:'Reference photo of '+recipe.name;
 hero.onclick=pending?null:()=>showPhotoLarge(recipe);
 hero.style.cursor=pending?'default':'zoom-in';
 let reference=byId('kbRealRecipeRef');
 if(pending && realRecipePages[recipe.id]){
   if(!reference){
     reference=document.createElement('a');reference.id='kbRealRecipeRef';reference.className='kb-real-recipe-link';
     reference.target='_blank';reference.rel='noopener noreferrer';
     hero.after(reference);
   }
   reference.href=realRecipePages[recipe.id];
   reference.textContent='See the original cook’s real food photos ↗';
 }else if(reference)reference.remove();
}
/* The app owns its cook-state transitions; hook its existing tab navigation
   instead of changing recipes, timers, or grocery calculation logic. */
if(typeof showTab==='function'){
 const previousShowTab=showTab;
 showTab=function(...args){
   const result=previousShowTab.apply(this,args);
   if(args[0]==='cook')renderCookPhoto();
   else if(lightbox && lightbox.open)lightbox.close();
   hideDietTip();
   return result;
 };
}
if(byId('cook')&&!byId('cook').classList.contains('hide'))renderCookPhoto();
})();