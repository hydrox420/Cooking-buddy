const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 try{
  await page.goto('http://127.0.0.1:8765/layout-test/',{waitUntil:'networkidle'});
  await page.waitForSelector('.kb-compact-card');
  const counts=await page.evaluate(()=>{
   const pic=state.recipes.filter(r=>r.photo?.includes('/assets/verified/'));
   return {total:state.recipes.length,withRealPictures:pic.length,ids:new Set(pic.map(r=>r.id)).size,recipeSources:pic.every(r=>r.recipeSourceUrl?.startsWith('https://'))};
  });
  assert.ok(counts.total>=39&&counts.withRealPictures>=22&&counts.withRealPictures===counts.ids&&counts.recipeSources,'39 recipes, including 22 photographed, with source links');
  const headers=[['plan','Meal Plan'],['shopping','Your Shopping List'],['kitchen','My Kitchen'],['fridge','My Fridge'],['settings','My Profile']];
  for(const [tab,label] of headers){
   await page.locator('nav.tabs [data-tab="'+tab+'"]').click();
   const heading=page.locator('#'+tab+' .kb-tab-intro h2');
   assert.equal((await heading.textContent()).trim(),label,'correct '+tab+' heading');
   const rect=await heading.boundingBox();
   assert.ok(rect && Math.abs(rect.x+rect.width/2-393/2)<=16,tab+' heading is visually centered');
   assert.ok(!/\p{Extended_Pictographic}/u.test(label),'no emoji in heading');
  }
  await page.locator('nav.tabs [data-tab="home"]').click();
  await page.locator('#recipes .kb-card-picture').first().click();
  assert.equal(await page.locator('#cook').isVisible(),true,'cooking opened');
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>window.kbCurrentScreen()==='home');
  assert.equal(await page.locator('#home').isVisible(),true,'Android Back returns from a recipe to Recipes');
  await page.locator('nav.tabs [data-tab="plan"]').click();
  await page.locator('nav.tabs [data-tab="shopping"]').click();
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>window.kbCurrentScreen()==='plan');
  assert.equal(await page.locator('#plan').isVisible(),true,'Back from Shopping returns to Plan');
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>window.kbCurrentScreen()==='home');
  await page.evaluate(()=>history.back());
  await page.waitForTimeout(350);
  assert.ok(page.url().includes('/layout-test/')&&(await page.locator('#home').isVisible()),'Back on home stays in app');
  await page.locator('#recipes .kb-card-picture').first().click();
  await page.getByRole('button',{name:'Plan this meal'}).click();
  const selected=await page.evaluate(()=>({planSize:state.planned.length,name:state.recipes.find(r=>r.id===state.planned[0]?.recipeId)?.name}));
  assert.ok(selected.planSize>=1&&selected.name,'Planning a pictured recipe works');
  await page.locator('nav.tabs [data-tab="plan"]').click();
  assert.ok((await page.locator('#plannedMeals').innerText()).includes(selected.name),'planned meal in meal-plan tab');
  await page.locator('nav.tabs [data-tab="shopping"]').click();
  assert.ok((await page.locator('#shoppingItems').innerText()).length>20,'shopping list populated with planned meal ingredients');
  const handoff=await page.evaluate(()=>({
   prompt:typeof groceryChatPrompt==='function'?groceryChatPrompt():null,
   onclick:document.getElementById('cbOpenOrder')?.getAttribute('onclick')
  }));
  assert.ok(handoff.prompt?.includes('Stop & Shop')&&handoff.prompt?.length>100,'Instacart/ChatGPT handoff prepares full grocery request');
  assert.ok(handoff.onclick?.includes('sendGroceriesToChatGPT'),'handoff remains wired, without placing an order');
  await page.locator('nav.tabs [data-tab="fridge"]').click();
  await page.locator('#cbFridgeAddButton').click();
  assert.equal(await page.locator('#cbFridgeAddPanel').isVisible(),true,'fridge form opens');
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>document.querySelector('#cbFridgeAddPanel')?.classList.contains('hide'));
  assert.equal(await page.locator('#fridge').isVisible(),true,'Back closes nested fridge form but stays in Fridge');
  await page.locator('#cbFridgeAddButton').click();
  await page.locator('#foodName').fill('Test leftover rice');
  await page.locator('#foodNotes').fill('A small portion for tomorrow');
  await page.getByRole('button',{name:'Save to Fridge'}).click();
  assert.ok((await page.locator('#foods').innerText()).includes('Test leftover rice'),'fridge saves date-stamped leftovers');
  await page.evaluate(()=>history.back());
  await page.waitForFunction(()=>window.kbCurrentScreen()==='shopping');
  assert.equal(await page.locator('#shopping').isVisible(),true,'Back from fridge returns to previous Shopping tab');
  assert.deepEqual(errors,[],'no page errors');
  console.log('PASS: '+counts.withRealPictures+' source-photographed recipes, centered tabs, browser Back, plan/shopping handoff, fridge add/save');
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exitCode=1});
