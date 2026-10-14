/* Kitchen Buddy: browser/Android Back navigates app history instead of closing the PWA.
   Isolated preview only. All state uses history.state, not server-side routes. */
(function(){
'use strict';
const valid=new Set(['home','cook','plan','shopping','kitchen','fridge','settings']);
const marker='__kitchenBuddyNavigationV1';
const mainTabs=[...valid];
const previous=showTab;
let restoring=false;
let currentTab=mainTabs.find(id=>!document.getElementById(id)?.classList.contains('hide'))||'home';
let seq=1;
function recipeId(){
 const title=document.getElementById('recipeTitle')?.textContent?.trim();
 if(!title||!Array.isArray(state.recipes))return null;
 return state.recipes.find(r=>r.name===title)?.id||null;
}
function makeRoute(tab,extra={}){
 return {[marker]:true,tab,recipeId:tab==='cook'?recipeId():null,seq:++seq,...extra};
}
try{history.scrollRestoration='manual'}catch(_){}
try{
 // The base entry is a "home" safety net. The visible entry is a second home
 // state, so one more Back on home does not exit the installed app.
 history.replaceState({[marker]:true,tab:'home',seq:0,base:true},'');
 history.pushState({[marker]:true,tab:'home',seq:1},'');
}catch(_){}
showTab=function(tab,...args){
 const destination=valid.has(tab)?tab:'home';
 const before=currentTab;
 const result=previous.call(this,destination,...args);
 currentTab=destination;
 if(!restoring&&before!==destination){
   try{history.pushState(makeRoute(destination),'')}catch(_){}
 }
 return result;
};
function returnTo(route){
 restoring=true;
 try{
  if(route.tab==='cook' && route.recipeId){
    const current=recipeId();
    if(current!==route.recipeId){
      const i=state.recipes.findIndex(r=>r.id===route.recipeId);
      if(i>=0)openCookingRecipe(i);
      else showTab('home');
    }else showTab('cook');
  }else showTab(valid.has(route.tab)?route.tab:'home');
  if(document.getElementById('cbFridgeAddPanel') && route.tab==='fridge'&&!route.addingFridge){
    window.closeFridgeAdd?.();
  }
  window.scrollTo({top:0,behavior:'instant'});
 }finally{restoring=false}
}
addEventListener('popstate',event=>{
 const target=event.state;
 if(target?.[marker]){
  // Back reached the initial safety net; return to visible home instead of closing.
  if(target.base){
    returnTo({tab:'home'});
    try{history.go(1)}catch(_){}
    return;
  }
  returnTo(target);
 }else{
  // Some Android/WebView histories supply an empty state during app restores.
  returnTo({tab:'home'});
  try{history.pushState(makeRoute('home'),'')}catch(_){}
 }
});
window.kbBack=function(){
 if(document.querySelector('dialog.kb-dish-lightbox[open]')){
   document.querySelector('dialog.kb-dish-lightbox[open]').close();return;
 }
 if(document.getElementById('cbFridgeAddPanel') && !document.getElementById('cbFridgeAddPanel').classList.contains('hide')){
   window.closeFridgeAdd?.();return;
 }
 if(currentTab==='home'){
   window.scrollTo({top:0,behavior:'smooth'});
   return;
 }
 history.back();
};
window.kbCurrentScreen=()=>currentTab;
})();