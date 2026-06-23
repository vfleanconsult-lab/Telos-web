import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { Resend } from 'resend'
import { emailEvaluador } from '../../../data/email-evaluador'

export const POST: APIRoute = async ({ request }) => {
  const { evaluacion_id, nombre, email } = await request.json()

  if (!evaluacion_id || !nombre || !email) {
    return new Response(JSON.stringify({ error: 'Datos incompletos' }), { status: 400 })
  }

  const supabase = getSupabaseAdmin()

  // Obtener datos de la evaluación para el email
  const { data: evaluacion, error: evalError } = await supabase
    .from('evaluaciones')
    .select('nombre_empresa, fecha_evaluacion')
    .eq('id', evaluacion_id)
    .single()

  if (evalError || !evaluacion) {
    return new Response(JSON.stringify({ error: 'Evaluación no encontrada' }), { status: 404 })
  }

  // Crear el evaluador
  const { data: evaluador, error: evError } = await supabase
    .from('evaluadores')
    .insert({ evaluacion_id, nombre, email })
    .select('id, nombre, email, token')
    .single()

  if (evError || !evaluador) {
    return new Response(JSON.stringify({ error: evError?.message ?? 'Error al crear evaluador' }), { status: 500 })
  }

  const fechaFormateada = new Date(evaluacion.fecha_evaluacion).toLocaleDateString('es-CL', {
    day: 'numeric', month: 'long', year: 'numeric'
  })

  const link = `https://www.telos.cl/evaluacion?token=${evaluador.token}`

  // Enviar email de invitación
  const resend = new Resend(import.meta.env.RESEND_API_KEY)
  const { error: emailError } = await resend.emails.send({
    from: 'noreply@telos.cl',
    to: email,
    subject: `Evaluación de madurez — ${evaluacion.nombre_empresa}`,
    html: emailEvaluador({
      nombre,
      empresa: evaluacion.nombre_empresa,
      fecha: fechaFormateada,
      link
    })
  })

  // Marcar correo como enviado si fue exitoso
  if (!emailError) {
    await supabase
      .from('evaluadores')
      .update({ correo_enviado: true })
      .eq('id', evaluador.id)
  }

  return new Response(JSON.stringify({
    ok: true,
    evaluador: {
      id: evaluador.id,
      nombre: evaluador.nombre,
      email: evaluador.email,
      token: evaluador.token,
      correo_enviado: !emailError,
      link
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
