import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { Resend } from 'resend'
import { RUBRICA } from '../../../data/rubrica'
import { emailCompletado } from '../../../data/email-completado'

export const POST: APIRoute = async ({ request }) => {
  const { token } = await request.json()
  if (!token) return new Response(JSON.stringify({ error: 'Token requerido' }), { status: 400 })

  const supabase = getSupabaseAdmin()

  const { data: evaluador } = await supabase
    .from('evaluadores')
    .select(`id, nombre, email, token, evaluacion_id, evaluaciones(nombre_empresa, fecha_evaluacion)`)
    .eq('token', token)
    .single()

  if (!evaluador) return new Response(JSON.stringify({ error: 'Evaluador no encontrado' }), { status: 404 })

  const { data: respuestas } = await supabase
    .from('respuestas')
    .select('codigo, puntuacion')
    .eq('evaluador_id', evaluador.id)

  const respuestaMap: Record<string, number | null> = {}
  for (const r of respuestas ?? []) {
    respuestaMap[r.codigo] = r.puntuacion
  }

  const dimensiones = RUBRICA.map(dim => {
    const puntuaciones = dim.practicas
      .map(p => respuestaMap[p.codigo])
      .filter((v): v is number => v !== null && v !== undefined)

    return {
      nombre: dim.nombre,
      completadas: puntuaciones.length,
      total: dim.practicas.length,
      promedio: puntuaciones.length > 0
        ? Math.round((puntuaciones.reduce((a, b) => a + b, 0) / puntuaciones.length) * 10) / 10
        : null
    }
  })

  const empresa = evaluador.evaluaciones as any
  const fechaFormateada = empresa?.fecha_evaluacion
    ? new Date(empresa.fecha_evaluacion).toLocaleDateString('es-CL', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : ''

  const link = `https://www.telos.cl/evaluacion/eval/${evaluador.token}`

  const resend = new Resend(import.meta.env.RESEND_API_KEY)
  const { error } = await resend.emails.send({
    from: 'noreply@telos.cl',
    to: evaluador.email,
    subject: `Evaluación guardada — ${empresa?.nombre_empresa ?? 'Diagnóstico'}`,
    html: emailCompletado({
      nombre: evaluador.nombre,
      empresa: empresa?.nombre_empresa ?? '',
      fecha: fechaFormateada,
      link,
      dimensiones
    })
  })

  return new Response(JSON.stringify({ ok: !error, error: error?.message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
