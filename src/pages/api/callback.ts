// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Entrega el token a Sveltia CMS usando 3 mecanismos en paralelo:
//   1. localStorage  — storage event al admin tab (mismo origen)
//   2. BroadcastChannel — canal 'decap-cms-auth'
//   3. window.opener.postMessage — directo al opener
// NO usa el handshake "authorizing:" para no bloquear a Sveltia en modo-espera.
// El popup se cierra a los 15 s para que Sveltia tenga tiempo de autenticar.
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

  const message = `authorization:github:success:${JSON.stringify({ provider: 'github', token: tokenData.access_token })}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizado. Esta ventana se cerrará en unos segundos.</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(() => {
  const msg  = ${JSON.stringify(message)};
  const db   = document.getElementById('db');
  const vias = [];

  // 1. localStorage
  try {
    localStorage.setItem('cms-auth-token', msg);
    vias.push('localStorage');
  } catch (e) { vias.push('localStorage-FALLO'); }

  // 2. BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('decap-cms-auth');
      bc.postMessage(msg);
      bc.close();
      vias.push('BroadcastChannel');
    } catch (e) { vias.push('BC-FALLO'); }
  }

  // 3. postMessage directo al opener (sin handshake para no bloquear estado de Sveltia)
  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(msg, '*');
      vias.push('postMessage');
    } catch (e) { vias.push('postMessage-FALLO'); }
  } else {
    vias.push('opener-nulo');
  }

  db.textContent = 'Vias: ' + vias.join(', ');

  // Cerrar a los 15 s para dar tiempo a Sveltia de completar la auth antes de que
  // popup.closed dispare la cancelación interna del CMS.
  setTimeout(() => window.close(), 15000);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
