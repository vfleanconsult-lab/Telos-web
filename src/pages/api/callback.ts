// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Intercambia el código por un token y lo pasa a Decap CMS vía postMessage.
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

  // Intercambiar código por token con GitHub
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

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizando…</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(function () {
  var msg = ${JSON.stringify(message)};
  var st  = document.getElementById('st');
  var db  = document.getElementById('db');

  // 1. localStorage — admin tab lo lee al volver al frente (visibilitychange)
  //    o vía storage event si el tab estaba activo.
  try { localStorage.setItem('sveltia-cms-auth-pending', msg); } catch(_) {}

  // 2. window.opener directo (funciona en escritorio donde admin tab no está en background)
  if (window.opener && !window.opener.closed) {
    try { window.opener.postMessage(msg, '*'); } catch(_) {}
  }

  // 3. BroadcastChannel — relay en index.html lo convierte en synthetic MessageEvent
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      var bc = new BroadcastChannel('decap-cms-auth');
      bc.postMessage(msg);
    } catch(_) {}
  }

  db.textContent = 'enviado: localStorage + opener + BC';
  st.textContent = 'Autorizado. Cerrando…';

  // Cerrar el popup para que iPadOS traiga el tab admin al frente.
  // index.html usa visibilitychange para leer el token de localStorage
  // antes de que el timer de Sveltia detecte popup.closed.
  setTimeout(function () { try { window.close(); } catch(_) {} }, 600);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
