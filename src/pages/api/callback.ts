// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
//
// Protocolo A (desktop — opener disponible):
//   Handshake estándar de Sveltia: popup anuncia "authorizing:github",
//   parent hace echo, popup envía el token al origin del echo.
//
// Protocolo B (iPadOS — opener null por redirect cross-origin a github.com):
//   localStorage.setItem → dispara storage event en el tab admin →
//   index.html re-despacha el token como synthetic MessageEvent a Sveltia.
//   (localStorage es el mecanismo cross-tab más confiable en Safari/iPadOS,
//    funciona incluso cuando el popup abre en ventana separada.)
//
// El popup se cierra a los 5 s como respaldo (Sveltia lo cierra antes si puede).
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

  const payload = JSON.stringify(
    'authorization:github:success:' + JSON.stringify({ provider: 'github', token: tokenData.access_token })
  );

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p style="font-family:sans-serif;color:#444;padding:2rem">Autorizado. Esta ventana se cerrará automáticamente.</p>
<script>
(() => {
  const payload = ${payload};

  // Protocolo B: localStorage → storage event en el tab admin (iPadOS sin opener)
  try { localStorage.setItem('sveltia-auth-token', payload); } catch (_) {}

  // Protocolo A: handshake postMessage directo (desktop / cuando opener existe)
  window.addEventListener('message', function(e) {
    if (e.data === 'authorizing:github') {
      window.opener?.postMessage(payload, e.origin);
    }
  });
  window.opener?.postMessage('authorizing:github', '*');

  // Cierre de respaldo a los 5 s (Sveltia cierra el popup antes si Protocol A funciona)
  setTimeout(() => window.close(), 5000);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
