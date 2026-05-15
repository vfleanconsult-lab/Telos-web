// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
//
// Protocolo A (desktop — opener disponible):
//   1. Popup → Parent: "authorizing:github" via postMessage
//   2. Parent → Popup: "authorizing:github" (echo de Sveltia)
//   3. Popup → Parent: payload del token via postMessage
//
// Protocolo B (iPadOS — opener null por redirect cross-origin a github.com):
//   1. Popup → index.html: "authorizing:github" via BroadcastChannel 'sveltia-auth'
//   2. index.html → Popup: "authorizing:github:ack" via BC
//   3. Popup → index.html: payload del token via BC 'sveltia-auth-token'
//   4. index.html → Sveltia: re-despacha como synthetic MessageEvent
//
// Ambos protocolos corren en paralelo; un flag `sent` evita el envío duplicado.
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
  let sent = false;

  function sendToken(targetOrigin) {
    if (sent) return;
    sent = true;
    if (window.opener && !window.opener.closed) {
      // Protocolo A: postMessage directo (desktop / cuando opener existe)
      window.opener.postMessage(payload, targetOrigin);
    } else {
      // Protocolo B: BroadcastChannel (iPadOS — opener null por redirect cross-origin)
      const tbc = new BroadcastChannel('sveltia-auth-token');
      tbc.postMessage(payload);
      tbc.close();
      // Auto-cierre de respaldo por si popup.close() del parent no funciona en iOS tab
      setTimeout(() => window.close(), 3000);
    }
  }

  // Protocolo A: escuchar el echo del parent via postMessage
  window.addEventListener('message', function(e) {
    if (e.data === 'authorizing:github') {
      sendToken(e.origin);
    }
  });

  // Protocolo B: escuchar el ack del relay en index.html via BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    const hbc = new BroadcastChannel('sveltia-auth');
    hbc.onmessage = function(e) {
      if (e.data === 'authorizing:github:ack') {
        hbc.close();
        sendToken(window.location.origin);
      }
    };
    hbc.postMessage('authorizing:github');
  }

  // Protocolo A: anunciar via postMessage directo (si opener existe)
  window.opener?.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
