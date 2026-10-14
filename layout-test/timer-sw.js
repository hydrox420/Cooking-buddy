self.addEventListener('install',event=>{self.skipWaiting()});
self.addEventListener('activate',event=>{event.waitUntil(self.clients.claim())});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil((async()=>{
    const tabs=await self.clients.matchAll({type:'window',includeUncontrolled:true});
    const here=new URL('./',self.registration.scope).href;
    for(const tab of tabs){
      if(tab.url.startsWith(here) && 'focus' in tab){await tab.focus();return}
    }
    if(self.clients.openWindow)await self.clients.openWindow(here);
  })());
});