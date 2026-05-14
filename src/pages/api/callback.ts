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

  // Formato que espera Decap CMS — postMessage al opener con el token
  const message = `authorization:github:success:${JSON.stringify({
    token:    tokenData.access_token,
    provider: 'github',
  })}`;

  // HTML mínimo que envía el token al opener y cierra el popup.
  // Se envía directamente sin esperar confirmación (evita problema de opener nulo
  // después de los redirects cross-origin por GitHub).
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p style="font-family:sans-serif;color:#666;padding:2rem">Autorizando… esta ventana se cerrará automáticamente.</p>
<script>
(function () {
  var msg = ${JSON.stringify(message)};
  if (window.opener && !window.opener.closed) {
    window.opener.postMessage(msg, '*');
    setTimeout(function () { window.close(); }, 300);
  } else {
    document.querySelector('p').textContent =
      'Error: no se pudo comunicar con la ventana del CMS. Cierra esta ventana e inténtalo de nuevo.';
  }
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
