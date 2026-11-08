const CACHE='shift-v2';
const ASSETS=['/','/index.html','/manifest.json','/icon.svg'];

self.addEventListener('install',e=>{
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));
});

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(
    caches.open(CACHE).then(cache=>
      cache.match(e.request).then(cached=>{
        const fetched=fetch(e.request).then(r=>{
          if(r.ok)cache.put(e.request,r.clone());
          return r;
        }).catch(()=>cached);
        return cached||fetched;
      })
    )
  );
});