export interface Evaluacion {
  id: string
  nombre_empresa: string
  rut_empresa: string
  fecha_evaluacion: string
  rubrica_id: string
  created_at: string
}

export interface Evaluador {
  id: string
  evaluacion_id: string
  nombre: string
  email: string
  token: string
  correo_enviado: boolean
  created_at: string
}

export interface Respuesta {
  id: string
  evaluador_id: string
  evaluacion_id: string
  codigo: string
  puntuacion: number | null
  comentario: string
  updated_at: string
}

export interface Consenso {
  id: string
  evaluacion_id: string
  codigo: string
  nota_consenso: number | null
  comentario_calibracion: string
  updated_at: string
}

export interface EvaluadorConProgreso extends Evaluador {
  total_respuestas: number
}

export interface ResultadoDimension {
  nombre: string
  puntaje: number
  indice: number
  nivel: string
}

export interface ResultadoFinal {
  evaluacion: Evaluacion
  evaluadores: EvaluadorConProgreso[]
  dimensiones: ResultadoDimension[]
  puntaje_global: number
  indice_global: number
  nivel_global: string
  practicas_con_brecha: Array<{
    codigo: string
    nombre: string
    brecha: number
    evaluaciones: Record<string, number | null>
    consenso: number | null
  }>
}
