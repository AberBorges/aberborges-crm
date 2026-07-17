// AberBorges CRM — Service Worker v5
const CACHE_NAME = "aberborges-v5";
const URLS = ["/", "/index.html"];

// Al instalar: cachear páginas principales
self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(c => c.addAll(URLS))
      .catch(() => {})
  );
  self.skipWaiting();
});

// Al activar: borrar caches viejos
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: network first, caché como fallback
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // No interceptar llamadas a Supabase — dejar que fallen normalmente
  if (e.request.url.includes("supabase.co")) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Guardar en caché si es exitoso
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() =>
        // Sin red: usar caché
        caches.match(e.request)
          .then(r => r || caches.match("/index.html"))
      )
  );
});
