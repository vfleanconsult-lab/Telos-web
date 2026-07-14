# Módulo de Evaluación de Madurez Organizacional

Servicio web completo en `/evaluacion` para ejecutar diagnósticos de madurez multi-evaluador
con calibración y generación de resultados. Construido sobre el stack Astro + Supabase + Resend.

---

## Arquitectura general

```
/evaluacion
├── index.astro                        → Welcome page del evaluador (recibe ?token=)
├── admin.astro                        → Panel del consultor: crear evaluaciones, gestionar evaluadores
├── gracias.astro                      → Página post-envío (modo completado o pausado)
├── eval/[token].astro                 → Formulario de evaluación del evaluador
└── [evalId]/
    ├── calibracion.astro              → Sesión de calibración multi-evaluador
    └── resultado.astro                → Informe final con índice, radar, brecha, F&O

/api/evaluacion
├── crear.ts                           → Crea evaluación + evaluadores, envía emails
├── respuesta.ts                       → Guarda/actualiza respuesta individual (auto-save)
├── completar.ts                       → Email de resumen al terminar
├── pausar.ts                          → Email de recordatorio al salir a la mitad
├── consenso.ts                        → Guarda nota de consenso y comentario de calibración
├── auth.ts                            → Verifica token de evaluador
├── eval/[token].ts                    → Valida token y retorna datos del evaluador
└── [evalId]/
    ├── resultado.ts                   → Calcula y retorna métricas finales
    └── status.ts                      → Estado de completitud por evaluador

/data
├── rubrica.ts                         → Rúbrica completa (4 dimensiones × 5 prácticas)
├── email-evaluador.ts                 → Template HTML email invitación
├── email-completado.ts                → Template HTML email resumen al completar
└── email-pausado.ts                   → Template HTML email recordatorio al pausar

/types/evaluacion.ts                   → Interfaces TypeScript del módulo
/scripts/schema.sql                    → DDL de las 4 tablas en Supabase
```

---

## Base de datos (Supabase)

Proyecto: `jsvnedimselixowhzmkt`

### Tablas

| Tabla | Propósito |
|---|---|
| `evaluaciones` | Una fila por proceso de diagnóstico (empresa, RUT, fecha, rúbrica) |
| `evaluadores` | N evaluadores por evaluación; contiene el token UUID único |
| `respuestas` | Una fila por práctica × evaluador; upsert en auto-save |
| `consenso` | Nota acordada en calibración por práctica; también guarda comentarios especiales |

### Códigos especiales en `respuestas`

Las Fortalezas y Oportunidades se guardan en `respuestas` con `puntuacion = null` y los siguientes códigos:

| Código | Contenido |
|---|---|
| `__dim1_fortalezas` | Fortalezas de la dimensión Estrategia |
| `__dim1_oportunidades` | Oportunidades de la dimensión Estrategia |
| `__dim2_fortalezas` | Fortalezas de la dimensión Personas |
| `__dim2_oportunidades` | Oportunidades de la dimensión Personas |
| `__dim3_fortalezas` | Fortalezas de la dimensión Procesos |
| `__dim3_oportunidades` | Oportunidades de la dimensión Procesos |
| `__dim4_fortalezas` | Fortalezas de la dimensión Tecnología |
| `__dim4_oportunidades` | Oportunidades de la dimensión Tecnología |

### Códigos especiales en `consenso`

| Código | Contenido |
|---|---|
| `__final` | Comentario final del consultor (campo en resultado.astro) |

---

## Rúbrica

Archivo: `src/data/rubrica.ts`

- **4 dimensiones, en este orden:** Estrategia (6) → Procesos (8) → Tecnología (7) → Personas (6) = **27 prácticas totales** (`TOTAL_PRACTICAS` se deriva de `RUBRICA.reduce(...)`, ya no es un literal)
- Cada práctica tiene: `codigo` (ej. `2.03`), `nombre`, `objetivo` (objetivo de descubrimiento), `queObservar` (incluye prefijo de referencia `P-x.xx` a la Guía de Entrevista v2), y `niveles` (array de 5 descriptores, nivel 0–4)
- Escala de puntuación: 0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4 (sin cambios respecto a v1)
- Índice de madurez = (puntaje_consenso / 4) × 100 → clasificado en Crítico / Incipiente / En desarrollo / Consolidado

```
0–25%  → Crítico
26–50% → Incipiente
51–75% → En desarrollo
76–100% → Consolidado
```

