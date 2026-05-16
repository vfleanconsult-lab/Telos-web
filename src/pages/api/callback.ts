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

  // Formato que Sveltia CMS espera: "authorization:github:success:{token,provider}"
  const message = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}`;

  // Estrategia multi-canal para iPadOS (Safari throttlea el admin tab mientras
  // el popup está abierto, así que el admin tab no puede procesar eventos):
  //
  // 1. localStorage → el setInterval intercept del admin tab lo lee en cuanto
  //    el popup cierra y el admin tab recupera el foco.
  // 2. postMessage directo al opener → funciona en escritorio y Chrome.
  // 3. BroadcastChannel → fallback si opener es nulo.
  // 4. Auto-cierre del popup → devuelve el foco al admin tab en iPadOS para que
  //    el JS vuelva a correr y el intercept pueda entregar el token.
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

  // 1. localStorage: canal único de entrega para iPadOS.
  //    NO usamos window.opener.postMessage porque en iPadOS Safari el admin tab
  //    está throttleado mientras el popup está abierto — Sveltia recibiría el token
  //    y llamaría fetch(github/user) mientras el tab sigue en background, y Safari
  //    congela ese fetch. En cambio, el admin tab entrega el token solo cuando
  //    su visibilitychange: hidden=false confirma que está activo.
  try { localStorage.setItem('sveltia-cms-auth-pending', msg); db.textContent = 'localStorage: OK'; } catch(_) {}

  // 2. BroadcastChannel: respaldo para escritorio cuando el admin tab ya está visible
  if (typeof BroadcastChannel !== 'undefined') {
    try { var bc = new BroadcastChannel('decap-cms-auth'); bc.postMessage(msg); bc.close(); db.textContent += ' | BC: OK'; } catch(_) {}
  }

  // 3. Cerrar popup: devuelve foco al admin tab → lo desthrottlea para que pueda
  //    entregar el token y hacer los fetch a GitHub API correctamente
  db.textContent += ' | cerrando…';
  setTimeout(function () { window.close(); }, 1000);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
