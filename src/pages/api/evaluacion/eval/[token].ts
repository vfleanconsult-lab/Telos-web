import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../../lib/supabase'

export const GET: APIRoute = async ({ params }) => {
  const { token } = params

  if (!token) {
    return new Response(JSON.stringify({ error: 'Token requerido' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { data: evaluador, error: evError } = await supabase
    .from('evaluadores')
    .select(`
      id, nombre, email, token, evaluacion_id,
      evaluaciones ( nombre_empresa, fecha_evaluacion, rut_empresa )
    `)
    .eq('token', token)
    .single()

  if (evError || !evaluador) {
    return new Response(JSON.stringify({ error: 'Token inválido' }), { status: 404 })
  }

  const { data: respuestas } = await supabase
    .from('respuestas')
    .select('codigo, puntuacion, comentario')
    .eq('evaluador_id', evaluador.id)

  return new Response(JSON.stringify({
    evaluador: {
      id: evaluador.id,
      nombre: evaluador.nombre,
      email: evaluador.email,
      token: evaluador.token,
      evaluacion_id: evaluador.evaluacion_id
    },
    evaluacion: evaluador.evaluaciones,
    respuestas: respuestas ?? []
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
