import type { APIRoute } from 'astro'

export const POST: APIRoute = async ({ request, cookies }) => {
  const { password } = await request.json()

  if (password === import.meta.env.EVAL_ADMIN_KEY) {
    cookies.set('eval_admin', 'authenticated', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 8
    })
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ ok: false, error: 'Contraseña incorrecta' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' }
  })
}
