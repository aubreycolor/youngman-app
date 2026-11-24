const CACHE="youngman-2026-11-24";
const CORE=["./","./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png","./apple-touch-icon.png","./data/packs.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
// 같은 출처 파일(앱·문제팩)은 네트워크 우선 → 새 문제팩이 올라오면 바로 반영, 오프라인이면 캐시 사용
self.addEventListener("fetch",e=>{
  const r=e.request;if(r.method!=="GET")return;const u=new URL(r.url);
  if(u.origin===location.origin){
    e.respondWith(fetch(r).then(res=>{if(res.ok){const c=res.clone();caches.open(CACHE).then(x=>x.put(r.mode==="navigate"?"./index.html":r,c))}return res})
      .catch(()=>caches.match(r.mode==="navigate"?"./index.html":r)));return}
  if(u.host.endsWith("fonts.googleapis.com")||u.host.endsWith("fonts.gstatic.com")){
    e.respondWith(caches.match(r).then(hit=>hit||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})))}
});
