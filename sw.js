// เก็บไลบรารีและโมเดลจำหน้า (~8 MB) ไว้ในเครื่อง เพื่อให้เปิดแอปครั้งต่อไปเร็ว
const CACHE = 'faceclock-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(
  caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())
));
self.addEventListener('fetch', e => {
  const url = e.request.url;
  if (e.request.method !== 'GET' || !url.startsWith('https://cdn.jsdelivr.net/npm/@vladmandic/face-api@')) return;
  // ไฟล์ CDN ระบุเวอร์ชันตายตัว → ใช้จากแคชก่อน ไม่มีค่อยโหลด
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    if (hit) return hit;
    const res = await fetch(e.request);
    if (res.ok) c.put(e.request, res.clone());
    return res;
  }));
});
