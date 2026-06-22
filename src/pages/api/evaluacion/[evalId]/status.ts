import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../../lib/supabase'

export const GET: APIRoute = async ({ params, cookies }) => {
  if (cookies.get('eval_admin')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const { evalId } = params
  if (!evalId) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })

  const supabase = getSupabaseAdmin()

  const { data: evaluadores } = await supabase
    .from('evaluadores')
    .select('id, nombre, email, correo_enviado')
    .eq('evaluacion_id', evalId)

  if (!evaluadores) {
    return new Response(JSON.stringify({ error: 'No encontrado' }), { status: 404 })
  }

  const statusList = await Promise.all(evaluadores.map(async (ev) => {
    const { count } = await supabase
      .from('respuestas')
      .select('*', { count: 'exact', head: true })
      .eq('evaluador_id', ev.id)
      .not('puntuacion', 'is', null)

    return {
      ...ev,
      total_respuestas: count ?? 0
    }
  }))

  return new Response(JSON.stringify({ evaluadores: statusList }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
