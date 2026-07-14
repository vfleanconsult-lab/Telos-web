import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { getSupabaseAdmin } from '../../../lib/supabase'
import { emailResetPassword } from '../../../data/email-reset-password'

export const POST: APIRoute = async () => {
  const supabase = getSupabaseAdmin()
  const resetToken = crypto.randomUUID()
  const resetExpira = new Date(Date.now() + 60 * 60 * 1000).toISOString()

  const { error } = await supabase
    .from('admin_credenciales')
    .update({ reset_token: resetToken, reset_expira: resetExpira })
    .eq('id', 1)

  if (error) {
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 })
  }

  const destino = import.meta.env.ADMIN_RESET_EMAIL || 'victor@telos.cl'
  const link = `https://www.telos.cl/evaluacion/reset?token=${resetToken}`

  const resend = new Resend(import.meta.env.RESEND_API_KEY)
  const { error: emailError } = await resend.emails.send({
    from: 'noreply@telos.cl',
    to: destino,
    subject: 'Restablecer contraseña — Panel Admin Evaluación',
    html: emailResetPassword({ link })
  })

  if (emailError) {
    console.error('Error enviando email de reset:', emailError)
    return new Response(JSON.stringify({ ok: false, error: emailError.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
