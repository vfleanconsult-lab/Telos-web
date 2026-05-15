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

  // Formato que Decap CMS espera: JSON con { token, provider }.
  // Regex /authorization:(.+?):(.+?):(.+)/ → match[3] = payload JSON.
  const message = `authorization:github:success:${JSON.stringify({ token: tokenData.access_token, provider: 'github' })}`;

  // Intenta los tres mecanismos disponibles y muestra cuáles se usaron.
  // El texto diagnóstico en pantalla ayuda a depurar problemas en Safari/iPadOS.
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizando…</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(function () {
  var msg  = ${JSON.stringify(message)};
  var st   = document.getElementById('st');
  var db   = document.getElementById('db');
  var vias = [];

  // 1. localStorage — genera storage event en la pestaña del admin
  try {
    localStorage.setItem('cms-auth-token', msg);
    vias.push('localStorage');
  } catch (e) { vias.push('localStorage-FALLO:' + e); }

  // 2. BroadcastChannel
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      var bc = new BroadcastChannel('decap-cms-auth');
      bc.postMessage(msg);
      bc.close();
      vias.push('BroadcastChannel');
    } catch (e) { vias.push('BC-FALLO:' + e); }
  } else {
    vias.push('BC-no-disponible');
  }

  // 3. postMessage directo al opener
  if (window.opener && !window.opener.closed) {
    try {
      window.opener.postMessage(msg, '*');
      vias.push('postMessage');
    } catch (e) { vias.push('postMessage-FALLO:' + e); }
  } else {
    vias.push('opener-nulo');
  }

  db.textContent = 'Mecanismos: ' + vias.join(', ');
  st.textContent = 'Autorizado. Esta ventana se cerrará en unos segundos.';
  setTimeout(function () { window.close(); }, 5000);
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
