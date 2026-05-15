// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Implementa el protocolo de sveltia-cms-auth:
//   1. popup → CMS:  "authorizing:github"
//   2. CMS  → popup: "authorizing:github"  (ack)
//   3. popup → CMS:  token de autorización
// En paralelo escribe en localStorage como fallback para COOP/Safari.
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

  // Protocolo idéntico al de sveltia-cms-auth oficial:
  //   - Escucha "authorizing:github" del opener (CMS) y responde con el token
  //   - Anuncia "authorizing:github" al opener para iniciar el handshake
  // Fallbacks para COOP/Safari donde window.opener.postMessage no funciona:
  //   - localStorage (storage event llega al admin tab por el mismo origen)
  //   - BroadcastChannel
  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizado. Puedes cerrar esta ventana.</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(() => {
  const msg      = ${JSON.stringify(message)};
  const provider = 'github';
  const db       = document.getElementById('db');
  const vias     = [];

  // 1. localStorage — funciona aunque COOP rompa window.opener
  try {
    localStorage.setItem('cms-auth-token', msg);
    vias.push('localStorage');
  } catch (e) { vias.push('localStorage-FALLO'); }

  // 2. BroadcastChannel directo
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      const bc = new BroadcastChannel('decap-cms-auth');
      bc.postMessage(msg);
      bc.close();
      vias.push('BroadcastChannel');
    } catch (e) { vias.push('BC-FALLO'); }
  }

  // 3. Protocolo sveltia-cms-auth: handshake via postMessage
  if (window.opener && !window.opener.closed) {
    window.addEventListener('message', ({ data, origin }) => {
      if (data !== 'authorizing:' + provider) return;
      const target = (origin && origin !== 'null') ? origin : '*';
      window.opener.postMessage(msg, target);
      vias.push('postMessage-handshake');
      db.textContent = 'Vias: ' + vias.join(', ');
    });
    window.opener.postMessage('authorizing:' + provider, '*');
    vias.push('handshake-iniciado');
  } else {
    vias.push('opener-nulo');
  }

  db.textContent = 'Vias: ' + vias.join(', ');
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