> Rúbrica v2 (julio 2026): reemplaza la v1 de 20 prácticas (5 por dimensión). El desglose por
> dimensión ya no es parejo — usar siempre `dim.practicas.length`, nunca asumir 5 o 20 en código
> nuevo. `rubrica_id` default en la tabla `evaluaciones`: `madurez-4dim-v2`.

---

## Flujo completo

### 1. Consultor crea la evaluación (`/evaluacion/admin`)

1. Ingresa nombre empresa, RUT, fecha y hasta N evaluadores (nombre + email)
2. `POST /api/evaluacion/crear`:
   - Inserta en `evaluaciones`
   - Inserta en `evaluadores` (genera token UUID por evaluador)
   - Envía email de invitación a cada evaluador via Resend con enlace `https://www.telos.cl/evaluacion?token=...`
3. **Post-creación**: en la sección "Evaluaciones recientes" del admin puede:
   - Eliminar un evaluador (botón ×) → `DELETE /api/evaluacion/evaluador` (cascade borra sus respuestas)
   - Agregar un evaluador nuevo con nombre + email → `POST /api/evaluacion/agregar-evaluador` (crea y envía invitación)

### 2. Evaluador completa el formulario (`/evaluacion/eval/[token]`)

1. Accede por el enlace personal — el token identifica al evaluador sin login
2. Welcome page (`/evaluacion/index.astro`) muestra empresa y botón "Comenzar evaluación"
3. Formulario muestra las 20 prácticas agrupadas por dimensión. Jerarquía visual: nombre de práctica es el elemento más grande (`text-xl`); la dimensión aparece como eyebrow
4. Selector de nivel: **slider** de 0 a 4 en pasos de 0.5. Track con gradiente de color (rojo Inicial → verde Pleno) que avanza hasta el thumb. Muestra valor numérico + etiqueta en el color del nivel. Estado "sin evaluar" hasta el primer contacto
5. Auto-save debounced (800 ms) en cada cambio de puntuación o comentario → `POST /api/evaluacion/respuesta`
5. Al final de cada dimensión: campos "Fortalezas" y "Oportunidades" (también auto-save)
6. Barra de progreso superior actualiza en tiempo real
7. Al completar las 20 prácticas aparece botón "Salir de la evaluación" → llama `completar.ts` (email resumen) y redirige a `/evaluacion/gracias`
8. En cualquier momento: botón "Guardar y Cerrar" en el header → llama `pausar.ts` (email recordatorio) y redirige a `/evaluacion/gracias?modo=pausado`

### 3. Calibración (`/evaluacion/[evalId]/calibracion`)

1. El consultor abre la sesión con los evaluadores
2. Muestra prácticas ordenadas por brecha (mayor diferencia entre evaluadores primero)
3. Prácticas con brecha ≥ 1.0 se marcan visualmente en rojo
4. El consultor ingresa la nota de consenso por práctica → `POST /api/evaluacion/consenso`
5. Se muestran los comentarios de cada evaluador por práctica para apoyar la discusión

### 4. Resultado (`/evaluacion/[evalId]/resultado`)

Genera el informe final con:
- **Índice Global de Madurez** (número grande + badge de nivel)
- **Gráfico radar SVG** de las 4 dimensiones
- **Tabla por dimensión** con puntaje, índice y nivel
- **Prácticas con mayor brecha** entre evaluadores (top 10)
- **Fortalezas y Oportunidades** por dimensión (lo que registraron los evaluadores)
- **Comentarios por práctica** agrupados por dimensión
- **Comentario final del consultor** — textarea con auto-save en `consenso` (código `__final`)
- Botón Imprimir / PDF (print CSS incluido)

---

## Emails

Servicio: **Resend** (`RESEND_API_KEY` en Vercel env vars)
Remitente: `noreply@telos.cl`

| Evento | Asunto | Template |
|---|---|---|
| Invitación al evaluador | `Evaluación de madurez — [Empresa]` | `email-evaluador.ts` |
| Evaluación completada | `Evaluación guardada — [Empresa]` | `email-completado.ts` |
| Guardar y Cerrar (pausa) | `Recuerda completar tu evaluación — [Empresa]` | `email-pausado.ts` |

Todos los emails incluyen el enlace personal del evaluador para retomar o corregir.

---

## Variables de entorno

| Variable | Uso |
|---|---|
| `SUPABASE_URL` | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clave de servicio (bypasa RLS) |
| `RESEND_API_KEY` | API key de Resend para envío de emails |
| `ADMIN_RESET_EMAIL` | Email destino del enlace de recuperación de contraseña del panel admin (default `victor@telos.cl` si no está seteada) |

