import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { Resend } from 'resend'
import { emailEvaluador } from '../../../data/email-evaluador'

export const POST: APIRoute = async ({ request, cookies }) => {
  if (cookies.get('eval_admin')?.value !== 'authenticated') {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 })
  }

  const body = await request.json()
  const { nombre_empresa, rut_empresa, fecha_evaluacion, evaluadores } = body

  if (!nombre_empresa || !rut_empresa || !fecha_evaluacion || !evaluadores?.length) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Crear la evaluación
  const { data: evaluacion, error: evalError } = await supabase
    .from('evaluaciones')
    .insert({ nombre_empresa, rut_empresa, fecha_evaluacion })
    .select()
    .single()

  if (evalError || !evaluacion) {
    return new Response(JSON.stringify({ error: evalError?.message }), { status: 500 })
  }

  // Crear evaluadores
  const evaluadoresData = evaluadores.map((e: { nombre: string; email: string }) => ({
    evaluacion_id: evaluacion.id,
    nombre: e.nombre,
    email: e.email
  }))

  const { data: evalRows, error: evaladoresError } = await supabase
    .from('evaluadores')
    .insert(evaluadoresData)
    .select()

  if (evaladoresError || !evalRows) {
    return new Response(JSON.stringify({ error: evaladoresError?.message }), { status: 500 })
  }

  // Enviar emails
  const resend = new Resend(import.meta.env.RESEND_API_KEY)
  const baseUrl = 'https://www.telos.cl'
  const fechaFormateada = new Date(fecha_evaluacion).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const emailResults = await Promise.allSettled(
    evalRows.map(async (ev: any) => {
      const link = `${baseUrl}/evaluacion/eval/${ev.token}`
      const html = emailEvaluador({
        nombre: ev.nombre,
        empresa: nombre_empresa,
        fecha: fechaFormateada,
        link
      })

      const { error: emailError } = await resend.emails.send({
        from: 'noreply@telos.cl',
        to: ev.email,
        subject: `Tu acceso al Diagnóstico de Madurez — ${nombre_empresa}`,
        html
      })

      if (!emailError) {
        await supabase
          .from('evaluadores')
          .update({ correo_enviado: true })
          .eq('id', ev.id)
      }

      return { id: ev.id, nombre: ev.nombre, email: ev.email, link, correo_ok: !emailError }
    })
  )

  const links = emailResults.map((r, i) => {
    if (r.status === 'fulfilled') return r.value
    return {
      id: evalRows[i].id,
      nombre: evalRows[i].nombre,
      email: evalRows[i].email,
      link: `${baseUrl}/evaluacion/eval/${evalRows[i].token}`,
      correo_ok: false
    }
  })

  return new Response(JSON.stringify({
    ok: true,
    evaluacion_id: evaluacion.id,
    calibracion_url: `${baseUrl}/evaluacion/${evaluacion.id}/calibracion`,
    resultado_url: `${baseUrl}/evaluacion/${evaluacion.id}/resultado`,
    evaluadores: links
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
