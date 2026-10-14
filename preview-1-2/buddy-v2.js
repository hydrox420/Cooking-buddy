
// Cooking Buddy 2.0 integrated beta; extends the proven 1.6.1 HTML in place.
// Deliberately preserves cookingBuddy_v1_2_preview state and all user-uploaded photos.
(function(){
'use strict';
const $cb=id=>document.getElementById(id);
const PKEY='cookingBuddy_v2_preferences';
let prefs={defaultServings:1,autoFloat:false,dislikes:'',allergies:''};
try{Object.assign(prefs,JSON.parse(localStorage.getItem(PKEY))||{})}catch(e){}
function savePrefs(){localStorage.setItem(PKEY,JSON.stringify(prefs))}
state.recipeServings=state.recipeServings&&typeof state.recipeServings==='object'?state.recipeServings:{};
state.cartChecked=state.cartChecked&&typeof state.cartChecked==='object'?state.cartChecked:{};
// Old checks were not purchases. Discard them on first upgrade to one-tap buying.
if(!state.groceryOneTapV1){state.cartChecked={};state.groceryOneTapV1=true;save()}
const baseCount=r=>Number(r.servings)||2;
const selectedCount=r=>Math.max(1,Math.min(8,Number((state.recipeServings||{})[r.id]||prefs.defaultServings)||1));
const byID=id=>state.recipes.find(r=>r.id===id);
const round3=x=>Math.round(x*1000)/1000;
const scale=(n,r,c)=>round3(Number(n)*c/baseCount(r));
const esc=s=>String(s).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const recipePhoto=r=>r.photo||'../meal-placeholder.svg';
function fmt(n){
 n=round3(n);const sign=n<0?'-':'';n=Math.abs(n);
 let whole=Math.floor(n),fraction=n-whole;
 const fractions=[[0.0625,'1/16'],[0.125,'⅛'],[0.25,'¼'],[0.333,'⅓'],[0.375,'⅜'],[0.5,'½'],[0.625,'⅝'],[0.666,'⅔'],[0.75,'¾'],[0.875,'⅞']];
 let part=fractions.find(x=>Math.abs(x[0]-fraction)<0.018);
 if(part)return sign+(whole?whole+' ':'')+part[1];
 return sign+(Number.isInteger(n)?String(n):String(+n.toFixed(2)));
}
function fmtQty(n,u){return fmt(n)+' '+u}
function setSelected(id,n){
 const r=byID(id);if(!r)return;
 state.recipeServings=state.recipeServings||{};
 state.recipeServings[id]=Math.max(1,Math.min(8,Math.round(Number(n)||1)));
 save();
 if(currentRecipeID===id)drawCook();
 if($cb('home')&&!$cb('home').classList.contains('hide'))renderRecipes();
}
let currentRecipeID=null;
let view='Instructions',doneSteps=new Set(),checkedEquipment=new Set();
const timers=new Map();let finishedTimers=new Set();let timerVersion=0;
function updateNav(tab){
 for(const id of ['home','cook','plan','shopping','kitchen','settings','fridge']){
  const el=$cb(id);if(el)el.classList.toggle('hide',id!==tab);
 }
 document.querySelectorAll('[data-tab]').forEach(btn=>btn.classList.toggle('active',btn.dataset.tab===tab));
 if(tab==='home'){renderRecipes();renderTimerSetup()}
 if(tab==='plan')renderPlanned();
 if(tab==='shopping')renderShopping();
 if(tab==='kitchen')renderInventory();if(tab==='fridge')renderFoods()
 if(tab==='settings')paintSettings();
 if(tab==='cook')drawCook();
}
showTab=updateNav;
function changeRecipe(id){
 const i=state.recipes.findIndex(r=>r.id===id);if(i<0)return;
 acknowledgeAlarm();timers.clear();finishedTimers.clear();
 active=i;step=0;remaining=0;running=false;deadline=null;
 currentRecipeID=id;doneSteps=new Set();checkedEquipment=new Set();view='Instructions';
 showTab('cook');window.scrollTo({top:0,behavior:'instant'});
}
openCookingRecipe=changeIndex;
function changeIndex(index){const r=state.recipes[index];if(r)changeRecipe(r.id)}
const originalRenderRecipes=renderRecipes;
renderRecipes=function(){
 originalRenderRecipes();
 const cards=[...document.querySelectorAll('#recipes .mealcard')];
 for(const card of cards){
  const name=card.querySelector('.meal-title h3')?.textContent;
  const r=state.recipes.find(x=>x.name===name);if(!r)continue;
  const action=card.querySelector('.meal-actions');
  if(!action)continue;
  card.querySelector('.photo-choice')?.remove();
  const existing=card.querySelector('.cb-card-serving');if(existing)existing.remove();
  const row=document.createElement('div');row.className='cb-card-serving';
  const label=document.createElement('span');label.className='cb-serving-label';label.textContent='Servings';
  const sel=document.createElement('select');sel.setAttribute('aria-label','Servings for '+r.name);
  for(let i=1;i<=8;i++){const option=document.createElement('option');option.value=String(i);option.textContent=i+(i===1?' person':' people');sel.append(option)}
  sel.value=String(selectedCount(r));sel.onchange=()=>setSelected(r.id,+sel.value);
  row.append(label,sel);action.before(row);
  const cook=action.querySelector('.start-cooking');
  if(cook)cook.onclick=()=>changeRecipe(r.id);
  const plan=action.querySelector('.btn.secondary');
  if(plan)plan.onclick=()=>addRecipeShopping(state.recipes.indexOf(r));
  const pic=card.querySelector('.photo-open'),title=card.querySelector('.meal-title');
  if(pic)pic.onclick=()=>changeRecipe(r.id);
  if(title)title.onclick=()=>changeRecipe(r.id);
 }
};
const legacySeedCook=$cb('cook'),oldSettings=$cb('settings'),oldTimerOptions=$cb('timerTools');
const groceries=$cb('shopping'),oldFridge=$cb('fridge');
const plan=document.createElement('section');plan.id='plan';plan.className='hide';
plan.innerHTML='<div class="cb-intro"><span class="eyebrow">YOUR WEEK AHEAD</span><h2>📅 Meal Plan</h2><p>Choose recipes, set servings, and make one combined grocery list.</p></div><div class="cb-tiles" id="planStats"></div><div class="cb-panel"><h3>Meals you have planned</h3><div id="plannedMeals"></div></div><button class="btn" onclick="showTab(\'shopping\')">🛒 View combined groceries →</button>';
groceries.before(plan);
groceries.innerHTML='<div class="cb-intro cb-shopping-title"><div><span class="eyebrow">YOUR SHOPPING LIST</span><h2>Groceries</h2></div><button type="button" id="cbOpenOrder" class="cb-icon-button" aria-label="Shopping and pickup options" aria-expanded="false" title="Shopping and pickup options" onclick="togglePickupOptions()"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/><path d="M2 3h2l3 12h13l2-9H5"/></svg></button></div><div class="cb-shopping-handoff"><button type="button" id="cbShareChatGPT" class="btn secondary cb-chatgpt-share" onclick="sendGroceriesToChatGPT()"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h13M12 7l5 5-5 5"/><path d="M18 4h2v16h-2"/></svg> Send to ChatGPT</button><span class="cb-handoff-hint">Share your list to build an Instacart cart with me</span></div><div id="groceryStats" class="cb-check-total"></div><div id="shoppingItems"></div><div id="cbPendingOrder"></div><details class="cb-panel cb-add-grocery"><summary>＋ Add an item</summary><label>Item<input id="shopName" placeholder="Bananas"></label><label>Amount<input id="shopQty" type="number" step="any" min="0.01" value="1"></label><label>Unit<input id="shopUnit" placeholder="each"></label><button class="btn" onclick="addShopManual()">Add to grocery list</button></details><div id="pantryOptional" class="cb-panel"></div>';
const kitchen=document.createElement('section');kitchen.id='kitchen';kitchen.className='hide';
kitchen.innerHTML='<div class="cb-intro"><span class="eyebrow">WHAT YOU HAVE AT HOME</span><h2>My Kitchen</h2></div><div class="cb-panel cb-kitchen-stock"><h3>Kitchen inventory</h3><div id="inventoryItems"></div></div>';
groceries.after(kitchen);
if(oldFridge){
 oldFridge.innerHTML='<div class="cb-intro cb-fridge-heading"><div><span class="eyebrow">KEEP IT FRESH</span><h2>My Fridge</h2></div><button id="cbFridgeAddButton" type="button" class="btn secondary cb-fridge-add-button" onclick="toggleFridgeAdd()">＋ Add item</button></div>'+
 '<div id="foods" class="cb-fridge-contents"></div>'+
 '<div id="cbFridgeAddPanel" class="cb-panel cb-fridge-form hide"><div class="cb-row"><h3>Add to my fridge</h3><button type="button" class="btn secondary mini" onclick="closeFridgeAdd()">Close</button></div>'+
 '<label>Food name<input id="foodName" placeholder="Leftover dinner"></label>'+
 '<label>Date cooked / refrigerated<input id="foodDate" type="date"></label>'+
 '<label>Use-within reminder (days)<input id="foodDays" type="number" min="1" max="30" value="3"></label>'+
 '<label>Amount / notes<input id="foodNotes" placeholder="About 1 serving"></label>'+
 '<button class="btn" type="button" onclick="addFood()">Save to Fridge</button>'+
 '<p class="cb-sub">Dates are reminders, not a guarantee of food safety. Refrigerate promptly at 40°F / 4°C or below. Most cooked leftovers keep 3–4 days; use a shorter window when appropriate.</p></div>';
}
window.closeFridgeAdd=()=>{
 const panel=$cb('cbFridgeAddPanel');if(panel)panel.classList.add('hide');
};
window.openFridgeAdd=(name='',notes='')=>{
 const panel=$cb('cbFridgeAddPanel');if(!panel)return;
 if(name)$cb('foodName').value=name;
 if(notes)$cb('foodNotes').value=notes;
 $cb('foodDate').value=today();
 $cb('foodDays').value='3';
 panel.classList.remove('hide');
 if(panel.scrollIntoView)panel.scrollIntoView({behavior:'smooth',block:'nearest'});
};
window.toggleFridgeAdd=()=>{
 const panel=$cb('cbFridgeAddPanel');if(!panel)return;
 if(panel.classList.contains('hide'))window.openFridgeAdd();
 else window.closeFridgeAdd();
};
const originalAddFood=addFood;
addFood=function(){
 const before=state.foods.length;
 originalAddFood();
 if(state.foods.length>before){
  window.closeFridgeAdd();
  $cb('foodName').value='';
  $cb('foodNotes').value='';
 }
};
oldSettings.innerHTML='<div class="cb-intro"><span class="eyebrow">YOUR CORNER</span><h2>My Profile</h2></div><div class="cb-profile-hero"><div class="cb-profile-avatar" aria-hidden="true">K</div><div><strong>Home cook</strong><p class="cb-sub">Your cozy kitchen space — stored on this device.</p></div></div><details class="cb-panel cb-profile-preferences" id="cbProfilePreferences"><summary>Preferences and app settings</summary><div class="cb-profile-preference-body"><h3>Cooking preferences</h3><div class="cb-field"><label for="cbDefaultServings">Default meal size</label><select id="cbDefaultServings"></select></div><div class="cb-field"><label for="cbAutoFloat">Floating timer</label><select id="cbAutoFloat"><option value="0">Open manually</option><option value="1">Try automatically when a timer starts</option></select></div><p class="cb-settings-note">Floating windows depend on browser support. Timer alerts may be delayed when your phone suspends the app.</p><h3>Alarm sound and notifications</h3><div id="cbSoundSlot"></div><h3>Dietary preferences</h3><div class="cb-field"><label for="cbDislikes">Ingredients you dislike (comma-separated)</label><input id="cbDislikes" placeholder="olives, mushrooms"></div><div class="cb-field"><label for="cbAllergies">Allergies / restrictions (comma-separated)</label><input id="cbAllergies" placeholder="e.g. peanuts"></div><p class="cb-settings-note">Allergy warnings are keyword-based, not verified allergen or cross-contact information.</p><h3>Backups and app</h3><p class="cb-sub">Your data is saved locally. Accounts, profile customization and cross-device sync are future features.</p><button class="btn secondary" onclick="exportData()">Export backup</button><p class="cb-sub">Kitchen Buddy beta 2.0.5</p></div></details>';
const soundSlot=$cb('cbSoundSlot');
if(oldTimerOptions){
 oldTimerOptions.classList.remove('hide');oldTimerOptions.open=true;
 oldTimerOptions.querySelector('summary').textContent='Choose alarm sound and enable notifications';
 soundSlot.append(oldTimerOptions);
}
if($cb('alarmSound'))$cb('alarmSound').value=getTimerSound();
const allNavigation=$cb('home')?.closest('main')?.nextElementSibling;
const nav=document.querySelector('nav.tabs');
const navArt={
 home:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 11h7M8 15h6"/>',
 plan:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h2M14 14h2"/>',
 shopping:'<path d="M2 3h2l3 12h13l2-9H5"/><circle cx="9" cy="20" r="1"/><circle cx="19" cy="20" r="1"/>',
 kitchen:'<path d="M4 12h16l-2 8H6l-2-8ZM7 12V6h10v6M9 6V3h6v3"/>',
 fridge:'<rect x="5" y="2.5" width="14" height="19" rx="2"/><path d="M5 11h14M8 6v3M8 15v3"/>',
 settings:'<circle cx="12" cy="8" r="3.5"/><path d="M4.5 21v-1.5a7.5 7.5 0 0 1 15 0V21"/>'
};
function navSvg(tab){return '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+navArt[tab]+'</svg>'}
if(nav){nav.classList.add('cb-six-tabs');nav.innerHTML=[
 ['home','Recipes'],['plan','Plan'],['shopping','Groceries'],
 ['kitchen','Kitchen'],['fridge','Fridge'],['settings','Profile']
].map(row=>'<button class="btn secondary" data-tab="'+row[0]+'" onclick="showTab(\''+row[0]+'\')"><span class="cb-nav-icon">'+navSvg(row[0])+'</span><span class="cb-nav-text">'+row[1]+'</span></button>').join('');}
legacySeedCook.innerHTML='<div class="cb-row"><div><span class="eyebrow">COOKING BUDDY</span><h2 id="recipeTitle">Recipe</h2></div><button class="btn secondary" onclick="showTab(\'home\')">← Recipes</button></div><div class="cb-panel" id="cbRecipeHead"></div><div id="cbDietWarning"></div><div class="cb-switches" id="cbCookTabs"></div><div id="cbCookContent"></div><div id="cbActiveTimers" class="cb-timer-dock hide"></div><div class="cb-panel"><button class="btn" style="width:100%" onclick="finishCooking()">✓ Finished cooking</button><p class="cb-sub">Finish cooking only after your food is safely cooked; any running alarms will stop.</p></div>';
const $q=sel=>document.querySelector(sel);
function fillSettings(){
 const size=$cb('cbDefaultServings');size.innerHTML='';
 for(let n=1;n<=8;n++){const o=document.createElement('option');o.value=n;o.textContent=n+(n===1?' serving':' servings');size.append(o)}
 size.value=prefs.defaultServings;
 size.onchange=()=>{prefs.defaultServings=+size.value;savePrefs();renderRecipes();toast('Default changed — existing planned meals keep their own servings')};
 const float=$cb('cbAutoFloat');float.value=prefs.autoFloat?'1':'0';
 float.onchange=()=>{prefs.autoFloat=float.value==='1';savePrefs()};
 $cb('cbDislikes').value=prefs.dislikes;
 $cb('cbAllergies').value=prefs.allergies;
 $cb('cbDislikes').onchange=()=>{prefs.dislikes=$cb('cbDislikes').value;savePrefs()};
 $cb('cbAllergies').onchange=()=>{prefs.allergies=$cb('cbAllergies').value;savePrefs()};
}
function paintSettings(){fillSettings();if($cb('alarmSound'))$cb('alarmSound').value=getTimerSound()}
function avoidMatches(r){
 const all=(r.name+' '+r.ingredients.join(' ')+' '+(r.items||[]).map(it=>it.name).join(' ')).toLowerCase();
 const allergy=prefs.allergies.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).filter(x=>all.includes(x));
 const disliked=prefs.dislikes.split(',').map(x=>x.trim().toLowerCase()).filter(Boolean).filter(x=>all.includes(x));
 return {allergy,disliked};
}
function cookware(r){
 if(Array.isArray(r.cookware)&&r.cookware.length)return r.cookware;
 const name=r.name.toLowerCase();
 if(name.includes('sheet-pan'))return ['Oven','Rimmed baking sheet','Knife','Cutting board','Oven mitts','Mixing bowl','Spatula'];
 if(name.includes('pasta'))return ['Medium saucepan','Colander','Skillet','Wooden spoon','Measuring cups'];
 if(name.includes('wrap'))return ['Skillet','Spatula','Mixing bowl','Fork','Measuring cups'];
 if(name.includes('test'))return ['Phone with Cooking Buddy open'];
 return ['Skillet','Spatula','Cutting board','Knife','Measuring spoons','Food thermometer'];
}
function scaledIngredients(r,c){
 return (Array.isArray(r.items)&&r.items.length)?
 r.items.map(x=>({name:x.name,qty:scale(x.qty,r,c),unit:x.unit})):
 r.ingredients.map(name=>({name,qty:null,unit:''}));
}
function qtyToken(x){const m=String(x).trim().match(/^(\d+(?:\.\d+)?|½|¼|¾|⅛|⅓|⅔|⅜|⅝|⅞)$/);if(!m)return NaN;return {'½':.5,'¼':.25,'¾':.75,'⅛':.125,'⅓':1/3,'⅔':2/3,'⅜':.375,'⅝':.625,'⅞':.875}[m[1]]??Number(m[1])}
function stepText(r,body,c){
 if(c===baseCount(r))return body;
 const factor=c/baseCount(r);
 // Adjust ingredient amounts only. Never scale temperatures, doneness thresholds or timer durations.
 return body.replace(/(\d+(?:\.\d+)?|½|¼|¾|⅛|⅓|⅔|⅜|⅝|⅞)\s*(?:[-–]\s*(\d+(?:\.\d+)?|½|¼|¾|⅛|⅓|⅔|⅜|⅝|⅞)\s*)?(tablespoons?|tbsp|teaspoons?|tsp|cups?|oz|ounces?|fillets?|eggs?|lemons?|tortillas?|cloves?)\b/gi,function(match,a,b,unit){
  const start=qtyToken(a);if(!Number.isFinite(start))return match;
  const result=start*factor;
  const plural=/^(tablespoons|teaspoons|cups|fillets|eggs|lemons|tortillas|cloves)$/i;
  const displayUnit=!b&&Math.abs(result-1)<.001&&plural.test(unit)?unit.slice(0,-1):unit;
  return fmt(result)+(b?'–'+fmt(qtyToken(b)*factor):'')+' '+displayUnit;
 });
}
function chooseTimes(s){
 const match=s.body.match(/(\d+)\s*[-–]\s*(\d+)\s*minutes?/i);
 if(match&&s.seconds>0){
  const lo=+match[1],hi=+match[2];
  if(lo>0&&hi>lo&&hi<=120&&Math.abs(s.seconds-hi*60)<=180){
   return [lo*60,hi*60];
  }
 }
 return [s.seconds].filter(Boolean);
}
function cookKey(i){return String(i)}
function timerFor(i){return timers.get(cookKey(i))}
function asClock(s){s=Math.max(0,Math.ceil(s));return String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0')}
function drawCook(){
 if(!currentRecipeID)return;
 const r=byID(currentRecipeID);if(!r)return;
 const c=selectedCount(r);$cb('recipeTitle').textContent=r.name;
 $cb('cbRecipeHead').innerHTML='<div class="cb-row wrap"><div><strong>'+c+' '+(c===1?'serving':'servings')+'</strong><div class="cb-sub">'+esc(r.description||'Follow along, one step at a time')+'</div></div><div class="cb-quantity"><button type="button" onclick="setRecipeCount(\''+esc(r.id)+'\','+(c-1)+')" '+(c<=1?'disabled':'')+'>−</button><strong>'+c+'</strong><button type="button" onclick="setRecipeCount(\''+esc(r.id)+'\','+(c+1)+')" '+(c>=8?'disabled':'')+'>+</button></div></div><div class="cb-cta"><button class="btn secondary" onclick="planCurrentRecipe()">🛒 Plan this meal</button><button class="btn secondary" onclick="showTab(\'settings\')">⚙️ Timer settings</button></div><p class="cb-sub">Food amounts adjust for your servings. Cooking durations stay safety-based; larger portions may require extra batches.</p>';
 const flags=avoidMatches(r);
 $cb('cbDietWarning').innerHTML=(flags.allergy.length?'<div class="cb-warning">⚠️ Possible restriction keyword: '+esc(flags.allergy.join(', '))+'. Review all actual labels and preparation carefully.</div>':'')+
 (flags.disliked.length?'<div class="cb-warning">Contains ingredients you marked as disliked: '+esc(flags.disliked.join(', '))+'</div>':'');
 $cb('cbCookTabs').innerHTML=['Cookware','Ingredients','Instructions'].map(name=>'<button class="'+(name===view?'active':'')+'" onclick="chooseCookView(\''+name+'\')">'+name+'</button>').join('');
 const panel=$cb('cbCookContent');panel.innerHTML='';
 if(view==='Cookware'){
  const el=document.createElement('div');el.className='cb-panel';el.innerHTML='<h3>Before you start</h3><p class="cb-sub">Gather your equipment before turning on the stove.</p>';
  const ul=document.createElement('ul');ul.className='cb-simple-list';
  for(const name of cookware(r)){
   const li=document.createElement('li');const input=document.createElement('input');input.type='checkbox';
   input.checked=checkedEquipment.has(name);input.onchange=()=>{if(input.checked)checkedEquipment.add(name);else checkedEquipment.delete(name)};
   const label=document.createElement('span');label.textContent=name;li.append(input,label);ul.append(li);
  }
  el.append(ul);panel.append(el);
 }else if(view==='Ingredients'){
  const el=document.createElement('div');el.className='cb-panel';el.innerHTML='<h3>Ingredients for '+c+' '+(c===1?'person':'people')+'</h3><p class="cb-sub">The grocery list combines these amounts across planned meals.</p>';
  const list=document.createElement('ul');list.className='cb-simple-list';
  for(const it of scaledIngredients(r,c)){const li=document.createElement('li');const label=document.createElement('span');label.textContent=it.name;const q=document.createElement('strong');q.textContent=it.qty===null?'':fmtQty(it.qty,it.unit);q.style.marginLeft='auto';li.append(label,q);list.append(li)}
  el.append(list);panel.append(el);
 }else{
  const note=document.createElement('p');note.className='cb-sub';note.textContent='Scroll ahead anytime. Each step has its own timer; other timers keep counting while you cook. Tap a checkbox when a step is done.';
  panel.append(note);
  if(c!==baseCount(r)){const w=document.createElement('p');w.className='cb-warning';w.textContent='Ingredient measures are scaled to '+c+' '+(c===1?'serving':'servings')+'. Check portions and batch size while cooking; timers and temperature requirements are not multiplied.';panel.append(w)}
  r.steps.forEach((s,i)=>{
   const card=document.createElement('article');card.className='cb-step'+(doneSteps.has(i)?' done':'');card.id='cbStep'+i;
   const header=document.createElement('div');header.className='cb-step-header';
   const num=document.createElement('span');num.className='cb-step-number';num.textContent=i+1;
   const title=document.createElement('h3');title.textContent=s.title;header.append(num,title);card.append(header);
   const copy=document.createElement('p');copy.textContent=stepText(r,s.body,c);card.append(copy);
   if(s.seconds>0){
    const timer=document.createElement('div');timer.className='cb-time';timer.id='cbTimer'+i;
    const options=chooseTimes(s),selected=timerFor(i)?.original||options[0];
    if(options.length>1){
     const prompt=document.createElement('div');prompt.className='cb-sub';prompt.textContent='Choose your time';timer.append(prompt);
     const choices=document.createElement('div');choices.className='cb-time-options';
     for(const sec of options){const btn=document.createElement('button');btn.type='button';btn.textContent=asClock(sec);btn.className=selected===sec?'selected':'';btn.onclick=()=>chooseStepDuration(i,sec);choices.append(btn)}
     timer.append(choices);
    }
    const display=document.createElement('div');display.className='cb-time-main';
    const amount=document.createElement('div');amount.innerHTML='<strong data-time="'+i+'">'+asClock(timerFor(i)?.remaining??selected)+'</strong><small data-time-status="'+i+'">Ready to start</small>';
    display.append(amount);timer.append(display);
    const controls=document.createElement('div');controls.className='cb-time-row';
    const start=document.createElement('button');start.className='btn';start.setAttribute('data-time-start',i);start.textContent='▶ Start';start.onclick=()=>toggleStepTimer(i);
    const extend=document.createElement('button');extend.className='btn secondary';extend.textContent='+1 minute';extend.onclick=()=>extendStepTimer(i);
    const reset=document.createElement('button');reset.className='btn secondary';reset.textContent='↻ Reset';reset.onclick=()=>resetStepTimer(i);
    controls.append(start,extend,reset);timer.append(controls);card.append(timer);
   }
   const footer=document.createElement('div');footer.className='cb-step-bottom';
   const tickBox=document.createElement('input');tickBox.type='checkbox';tickBox.checked=doneSteps.has(i);
   tickBox.onchange=()=>{if(tickBox.checked)doneSteps.add(i);else doneSteps.delete(i);card.classList.toggle('done',tickBox.checked)};
   const label=document.createElement('label');label.append(tickBox,document.createTextNode('Done with this step'));
   footer.append(label);card.append(footer);panel.append(card);
  });
 }
 updateTimerLabels();drawTimerDock();
}
function setCookView(name){view=name;drawCook()}
window.chooseCookView=setCookView;
window.setRecipeCount=(id,n)=>{if(n<1||n>8)return;setSelected(id,n);if(currentRecipeID===id){drawCook()}};
window.planCurrentRecipe=()=>{const r=byID(currentRecipeID);if(r)addRecipeShopping(state.recipes.indexOf(r))};
const originalFinish=finishCooking;
function endCooking(){
 if(!currentRecipeID)return;
 const r=byID(currentRecipeID);const servings=selectedCount(r);
 const shouldDeduct=hasItems(r)&&confirm('Dinner finished! Deduct ingredients for '+servings+' '+(servings===1?'serving':'servings')+' from Kitchen inventory? Cancel keeps your inventory unchanged.');
 if(shouldDeduct){
  for(const ingredient of r.items){
   let needed=scale(ingredient.qty,r,servings);
   for(const item of state.inventory.filter(x=>x.name.trim().toLowerCase()===ingredient.name.trim().toLowerCase()&&x.unit===ingredient.unit)){
    const deducted=Math.min(needed,Number(item.qty));item.qty=round3(Number(item.qty)-deducted);needed=round3(needed-deducted);
   }
  }
  state.inventory=state.inventory.filter(x=>Number(x.qty)>0);save();
 }
 acknowledgeAlarm();timers.clear();finishedTimers.clear();running=false;deadline=null;
 currentRecipeID=null;showTab('home');toast('Cooking complete! '+(shouldDeduct?'Inventory adjusted.':'Inventory unchanged.'));askAboutLeftovers(r,servings);
}
// A friendly post-cooking step: never claim leftovers exist until the cook confirms.
const leftOverQuestion=document.createElement('div');
leftOverQuestion.id='cbLeftoversQuestion';
leftOverQuestion.className='cb-leftovers-overlay hide';
leftOverQuestion.setAttribute('role','dialog');
leftOverQuestion.setAttribute('aria-modal','true');
leftOverQuestion.setAttribute('aria-labelledby','cbLeftoversTitle');
leftOverQuestion.innerHTML='<div class="cb-leftovers-modal"><span class="eyebrow">AFTER DINNER</span><h2 id="cbLeftoversTitle">Any leftovers?</h2>'+
 '<p class="cb-sub" id="cbLeftoversText">Kitchen Buddy will save this meal to your Fridge with today’s date and a 3-day reminder.</p>'+
 '<label class="cb-leftovers-note">Amount left (optional)<input id="cbLeftoverAmount" placeholder="e.g. 1 serving left"></label>'+
 '<div class="cb-leftovers-actions"><button class="btn secondary" id="cbNoLeftovers" type="button">No leftovers</button><button class="btn" type="button" id="cbYesLeftovers">Yes, save them</button></div></div>';
document.body.append(leftOverQuestion);
let justCooked=null;
function finishLeftoverQuestion(){
 leftOverQuestion.classList.add('hide');
 justCooked=null;
}
$cb('cbNoLeftovers').onclick=()=>{finishLeftoverQuestion();showTab('home')};
$cb('cbYesLeftovers').onclick=()=>{
 const done=justCooked;if(!done)return;
 const amount=$cb('cbLeftoverAmount').value.trim();
 state.foods.push({id:uid(),name:done.name,date:today(),days:3,notes:amount});
 save();finishLeftoverQuestion();showTab('fridge');
 toast('Leftovers saved to your Fridge!');
};
function askAboutLeftovers(r,servings){
 justCooked={name:r.name,servings};
 $cb('cbLeftoverAmount').value='';
 leftOverQuestion.classList.remove('hide');
 $cb('cbYesLeftovers').focus();
}

finishCooking=endCooking;

function newTimer(i){
 const r=byID(currentRecipeID);if(!r)return null;
 const options=chooseTimes(r.steps[i]);const start=options[0];
 if(!start)return null;
 const timer={original:start,remaining:start,endsAt:null,running:false,done:false};
 timers.set(cookKey(i),timer);return timer;
}
window.chooseStepDuration=(i,sec)=>{
 const t=timerFor(i)||newTimer(i);if(!t)return;
 if(t.running){toast('Pause the timer before changing its starting duration.');return}
 t.original=sec;t.remaining=sec;t.done=false;t.endsAt=null;finishedTimers.delete(i);drawCook();
};
function tickAll(){
 if(!currentRecipeID)return;
 const now=Date.now();let changed=false;
 for(const [key,t] of timers){
  if(!t.running||!t.endsAt)continue;
  const ms=t.endsAt-now;t.remaining=Math.max(0,Math.ceil(ms/1000));
  if(ms<=0){
   t.running=false;t.endsAt=null;t.remaining=0;t.done=true;
   const i=Number(key);finishedTimers.add(i);changed=true;
   const lateBy=-ms;lateTimerNotice=lateBy>5000;
   startRepeatingAlarm(lateBy);
   step=i;notifyTimerFinished();
   toast('⏰ '+byID(currentRecipeID).steps[i].title+' — ready! Stop alarm to silence.');
  }
 }
 if(changed){
  drawTimerDock();renderAlarmBanner();
  const r=byID(currentRecipeID);
  if($cb('alarmBannerMessage'))$cb('alarmBannerMessage').textContent=[...finishedTimers].map(i=>r.steps[i].title).join(' • ')+' — check food and stop alarm';
 }
 updateTimerLabels();
}
function toggleStepTimer(i){
 const r=byID(currentRecipeID);if(!r)return;
 const t=timerFor(i)||newTimer(i);if(!t)return;
 if(t.running){
  t.remaining=Math.max(0,Math.ceil((t.endsAt-Date.now())/1000));
  t.running=false;t.endsAt=null;drawTimerDock();updateTimerLabels();return;
 }
 if(t.done||t.remaining<=0){t.remaining=t.original;t.done=false;finishedTimers.delete(i)}
 unlockAlarmAudio();askTimerPermissionOnFirstStart();
 t.endsAt=Date.now()+t.remaining*1000;t.running=true;step=i;
 if(prefs.autoFloat&&!document.pictureInPictureElement)openFloatingTimer();
 drawTimerDock();updateTimerLabels();
}
function extendStepTimer(i){
 const t=timerFor(i)||newTimer(i);if(!t)return;
 if(t.running){t.endsAt+=60000;t.remaining+=60}
 else{t.remaining+=60;if(t.done){t.done=false;finishedTimers.delete(i)}}
 updateTimerLabels();drawTimerDock();
}
function resetStepTimer(i){
 const t=timerFor(i)||newTimer(i);if(!t)return;
 t.remaining=t.original;t.endsAt=null;t.running=false;t.done=false;
 finishedTimers.delete(i);
 if(!finishedTimers.size&&alarmActive)acknowledgeAlarm();
 updateTimerLabels();drawTimerDock();
}
window.toggleStepTimer=toggleStepTimer;
window.extendStepTimer=extendStepTimer;
window.resetStepTimer=resetStepTimer;
function updateTimerLabels(){
 for(const [key,t] of timers){
  const seconds=t.running?Math.max(0,Math.ceil((t.endsAt-Date.now())/1000)):t.remaining;
  document.querySelectorAll('[data-time="'+key+'"]').forEach(el=>el.textContent=asClock(seconds));
  document.querySelectorAll('[data-time-status="'+key+'"]').forEach(el=>el.textContent=t.done?'⏰ Done — stop alarm':t.running?'Counting down…':seconds!==t.original?'Paused / adjusted':'Ready to start');
  document.querySelectorAll('[data-time-start="'+key+'"]').forEach(el=>el.textContent=t.running?'⏸ Pause':t.done?'▶ Start again':'▶ Start');
 }
 const banner=$cb('alarmBanner');
 if(banner&&alarmActive&&finishedTimers.size){
  const r=byID(currentRecipeID);if(r&&$cb('alarmBannerMessage'))$cb('alarmBannerMessage').textContent=[...finishedTimers].map(i=>r.steps[i]?.title||'Timer').join(' • ')+' — check your food';
 }
}
function drawTimerDock(){
 const el=$cb('cbActiveTimers');if(!el)return;
 const r=byID(currentRecipeID);if(!r)return;
 const entries=[...timers].filter(([,t])=>t.running||t.done);
 el.classList.toggle('hide',!entries.length);
 if(!entries.length){el.innerHTML='';return}
 el.innerHTML='<div class="cb-row"><strong>⏱ Active cooking timers</strong><button class="btn secondary" onclick="openFloatingTimer()">▣ Float</button></div>';
 for(const [key,t] of entries){
  const div=document.createElement('div');div.className='cb-row';div.style.marginTop='8px';
  const label=document.createElement('span');label.className='small';label.textContent=r.steps[Number(key)]?.title||'Timer';
  const remaining=document.createElement('strong');remaining.setAttribute('data-time',key);remaining.textContent=asClock(t.remaining);
  div.append(label,remaining);el.append(div);
 }
}
const originalAck=acknowledgeAlarm;
acknowledgeAlarm=function(){
 originalAck();finishedTimers.clear();
 for(const t of timers.values())if(t.done)t.done=false;
 updateTimerLabels();drawTimerDock();
};
const oldDrawFloating=drawFloatingTimer;
drawFloatingTimer=function(){
 if(!pipCanvas)return;
 const ctx=pipCanvas.getContext('2d'),w=pipCanvas.width,h=pipCanvas.height;
 ctx.fillStyle='#15271d';ctx.fillRect(0,0,w,h);
 ctx.fillStyle='#b5e5a7';ctx.font='bold 28px system-ui';ctx.textAlign='center';
 ctx.fillText('🍳 Cooking Buddy',w/2,42);
 const active=[...timers].filter(([,t])=>t.running||t.done).slice(0,2);
 if(!active.length){
  ctx.fillStyle='#e9f4ea';ctx.font='27px system-ui';ctx.fillText('No running timers',w/2,139);return;
 }
 const recipeName=byID(currentRecipeID);
 active.forEach(([key,t],i)=>{
  const y=i===0?105:209,label=recipeName?.steps[Number(key)]?.title||'Timer';
  ctx.fillStyle='#eaf4ea';ctx.font='21px system-ui';ctx.fillText(label.length>29?label.slice(0,27)+'…':label,w/2,y);
  ctx.fillStyle='#ffffff';ctx.font='bold 57px system-ui';
  ctx.fillText(t.done?'00:00':asClock(t.running?Math.ceil((t.endsAt-Date.now())/1000):t.remaining),w/2,y+57);
 });
};
openFloatingTimer=async function(){
 const status=$cb('timerFeatureStatus');
 const setStatus=message=>{if(status)status.textContent=message};
 if(![...timers.values()].some(t=>t.running||t.done)){toast('Start a cooking timer first');return}
 if(!document.pictureInPictureEnabled||!('captureStream' in HTMLCanvasElement.prototype)||!('requestPictureInPicture' in HTMLVideoElement.prototype)){
  setStatus('Floating window is unavailable in this browser. Try split-screen mode.');return;
 }
 try{
  if(!pipCanvas){
   pipCanvas=document.createElement('canvas');pipCanvas.width=480;pipCanvas.height=270;
   pipVideo=document.createElement('video');pipVideo.muted=true;pipVideo.autoplay=true;pipVideo.playsInline=true;
   pipVideo.style.cssText='position:fixed;left:0;bottom:0;width:2px;height:2px;opacity:0;pointer-events:none';
   document.body.append(pipVideo);
   pipVideo.addEventListener('leavepictureinpicture',()=>{if(pipDrawInterval){clearInterval(pipDrawInterval);pipDrawInterval=null}});
   pipVideo.srcObject=pipCanvas.captureStream(2);
  }
  drawFloatingTimer();await pipVideo.play();
  if(!document.pictureInPictureElement)await pipVideo.requestPictureInPicture();
  if(!pipDrawInterval)pipDrawInterval=setInterval(drawFloatingTimer,350);
  setStatus('Floating countdown is open. Android controls its size; pinch to resize where supported.');
 }catch(err){setStatus('Floating timer was blocked by this browser. Open it manually or use split-screen.');}
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)tickAll()});
setInterval(tickAll,250);

// Planned meals retain their own serving quantities; legacy count means repeat this meal.
function planParts(p){
 const r=byID(p.recipeId);if(!r)return null;
 const c=Number(p.servings)||baseCount(r);
 return {r,c,repeat:Math.max(1,Number(p.count)||1)};
}
plannedIngredients=function(){
 const results=new Map();
 for(const p of state.planned){
  const x=planParts(p);if(!x||!hasItems(x.r))continue;
  for(const item of x.r.items){
   const key=item.name.trim().toLowerCase()+'|'+item.unit.trim().toLowerCase();
   const row=results.get(key)||{name:item.name,unit:item.unit,qty:0};
   row.qty+=scale(item.qty,x.r,x.c)*x.repeat;results.set(key,row);
  }
 }
 return [...results.values()].map(r=>({...r,qty:round3(r.qty)}));
};
addRecipeShopping=function(i){
 const r=state.recipes[i];if(!r)return;
 if(!hasItems(r)){alert('This recipe needs structured ingredient quantities before it can be added to a meal plan.');return}
 const servings=selectedCount(r);
 const p=state.planned.find(x=>x.recipeId===r.id&&Number(x.servings||baseCount(r))===servings);
 if(p)p.count=Math.max(1,Number(p.count)||1)+1;
 else state.planned.push({recipeId:r.id,servings,count:1});
 state.cartChecked={};save();renderPlan();
 toast('✓ '+r.name+' added to your plan! Keep browsing or open Plan when ready.');
};
function renderPlan(){
 state.planned=Array.isArray(state.planned)?state.planned:[];
 const planTab=document.querySelector('nav.tabs [data-tab="plan"]');
 const plannedTotal=state.planned.reduce((n,p)=>n+Math.max(1,Number(p.count)||1),0);
 if(planTab){const label=planTab.querySelector('.cb-nav-text');if(label)label.textContent='Plan'+(plannedTotal?' ('+plannedTotal+')':'');}
 const root=$cb('plannedMeals');if(!root)return;
 root.innerHTML='';const cards=state.planned.filter(p=>byID(p.recipeId));
 const mealCount=cards.reduce((n,p)=>n+Math.max(1,Number(p.count)||1),0);
 const stats=$cb('planStats');
 if(stats)stats.innerHTML='<div class="cb-tile"><span>Planned meals</span><strong>'+mealCount+'</strong></div><div class="cb-tile"><span>Ingredients to buy</span><strong>'+plannedNeeds().length+'</strong></div>';
 if(!cards.length){root.innerHTML='<div class="cb-empty">No meals planned. Choose a recipe, select servings, then tap Plan. 🥦</div>';return}
 for(const p of cards){
  const x=planParts(p),r=x.r;
  const row=document.createElement('div');row.className='cb-plan-row';
  const img=document.createElement('img');img.src=recipePhoto(r);img.alt=r.name;img.onerror=()=>{img.onerror=null;img.src='../meal-placeholder.svg'};
  const main=document.createElement('div');main.className='cb-plan-row-main';
  const title=document.createElement('strong');title.textContent=r.name;
  const details=document.createElement('small');details.textContent=x.repeat+' × '+x.c+' '+(x.c===1?'serving':'servings');
  const tools=document.createElement('div');tools.className='cb-plan-tools';
  const minus=document.createElement('button');minus.className='btn secondary';minus.textContent='− meal';
  minus.onclick=()=>{p.count=x.repeat-1;if(p.count<=0)state.planned=state.planned.filter(a=>a!==p);state.cartChecked={};save();renderPlanned();renderShopping()};
  const plus=document.createElement('button');plus.className='btn secondary';plus.textContent='+ meal';
  plus.onclick=()=>{p.count=x.repeat+1;state.cartChecked={};save();renderPlanned();renderShopping()};
  const servings=document.createElement('select');servings.setAttribute('aria-label','Change servings for '+r.name);
  servings.style.cssText='max-width:112px;padding:7px;font-size:12px';
  for(let k=1;k<=8;k++){const opt=document.createElement('option');opt.value=k;opt.textContent=k+' servings';servings.append(opt)}
  servings.value=String(x.c);
  servings.onchange=()=>{p.servings=+servings.value;state.cartChecked={};save();renderPlanned();renderShopping()};
  const del=document.createElement('button');del.className='btn secondary';del.textContent='Remove';
  del.onclick=()=>{state.planned=state.planned.filter(a=>a!==p);state.cartChecked={};save();renderPlanned();renderShopping()};
  tools.append(minus,plus,servings,del);main.append(title,details,tools);row.append(img,main);root.append(row);
 }
}
renderPlanned=renderPlan;
function shoppingDept(name){
 const s=name.toLowerCase();
 if(s.startsWith('frozen ')||/frozen green beans|frozen corn/.test(s))return 'FROZEN';
 if(/black pepper|white pepper|red pepper flakes|paprika|seasoning|garlic powder|onion powder|oregano|cumin|basil|spice|cinnamon|ground ginger/.test(s))return 'HERBS & SPICES';
 if(/broccoli|pepper|lemon|potato|onion|spinach|carrot|garlic clove|tomato|lettuce|cucumber|avocado|banana|apple|orange|grape/.test(s)&&!/powder|sauce/.test(s))return 'PRODUCE';
 if(/tilapia|shrimp|salmon|chicken breast|sausage|ground turkey|ground beef|fish|meat/.test(s))return 'MEAT & SEAFOOD';
 if(/frozen|green beans|corn/.test(s))return 'FROZEN';
 if(/egg|cheese|butter|milk|yogurt|parmesan/.test(s))return 'DAIRY & EGGS';
 if(/rice|pasta|noodle|oat|quinoa|couscous/.test(s))return 'RICE, GRAINS & PASTA';
 if(/tortilla|bread|roll|bun/.test(s))return 'BAKERY & BREAD';
 if(/beans|chickpeas|salsa|tomato sauce/.test(s))return 'CANNED & JARRED';
 if(/oil|vinegar|honey|soy sauce|dressing|syrup/.test(s))return 'OILS, SAUCES & CONDIMENTS';
 if(/seasoning|garlic powder|paprika|salt|pepper|oregano|cumin|basil|spice/.test(s))return 'HERBS & SPICES';
 return 'OTHER GROCERIES';
}
const departmentOrder=['PRODUCE','MEAT & SEAFOOD','FROZEN','DAIRY & EGGS','BAKERY & BREAD','RICE, GRAINS & PASTA','CANNED & JARRED','OILS, SAUCES & CONDIMENTS','HERBS & SPICES','OTHER GROCERIES'];
function amountToBuy(q,u){return /^(each|can|jar|whole|package|bag)$/i.test(u)?Math.ceil(q):q}
function mergedGroceries(){
 const map=new Map();
 const insert=(name,unit,qty,manualId)=>{
  const key=name.trim().toLowerCase()+'|'+unit.trim().toLowerCase();
  let x=map.get(key);if(!x){x={key,name,unit,qty:0,manualIds:[],dept:shoppingDept(name)};map.set(key,x)}
  x.qty=round3(x.qty+qty);if(manualId)x.manualIds.push(manualId);
 };
 const ordered=state.pendingOrder?.items||[];
 const quantities=new Map(ordered.map(x=>[x.key,Number(x.qty)||0]));
 for(const x of plannedNeeds()){
  const key=x.name.trim().toLowerCase()+'|'+x.unit.trim().toLowerCase();
  const missing=round3(Math.max(0,Number(x.qty)-(quantities.get(key)||0)));
  if(missing>0)insert(x.name,x.unit,missing,null);
 }
 // Manual items added after an order is placed must still appear, even if they share a product name.
 for(const x of state.shopping||[])if(Number(x.qty)>0)insert(x.name,x.unit,Number(x.qty),x.id);
 return [...map.values()].filter(x=>x.qty>0.0001)
  .sort((a,b)=>departmentOrder.indexOf(a.dept)-departmentOrder.indexOf(b.dept)||a.name.localeCompare(b.name));
}
function buyGroceryItem(item){
 addToStock(item.name,amountToBuy(Number(item.qty),item.unit),item.unit);
 const remove=new Set(item.manualIds||[]);
 state.shopping=state.shopping.filter(x=>!remove.has(x.id));
 delete state.cartChecked[item.key];
 save();renderShopping();renderInventory();
}
function drawGroceries(){
 const root=$cb('shoppingItems');if(!root)return;
 root.innerHTML='';
 const list=mergedGroceries(),stats=$cb('groceryStats');
 if(stats)stats.textContent=list.length+' '+(list.length===1?'item':'items')+' left to buy';
 if(!list.length)root.innerHTML='<div class="cb-empty">Nothing left to buy. 🎉</div>';
 let last='';
 for(const item of list){
  if(last!==item.dept){last=item.dept;const h=document.createElement('h3');h.className='cb-dept';h.textContent=last;root.append(h)}
  const row=document.createElement('div');row.className='cb-grocery-row';
  const circle=document.createElement('span');circle.className='cb-grocery-circle';circle.textContent='○';circle.setAttribute('aria-hidden','true');
  const label=document.createElement('span');label.className='cb-grocery-label';label.textContent=item.name;
  const amount=document.createElement('span');amount.className='cb-amount';amount.textContent=fmtQty(amountToBuy(item.qty,item.unit),item.unit);
  row.append(circle,label,amount);
  row.setAttribute('role','button');row.tabIndex=0;
  row.setAttribute('aria-label','Bought '+item.name+', move to Kitchen');
  row.onclick=()=>buyGroceryItem(item);
  row.onkeydown=ev=>{if(ev.target===row&&(ev.key==='Enter'||ev.key===' ')){ev.preventDefault();buyGroceryItem(item)}};
  root.append(row);
 }
 const pantry=$cb('pantryOptional');if(!pantry)return;
 pantry.innerHTML='<h3>🧂 Pantry seasonings</h3><p class="cb-sub">Add a jar if you need one. Spices are not automatically tracked by the teaspoon.</p>';
 const spices=pantrySeasonings();
 if(!spices.length)pantry.innerHTML+='<p class="cb-sub">No additional seasonings to check.</p>';
 for(const name of spices){
  const btn=document.createElement('button');btn.className='btn secondary mini';btn.style.margin='5px';
  btn.textContent='+ '+name;
  const exists=state.shopping.some(x=>x.name.trim().toLowerCase()===name.trim().toLowerCase());
  const inKitchen=stock(name,'jar')>0;
  const ordered=!!state.pendingOrder?.items?.some(x=>x.name.toLowerCase()===name.toLowerCase()&&x.unit==='jar');
  btn.disabled=exists||inKitchen||ordered;if(exists)btn.textContent='✓ '+name+' on list';else if(inKitchen)btn.textContent='✓ In Kitchen: '+name;else if(ordered)btn.textContent='✓ Ordered: '+name;
  btn.onclick=()=>addSeasoningToList(name);pantry.append(btn);
 }
}
renderShopping=drawGroceries;
addShopManual=function(){
 const name=$cb('shopName').value.trim(),qty=Number($cb('shopQty').value),unit=$cb('shopUnit').value.trim()||'each';
 if(!name||!Number.isFinite(qty)||qty<=0){alert('Enter an item and a positive quantity.');return}
 state.shopping.push({id:uid(),name,qty,unit,manual:true});
 $cb('shopName').value='';save();renderShopping();
};
function drawPendingPickup(){
 const container=$cb('cbPendingOrder');if(!container)return;
 container.innerHTML='';
 const order=state.pendingOrder;
 if(!order?.items?.length)return;
 const panel=document.createElement('div');panel.className='cb-panel cb-pending-order';
 const heading=document.createElement('h3');heading.textContent='🚗 Your Instacart pickup order';
 const p=document.createElement('p');p.className='cb-sub';
 p.textContent=order.items.length+' items are marked ordered, not yet in your Kitchen.';
 const actions=document.createElement('div');actions.className='cb-pending-actions';
 const receive=document.createElement('button');receive.className='btn';receive.type='button';receive.textContent='✓ Picked up — add to Kitchen';
 receive.onclick=()=>{
  const pending=state.pendingOrder;if(!pending)return;
  for(const item of pending.items)addToStock(item.name,Number(item.qty),item.unit);
  state.pendingOrder=null;save();renderShopping();renderInventory();
 };
 const undo=document.createElement('button');undo.type='button';undo.className='btn secondary';undo.textContent='↩ Undo order status';
 undo.onclick=()=>{
  const pending=state.pendingOrder;if(!pending)return;
  for(const item of pending.manualItems||[])if(!state.shopping.some(x=>x.id===item.id))state.shopping.push(item);
  state.pendingOrder=null;save();renderShopping();
 };
 actions.append(receive,undo);panel.append(heading,p,actions);container.append(panel);
}
window.markInstacartOrderPlaced=()=>{
 if(state.pendingOrder?.items?.length)return;
 const list=mergedGroceries();if(!list.length)return;
 const items=list.map(x=>({key:x.key,name:x.name,unit:x.unit,qty:amountToBuy(x.qty,x.unit)}));
 const ids=new Set(list.flatMap(x=>x.manualIds));
 const manualItems=state.shopping.filter(x=>ids.has(x.id));
 state.shopping=state.shopping.filter(x=>!ids.has(x.id));
 state.pendingOrder={items,manualItems,placedAt:Date.now()};
 state.cartChecked={};
 save();renderShopping();
};
const legacyRenderInventory=renderInventory;
renderInventory=function(){
 // Treat nonpositive quantities as out of stock, including old saved 0-quantity records.
 // Preserve any malformed records rather than silently discarding the user's data.
 if(Array.isArray(state.inventory)){
  const countBefore=state.inventory.length;
  state.inventory=state.inventory.filter(item=>{
   const amount=Number(item.qty);
   return !Number.isFinite(amount)||amount>0;
  });
  if(state.inventory.length!==countBefore)save();
 }
 legacyRenderInventory();
 const root=$cb('inventoryItems');if(!root)return;
 if(!state.inventory.length)root.innerHTML='<div class="cb-empty">Nothing recorded yet. Check off groceries, then add them here after shopping.</div>';
};

let currentCategory='All';
const categoryFilter=document.createElement('div');
categoryFilter.id='cbCategoryFilters';
categoryFilter.className='filters cb-unified-filters';
categoryFilter.setAttribute('aria-label','Recipe filters');
const oldFilters=$q('#home .filters');
if(oldFilters)oldFilters.replaceWith(categoryFilter);
function recipeMatchesCategory(r,tag){
 const n=r.name.toLowerCase();
 if(tag==='All'||tag==='Favorites'||tag==='Use tonight')return true;
 if(tag==='Test')return n.includes('timer test');
 if(n.includes('timer test'))return false;
 if(tag==='Seafood')return /tilapia|shrimp|salmon|seafood|fish/.test(n);
 if(tag==='Breakfast')return /breakfast|egg.*wrap/.test(n);
 if(tag==='Vegetarian')return !/chicken|turkey|beef|sausage|tilapia|shrimp|salmon|meat|fish/.test(n+' '+r.ingredients.join(' '));
 if(tag==='Quick')return r.steps.reduce((sum,x)=>sum+(x.seconds||0),0)<=1800&&!/sheet.pan/.test(n);
 if(tag==='Dinner')return !/breakfast|egg.*wrap/.test(n);
 return true;
}
window.setBuddyCategory=tag=>{currentCategory=tag;filter=tag==='Favorites'?'favorites':tag==='Use tonight'?'tonight':'all';renderRecipes()};
const renderWithServing=renderRecipes;
renderRecipes=function(){
 renderWithServing();
 categoryFilter.innerHTML='';
 for(const tag of ['All','Favorites','Use tonight','Quick','Vegetarian','Seafood','Breakfast','Dinner','Test']){
  const btn=document.createElement('button');btn.className='btn secondary'+(tag===currentCategory?' selected':'');
  btn.textContent=tag==='Favorites'?'♥ Favorites':tag==='Use tonight'?'🥦 Use tonight':tag;btn.onclick=()=>window.setBuddyCategory(tag);categoryFilter.append(btn);
 }
 let visible=0;
 for(const card of document.querySelectorAll('#recipes .mealcard')){
  const name=card.querySelector('h3')?.textContent;
  const r=state.recipes.find(x=>x.name===name);
  const show=!r||recipeMatchesCategory(r,currentCategory);
  card.style.display=show?'':'none';if(show)visible++;
 }
 const label=$cb('recipeCount');if(label)label.textContent=visible+' '+(visible===1?'recipe':'recipes')+' available';
 if(!visible&&$cb('recipes')){
  const empty=document.createElement('p');empty.className='muted';empty.textContent='No recipes in this category yet.';empty.style.gridColumn='1/-1';$cb('recipes').append(empty);
 }
};

// Kitchen Buddy pickup-prep beta: hand off a local list; checkout stays at retailer.
const pickupPanel=document.createElement('details');
pickupPanel.className='cb-pickup';
pickupPanel.open=false;
pickupPanel.innerHTML=
 '<summary>🚗 Pickup at Stop &amp; Shop #0404</summary>'+
 '<div class="cb-pickup-body">'+
 '<div class="cb-pickup-location">1600 Boston Road · Springfield, MA 01129</div>'+
 '<p class="cb-sub">Your saved pickup store. Pick your meals first; we combine their missing ingredients below.</p>'+
 '<div class="cb-pickup-grid"><label for="cbPickupTime">Preferred pickup time'+
 '<input id="cbPickupTime" type="time" aria-label="Preferred pickup time"></label>'+
 '<div class="cb-sub" id="cbPickupCount" aria-live="polite"></div></div>'+
 '<label for="cbPickupList" class="cb-sub">Items to order (editable only in your grocery list)</label>'+
 '<textarea id="cbPickupList" class="cb-pickup-preview" readonly rows="5" aria-label="Prepared grocery pickup list"></textarea>'+
 '<div class="cb-pickup-actions">'+
 '<button type="button" id="cbPickupCopy" class="btn secondary">📋 Copy grocery list</button>'+
 '<a class="btn" id="cbPickupShop" href="https://www.instacart.com/retailer/stop-shop-delivery/ma/near-me-in-springfield-ma" target="_blank" rel="noopener noreferrer">🛒 Continue to Instacart ↗</a></div>'+
 '<p class="cb-pickup-footnote"><strong>Thursday test:</strong> Instacart first asks for your ZIP code and login. Enter <strong>01129</strong>, sign in, select Pickup, and verify <strong>1600 Boston Road</strong> is available. Then add your ingredients and choose a pickup slot. The list is <strong>not</strong> automatically sent to the cart. The time above is a reminder, not a reservation; products, prices and pickup availability need confirmation at checkout. Only mark items Bought after receiving them.</p>'+
 '</div>';
// Keep the grocery list first; pickup actions live after the list and are opened from the cart icon.
const groceryExtras=groceries.querySelector('.cb-add-grocery');
if(groceryExtras)groceryExtras.before(pickupPanel);
const orderAction=document.createElement('div');
orderAction.id='cbPlaceOrderPanel';orderAction.className='cb-order-action';
orderAction.innerHTML='<button class="btn" type="button" onclick="markInstacartOrderPlaced()">I completed my Instacart order</button><p class="cb-sub">The app cannot read Instacart checkout confirmations yet. Mark ordered only after checkout succeeds; the groceries enter Kitchen after pickup.</p>';
pickupPanel.querySelector('.cb-pickup-body').append(orderAction);
window.togglePickupOptions=()=>{
 pickupPanel.open=!pickupPanel.open;
 const toggle=$cb('cbOpenOrder');if(toggle)toggle.setAttribute('aria-expanded',pickupPanel.open?'true':'false');
 if(pickupPanel.open&&pickupPanel.scrollIntoView)pickupPanel.scrollIntoView({behavior:'smooth',block:'nearest'});
};
const pickupTimeField=$cb('cbPickupTime');
pickupTimeField.value=(typeof prefs.pickupTime==='string'&&/^\d{2}:\d{2}$/.test(prefs.pickupTime))?prefs.pickupTime:'15:30';
pickupTimeField.onchange=()=>{
 prefs.pickupTime=pickupTimeField.value||'15:30';
 savePrefs();paintPickup();
};
function pickupTimeLabel(){
 const t=pickupTimeField.value||'15:30';
 const parts=t.split(':').map(Number);
 return ((parts[0]%12)||12)+':'+String(parts[1]).padStart(2,'0')+(parts[0]>=12?' PM':' AM');
}
function pickupRemaining(){
 return mergedGroceries();
}
function pickupText(){
 const items=pickupRemaining();
 if(!items.length)return '';
 const lines=['Kitchen Buddy grocery pickup list','Preferred store: Stop & Shop #0404 — 1600 Boston Road, Springfield MA 01129',
  'Preferred pickup time: '+pickupTimeLabel()+' (select an available slot during checkout)',''];
 for(const it of items)lines.push('• '+it.name+' — '+fmtQty(amountToBuy(it.qty,it.unit),it.unit));
 lines.push('', 'Review package sizes, substitutes and available pickup location in Instacart.');
 return lines.join('\n');
}
function groceryChatPrompt(){
 const items=pickupRemaining();
 if(!items.length)return '';
 const lines=[
  'KITCHEN BUDDY → INSTACART HANDOFF',
  '',
  'Please add ALL the following items to my connected Instacart shopping cart. Do not place an order or check out.',
  'I prefer Stop & Shop. If no retailer has been selected, show me the retailer selection and let me choose.',
  'Choose sensible grocery packages for recipe measurements, and tell me about substitutes or items you cannot find. Do not guess sizes or prices.',
  'Review the completed cart with me before checkout.',
  '',
  'GROCERY LIST:'
 ];
 for(const item of items)lines.push('- '+item.name+' — '+fmtQty(amountToBuy(item.qty,item.unit),item.unit));
 return lines.join('\n');
}
window.sendGroceriesToChatGPT=async()=>{
 const prompt=groceryChatPrompt();
 if(!prompt){toast('Your grocery list is empty. Plan a meal or add groceries first.');return}
 // Android's native share sheet may offer ChatGPT as a target; it cannot target this specific chat.
 if(typeof navigator.share==='function'){
  try{
   await navigator.share({title:'Kitchen Buddy groceries for Instacart',text:prompt});
   return;
  }catch(err){
   if(err&&err.name==='AbortError')return;
  }
 }
 // Without a supported share target, copy the request and open ChatGPT for manual pasting.
 try{
  if(!navigator.clipboard?.writeText)throw Error('Clipboard not supported');
  await navigator.clipboard.writeText(prompt);
  toast('List copied. Paste it into ChatGPT to fill your Instacart cart.');
  window.location.assign('https://chatgpt.com/');
 }catch(err){
  // Keep the message available for manual copy if clipboard access is denied.
  const preview=$cb('cbPickupList');
  if(preview){
   pickupPanel.open=true;
   preview.value=prompt;preview.focus();preview.select();
  }
  toast('Copy the selected shopping request, then paste it into ChatGPT.');
 }
};
function paintPickup(){
 const items=pickupRemaining();
 const count=$cb('cbPickupCount'),textArea=$cb('cbPickupList'),copy=$cb('cbPickupCopy');
 if(!count||!textArea||!copy)return;
 const orderButton=$cb('cbPlaceOrderPanel');if(orderButton)orderButton.hidden=!items.length||!!state.pendingOrder?.items?.length;
 count.textContent=items.length+' remaining '+(items.length===1?'item':'items')+' to add to the order';
 textArea.value=items.length?pickupText():'Your order list is empty. Plan a meal or add groceries first.';
 copy.disabled=!items.length;
 const share=$cb('cbShareChatGPT');if(share)share.disabled=!items.length;
}
$cb('cbPickupCopy').onclick=async()=>{
 const msg=pickupText();
 if(!msg){toast('Plan a meal to build a list first.');return}
 const ta=$cb('cbPickupList');
 try {
  if(navigator.clipboard&&navigator.clipboard.writeText)await navigator.clipboard.writeText(msg);
  else {ta.focus();ta.select();if(!document.execCommand('copy'))throw Error('Clipboard unavailable')}
  toast('List copied! Add products to your Instacart pickup cart.');
 } catch(err) {
  ta.focus();ta.select();
  toast('Select and copy the list shown above.');
 }
};
const drawGroceriesBeforePickup=renderShopping;
renderShopping=function(){drawGroceriesBeforePickup();drawPendingPickup();paintPickup()};
paintPickup();

renderRecipes();paintSettings();showTab('home');renderPlan();
// No timer in a web app can guarantee alarm delivery when the OS suspends the page.
})();