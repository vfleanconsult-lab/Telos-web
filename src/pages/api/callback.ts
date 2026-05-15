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

  // El popup NO se cierra solo. Sveltia cerrará el popup cuando procese el token.
  // Mientras el popup esté abierto, popup.closed === false en el admin tab, así
  // el timer de Sveltia no puede lanzar AbortError.
  // El token se entrega vía localStorage + opener + BroadcastChannel.
  // El admin (index.html) intercepta el setInterval de Sveltia para despachar
  // el token en el primer tick del timer, antes del chequeo de popup.closed.
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

  // localStorage: admin tab lo lee en el primer tick del setInterval interceptado
  try { localStorage.setItem('sveltia-cms-auth-pending', msg); } catch(_) {}

  // opener directo (funciona en escritorio donde admin no está en background)
  if (window.opener && !window.opener.closed) {
    try { window.opener.postMessage(msg, '*'); } catch(_) {}
  }

  // BroadcastChannel como canal adicional
  if (typeof BroadcastChannel !== 'undefined') {
    try { var bc = new BroadcastChannel('decap-cms-auth'); bc.postMessage(msg); } catch(_) {}
  }

  db.textContent = 'token enviado — esperando que Sveltia cierre esta ventana';
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
