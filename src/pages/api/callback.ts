// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Implementa el handshake de 2 mensajes que espera Sveltia CMS:
//   1. Popup → Parent: "authorizing:github"  (anuncio, target '*')
//   2. Parent → Popup: "authorizing:github"  (echo del parent al popup)
//   3. Popup → Parent: "authorization:github:success:{...}" (al origin del echo)
// El popup NO se cierra — Sveltia lo cierra desde el parent al resolver.
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

  // Payload en el formato exacto que espera Sveltia CMS
  const payload = JSON.stringify(
    'authorization:github:success:' + JSON.stringify({ provider: 'github', token: tokenData.access_token })
  );

  const html = `<!doctype html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p style="font-family:sans-serif;color:#444;padding:2rem">Autorizado. Sveltia cerrará esta ventana automáticamente.</p>
<script>
(() => {
  const payload = ${payload};

  // Paso 3: cuando el parent hace echo de "authorizing:github", enviar el token al mismo origin
  window.addEventListener('message', ({ data, origin }) => {
    if (data === 'authorizing:github') {
      window.opener?.postMessage(payload, origin);
    }
  });

  // Paso 1: anunciar al parent que el popup está listo
  window.opener?.postMessage('authorizing:github', '*');
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
