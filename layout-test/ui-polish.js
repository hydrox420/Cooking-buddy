/* Kitchen Buddy /layout-test/ UI refinements (isolated preview only). */
(function(){
'use strict';
const byId=id=>document.getElementById(id);
const fallback='../meal-placeholder.svg';

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
 if(tipButton){tipButton.setAttribute('aria-expanded','false');tipButton=null}
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
window.addEventListener('scroll',hideDietTip,true);

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
 let hero=byId('kbDishPhoto'), peek=byId('kbDishPeek');
 if(!hero){
   hero=document.createElement('button');hero.id='kbDishPhoto';hero.className='kb-dish-photo';hero.type='button';
   const img=document.createElement('img');img.alt='Finished dish reference photo';
   const caption=document.createElement('span');caption.textContent='Finished-dish reference · tap to enlarge';
   hero.append(img,caption);
   head.before(hero);
 }
 if(!peek){
   peek=document.createElement('button');peek.id='kbDishPeek';peek.type='button';peek.className='kb-dish-peek';
   peek.setAttribute('aria-label','View finished dish photograph while cooking');
   const small=document.createElement('img');small.alt='';small.setAttribute('aria-hidden','true');
   const text=document.createElement('span');text.textContent='View dish';
   peek.append(small,text);cook.append(peek);
 }
 const src=recipe.photo||fallback;
 if(hero.dataset.photo!==src){
   safeImg(hero.querySelector('img'),src);
   safeImg(peek.querySelector('img'),src);
   hero.dataset.photo=src;
 }
 hero.querySelector('img').alt='Reference photo of '+recipe.name;
 hero.onclick=()=>showPhotoLarge(recipe);
 peek.onclick=()=>showPhotoLarge(recipe);
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