import type { APIRoute } from 'astro'
import { getSupabaseAdmin } from '../../../../lib/supabase'
import { RUBRICA, indiceLabel } from '../../../../data/rubrica'

export const GET: APIRoute = async ({ params }) => {
  const { evalId } = params
  if (!evalId) return new Response(JSON.stringify({ error: 'ID requerido' }), { status: 400 })

  const supabase = getSupabaseAdmin()

  const [evalResult, evaladoresResult, consensoResult, respuestasResult] = await Promise.all([
    supabase.from('evaluaciones').select('*').eq('id', evalId).single(),
    supabase.from('evaluadores').select('id, nombre, email').eq('evaluacion_id', evalId),
    supabase.from('consenso').select('codigo, nota_consenso').eq('evaluacion_id', evalId),
    supabase.from('respuestas').select('evaluador_id, codigo, puntuacion').eq('evaluacion_id', evalId)
  ])

  if (evalResult.error || !evalResult.data) {
    return new Response(JSON.stringify({ error: 'Evaluación no encontrada' }), { status: 404 })
  }

  const evaluadores = evaladoresResult.data ?? []
  const consensos = consensoResult.data ?? []
  const respuestas = respuestasResult.data ?? []

  const consensoMap: Record<string, number | null> = {}
  consensos.forEach(c => { consensoMap[c.codigo] = c.nota_consenso })

  // Calcular puntaje por dimensión usando nota de consenso
  const dimensiones = RUBRICA.map(dim => {
    const puntajes = dim.practicas
      .map(p => consensoMap[p.codigo])
      .filter((v): v is number => v !== null && v !== undefined)

    const puntaje = puntajes.length > 0
      ? puntajes.reduce((a, b) => a + b, 0) / puntajes.length
      : 0
    const indice = Math.round((puntaje / 4) * 100)

    return { nombre: dim.nombre, puntaje: Math.round(puntaje * 100) / 100, indice, nivel: indiceLabel(indice) }
  })

  const dimConPuntaje = dimensiones.filter(d => d.puntaje > 0)
  const puntaje_global = dimConPuntaje.length > 0
    ? Math.round((dimConPuntaje.reduce((a, b) => a + b.puntaje, 0) / RUBRICA.length) * 100) / 100
    : 0
  const indice_global = Math.round((puntaje_global / 4) * 100)

  // Calcular brechas por práctica
  const practicasConBrecha = RUBRICA.flatMap(dim => dim.practicas).map(p => {
    const evPuntajes: Record<string, number | null> = {}
    evaluadores.forEach(ev => {
      const r = respuestas.find(r => r.evaluador_id === ev.id && r.codigo === p.codigo)
      evPuntajes[ev.nombre] = r?.puntuacion ?? null
    })

    const vals = Object.values(evPuntajes).filter((v): v is number => v !== null)
    const brecha = vals.length >= 2
      ? Math.max(...vals) - Math.min(...vals)
      : 0

    return {
      codigo: p.codigo,
      nombre: p.nombre,
      brecha: Math.round(brecha * 100) / 100,
      evaluaciones: evPuntajes,
      consenso: consensoMap[p.codigo] ?? null
    }
  }).sort((a, b) => b.brecha - a.brecha)

  return new Response(JSON.stringify({
    evaluacion: evalResult.data,
    evaluadores,
    dimensiones,
    puntaje_global,
    indice_global,
    nivel_global: indiceLabel(indice_global),
    practicas_con_brecha: practicasConBrecha
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
