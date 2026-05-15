// Endpoint: GET /api/callback
// GitHub redirige aquí con el código de autorización.
// Intercambia el código por un token y lo entrega a Sveltia CMS mediante el
// protocolo de handshake oficial: popup→"authorizing:github"→CMS responde→popup→token.
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

  // Sveltia espera provider antes que token en el payload JSON
  const message = `authorization:github:success:${JSON.stringify({ provider: 'github', token: tokenData.access_token })}`;

  const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="utf-8" /><title>Autorizando…</title></head>
<body>
<p id="st" style="font-family:sans-serif;color:#444;padding:2rem 2rem 0">Autorizando…</p>
<p id="db" style="font-family:monospace;font-size:0.75rem;color:#999;padding:0 2rem 2rem"></p>
<script>
(function () {
  var msg      = ${JSON.stringify(message)};
  var provider = 'github';
  var st       = document.getElementById('st');
  var db       = document.getElementById('db');
  var vias     = [];
  var cerrado  = false;

  function cerrar(delay) {
    setTimeout(function () {
      if (!cerrado) { cerrado = true; window.close(); }
    }, delay || 1500);
  }

  // Handshake postMessage (protocolo oficial de Sveltia CMS):
  // 1. popup → opener:  "authorizing:github"
  // 2. opener → popup:  "authorizing:github"  (ack del CMS)
  // 3. popup → opener:  token de autorización
  if (window.opener && !window.opener.closed) {
    var ackRecibido = false;

    window.addEventListener('message', function handler(e) {
      if (e.data !== 'authorizing:' + provider) return;
      window.removeEventListener('message', handler);
      ackRecibido = true;

      var origin = (e.origin && e.origin !== 'null') ? e.origin : '*';
      window.opener.postMessage(msg, origin);
      vias.push('postMessage-handshake');
      db.textContent = 'Mecanismos: ' + vias.join(', ');
      cerrar(1500);
    });

    window.opener.postMessage('authorizing:' + provider, '*');
    vias.push('handshake-iniciado');

    // Si el CMS no responde en 5 s, cerrar de todas formas
    setTimeout(function () {
      if (!ackRecibido) {
        vias.push('handshake-sin-respuesta');
        db.textContent = 'Mecanismos: ' + vias.join(', ');
        cerrar(500);
      }
    }, 5000);

  } else {
    vias.push('opener-nulo');

    // Fallback BroadcastChannel (handshake sobre mismo canal)
    if (typeof BroadcastChannel !== 'undefined') {
      var bc = new BroadcastChannel('sveltia-auth');
      var bcAck = false;

      bc.onmessage = function (e) {
        if (e.data !== 'authorizing:' + provider + ':ack') return;
        bcAck = true;
        bc.close();
        var bc2 = new BroadcastChannel('decap-cms-auth');
        bc2.postMessage(msg);
        bc2.close();
        vias.push('BC-handshake');
        db.textContent = 'Mecanismos: ' + vias.join(', ');
        cerrar(1500);
      };

      bc.postMessage('authorizing:' + provider);
      vias.push('BC-handshake-iniciado');

      setTimeout(function () {
        if (!bcAck) {
          // Fallback directo: enviar token sin handshake
          bc.close();
          var bc3 = new BroadcastChannel('decap-cms-auth');
          bc3.postMessage(msg);
          bc3.close();
          vias.push('BC-directo-fallback');
          db.textContent = 'Mecanismos: ' + vias.join(', ');
          cerrar(500);
        }
      }, 3000);
    }

    // Fallback localStorage
    try {
      localStorage.setItem('cms-auth-token', msg);
      vias.push('localStorage');
    } catch (e) { vias.push('localStorage-FALLO'); }
  }

  db.textContent = 'Mecanismos: ' + vias.join(', ');
  st.textContent = 'Autorizado. Esta ventana se cerrará automáticamente.';
})();
</script>
</body>
</html>`;

  return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
};
