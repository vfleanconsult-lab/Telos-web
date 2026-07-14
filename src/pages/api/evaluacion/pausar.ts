import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { Resend } from 'resend'
import { RUBRICA, TOTAL_PRACTICAS } from '../../../data/rubrica'
import { emailPausado } from '../../../data/email-pausado'

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

  const dimensiones = RUBRICA.map(dim => ({
    nombre: dim.nombre,
    completadas: dim.practicas.filter(p => respuestaMap[p.codigo] !== null && respuestaMap[p.codigo] !== undefined).length,
    total: dim.practicas.length
  }))

  const completadas = dimensiones.reduce((sum, d) => sum + d.completadas, 0)

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
    subject: `Recuerda completar tu evaluación — ${empresa?.nombre_empresa ?? 'Diagnóstico'}`,
    html: emailPausado({
      nombre: evaluador.nombre,
      empresa: empresa?.nombre_empresa ?? '',
      fecha: fechaFormateada,
      link,
      dimensiones,
      completadas,
      total: TOTAL_PRACTICAS
    })
  })

  return new Response(JSON.stringify({ ok: !error, error: error?.message }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
