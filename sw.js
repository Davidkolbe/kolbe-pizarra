// Versión 20261114-0938. Páginas: primero la red (para coger cambios), si no hay conexión, la copia guardada.
const CACHE="pizarra-kolbe-20261114-0938";
const BASE=["./","./index.html","./ver/","./ver/index.html","./manifest.webmanifest","./icono-180.png","./icono-192.png","./icono-512.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(BASE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;
  if(r.mode==="navigate"||r.destination==="document"){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match("./index.html"))));
    return}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok&&new URL(r.url).origin===location.origin){const c=res.clone();caches.open(CACHE).then(k=>k.put(r,c))}return res})));
});
