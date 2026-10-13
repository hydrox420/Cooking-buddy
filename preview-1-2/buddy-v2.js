
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
const baseCount=r=>Number(r.servings)||2;
const selectedCount=r=>Math.max(1,Math.min(8,Number(state.recipeServings[r.id]||prefs.defaultServings)||1));
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
 if(tab==='kitchen'){renderInventory();renderFoods()}
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
groceries.innerHTML='<div class="cb-intro"><span class="eyebrow">YOUR SHOPPING TRIP</span><h2>🛒 Groceries</h2><p>One list for all meals, grouped by department. Tap the circles when you buy things.</p></div><div id="groceryStats" class="cb-check-total"></div><div id="shoppingItems"></div><div class="cb-bottom-save"><button class="btn" onclick="moveCheckedToKitchen()">📦 Add checked groceries to Kitchen</button><p class="cb-sub">Checking a box only crosses it off. Nothing enters inventory until you confirm above.</p></div><details class="cb-panel"><summary>＋ Add a grocery item</summary><label>Item<input id="shopName" placeholder="Bananas"></label><label>Amount<input id="shopQty" type="number" step="any" min="0.01" value="1"></label><label>Unit<input id="shopUnit" placeholder="each"></label><button class="btn" onclick="addShopManual()">Add to grocery list</button></details><div id="pantryOptional" class="cb-panel"></div>';
const kitchen=document.createElement('section');kitchen.id='kitchen';kitchen.className='hide';
kitchen.innerHTML='<div class="cb-intro"><span class="eyebrow">WHAT YOU HAVE AT HOME</span><h2>🥬 My Kitchen</h2><p>Pantry inventory, fridge reminders and leftovers live here.</p></div><details class="cb-panel" open><summary>📦 Kitchen Inventory</summary><div id="inventoryItems"></div></details><details class="cb-panel"><summary>🧊 Fridge & leftovers</summary><div id="kitchenFridge"></div></details>';
groceries.after(kitchen);
if(oldFridge){const bucket=$cb('kitchenFridge');while(oldFridge.firstChild)bucket.append(oldFridge.firstChild);oldFridge.remove()}
oldSettings.innerHTML='<div class="cb-intro"><span class="eyebrow">MAKE IT YOURS</span><h2>⚙️ Preferences</h2><p>Set your default serving size, timer alerts and food preferences.</p></div><div class="cb-panel"><h3>🍽️ Cooking preferences</h3><div class="cb-field"><label for="cbDefaultServings">Default meal size</label><select id="cbDefaultServings"></select></div><div class="cb-field"><label for="cbAutoFloat">Floating timer</label><select id="cbAutoFloat"><option value="0">Open manually</option><option value="1">Try automatically when a timer starts</option></select></div><p class="cb-settings-note">Automatic floating windows depend on browser support and a user tap. They may not open on iPhones or while another video uses picture-in-picture.</p></div><div class="cb-panel"><h3>🔔 Alarm sound & notifications</h3><div id="cbSoundSlot"></div><p class="cb-settings-note">A browser timer cannot guarantee a background alert after Android or iOS suspends the app. Use the Clock app as backup for important cooking times.</p></div><div class="cb-panel"><h3>🥗 Dietary preferences</h3><div class="cb-field"><label for="cbDislikes">Ingredients you dislike (comma-separated)</label><input id="cbDislikes" placeholder="olives, mushrooms"></div><div class="cb-field"><label for="cbAllergies">Allergies / restrictions (comma-separated)</label><input id="cbAllergies" placeholder="e.g. peanuts"></div><p class="cb-settings-note">Keyword warnings are informational only. We cannot verify allergens, product labels, or cross-contact. Always check ingredients yourself.</p></div><div class="cb-panel"><h3>💾 Your recipes and data</h3><p class="cb-sub">This beta saves its data locally on this device. Back up your recipes regularly.</p><button class="btn secondary" onclick="exportData()">Export backup</button></div>';
const soundSlot=$cb('cbSoundSlot');
if(oldTimerOptions){
 oldTimerOptions.classList.remove('hide');oldTimerOptions.open=true;
 oldTimerOptions.querySelector('summary').textContent='Choose alarm sound and enable notifications';
 soundSlot.append(oldTimerOptions);
}
if($cb('alarmSound'))$cb('alarmSound').value=getTimerSound();
const allNavigation=$cb('home')?.closest('main')?.nextElementSibling;
const nav=document.querySelector('nav.tabs');
if(nav)nav.innerHTML=[
 ['home','📖','Recipes'],['plan','📅','Plan'],['shopping','🛒','Groceries'],
 ['kitchen','🥬','Kitchen'],['settings','⚙️','Settings']
].map(row=>'<button class="btn secondary" data-tab="'+row[0]+'" onclick="showTab(\''+row[0]+'\')">'+row[1]+' '+row[2]+'</button>').join('');
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
  return fmt(start*factor)+(b?'–'+fmt(qtyToken(b)*factor):'')+' '+unit;
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
 currentRecipeID=null;showTab('home');toast('Cooking complete! '+(shouldDeduct?'Inventory adjusted.':'Inventory unchanged.'));
}
finishCooking=endCooking;
