// Endpoint: GET /api/auth
// Redirige al flujo de autorización de GitHub OAuth.
// Decap CMS abre este endpoint en un popup cuando el usuario hace clic en "Login".
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ request }) => {
  const clientId    = 'Ov23liJhis0KyJECIdZA';
  const callbackUrl = 'https://telos.cl/api/callback';
  const scope       = 'repo,user';

  const githubUrl = new URL('https://github.com/login/oauth/authorize');
  githubUrl.searchParams.set('client_id',    clientId);
  githubUrl.searchParams.set('redirect_uri', callbackUrl);
  githubUrl.searchParams.set('scope',        scope);

  return Response.redirect(githubUrl.href, 302);
};
