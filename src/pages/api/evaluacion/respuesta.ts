import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request }) => {
  const { token, codigo, puntuacion, comentario } = await request.json()

  if (!token || !codigo) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Obtener evaluador por token
  const { data: evaluador, error: evError } = await supabase
    .from('evaluadores')
    .select('id, evaluacion_id')
    .eq('token', token)
    .single()

  if (evError || !evaluador) {
    return new Response(JSON.stringify({ error: 'Evaluador no encontrado' }), { status: 404 })
  }

  // Upsert respuesta
  const { error } = await supabase
    .from('respuestas')
    .upsert({
      evaluador_id: evaluador.id,
      evaluacion_id: evaluador.evaluacion_id,
      codigo,
      puntuacion: puntuacion ?? null,
      comentario: comentario ?? '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'evaluador_id,codigo' })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
