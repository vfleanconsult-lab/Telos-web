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

  // Formato que Sveltia/Decap CMS espera: JSON con { token, provider }.
  const message = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}`;

  // HTML que intenta postMessage al opener y, si el opener es nulo
  // (Safari iOS anula window.opener tras navegación cross-origin por GitHub),
  // usa BroadcastChannel como canal de respaldo.
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

  function cerrar() { setTimeout(function () { window.close(); }, 2000); }

  function usarBroadcast() {
    db.textContent = 'opener: NULO — usando BroadcastChannel';
    if (typeof BroadcastChannel !== 'undefined') {
      var bc = new BroadcastChannel('decap-cms-auth');
      bc.postMessage(msg);
      bc.close();
      st.textContent = 'Autorizado. Puedes cerrar esta ventana.';
    } else {
      st.textContent = 'Error: cierra esta ventana e intenta de nuevo.';
      db.textContent += ' (no disponible)';
    }
  }

  if (window.opener && !window.opener.closed) {
    db.textContent = 'opener: OK — postMessage enviado';
    window.opener.postMessage(msg, '*');
    st.textContent = 'Autorizado. Vuelve al tab <strong>Telos CMS</strong>.';
    // No cerramos — Sveltia llama popup.close() cuando procesa el token.
    // En iPadOS el admin tab está throttled en segundo plano; si cerramos antes
    // de que el tab vuelva al frente, popup.closed dispara AbortError en Sveltia.
    // Timeout de seguridad de 30 s por si Sveltia no responde.
    setTimeout(function () { window.close(); }, 30000);
  } else {
    usarBroadcast();
  }
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
