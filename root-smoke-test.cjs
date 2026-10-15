const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try{
  // Simulate a real older installation before loading the updated root app.
  await page.addInitScript(()=>{
   if(!localStorage.getItem('cookingBuddy_v1'))localStorage.setItem('cookingBuddy_v1',JSON.stringify({
    recipes:[{id:'my-test-personal-recipe',name:'My personal dish',description:'My recipe',
     servings:1,ingredients:['1 cup pasta'],items:[{name:'pasta',qty:1,unit:'cup'}],
     steps:[{title:'Cook',text:'Boil pasta',seconds:0}],favorite:true,
     photo:'data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22/%3E'}],
    foods:[{id:'pre-upgrade-food',name:'My leftovers',date:'2026-10-14',days:4,notes:'Keep this'}],
    shopping:[],inventory:[{id:'pre-upgrade-stock',name:'pasta',qty:2,unit:'cup'}],
    planned:[{recipeId:'my-test-personal-recipe',count:1}]
   }));
  });
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'networkidle'});
  await page.waitForSelector('#recipes .kb-compact-card',{timeout:20000});
  assert.match(await page.title(),/Kitchen Buddy.*Forest Cabin/);
  const intro=page.locator('#timerSetupPanel');
  if(await intro.isVisible())await intro.getByRole('button',{name:'Not now'}).click();
  assert.ok((await page.locator('#recipes .kb-compact-card').count())>=39,'all 39 pictured recipes visible');
  assert.ok((await page.locator('#recipes .kb-card-plan').count())>=39,'cards have plus-to-plan');
  assert.equal(await page.locator('#recipes .kb-favorite,#recipes .kb-card-add').count(),0,'no duplicate card controls');
  const before=await page.evaluate(()=>state.planned.reduce((sum,p)=>sum+p.count,0));
  await page.locator('#recipes .kb-card-plan').first().click();
  assert.equal(await page.evaluate(()=>state.planned.reduce((sum,p)=>sum+p.count,0)),before+1,'plus adds meal');
  assert.equal(await page.locator('#home').isVisible(),true,'plus keeps browsing');
  await page.locator('#recipes .kb-card-picture').first().click();
  const heart=page.locator('#cbRecipeFavorite');await heart.waitFor();
  const prior=await heart.getAttribute('aria-pressed');await heart.click();
  assert.notEqual(await heart.getAttribute('aria-pressed'),prior,'heart toggles favorite');
  await heart.click();
  assert.equal(await heart.getAttribute('aria-pressed'),prior,'heart can restore state');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#recipes .kb-compact-card');
  const s=await page.evaluate(()=>({
   food:state.foods.some(x=>x.id==='pre-upgrade-food'),
   stock:state.inventory.some(x=>x.id==='pre-upgrade-stock'),
   own:state.recipes.find(x=>x.id==='my-test-personal-recipe'),
   plan:state.planned.some(x=>x.recipeId==='my-test-personal-recipe'),
   live:!!localStorage.getItem('cookingBuddy_v1'),
   preview:localStorage.getItem('cookingBuddy_v1_2_preview'),
   test:localStorage.getItem('kitchenBuddy_layoutTest_2026')
  }));
  assert.ok(s.food&&s.stock&&s.own&&s.plan&&s.live,'previous user data survives upgrade and reload');
  assert.ok(s.own.favorite&&s.own.photo.startsWith('data:image/svg+xml'),'personal favorite/photo preserved');
  assert.equal(s.preview,null);assert.equal(s.test,null);
  assert.ok(await page.locator('#kbSearchField').isVisible(),'large search visible');
  const registration=await page.evaluate(async()=>navigator.serviceWorker?.ready.then(reg=>reg.active?.scriptURL));
  assert.ok(registration.endsWith('/Cooking-buddy/sw.js')||registration.endsWith('/sw.js'),'installed root service worker registers');
  assert.deepEqual(errors,[],'no runtime JS errors');
  console.log('PASS: live root, 39 recipes, + plan, favorite, original saved browser data, PWA, reload');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});