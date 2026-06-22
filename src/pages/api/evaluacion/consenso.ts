import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('eval_admin')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const { evaluacion_id, codigo, nota_consenso, comentario_calibracion } = await request.json()

  if (!evaluacion_id || !codigo) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  const { error } = await supabase
    .from('consenso')
    .upsert({
      evaluacion_id,
      codigo,
      nota_consenso: nota_consenso ?? null,
      comentario_calibracion: comentario_calibracion ?? '',
      updated_at: new Date().toISOString()
    }, { onConflict: 'evaluacion_id,codigo' })

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
