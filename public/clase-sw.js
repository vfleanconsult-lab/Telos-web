/* Service worker de /clase — permite proyectar la presentación sin internet.
   Alcance limitado a /clase: no toca el resto del sitio.
   Estrategia: responde desde caché al instante y revalida en segundo plano,
   de modo que arranca rápido, funciona offline y se actualiza sola. */

// Subir esta versión en cada cambio de la presentación: fuerza al SW a
// reinstalarse y recachear la página, en vez de servir la copia vieja.
var CACHE = 'clase-v3';
var PAGINA = '/clase';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.add(new Request(PAGINA, { cache: 'reload' })); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (ks) {
        return Promise.all(ks.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  e.respondWith(
    caches.open(CACHE).then(function (c) {
      return c.match(req, { ignoreSearch: true }).then(function (hit) {
        var red = fetch(req).then(function (res) {
          if (res && res.ok) c.put(req, res.clone());
          return res;
        }).catch(function () {
          // Sin red: si no había copia, servimos la página cacheada.
          return hit || c.match(PAGINA, { ignoreSearch: true });
        });
        return hit || red;
      });
    })
  );
});
