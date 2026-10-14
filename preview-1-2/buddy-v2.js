
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
 currentRecipeID=null;showTab('home');toast('Cooking complete! '+(shouldDeduct?'Inventory adjusted.':'Inventory unchanged.'));
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
 state.cartChecked={};save();showTab('plan');
 toast(r.name+' added for '+servings+' '+(servings===1?'person':'people')+'! 🛒');
};
function renderPlan(){
 state.planned=Array.isArray(state.planned)?state.planned:[];
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
  let entry=map.get(key);
  if(!entry){entry={key,name,unit,qty:0,manualIds:[],dept:shoppingDept(name)};map.set(key,entry)}
  entry.qty=round3(entry.qty+qty);if(manualId)entry.manualIds.push(manualId);
 };
 for(const item of plannedNeeds())insert(item.name,item.unit,Number(item.qty),null);
 for(const item of state.shopping||[])if(Number(item.qty)>0)insert(item.name,item.unit,Number(item.qty),item.id);
 return [...map.values()].sort((a,b)=>departmentOrder.indexOf(a.dept)-departmentOrder.indexOf(b.dept)||a.name.localeCompare(b.name));
}
function drawGroceries(){
 state.cartChecked=state.cartChecked||{};
 const root=$cb('shoppingItems');if(!root)return;root.innerHTML='';
 const list=mergedGroceries(),checked=list.filter(x=>state.cartChecked[x.key]);
 const stats=$cb('groceryStats');
 if(stats)stats.textContent=checked.length+' of '+list.length+' grocery items checked off';
 if(!list.length){root.innerHTML='<div class="cb-empty">Your grocery list is empty. Plan a meal or add an item. 🛒</div>'}
 let last='';
 for(const item of list){
  if(last!==item.dept){last=item.dept;const h=document.createElement('h3');h.className='cb-dept';h.textContent=last;root.append(h)}
  const row=document.createElement('div');row.className='cb-grocery-row'+(state.cartChecked[item.key]?' checked':'');
  const input=document.createElement('input');input.type='checkbox';input.checked=!!state.cartChecked[item.key];
  input.setAttribute('aria-label','Bought '+item.name);const id='cart-'+list.indexOf(item);input.id=id;
  input.onchange=()=>{if(input.checked)state.cartChecked[item.key]=true;else delete state.cartChecked[item.key];save();renderShopping()};
  const label=document.createElement('label');label.htmlFor=id;label.textContent=item.name;
  const amount=document.createElement('span');amount.className='cb-amount';amount.textContent=fmtQty(amountToBuy(item.qty,item.unit),item.unit);
  row.append(input,label,amount);root.append(row);
 }
 const pantry=$cb('pantryOptional');pantry.innerHTML='<h3>🧂 Pantry seasonings</h3><p class="cb-sub">Spices are not automatically counted by the teaspoon. Add a jar when you need one.</p>';
 const spices=pantrySeasonings();
 if(!spices.length)pantry.innerHTML+='<p class="cb-sub">No extra seasonings to check right now.</p>';
 for(const name of spices){
  const btn=document.createElement('button');btn.className='btn secondary mini';btn.style.margin='5px';
  btn.textContent='+ '+name;
  const exists=state.shopping.some(x=>x.name.trim().toLowerCase()===name.trim().toLowerCase());
  btn.disabled=exists;if(exists)btn.textContent='✓ '+name+' on list';
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
window.moveCheckedToKitchen=()=>{
 const list=mergedGroceries().filter(x=>state.cartChecked[x.key]);
 if(!list.length){toast('Check off groceries as you shop first.');return}
 if(!confirm('Add '+list.length+' checked grocery items to Kitchen inventory? Only do this after buying them.'))return;
 const remove=new Set();
 for(const item of list){
  addToStock(item.name,amountToBuy(item.qty,item.unit),item.unit);
  item.manualIds.forEach(id=>remove.add(id));
  delete state.cartChecked[item.key];
 }
 state.shopping=state.shopping.filter(x=>!remove.has(x.id));
 save();renderShopping();renderInventory();toast('Checked groceries added to Kitchen! 🥬');
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
categoryFilter.className='filters';
categoryFilter.style.marginTop='-6px';
const oldFilters=$q('#home .filters');
if(oldFilters)oldFilters.after(categoryFilter);
function recipeMatchesCategory(r,tag){
 const n=r.name.toLowerCase();
 if(tag==='All')return true;
 if(tag==='Test')return n.includes('timer test');
 if(n.includes('timer test'))return false;
 if(tag==='Seafood')return /tilapia|shrimp|salmon|seafood|fish/.test(n);
 if(tag==='Breakfast')return /breakfast|egg.*wrap/.test(n);
 if(tag==='Vegetarian')return !/chicken|turkey|beef|sausage|tilapia|shrimp|salmon|meat|fish/.test(n+' '+r.ingredients.join(' '));
 if(tag==='Quick')return r.steps.reduce((sum,x)=>sum+(x.seconds||0),0)<=1800&&!/sheet.pan/.test(n);
 if(tag==='Dinner')return !/breakfast|egg.*wrap/.test(n);
 return true;
}
window.setBuddyCategory=tag=>{currentCategory=tag;renderRecipes()};
const renderWithServing=renderRecipes;
renderRecipes=function(){
 renderWithServing();
 categoryFilter.innerHTML='';
 for(const tag of ['All','Quick','Vegetarian','Seafood','Breakfast','Dinner','Test']){
  const btn=document.createElement('button');btn.className='btn secondary'+(tag===currentCategory?' selected':'');
  btn.textContent=tag;btn.onclick=()=>window.setBuddyCategory(tag);categoryFilter.append(btn);
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
pickupPanel.open=true;
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
 '<a class="btn" id="cbPickupShop" href="https://www.instacart.com/retailer/stop-shop-delivery/ma/near-me-in-springfield-ma" target="_blank" rel="noopener noreferrer">🛒 Open Instacart pickup ↗</a></div>'+
 '<p class="cb-pickup-footnote"><strong>Thursday test:</strong> Select Pickup and <strong>1600 Boston Road</strong> in Instacart, then add the items and choose an available pickup slot. The list is <strong>not</strong> automatically sent to the cart. The time above is a reminder, not a reservation; products, prices and pickup availability need confirmation at checkout. Only mark items Bought after receiving them.</p>'+
 '</div>';
const groceryHeading=groceries.querySelector('.cb-intro');
if(groceryHeading)groceryHeading.after(pickupPanel);
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
 return mergedGroceries().filter(it=>!state.cartChecked[it.key]);
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
function paintPickup(){
 const items=pickupRemaining();
 const count=$cb('cbPickupCount'),textArea=$cb('cbPickupList'),copy=$cb('cbPickupCopy');
 if(!count||!textArea||!copy)return;
 count.textContent=items.length+' remaining '+(items.length===1?'item':'items')+' to add to the order';
 textArea.value=items.length?pickupText():'Your order list is empty. Plan a meal or add groceries first.';
 copy.disabled=!items.length;
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
renderShopping=function(){drawGroceriesBeforePickup();paintPickup()};
paintPickup();

renderRecipes();paintSettings();showTab('home');
// No timer in a web app can guarantee alarm delivery when the OS suspends the page.
})();