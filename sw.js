/* CURSED VOCA: network-first app updates, offline fallback. */
const CACHE = 'cursed-voca-v5-app-update-20261019';
const CORE = ['./index.html','./styles.css','./app.js','./words.js','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await Promise.all(CORE.map(async path => {
      try { const response = await fetch(new Request(path, {cache:'reload'})); if(response.ok) await cache.put(path,response); } catch (_) {}
    }));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('cursed-voca-') && key !== CACHE).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request;
  if(request.method!=='GET') return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin) return;
  event.respondWith((async()=>{
    const cache=await caches.open(CACHE);
    try {
      const response=await fetch(request);
      if(response.ok && response.type==='basic') event.waitUntil(cache.put(request,response.clone()));
      return response;
    } catch (_) {
      const cached=await caches.match(request);
      if(cached) return cached;
      if(request.mode==='navigate') {
        const fallback=await cache.match('./index.html');
        if(fallback) return fallback;
      }
      return Response.error();
    }
  })());
});
