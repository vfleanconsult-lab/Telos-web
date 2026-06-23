import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'

export const DELETE: APIRoute = async ({ request }) => {
  const { evaluador_id } = await request.json()

  if (!evaluador_id) {
    return new Response(JSON.stringify({ error: 'evaluador_id requerido' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('evaluadores')
    .delete()
    .eq('id', evaluador_id)

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
