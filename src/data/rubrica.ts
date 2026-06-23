export interface Practica {
  codigo: string
  nombre: string
  queObservar: string
  niveles: [string, string, string, string, string]
}

export interface Dimension {
  id: number
  nombre: string
  descripcion: string
  practicas: Practica[]
}

export const TOTAL_PRACTICAS = 20

export function nivelLabel(n: number | null): string {
  if (n === null) return '—'
  if (n <= 1) return 'Crítico'
  if (n <= 2) return 'Bajo'
  if (n <= 3) return 'Medio'
  return 'Avanzado'
}

export function indiceLabel(pct: number): string {
  if (pct <= 25) return 'Crítico'
  if (pct <= 50) return 'Bajo'
  if (pct <= 75) return 'Medio'
  return 'Avanzado'
}

export const RUBRICA: Dimension[] = [
  {
    id: 1,
    nombre: 'Estrategia',
    descripcion: 'Claridad estratégica, despliegue y madurez para absorber el cambio',
    practicas: [
      {
        codigo: '1.01',
        nombre: 'Claridad de los objetivos del área',
        queObservar: '¿Enumera rápido los objetivos? Gerente que duda = desalineación.',
        niveles: [
          'No existen objetivos definidos para el área; el trabajo responde a la urgencia del día.',
          'Hay objetivos pero son difusos o solo conocidos por la gerencia; no se enuncian con claridad.',
          'Existen 2-3 objetivos definidos que la jefatura enuncia, aunque no siempre están escritos ni medidos.',
          'Objetivos claros, escritos y medibles, conocidos por mandos medios y vinculados a metas del negocio.',
          'Objetivos claros, medibles y revisados periódicamente; toda el área los conoce y los usa para priorizar.'
        ]
      },
      {
        codigo: '1.02',
        nombre: 'Despliegue y comunicación de la estrategia al equipo',
        queObservar: '¿Proceso formal o solo conversación? ¿El analista los conoce?',
        niveles: [
          'La estrategia no baja al equipo; los analistas desconocen hacia dónde va el área.',
          'Se transmite informalmente, en conversaciones sueltas, sin mecanismo definido.',
          'Hay instancias de comunicación (reuniones) pero irregulares; el mensaje llega parcial.',
          'Existe un proceso formal de despliegue (reuniones, KPIs, dashboards) y el equipo lo entiende.',
          'Despliegue sistemático con seguimiento; cada persona entiende cómo su trabajo aporta a los objetivos.'
        ]
      },
      {
        codigo: '1.03',
        nombre: 'Seguimiento y control de gestión en tiempo real',
        queObservar: '"El cierre mensual" / "cuando me llaman" = vacío de control.',
        niveles: [
          'No hay forma de saber el avance hasta el cierre; el control es reactivo.',
          'El seguimiento depende del cierre mensual; no hay visibilidad intra-mes.',
          'Existen algunos indicadores operativos, pero se actualizan manualmente y con rezago.',
          'Hay indicadores de seguimiento semanales, mayormente confiables, aunque con trabajo manual.',
          'Control de gestión con indicadores automatizados y visibles que permiten reaccionar a tiempo.'
        ]
      },
      {
        codigo: '1.04',
        nombre: 'Conciencia de la cadena de valor y procesos que impactan al negocio',
        queObservar: '¿Entiende la relación finanzas-negocio? Anota procesos que menciona.',
        niveles: [
          'No se identifica qué procesos del área impactan al negocio; finanzas se ve como tarea aislada.',
          'Reconoce algunos procesos relevantes pero sin claridad de su impacto en la operación.',
          'Identifica los procesos críticos principales y entiende su relación con el negocio.',
          'Comprende bien la cadena de valor y dónde están los puntos de riesgo de los procesos clave.',
          'Visión integral de la cadena de valor; prioriza y gestiona los procesos según su impacto al negocio.'
        ]
      },
      {
        codigo: '1.05',
        nombre: 'Capacidad de absorción de cambio (iniciativas en curso)',
        queObservar: 'Muchas iniciativas abiertas = baja absorción de proyectos nuevos.',
        niveles: [
          'Saturación total: muchas iniciativas abiertas o sin capacidad de tomar nada nuevo.',
          'Varias iniciativas en curso con bajo avance; absorción de cambio limitada.',
          'Algunas iniciativas activas con avance razonable; hay espacio acotado para nuevos proyectos.',
          'Pocas iniciativas, bien gestionadas; el área puede absorber un proyecto adicional.',
          'Cartera de mejoras gestionada con método; alta disposición y capacidad para incorporar cambios.'
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: 'Personas',
    descripcion: 'Competencias, disposición al cambio y concentración de conocimiento',
    practicas: [
      {
        codigo: '2.01',
        nombre: 'Mentalidad y manejo tecnológico del equipo',
        queObservar: 'Distinguir "usa bien Excel" de "tiene mentalidad digital".',
        niveles: [
          'Manejo tecnológico muy bajo; resistencia o temor generalizado a las herramientas.',
          'Manejo básico de ofimática (Excel) sin mentalidad digital; se hace lo mínimo.',
          'Buen manejo de herramientas tradicionales; mentalidad digital incipiente en algunas personas.',
          'Equipo competente digitalmente, abierto a nuevas herramientas y con curiosidad por mejorar.',
          'Cultura digital instalada: el equipo busca, prueba y propone herramientas de forma proactiva.'
        ]
      },
      {
        codigo: '2.02',
        nombre: 'Adopción actual de IA (formal o informal)',
        queObservar: 'Adopción informal = demanda. Power users = agentes de cambio.',
        niveles: [
          'No hay uso de IA ni interés manifiesto.',
          'Uso aislado y por cuenta propia (ej. ChatGPT para correos), sin que nadie lo formalice.',
          'Varias personas usan IA informalmente; hay demanda evidente pero sin gobernanza.',
          'Uso de IA reconocido por la jefatura, con algunos casos consolidados y power users identificados.',
          'Uso de IA gobernado y escalado, con lineamientos, casos en producción y agentes de cambio activos.'
        ]
      },
      {
        codigo: '2.03',
        nombre: 'Capacidad instalada de liderazgo técnico interno',
        queObservar: '¿Sabe quién lideraría? Si no, hay vacío de liderazgo técnico.',
        niveles: [
          'No hay nadie que pueda liderar una automatización; todo dependería de un externo.',
          'Hay interés pero no una persona con capacidad real de liderar mejoras técnicas.',
          'Existe al menos una persona con perfil para liderar iniciativas puntuales con apoyo.',
          'Hay uno o más referentes internos capaces de liderar automatizaciones con autonomía.',
          'Equipo con varios referentes técnicos que impulsan mejoras y forman a otros.'
        ]
      },
      {
        codigo: '2.04',
        nombre: 'Concentración de conocimiento y dependencia de personas clave',
        queObservar: '"Si X no está, no funciona" = riesgo operacional crítico.',
        niveles: [
          'Procesos críticos dependen de una sola persona; si no está, el proceso se detiene (riesgo alto).',
          'Alta dependencia de personas clave con documentación mínima o inexistente.',
          'Dependencia parcial: algunos procesos documentados, otros viven en la cabeza de alguien.',
          'Procesos clave documentados y con respaldo; la ausencia de una persona no detiene la operación.',
          'Conocimiento distribuido y documentado; rotación y respaldos garantizan continuidad.'
        ]
      },
      {
        codigo: '2.05',
        nombre: 'Disposición del equipo al cambio',
        queObservar: '"No sé qué haría con el tiempo" / silencio = miedo al reemplazo.',
        niveles: [
          'Resistencia explícita; experiencias previas negativas con tecnología ("eso no es mi trabajo").',
          'Escepticismo o temor al reemplazo; disposición baja y condicionada.',
          'Disposición mixta: algunos abiertos, otros reticentes; depende del liderazgo.',
          'Disposición mayoritariamente positiva; el equipo ve el cambio como oportunidad.',
          'Equipo proactivo que pide y promueve cambios; cultura de mejora continua instalada.'
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: 'Procesos',
    descripcion: 'Procesos críticos, digitalización real, dolores operativos y reprocesos',
    practicas: [
      {
        codigo: '3.01',
        nombre: 'Mapa de procesos y conciencia de procesos críticos',
        queObservar: 'Enumera con claridad = conciencia de mapa. Input directo.',
        niveles: [
          'No hay noción de mapa de procesos; se confunden tareas con procesos.',
          'Reconoce algunos procesos pero de forma desordenada y sin priorización.',
          'Identifica los procesos principales del área aunque sin documentación estructurada.',
          'Tiene claro el mapa de procesos clave y cuáles están bien resueltos y cuáles no.',
          'Mapa de procesos documentado, priorizado y usado activamente para la gestión.'
        ]
      },
      {
        codigo: '3.02',
        nombre: 'Nivel de digitalización real del área',
        queObservar: '"Casi todo en Excel" = Etapa 2 (Digitalizar antes de Automatizar).',
        niveles: [
          'Operación casi totalmente manual; predominan papel, Excel y correos.',
          'Digitalización mínima; la mayoría del trabajo diario pasa por Excel manual.',
          'Digitalización parcial: conviven sistemas con un uso intensivo de planillas manuales.',
          'Mayoría de procesos digitalizados en sistemas; Excel acotado a tareas específicas.',
          'Procesos digitalizados e integrados; el Excel manual es marginal.'
        ]
      },
      {
        codigo: '3.03',
        nombre: 'Cuellos de botella, reprocesos y errores frecuentes',
        queObservar: '"Excel que se llena a mano" / "el sistema no integra" = caso directo.',
        niveles: [
          'Reprocesos y errores constantes asumidos como normales; no se miden.',
          'Cuellos de botella frecuentes, atribuidos a personas o sistemas, sin acción correctiva.',
          'Se reconocen los reprocesos principales y sus causas, pero se conviven con ellos.',
          'Los cuellos de botella están identificados y hay acciones puntuales para reducirlos.',
          'Procesos estables con baja tasa de error; los reprocesos se detectan y corrigen en origen.'
        ]
      },
      {
        codigo: '3.04',
        nombre: 'Carga de trabajo manual y repetitivo',
        queObservar: '>1,5–2 h/día de trabajo manual = potencial claro. Convierte a horas anuales.',
        niveles: [
          'Gran parte de la jornada se va en tareas manuales repetitivas (>3 h/día).',
          'Carga manual alta (~2-3 h/día) en consolidar, formatear y copiar/pegar.',
          'Carga manual moderada (~1-2 h/día); se reconoce como ineficiencia.',
          'Carga manual baja; las tareas repetitivas están acotadas o parcialmente automatizadas.',
          'Tareas repetitivas automatizadas; el tiempo se dedica a análisis y revisión.'
        ]
      },
      {
        codigo: '3.05',
        nombre: 'Documentación y estandarización de procesos',
        queObservar: 'Señales: procesos de memoria, Excel "maestro" que nadie más entiende.',
        niveles: [
          'Procesos ejecutados "de memoria", sin documentación alguna.',
          'Documentación dispersa y desactualizada; cada quien lo hace a su manera.',
          'Algunos procesos clave documentados, pero sin estándar común ni mantenimiento.',
          'Procesos clave documentados y estandarizados, con actualización ocasional.',
          'Estándares vivos, mantenidos y usados; la documentación es parte de la operación.'
        ]
      }
    ]
  },
  {
    id: 4,
    nombre: 'Tecnología',
    descripcion: 'Ecosistema de sistemas, integración, uso real y gobernanza',
    practicas: [
      {
        codigo: '4.01',
        nombre: 'Ecosistema de sistemas (ERP, BI, planillas)',
        queObservar: '¿ERP central o todo en paralelo? Construye el inventario.',
        niveles: [
          'No hay sistemas de soporte; todo corre en planillas y correos.',
          'Sistemas mínimos o muy antiguos; el área opera mayormente fuera de ellos.',
          'Existe un ERP u otros sistemas, pero coexisten con muchos procesos en paralelo.',
          'Sistemas centrales definidos (ERP/BI) que soportan la mayoría de los procesos.',
          'Ecosistema tecnológico moderno y coherente que cubre los procesos del área.'
        ]
      },
      {
        codigo: '4.02',
        nombre: 'Integración entre sistemas',
        queObservar: 'Falta de integración = donde se pierde más tiempo y se generan errores.',
        niveles: [
          'Sistemas totalmente aislados; los datos se reingresan a mano entre ellos.',
          'Integración casi nula; se exporta/importa manualmente con frecuencia.',
          'Integración parcial entre algunos sistemas; persisten transferencias manuales.',
          'Sistemas mayormente integrados; pocas transferencias manuales.',
          'Integración fluida y automática; los datos circulan sin reingreso manual.'
        ]
      },
      {
        codigo: '4.03',
        nombre: 'Uso real vs. potencial de los sistemas',
        queObservar: 'Brecha capacidad-uso = oportunidad de corto plazo sin costo extra.',
        niveles: [
          'Se usa una fracción mínima del sistema; gran capacidad instalada desaprovechada.',
          'Uso bajo (~20-30%); el sistema se subutiliza por falta de capacitación o diseño.',
          'Uso medio; se aprovechan las funciones básicas pero no las analíticas/avanzadas.',
          'Uso alto; el equipo explota la mayoría de las capacidades relevantes.',
          'Uso pleno y mejora continua del sistema; se exploran funciones nuevas activamente.'
        ]
      },
      {
        codigo: '4.04',
        nombre: 'Gobernanza y políticas de adopción tecnológica',
        queObservar: '¿Aprobaciones TI? ¿Seguridad? ¿Proveedor exclusivo? Acelera o paraliza.',
        niveles: [
          'Restricciones que bloquean cualquier herramienta nueva; o nula gobernanza (caos).',
          'Procesos de aprobación poco claros que frenan la adopción; depende de TI central.',
          'Existe gobernanza pero lenta o rígida; la adopción requiere gestión.',
          'Gobernanza clara que permite adoptar herramientas con un proceso razonable.',
          'Gobernanza ágil y habilitante: marco de seguridad claro que acelera la adopción responsable.'
        ]
      },
      {
        codigo: '4.05',
        nombre: 'Brecha tecnológica percibida y oportunidades',
        queObservar: '"Lo primero que cambiaría" = hipótesis de mejora. Anota literal.',
        niveles: [
          'No identifica brechas ni oportunidades; conformismo con el statu quo.',
          'Percibe molestias difusas pero no las traduce en mejoras concretas.',
          'Identifica algunas brechas claras y propone mejoras puntuales.',
          'Tiene hipótesis claras de mejora priorizadas por impacto.',
          'Visión articulada de la hoja de ruta tecnológica con oportunidades priorizadas.'
        ]
      }
    ]
  }
]

export function getPractica(codigo: string): Practica | undefined {
  for (const dim of RUBRICA) {
    const p = dim.practicas.find(p => p.codigo === codigo)
    if (p) return p
  }
  return undefined
}

export function getDimensionDePractica(codigo: string): Dimension | undefined {
  const prefix = codigo.split('.')[0]
  return RUBRICA.find(d => d.id === parseInt(prefix))
}
