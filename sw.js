const C='saemackin101-shin-v4-fixed';
const A=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/saemackin-gold-hero.png','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png','./assets/persona-romantic.jpg?v=4','./assets/persona-flirtatious.jpg?v=4','./assets/persona-business.jpg?v=4','./assets/persona-listener.jpg?v=4','./assets/persona-frustrated.jpg?v=4','./assets/persona-logical-angry.jpg?v=4','./assets/persona-toxic.jpg?v=4','./assets/persona-motivator.jpg?v=4','./assets/persona-comedian.jpg?v=4','./assets/persona-advisor.jpg?v=4','./assets/persona-negotiator.jpg?v=4','./assets/persona-grounded.jpg?v=4'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener('fetch',e=>{
 if(e.request.url.includes('/api/')) return;
 e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(C).then(c=>c.put(e.request,copy));return r}).catch(()=>caches.match(e.request)));
});