const { chromium }=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 try {
  await page.goto('http://127.0.0.1:8765/preview-1-2/',{waitUntil:'networkidle'});
  await page.waitForSelector('#recipes .kb-compact-card',{timeout:15000});
  const intro=page.locator('#timerSetupPanel');if(await intro.isVisible())await intro.getByRole('button',{name:'Not now'}).click();
  assert.match(await page.title(),/Forest Cabin/,'official Kitchen Buddy uses approved theme');
  assert.ok(await page.locator('#recipes .kb-compact-card').count()>=39,'all pictured recipe cards preserved');
  assert.ok(await page.locator('#recipes .kb-card-plan').count()>=39,'every pictured recipe offers a plus action');
  assert.equal(await page.locator('#recipes .kb-favorite,#recipes .kb-card-add').count(),0,'no duplicate card controls');
  const first=page.locator('#recipes .kb-compact-card').first();
  const title=(await first.locator('.kb-card-title').textContent()).trim();
  const before=await page.evaluate(()=>state.planned.reduce((n,p)=>n+p.count,0));
  await first.locator('.kb-card-plan').click();
  assert.equal(await page.locator('#home').isVisible(),true,'plus plans without leaving library');
  const after=await page.evaluate(()=>state.planned.reduce((n,p)=>n+p.count,0));
  assert.equal(after,before+1,'plus planned one meal');
  await first.locator('.kb-card-picture').click();
  await page.waitForSelector('#cook:not(.hide) #cbRecipeFavorite');
  const favorite=page.locator('#cbRecipeFavorite');
  const original=await favorite.getAttribute('aria-pressed');await favorite.click();
  assert.notEqual(await favorite.getAttribute('aria-pressed'),original,'detail-page heart toggles favorite');
  await page.evaluate(()=>{
   state.foods.push({id:'release-smoke-fridge',name:'Release test leftovers',date:today(),days:3,notes:'preserve'});
   localStorage.setItem('cookingBuddyTimerSound','bell');
   localStorage.setItem('cookingBuddy_v2_preferences',JSON.stringify({defaultServings:2,autoFloat:false,dislikes:'',allergies:''}));
   save();
  });
  const saved=await page.evaluate(()=>localStorage.getItem('cookingBuddy_v1_2_preview'));
  assert.ok(saved&&saved.includes('Release test leftovers'),'original live storage key contains saved data');
  assert.equal(await page.evaluate(()=>localStorage.getItem('kitchenBuddy_layoutTest_2026')),null,'live does not write the separate test data key');
  await page.reload({waitUntil:'networkidle'});
  await page.waitForSelector('#recipes .kb-compact-card');
  const persisted=await page.evaluate(()=>({
    key:localStorage.getItem('cookingBuddy_v1_2_preview'),
    foods:state.foods.some(f=>f.id==='release-smoke-fridge'),
    plan:state.planned.reduce((n,p)=>n+p.count,0),
    favorite:state.recipes.some(r=>r.favorite),
    sound:localStorage.getItem('cookingBuddyTimerSound'),
    prefs:localStorage.getItem('cookingBuddy_v2_preferences')
  }));
  assert.ok(persisted.foods&&persisted.plan>=1,'fridge and plans survive reload');
  assert.equal(persisted.sound,'bell','existing timer sound preference preserved');
  assert.equal(JSON.parse(persisted.prefs).defaultServings,2,'existing live preferences preserved');
  assert.ok(persisted.key,'saved state still stored at the original live key');
  assert.deepEqual(errors,[],'no JavaScript errors');
  console.log('PASS: official preview UI, all 39 photos, plus-to-plan, favorite heart, live storage continuity and reload');
 }finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});