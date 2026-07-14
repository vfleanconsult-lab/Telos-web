export interface Practica {
  codigo: string
  nombre: string
  objetivo: string
  queObservar: string
  niveles: [string, string, string, string, string]
}

export interface Dimension {
  id: number
  nombre: string
  descripcion: string
  practicas: Practica[]
}

export function nivelLabel(n: number | null): string {
  if (n === null) return '—'
  if (n <= 1) return 'Crítico'
  if (n <= 2) return 'Incipiente'
  if (n <= 3) return 'En desarrollo'
  return 'Consolidado'
}

export function indiceLabel(pct: number): string {
  if (pct <= 25) return 'Crítico'
  if (pct <= 50) return 'Incipiente'
  if (pct <= 75) return 'En desarrollo'
  return 'Consolidado'
}

export const RUBRICA: Dimension[] = [
  {
    id: 1,
    nombre: 'Estrategia',
    descripcion: 'Norte, despliegue y gobierno del área',
    practicas: [
      {
        codigo: '1.01',
        nombre: 'Claridad de los objetivos del área',
        objetivo: 'Determinar si existen objetivos formales, medibles y conocidos en todos los niveles, o solo en la cabeza del gerente.',
        queObservar: 'P-1.01. ¿El gerente los enumera rápido? ¿El analista los conoce? Contrastar respuestas entre niveles.',
        niveles: [
          'No existen objetivos definidos para el área; se trabaja por inercia o por urgencias.',
          'Existen objetivos pero son difusos, no medibles y solo los conoce la gerencia.',
          'Hay objetivos definidos y escritos, parcialmente medibles; el equipo los conoce de forma general.',
          'Objetivos claros, escritos y medibles, conocidos por jefaturas y la mayoría del equipo.',
          'Objetivos claros y medibles, revisados periódicamente, conocidos por todos y usados para decidir en el día a día.'
        ]
      },
      {
        codigo: '1.02',
        nombre: 'Despliegue de la estrategia en cascada',
        objetivo: 'Determinar si los objetivos se traducen en metas de equipo e individuo, o se quedan en la gerencia.',
        queObservar: 'P-1.02. ¿Existe proceso formal de despliegue o solo conversación? Preguntar al analista por sus metas.',
        niveles: [
          'La estrategia no baja al equipo; no hay metas de equipo ni individuales.',
          'Las metas de equipo reflejan tareas operativas, sin vínculo con los objetivos del área.',
          'Algunas metas de equipo están ligadas a los objetivos del área; el vínculo individual es débil.',
          'La mayoría de las metas de equipo e individuales deriva de los objetivos del área, con seguimiento periódico.',
          'Cascada completa: cada persona puede explicar cómo su trabajo aporta a los objetivos del área y del negocio.'
        ]
      },
      {
        codigo: '1.03',
        nombre: 'Control de gestión del área',
        objetivo: 'Determinar si el área monitorea su propio desempeño con indicadores en frecuencia útil, o solo se entera en el cierre mensual.',
        queObservar: 'P-1.03. "El cierre mensual" como única respuesta = vacío de control en tiempo real.',
        niveles: [
          'No hay indicadores; el desempeño se conoce solo cuando algo falla o "llaman de arriba".',
          'El seguimiento depende del cierre mensual; no hay visibilidad intermedia.',
          'Existen algunos indicadores operativos, construidos manualmente y revisados de forma irregular.',
          'Indicadores definidos con revisión semanal o quincenal, mayormente manuales pero sistemáticos.',
          'Control de gestión con indicadores automatizados (dashboard), revisados en rutinas formales y que gatillan acciones.'
        ]
      },
      {
        codigo: '1.04',
        nombre: 'Agenda de digitalización e IA',
        objetivo: 'Determinar si existe una hoja de ruta digital con presupuesto y sponsor, iniciativas sueltas, o nada.',
        queObservar: 'P-1.04. ¿Quién es el sponsor? ¿Hay presupuesto asignado o solo intención?',
        niveles: [
          'No existe agenda digital; la tecnología se aborda solo cuando algo se rompe.',
          'Hay ideas o intenciones declaradas, sin plan, presupuesto ni responsable.',
          'Existen iniciativas digitales aisladas, sin hoja de ruta que las conecte.',
          'Hay una hoja de ruta digital definida con sponsor, aunque con recursos o seguimiento parciales.',
          'Hoja de ruta digital priorizada, con presupuesto, sponsor ejecutivo y revisión periódica de avance.'
        ]
      },
      {
        codigo: '1.05',
        nombre: 'Gobierno de las iniciativas de mejora',
        objetivo: 'Determinar cómo se priorizan y gestionan los proyectos de mejora: criterio formal, urgencia o voluntarismo.',
        queObservar: 'P-1.05. Muchas iniciativas abiertas sin avance = baja capacidad de absorción para lo nuevo.',
        niveles: [
          'No hay iniciativas de mejora o mueren sin gestión; se decide por urgencia.',
          'Las iniciativas surgen por voluntarismo individual, sin criterios ni seguimiento.',
          'Hay iniciativas activas con responsables, pero la priorización es intuitiva y la carga no se gestiona.',
          'Cartera de iniciativas con criterios de priorización y seguimiento regular; se considera la capacidad de absorción.',
          'Portafolio gestionado con método: criterios explícitos (impacto/esfuerzo), recursos asignados y cierre disciplinado.'
        ]
      },
      {
        codigo: '1.06',
        nombre: 'Rol de Finanzas en el negocio',
        objetivo: 'Determinar si el área opera como socio estratégico del negocio o como procesador transaccional.',
        queObservar: 'P-1.06. ¿Los ejemplos que da son de reporte (pasado) o de decisión (futuro)?',
        niveles: [
          'El área solo procesa transacciones y reporta; nadie la consulta para decisiones.',
          'Entrega información cuando se la piden; rol esencialmente reactivo.',
          'Participa en algunas decisiones del negocio, con aportes principalmente históricos (qué pasó).',
          'Actúa como contraparte del negocio en decisiones relevantes, con análisis y proyecciones.',
          'Socio estratégico: anticipa escenarios, influye en decisiones y el negocio la busca proactivamente.'
        ]
      }
    ]
  },
  {
    id: 2,
    nombre: 'Procesos',
    descripcion: 'Operación real: estándares, medición, automatización',
    practicas: [
      {
        codigo: '2.01',
        nombre: 'Mapa y documentación de procesos',
        objetivo: 'Determinar si los procesos están identificados, documentados y con dueño, o viven en la memoria de quien los ejecuta.',
        queObservar: 'P-2.01. ¿Enumera los 5 procesos clave con claridad o mezcla tareas con procesos?',
        niveles: [
          'No existe noción de procesos; se ejecutan tareas de memoria, sin documentación.',
          'Los procesos se reconocen informalmente; documentación escasa, dispersa o desactualizada.',
          'Los procesos principales están identificados y algunos documentados, sin dueños claros.',
          'Mapa de procesos definido, con dueños y documentación actualizada en los procesos críticos.',
          'Mapa completo, documentado, con dueños y versiones vigentes; se usa en la operación y la inducción.'
        ]
      },
      {
        codigo: '2.02',
        nombre: 'Estandarización de la ejecución',
        objetivo: 'Determinar si un proceso se ejecuta igual independiente de quién lo haga, o el resultado depende del ejecutor.',
        queObservar: 'P-2.02. Preguntar qué pasa cuando alguien reemplaza a otro: ¿el resultado cambia?',
        niveles: [
          'Cada persona ejecuta a su manera; el resultado depende totalmente del ejecutor.',
          'Existen formas "habituales" de trabajo transmitidas verbalmente, con alta variabilidad.',
          'Algunos procesos tienen estándar definido, pero se cumple de forma irregular.',
          'Los procesos clave tienen estándares vigentes y se ejecutan de forma consistente.',
          'Estándares vivos: se cumplen, se auditan y se actualizan cuando el proceso mejora.'
        ]
      },
      {
        codigo: '2.03',
        nombre: 'Medición del desempeño de los procesos',
        objetivo: 'Determinar si se miden tiempos de ciclo, errores y volúmenes (días de cierre, DSO, DPO), o no existe línea base.',
        queObservar: 'P-2.03. Pedir números concretos: días de cierre, DSO, DPO. Si duda, no hay línea base.',
        niveles: [
          'No se mide nada; no hay línea base del desempeño de los procesos.',
          'Se conocen algunos datos gruesos (ej. días de cierre) pero no se registran ni gestionan.',
          'Se miden algunos procesos, de forma manual y esporádica.',
          'Los procesos críticos tienen métricas definidas (ciclo, errores, volumen) con registro sistemático.',
          'Medición integral y en lo posible automatizada; las métricas se usan para gestionar y mejorar.'
        ]
      },
      {
        codigo: '2.04',
        nombre: 'Calidad y reprocesos',
        objetivo: 'Determinar la frecuencia y causa raíz de errores y retrabajos, y si se gestionan o se toleran.',
        queObservar: 'P-2.04. "Lo hacemos dos veces porque..." = reproceso estructural, candidato a rediseño.',
        niveles: [
          'Errores y reprocesos constantes, asumidos como parte normal del trabajo.',
          'Reprocesos frecuentes; se corrigen sobre la marcha sin buscar la causa.',
          'Los reprocesos principales están identificados, pero el análisis de causa es ocasional.',
          'Los errores se registran y se analizan causas raíz en los procesos críticos; la tasa va en descenso.',
          'Calidad "a la primera" instalada: errores escasos, análisis de causa y acciones preventivas.'
        ]
      },
      {
        codigo: '2.05',
        nombre: 'Controles internos y gestión de riesgo',
        objetivo: 'Determinar la robustez de conciliaciones, segregación de funciones y aprobaciones: sistematizadas o dependientes de personas.',
        queObservar: 'P-2.05. ¿Las aprobaciones viven en correos? ¿Quién concilia y quién revisa?',
        niveles: [
          'Controles inexistentes o dependientes de la memoria de las personas.',
          'Controles informales, sin registro; segregación de funciones débil.',
          'Controles definidos en procesos clave, ejecutados manualmente y sin monitoreo regular.',
          'Estructura de control formal (conciliaciones, aprobaciones, segregación) ejecutada con disciplina.',
          'Controles sistematizados y en lo posible automatizados, con trazabilidad y monitoreo de excepciones.'
        ]
      },
      {
        codigo: '2.06',
        nombre: 'Grado de automatización real',
        objetivo: 'Determinar cuánto de cada proceso clave (cierre, AP, AR, tesorería, FP&A) corre en sistemas vs. Excel y trabajo manual.',
        queObservar: 'P-2.06. Recorrer proceso por proceso: cierre, AP, AR, tesorería, FP&A. Horas de copiar/pegar al día.',
        niveles: [
          'Operación esencialmente manual; el Excel es el sistema.',
          'Los sistemas registran, pero el trabajo real (consolidar, calcular, reportar) se hace a mano.',
          'Conviven procesos automatizados con islas relevantes de trabajo manual en Excel.',
          'La mayoría de los procesos clave corre en sistemas; el trabajo manual es acotado e identificado.',
          'Procesos clave automatizados de punta a punta; el Excel es herramienta de análisis, no de operación.'
        ]
      },
      {
        codigo: '2.07',
        nombre: 'Flujo de información entre áreas',
        objetivo: 'Determinar cómo viaja la información en los handoffs: integrada, o por correo con esperas y re-digitación.',
        queObservar: 'P-2.07. ¿Cuántas veces menciona "le mando el Excel por correo" al describir su día?',
        niveles: [
          'La información viaja por correo y planillas personales; esperas y re-digitación constantes.',
          'Handoffs definidos informalmente; frecuentes esperas por aprobaciones e información faltante.',
          'Algunos flujos estructurados, pero persisten transferencias manuales entre áreas clave.',
          'Flujos de información definidos y mayormente sistematizados; excepciones acotadas.',
          'La información fluye integrada entre áreas y sistemas; aprobaciones digitales con trazabilidad.'
        ]
      },
      {
        codigo: '2.08',
        nombre: 'Mejora continua de procesos',
        objetivo: 'Determinar si existen mecanismos para detectar y resolver problemas de proceso, o cada crisis se apaga y se olvida.',
        queObservar: 'P-2.08. ¿El mismo problema se repite hace meses? ¿Dónde se conversa y quién lo resuelve?',
        niveles: [
          'Los problemas se apagan como incendios y se olvidan; nada cambia.',
          'Mejoras ocasionales por iniciativa individual, sin método ni registro.',
          'Existen instancias para levantar problemas, pero la resolución es inconsistente.',
          'Mecanismo sistemático para detectar, priorizar y resolver problemas, con análisis de causa raíz.',
          'Mejora continua como rutina: el equipo detecta desviaciones a diario y las resuelve en el nivel adecuado.'
        ]
      }
    ]
  },
  {
    id: 3,
    nombre: 'Tecnología',
    descripcion: 'Ecosistema de sistemas, datos e IA',
    practicas: [
      {
        codigo: '3.01',
        nombre: 'Cobertura funcional de los sistemas',
        objetivo: 'Determinar qué procesos están cubiertos por sistemas y qué vacíos rellena Excel.',
        queObservar: 'P-3.01. Construir el inventario: ¿qué sistema soporta cada proceso? ¿Dónde aparece Excel?',
        niveles: [
          'Sin sistemas de soporte relevantes; todo corre en planillas.',
          'Sistemas mínimos o antiguos que cubren solo el registro contable básico.',
          'El ERP u otros sistemas cubren procesos centrales, pero vacíos importantes se llenan con Excel.',
          'Los sistemas cubren la mayoría de los procesos del área; brechas identificadas y acotadas.',
          'Cobertura funcional completa y coherente; el Excel no suple vacíos estructurales.'
        ]
      },
      {
        codigo: '3.02',
        nombre: 'Integración entre sistemas',
        objetivo: 'Determinar si los sistemas conversan entre sí o cada frontera implica re-ingreso manual de datos.',
        queObservar: 'P-3.02. Cada "bajo de un sistema y subo al otro" es un punto de quiebre. Mapearlos todos.',
        niveles: [
          'Sistemas totalmente aislados; los datos se re-digitan entre uno y otro.',
          'Integración casi nula; exportar e importar archivos a mano es la práctica habitual.',
          'Integración parcial entre algunos sistemas; persisten puntos de quiebre relevantes.',
          'Sistemas mayormente integrados; pocas transferencias manuales, conocidas y controladas.',
          'Integración fluida y automática; los datos circulan sin intervención manual.'
        ]
      },
      {
        codigo: '3.03',
        nombre: 'Calidad y gobernanza de datos',
        objetivo: 'Determinar si existe una fuente única de verdad confiable, o versiones paralelas de la misma cifra.',
        queObservar: 'P-3.03. ¿Cuánto tiempo se va en cuadrar cifras que "deberían" ser iguales?',
        niveles: [
          'Versiones paralelas de la misma cifra; nadie confía plenamente en los datos.',
          'Los datos maestros existen pero están desactualizados o duplicados; conciliar cifras toma tiempo.',
          'Fuente principal definida para los datos críticos, con problemas de calidad recurrentes.',
          'Fuente única de verdad establecida para lo crítico, con responsables y calidad razonable.',
          'Gobernanza de datos formal: maestros administrados, calidad monitoreada, cifras únicas en toda el área.'
        ]
      },
      {
        codigo: '3.04',
        nombre: 'Explotación de datos y reportería',
        objetivo: 'Determinar si el reporting es self-service / BI o construcción manual dependiente de personas.',
        queObservar: 'P-3.04. ¿Qué pasa si quien arma el reporte se enferma la semana del directorio?',
        niveles: [
          'Todo reporte se arma a mano en Excel, cada vez, por una persona específica.',
          'Reportes recurrentes semi-manuales; alta dependencia de quien los construye.',
          'Existe BI o reportes automatizados para algunas necesidades; el resto sigue siendo manual.',
          'La reportería crítica está automatizada; los usuarios acceden a dashboards con datos confiables.',
          'Self-service instalado: el equipo explora datos por sí mismo y el esfuerzo está en el análisis, no en armar reportes.'
        ]
      },
      {
        codigo: '3.05',
        nombre: 'Uso real vs. capacidad instalada',
        objetivo: 'Determinar qué porcentaje del potencial de los sistemas actuales se usa, y por qué no más.',
        queObservar: 'P-3.05. La brecha capacidad-uso es oportunidad sin costo de licencia. ¿La causa es capacitación, tiempo o diseño?',
        niveles: [
          'Se usa una fracción mínima del sistema; incluso funciones básicas se subutilizan.',
          'Uso bajo; funcionalidad relevante sin explotar por desconocimiento generalizado.',
          'Uso medio: funciones básicas dominadas, capacidades avanzadas sin aprovechar.',
          'Uso alto de la capacidad instalada; brechas de uso identificadas y con plan de cierre.',
          'Explotación plena y evolutiva: se buscan nuevas capacidades del sistema antes de comprar otro.'
        ]
      },
      {
        codigo: '3.06',
        nombre: 'Adopción de IA',
        objetivo: 'Determinar el uso actual de IA (formal e informal), y si existe gobernanza o es adopción espontánea.',
        queObservar: 'P-3.06. La adopción informal es señal de demanda; los power users son futuros agentes de cambio.',
        niveles: [
          'Sin uso de IA ni interés manifiesto.',
          'Uso aislado e informal por cuenta propia (ej. ChatGPT), sin conocimiento de la jefatura.',
          'Varias personas usan IA informalmente; hay demanda evidente, sin lineamientos.',
          'Uso de IA reconocido y promovido, con primeros casos formales y lineamientos básicos.',
          'IA gobernada y escalada: casos de uso formales, política clara y medición de impacto.'
        ]
      },
      {
        codigo: '3.07',
        nombre: 'Capacidad de TI para habilitar',
        objetivo: 'Determinar si TI acelera o bloquea la incorporación de herramientas (políticas, seguridad, arquitectura SAP ECC).',
        queObservar: 'P-3.07. Entrevista al Gerente TI: restricciones, roadmap SAP, apetito por pilotos.',
        niveles: [
          'TI bloquea de facto cualquier herramienta nueva; no hay canal de solicitud claro.',
          'Procesos de aprobación lentos y difusos; los proyectos mueren en el camino.',
          'Existe gobernanza TI, pero es rígida; adoptar algo nuevo toma meses.',
          'Gobernanza clara y razonable; TI actúa como contraparte que habilita con controles.',
          'TI como socio habilitante: marco de seguridad ágil, arquitectura preparada (ej. side-by-side sobre el ERP) y disposición a pilotear.'
        ]
      }
    ]
  },
  {
    id: 4,
    nombre: 'Personas',
    descripcion: 'Capacidades, disposición al cambio y liderazgo interno',
    practicas: [
      {
        codigo: '4.01',
        nombre: 'Competencias digitales y analíticas',
        objetivo: 'Determinar el nivel real de habilidades del equipo: desde Excel básico hasta mentalidad digital.',
        queObservar: 'P-4.01. Distinguir "usa bien Excel" de "tiene mentalidad digital": son perfiles distintos para adoptar IA.',
        niveles: [
          'Manejo tecnológico muy bajo; temor o rechazo a las herramientas.',
          'Ofimática básica (Excel operativo) sin mentalidad digital.',
          'Buen manejo de herramientas tradicionales; competencias analíticas concentradas en pocas personas.',
          'Equipo competente digitalmente, con capacidad analítica distribuida y apertura a nuevas herramientas.',
          'Cultura digital instalada: el equipo domina sus herramientas, analiza datos con autonomía y aprende continuamente.'
        ]
      },
      {
        codigo: '4.02',
        nombre: 'Desarrollo de capacidades',
        objetivo: 'Determinar si existe identificación de brechas y un plan de formación, o el desarrollo es azaroso.',
        queObservar: 'P-4.02. ¿La última capacitación relevante cuándo fue y quién la decidió?',
        niveles: [
          'No hay desarrollo; se aprende "a la mala" en el puesto.',
          'Capacitaciones esporádicas y reactivas, sin relación con brechas reales.',
          'Brechas identificadas informalmente; formación ocasional sin plan.',
          'Mapa de brechas definido y plan de formación en ejecución para los roles clave.',
          'Desarrollo sistemático: matriz de habilidades viva, plan por persona y medición de avance.'
        ]
      },
      {
        codigo: '4.03',
        nombre: 'Dependencia de personas clave',
        objetivo: 'Determinar cuánto conocimiento crítico vive en una sola persona sin documentar.',
        queObservar: 'P-4.03. "Si X no está, eso no sale" = riesgo operacional crítico. Escala en la priorización.',
        niveles: [
          'Procesos críticos dependen de una sola persona, sin documentación ni respaldo.',
          'Alta dependencia de personas clave; documentación mínima.',
          'Dependencia parcial: algunos procesos con respaldo, otros concentrados en una persona.',
          'Procesos clave documentados y con respaldo definido; la operación resiste ausencias.',
          'Conocimiento distribuido y documentado; rotación y vacaciones no afectan la operación.'
        ]
      },
      {
        codigo: '4.04',
        nombre: 'Conciencia y disposición al cambio',
        objetivo: 'Determinar si el equipo entiende por qué cambiar y quiere hacerlo (línea base Awareness/Desire de ADKAR).',
        queObservar: 'P-4.04. "¿Qué harías con el tiempo liberado?" — silencio o "no sé" puede ser miedo al reemplazo.',
        niveles: [
          'No se percibe necesidad de cambiar; resistencia explícita o indiferencia.',
          'Conciencia difusa de la necesidad; predomina el temor (ej. al reemplazo).',
          'El equipo entiende por qué cambiar, con disposición mixta: algunos abiertos, otros resistentes.',
          'Conciencia y deseo mayoritarios: el equipo pide mejoras y ve el cambio como oportunidad.',
          'Equipo protagonista del cambio: propone iniciativas, participa en el diseño y arrastra a los indecisos.'
        ]
      },
      {
        codigo: '4.05',
        nombre: 'Experiencias previas de cambio',
        objetivo: 'Determinar si los cambios anteriores dejaron capacidad instalada o cicatrices de resistencia.',
        queObservar: 'P-4.05. ¿Participaron en el diseño del último cambio o se los impusieron?',
        niveles: [
          'Experiencias previas traumáticas que dejaron rechazo activo a nuevos proyectos.',
          'Cambios anteriores mal gestionados; escepticismo del tipo "ya lo intentamos y no funcionó".',
          'Experiencias mixtas; algunos cambios funcionaron, pero sin aprendizaje capturado.',
          'Cambios recientes bien gestionados que dejaron confianza y aprendizajes.',
          'Historial de cambios exitosos con método; la organización sabe cambiar y lo ve como capacidad propia.'
        ]
      },
      {
        codigo: '4.06',
        nombre: 'Liderazgo interno para el cambio',
        objetivo: 'Determinar si existen líderes y power users capaces de traccionar la adopción internamente, o todo dependería del consultor.',
        queObservar: 'P-4.06. ¿El gerente nombra a alguien de inmediato? Si no, hay vacío de liderazgo técnico.',
        niveles: [
          'Nadie podría liderar una automatización; todo dependería de externos.',
          'Hay interés individual, pero sin capacidad técnica ni mandato.',
          'Existe al menos una persona con perfil para liderar, sin rol formal.',
          'Referentes internos identificados (power users) capaces de liderar la adopción con apoyo externo.',
          'Red interna de agentes de cambio con mandato formal; los externos aceleran, no sostienen.'
        ]
      }
    ]
  }
]

export const TOTAL_PRACTICAS = RUBRICA.reduce((acc, d) => acc + d.practicas.length, 0)

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