> `EVAL_ADMIN_KEY` quedó obsoleta — la contraseña del panel admin ya no se compara contra un env var, vive hasheada (scrypt) en la tabla `admin_credenciales`.

---

## Autenticación del panel admin

La contraseña de `/evaluacion/admin` se guarda hasheada (scrypt, `src/lib/password.ts`) en la tabla
`admin_credenciales` (fila única, `id = 1`) — ya no es un secreto plano en variable de entorno.

### Recuperación de contraseña

1. En el login (`admin.astro`) hay un botón "¿Olvidaste tu contraseña?" → `POST /api/evaluacion/solicitar-reset`
2. Genera un `reset_token` (UUID) con vencimiento de 1 hora, lo guarda en `admin_credenciales` y envía un email
   (vía Resend, template `email-reset-password.ts`) a `ADMIN_RESET_EMAIL` con el enlace
   `https://www.telos.cl/evaluacion/reset?token=...`
3. `/evaluacion/reset` (con el token en la URL) muestra un formulario para definir la nueva contraseña
4. `POST /api/evaluacion/actualizar-password` valida que el token coincida y no haya vencido, hashea la
   nueva contraseña y limpia `reset_token` / `reset_expira`

No hay flujo separado de "cambiar contraseña estando logueado" — solicitar el reset y usar el enlace cubre
ambos casos (olvido o cambio voluntario).

---

## Iteraciones del sprint (22–23 junio 2026)

| Commit | Descripción |
|---|---|
| `7c5ee0c` | Módulo completo inicial: admin, formulario, calibración, resultado, 6 rutas API, schema SQL, email invitación |
| `ccdfca8` | Fix estado save; botón "Salir" al completar; `completar.ts` + email resumen; página `gracias.astro` |
| `4295335` | Fix: TypeScript `as` en `define:vars` causaba SyntaxError en browser → todos los event listeners silenciosos |
| `972b200` | Welcome page con CTA por token; link admin; email apunta a `/evaluacion?token=`; comentarios en calibración |
| `4b57527` | Sección comentarios por práctica en resultado; campo "Comentario final del consultor" con auto-save |
| `fc28fc3` | Campos Fortalezas y Oportunidades al final de cada dimensión; sección F&O en resultado |
| `02cd0b9` | Botón "Guardar y Cerrar" en header; `pausar.ts` + email recordatorio; `gracias.astro` distingue modo pausado |
| `65758d4` | Documentación inicial del módulo en `docs/evaluacion.md` |
| `fd5b209` | Gestión post-creación: eliminar evaluador (DELETE) y agregar nuevo con email (POST) desde admin inline |
| `756dee7` | Rediseño visual: práctica → `text-xl`; dimensión de-enfatizada; 5 botones con color semántico + toggle +0.5 |
| `acbed02` | Slider de nivel (0–4, paso 0.5) con track degradado rojo→verde; display valor + etiqueta en color dinámico |
| `38d9ecc` | Limpieza de `queObservar`: eliminados prefijos internos P1., P8/P9., ↳ de toda la rúbrica |
| `46c16d5` | Thumb del slider reducido a 18px; borde fijo en `black-forest` (#243010) |

## Iteraciones del sprint (14 julio 2026)

| Cambio | Descripción |
|---|---|
| Rúbrica v2 | Migración de 20 a 27 prácticas (Estrategia 6 · Procesos 8 · Tecnología 7 · Personas 6), nuevo orden de dimensiones, campo `objetivo` por práctica visible en el formulario, prefijos `P-x.xx` de la Guía de Entrevista v2 mantenidos en `queObservar` |
| Clasificación | Etiquetas Crítico/Bajo/Medio/Avanzado → Crítico/Incipiente/En desarrollo/Consolidado (mismos cortes de %); etiquetas de nivel del slider → Inexistente/Incipiente/En desarrollo/Consolidada/Óptima |
| Calibración | Umbral de brecha ≥1,5 → ≥1,0; progreso `/20` hardcodeado → `TOTAL_PRACTICAS` dinámico |
| Fix Índice Global | El promedio dividía siempre por 4 dimensiones aunque faltaran por calibrar, subestimando el índice; ahora divide solo entre las dimensiones con consenso registrado |
| Emails | Denominador `/5` por dimensión (hardcodeado) → dinámico según prácticas reales de cada dimensión; copy actualizado a "27 prácticas en 4 dimensiones" |
