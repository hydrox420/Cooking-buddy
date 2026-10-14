const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
 const page=await browser.newPage({viewport:{width:393,height:852},deviceScaleFactor:1,isMobile:true,hasTouch:true});
 const errs=[];page.on('pageerror',e=>errs.push(e.message));
 try{
  await page.goto('http://127.0.0.1:8765/layout-test/',{waitUntil:'networkidle'});
  await page.waitForSelector('.kb-compact-card',{timeout:15000});
  assert.ok((await page.locator('.kb-compact-card').count())>=17,'show all recipe rows');
  const headline=page.locator('.kb-home-tools h2');
  assert.equal(await headline.textContent(),'What sounds good?','browsing headline is timeless');
  const midpoint=await headline.boundingBox();
  assert.ok(Math.abs(midpoint.x+midpoint.width/2-393/2)<14,'discover question is centered');
  assert.ok(await page.locator('.kb-brand-emblem svg').count(),'styled cooking brand emblem');
  const cabin=await page.evaluate(()=>{
    const card=document.querySelector('#recipes .kb-compact-card');
    const header=document.querySelector('header.cb-app-brand');
    const active=document.querySelector('nav.tabs [data-tab="home"]');
    return {
      themeLoaded:!![...document.styleSheets].some(s=>s.href?.includes('forest-cabin.css')),
      tagline:header?.querySelector('.kb-forest-tagline')?.textContent.trim(),
      bodyTrees:getComputedStyle(document.body).backgroundImage,
      border:getComputedStyle(header).borderTopWidth,
      headerBackground:getComputedStyle(header).backgroundImage,
      trees:getComputedStyle(header).backgroundImage,
      card:getComputedStyle(card).backgroundColor,
      activeTab:getComputedStyle(active).backgroundImage
    };
  });
  assert.ok(cabin.themeLoaded,'Forest Cabin theme stylesheet loaded');
  assert.equal(cabin.tagline,undefined,'woodland motto removed');
  assert.ok(cabin.bodyTrees.includes('forest-pines.svg'),'trees blend into the page background');
  assert.equal(cabin.border,'0px','header has no border');
  assert.equal(cabin.headerBackground,'none','header has no framed background');
  assert.equal(cabin.card,'rgb(244, 234, 216)','cookbook cards use contrasting parchment');
  assert.ok(cabin.activeTab.includes('linear-gradient'),'selected nav tab uses a contrasting sage gradient');
  const headerBox=await page.locator('header.cb-app-brand').boundingBox();
  assert.ok(headerBox.height>=140&&headerBox.height<=164,'forest header compact with less empty space');
  const titleFont=await page.locator('header.cb-app-brand h1').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));
  assert.ok(titleFont>=38,'Kitchen Buddy title slightly enlarged on mobile');
  const questionBox=await headline.boundingBox();
  assert.ok(questionBox.y<190,'What sounds good? moved higher on screen');
  assert.equal(await page.locator('#kbQuickFilters').count(),0,'top category chips removed');
  assert.equal(await page.locator('.kb-library-subhead').count(),0,'Recipes and recipe count subheading removed');
  assert.ok(await page.locator('#recipes .kb-recipe-section').count()>0,'browse categories remain below');
  const singleLine=await headline.evaluate(h=>({height:h.getBoundingClientRect().height,lineHeight:parseFloat(getComputedStyle(h).lineHeight),wrap:getComputedStyle(h).whiteSpace}));
  assert.ok(singleLine.height<=singleLine.lineHeight*1.1&&singleLine.wrap==='nowrap','What sounds good? fits one line');
  const firstHeart=page.locator('#recipes .kb-compact-card').first().locator('.kb-favorite');
  assert.equal(await firstHeart.count(),1,'favorite sits independently over food photo');
  assert.equal(await firstHeart.evaluate(x=>getComputedStyle(x).position),'absolute','favorite is overlaid on food photo');

  assert.equal(await page.locator('#kbSearchToggle').count(),0,'mini search button removed');
  const searchSize=await page.locator('#kbSearchField').boundingBox();
  assert.ok(searchSize.width>=320,'big recipe search spans the content width');
  const firstRail=page.locator('#recipes .kb-recipe-section').first();
  assert.equal((await firstRail.locator('.kb-row-heading h3').textContent()).trim(),'Breakfast','first section is a recipe category');
  assert.equal(await page.locator('.kb-discover-section').count(),0,'Explore rail removed');
  assert.ok(await firstRail.locator('.kb-compact-card').count()>=4,'breakfast recipe choices visible');
  const defaultPhotos=await page.locator('.kb-compact-card img').evaluateAll(images=>images.map(i=>i.getAttribute('src')));
  assert.ok(defaultPhotos.length>=39,'complete library shows picture cards');
  assert.ok(defaultPhotos.every(src=>src.startsWith('./assets/verified/')||src.startsWith('./assets/recipes/')),'default pictures are bundled');
  assert.ok(defaultPhotos.some(src=>src.startsWith('./assets/recipes/')),'older pictures restored');
  const licensedCount=defaultPhotos.filter(src=>src.startsWith('./assets/verified/')).length;
  assert.ok(licensedCount>=10,'ten exact-source licensed food photos are in cookbook browse');
  const oldShelf=page.locator('#recipes .kb-unpictured-shelf');
  assert.equal(await oldShelf.count(),0,'older default recipes no longer hidden');
  const discovered=firstRail.locator('.kb-card-picture img');
  const discoverPics=[];
  for(let i=0;i<4;i++){
    const img=discovered.nth(i);
    await img.scrollIntoViewIfNeeded();
    await img.evaluate(async image=>{image.loading='eager';if(!image.complete)await new Promise(resolve=>{image.addEventListener('load',resolve,{once:true});image.addEventListener('error',resolve,{once:true})})});
    discoverPics.push(await img.evaluate(image=>({src:image.currentSrc||image.src,loaded:image.complete&&image.naturalWidth>0,alt:image.alt})));
  }
  assert.ok(discoverPics.every(x=>(x.src.includes('/assets/verified/')||x.src.includes('/assets/recipes/'))&&x.loaded),'bundled image thumbnails load');
  const h1=await page.locator('header.cb-app-brand h1').boundingBox();
  assert.ok(h1&&Math.abs(h1.x+h1.width/2-393/2)<25,'center app title');
  assert.equal(await page.locator('#kbSearchField').isVisible(),true,'big search bar always visible');
  await page.locator('#recipeSearch').fill('shrimp');
  assert.ok((await page.locator('.kb-compact-card .kb-card-title').allTextContents()).some(x=>/shrimp/i.test(x)),'search finds original shrimp recipe as a picture card');
  await page.locator('#recipeSearch').press('Escape');
  assert.equal(await page.locator('#kbSearchField').isVisible(),true,'Escape leaves search visible');
  assert.equal(await page.locator('#recipeSearch').inputValue(),'','Escape clears the query');
  const chip=page.locator('.kb-diet-tag').first();
  assert.ok(await chip.count(),'badge available');
  await chip.click();
  await page.waitForSelector('.kb-diet-popover');
  const explanation=await page.locator('.kb-diet-popover').innerText();
  assert.ok(explanation.length>20,'badge explanation present');
  await page.locator('.kb-diet-popover button').click();
  assert.equal(await page.locator('.kb-diet-popover').count(),0,'tooltip closes');
  await page.locator('.kb-card-picture').first().click();
  await page.waitForSelector('#cook:not(.hide) #kbDishPhoto img');
  const hero=page.locator('#kbDishPhoto img');
  assert.ok((await hero.getAttribute('src')).length>10,'hero photo src exists');
  assert.ok(/\/assets\/(verified|recipes)\//.test(await hero.getAttribute('src')),'picture stays visible in cook view');
  assert.equal(await page.locator('#kbRealRecipeRef').count(),0,'licensed original source photo needs no placeholder link');
  assert.equal(await page.locator('#kbDishPeek').count(),0,'no floating view dish button');
  await page.locator('#kbDishPhoto').click();
  await page.waitForSelector('dialog.kb-dish-lightbox[open] img');
  await page.locator('.kb-lightbox-close').click();
  assert.equal(await page.locator('dialog.kb-dish-lightbox[open]').count(),0,'licensed original photo enlarges and closes');
  await page.evaluate(()=>{
    const testRecipe=state.recipes.find(r=>r.name===document.getElementById('recipeTitle').textContent);
    testRecipe.photo='data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%228%22%20height=%228%22%3E%3Crect%20width=%228%22%20height=%228%22%20fill=%22blue%22/%3E%3C/svg%3E';
    showTab('cook');
  });
  await page.locator('#kbDishPhoto').click();
  await page.waitForSelector('dialog.kb-dish-lightbox[open] img');
  await page.locator('.kb-lightbox-close').click();
  assert.equal(await page.locator('dialog.kb-dish-lightbox[open]').count(),0,'user-supplied photo can be enlarged and closed');
  await page.locator('#cbCookTabs button').last().click();
  assert.ok(await page.locator('#cbCookContent .cb-step').count()>0,'cook steps remain intact');
  assert.equal((await page.locator('#cook').innerText()).includes('COOKING BUDDY'),false,'old app name removed');
  assert.ok((await page.locator('#cook').innerText()).includes('KITCHEN BUDDY'),'correct cooking screen brand');
  const done=page.locator('#cbCookContent .cb-step').first();
  await done.locator('input[type="checkbox"]').check();
  assert.ok((await done.getAttribute('class')).includes('done'),'checked step marked completed');
  const visual=await done.evaluate(card=>{
    const title=card.querySelector('h3'),copy=card.querySelector('p');
    return {background:getComputedStyle(card).backgroundImage,titleStrike:getComputedStyle(title).textDecorationLine,copyStrike:getComputedStyle(copy).textDecorationLine,visibility:getComputedStyle(copy).visibility,color:getComputedStyle(copy).color,opacity:getComputedStyle(copy).opacity};
  });
  assert.ok(visual.titleStrike.includes('line-through')&&visual.copyStrike.includes('line-through'),'completed steps use readable strikethrough');
  assert.equal(visual.visibility,'visible','done text remains visible');
  await done.locator('input[type="checkbox"]').uncheck();
  assert.equal(await done.evaluate(c=>getComputedStyle(c.querySelector('h3')).textDecorationLine),'none','completion can be undone');
  await page.locator('nav.tabs [data-tab="plan"]').click();
  assert.equal(await page.locator('#plan').isVisible(),true,'plan navigation works');
  await page.locator('nav.tabs [data-tab="home"]').click();
  assert.equal(await page.locator('#home').isVisible(),true,'recipe navigation works');
  assert.deepEqual(errs,[],'no JavaScript page errors');
  console.log('PASS: 393px mobile layout, search, diet popovers, recipe photos, cook steps and tab navigation');
 }finally{await browser.close()}
})().catch(e=>{console.error(e);process.exitCode=1});
