import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { hashPassword } from '../../../lib/password'

export const POST: APIRoute = async ({ request }) => {
  const { token, password } = await request.json()

  if (!token || !password || password.length < 8) {
    return new Response(JSON.stringify({ ok: false, error: 'Datos inválidos' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()
  const { data } = await supabase
    .from('admin_credenciales')
    .select('reset_token, reset_expira')
    .eq('id', 1)
    .single()

  if (!data || data.reset_token !== token || !data.reset_expira || new Date(data.reset_expira) < new Date()) {
    return new Response(JSON.stringify({ ok: false, error: 'Enlace inválido o vencido' }), { status: 401 })
  }

  const { error } = await supabase
    .from('admin_credenciales')
    .update({
      password_hash: hashPassword(password),
      reset_token: null,
      reset_expira: null
    })
    .eq('id', 1)

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
