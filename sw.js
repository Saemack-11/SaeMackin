const C='saemackin101-shin-v4-universal-zodiac';
const A=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./assets/saemackin-gold-hero.png','./assets/sae-reference.jpg','./assets/icon-180.png','./assets/icon-192.png','./assets/icon-512.png','./assets/persona-romantic.jpg','./assets/persona-flirtatious.jpg','./assets/persona-business.jpg','./assets/persona-listener.jpg','./assets/persona-frustrated.jpg','./assets/persona-logical-angry.jpg','./assets/persona-toxic.jpg','./assets/persona-motivator.jpg','./assets/persona-comedian.jpg','./assets/persona-advisor.jpg','./assets/persona-negotiator.jpg','./assets/persona-grounded.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(A)));self.skipWaiting()});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x))))));
self.addEventListener('fetch',e=>{
  if(e.request.url.includes('/api/'))return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
