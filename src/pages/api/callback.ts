// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Intercambia el código por un token y lo pasa a Sveltia CMS.
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url  = new URL(request.url);
  const code = url.searchParams.get('code');

  if (!code) {
    return new Response('Falta el parámetro code', { status: 400 });
  }

  const clientId     = 'Ov23liJhis0KyJECIdZA';
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientSecret) {
    return new Response('GITHUB_CLIENT_SECRET no configurado en Vercel', { status: 500 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method:  'POST',
    headers: {
      'Accept':       'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  const tokenData = await tokenRes.json() as { access_token?: string; error?: string; error_description?: string };

  if (tokenData.error || !tokenData.access_token) {
    return new Response(`Error GitHub: ${tokenData.error_description ?? tokenData.error}`, { status: 400 });
  }

  const message = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}`;

  // El popup guarda el token en localStorage (para que el admin tab lo lea cuando
  // vuelva al frente) y también intenta postMessage directo al opener.
  // El admin tab (index.html) intercept el setInterval de Sveltia y entrega el
  // token a Sveltia via window.postMessage(token, origin) cuando el timer dispara,
  // evitando que Sveltia detecte popup.closed antes de recibir el token.
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizado.</p>
<p style="font-family:sans-serif;color:#666;padding:0 2rem">Vuelve al tab <strong>Telos CMS</strong> para abrir el panel.</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(function () {
  var msg = ${JSON.stringify(message)};
  var db  = document.getElementById('db');

  // 1. localStorage: el admin tab lo lee en el setInterval intercept
  try { localStorage.setItem('sveltia-cms-auth-pending', msg); } catch(_) {}

  // 2. postMessage directo al opener (funciona en escritorio y cuando el admin
  //    tab no está throttled)
  if (window.opener && !window.opener.closed) {
    try { window.opener.postMessage(msg, '*'); } catch(_) {}
  }

  // 3. BroadcastChannel como canal adicional
  if (typeof BroadcastChannel !== 'undefined') {
    try { var bc = new BroadcastChannel('decap-cms-auth'); bc.postMessage(msg); } catch(_) {}
  }

  // Auto-cierre: en iOS/iPadOS cerrar el popup hace que Safari lleve el foco
  // de vuelta al admin tab, lo que desthrottlea el JS y permite que el
  // setInterval interceptado lea el token de localStorage y lo entregue a Sveltia.
  db.textContent = 'cerrando…';
  setTimeout(function () { window.close(); }, 2000);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
