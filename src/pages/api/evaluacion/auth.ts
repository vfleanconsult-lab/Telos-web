import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { verifyPassword } from '../../../lib/password'

export const POST: APIRoute = async ({ request, cookies }) => {
  const { password } = await request.json()

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('admin_credenciales')
    .select('password_hash')
    .eq('id', 1)
    .single()

  if (data && verifyPassword(password, data.password_hash)) {
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
