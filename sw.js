const CACHE='cursed-voca-v1-pwa-819';
const ASSETS=["./", "./index.html", "./styles.css", "./app.js", "./words.js", "./manifest.webmanifest", "./assets/icon-192.png", "./assets/icon-512.png", "./assets/art-4.jpg", "./assets/art-2.jpg", "./assets/art-3.jpg", "./assets/art-1.jpg"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(resp=>{if(resp.ok){const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return resp})))})
