---
name: telos-ui-kit
description: >
  Build React components, UI screens, dashboards, and artifacts using the official Telos Design System (telos-ui-kit).
  Use this skill whenever the user asks to create any interface, component, screen, prototype, or visual tool for
  Telos Consultoría — telos.cl. Triggers on: "crear un componente Telos", "pantalla de Telos", "interfaz para Telos",
  "usa el design system de Telos", "usa el ui-kit de Telos", "haz una vista", "diseña un formulario Telos",
  "dashboard Telos", "botón Telos", or any request to build React/frontend/Astro UI within the Telos ecosystem.
  Always use this skill when the word Telos appears alongside any UI/frontend/design request.
---

# Telos UI Kit Skill

Guía para crear componentes y pantallas usando el Design System oficial de Telos Consultoría (www.telos.cl).

**Stack base:** Astro 5 + Tailwind CSS v3 + lucide-astro  
**Fuentes:** Noto Sans / Helvetica Neue (body + display) · DM Mono (eyebrows, captions, metadata)  
**Referencia visual:** Brand Identity System VF · 2026

---

## Tokens de marca

### Paleta de colores

| Token Tailwind      | Hex       | Rol                                        |
|---------------------|-----------|--------------------------------------------|
| `black-forest`      | `#243010` | Color principal de marca, CTAs, textos clave, fondos oscuros |
| `dust-grey`         | `#D6D5C9` | Fondos secundarios, secciones alternadas   |
| `ash-grey`          | `#B9BAA3` | Eyebrows, bordes, acentos tenues, captions |
| `ink`               | `#1A1A1A` | Texto corriente sobre fondo blanco         |
| White               | `#FFFFFF` | Fondo primario (blanco carry the work)     |

**Regla mnemotécnica del brand guide:**  
> "White carries the work. Black Forest signs it. Greys — Dust and Ash — do the structural work between."

---

### Paleta extendida — gráficos y visualizaciones

Colores adicionales **exclusivos para gráficos** (barras, líneas, pie, donut, scatter). No se usan en UI ni en tipografía — solo como series de datos. Derivan del verde Black Forest como ancla y se extienden con un azul acero y neutros calibrados.

**Notas de diseño:**
- El burgundy/rojo fue descartado explícitamente — no usar en la marca Telos por similitud con una consultora anterior.
- El azul `#3A5F7A` funciona como complementario frío del verde y es el segundo color más visible en gráficos sobre fondo blanco.
- Los colores están ordenados por orden de uso recomendado en series de datos.

| # Serie | Nombre          | Hex       | Descripción                                      |
|---------|-----------------|-----------|--------------------------------------------------|
| 1       | Forest          | `#243010` | Verde Black Forest — serie principal, el más pesado visualmente |
| 2       | Steel Blue      | `#3A5F7A` | Azul acero frío — contrasta con Forest sin romper el tono sobrio |
| 3       | Forest Light    | `#3D4F2A` | Verde bosque claro — variación cálida de Forest para segunda barra |
| 4       | Slate           | `#556270` | Gris azulado — neutro funcional para series terciarias |
| 5       | Sage            | `#7A9E7E` | Verde salvia — más claro, ideal para áreas en gráficos de línea |
| 6       | Guinda          | `#6B1A2A` | Rojo guinda oscuro — para destacar, alertas, valores negativos o series que requieren contraste máximo |
| 7       | Ash Chart       | `#B9BAA3` | Ash Grey del sistema — para valores de referencia o totales |
| 8       | Dust Chart      | `#D6D5C9` | Dust Grey — fondo de barras inactivas o valores esperados |

**Uso en Recharts / Chart.js (JSX):**
```jsx
const telosChartColors = [
  '#243010', // Forest — serie 1
  '#3A5F7A', // Steel Blue — serie 2
  '#3D4F2A', // Forest Light — serie 3
  '#556270', // Slate — serie 4
  '#7A9E7E', // Sage — serie 5
  '#6B1A2A', // Guinda — serie 6
]

// Ejemplo Recharts — BarChart con 2 series
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

<BarChart data={data}>
  <Bar dataKey="real"       fill={telosChartColors[0]} />
  <Bar dataKey="proyectado" fill={telosChartColors[1]} />
</BarChart>
```

**Uso en PowerPoint (10 slots del theme):**

| Slot                | Color             | Hex       |
|---------------------|-------------------|-----------|
| Texto oscuro 1      | Ink               | `#1A1A1A` |
| Texto claro 1       | White             | `#FFFFFF` |
| Texto oscuro 2      | Black Forest      | `#243010` |
| Texto claro 2       | Dust Grey         | `#D6D5C9` |
| Acento 1            | Black Forest      | `#243010` |
| Acento 2            | Steel Blue        | `#3A5F7A` |
| Acento 3            | Forest Light      | `#3D4F2A` |
| Acento 4            | Slate             | `#556270` |
| Acento 5            | Sage              | `#7A9E7E` |
| Acento 6            | Ash Grey          | `#B9BAA3` |

PowerPoint genera automáticamente tonos claros y oscuros de cada acento — por eso los primeros acentos deben ser los colores más usados (Forest y Steel Blue).

### Tipografía

```css
/* Display / H1 — Noto Sans 500, 56/60, tracking -2.5% */
font-family: "Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
font-weight: 500;
font-size: clamp(2.5rem, 4vw, 3.5rem);
line-height: 1.07;
letter-spacing: -0.025em;

/* H2 — Noto Sans 500, 32/36, tracking -2% */
font-size: clamp(1.75rem, 2.5vw, 2rem);
letter-spacing: -0.02em;

/* H3 — Noto Sans 500, 22/28 */
font-size: 1.375rem;
line-height: 1.27;

/* Body — Noto Sans 400, 16/25 */
font-size: 1rem;
line-height: 1.5625;

/* Caption — Noto Sans 400, 13/19 */
font-size: 0.8125rem;
line-height: 1.46;

/* Eyebrow — DM Mono 500, 11px, +18% tracking, UPPERCASE */
font-family: "DM Mono", "Courier New", monospace;
font-size: 0.6875rem;
letter-spacing: 0.18em;
text-transform: uppercase;
```

---

## Tailwind config de referencia

```js
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  theme: {
    extend: {
      colors: {
        'black-forest': '#243010',
        'dust-grey':    '#D6D5C9',
        'ash-grey':     '#B9BAA3',
        'ink':          '#1A1A1A',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"DM Mono"', '"Courier New"', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

---

## Gradiente Forest (efecto vignette multicapa) ⭐

Este es el tratamiento de fondo oscuro canónico de Telos. **Nunca usar `bg-black-forest` plano** para secciones hero o CTA. El gradiente crea un efecto de reflejo/sombra más claro en el centro y oscurece las esquinas, como un viñeteo fotográfico sobre verde oscuro.

```css
/* Gradiente Forest estándar — usar siempre vía style inline */
background:
  radial-gradient(ellipse at top left,     #111a06 0%, rgba(17,26,6,0) 45%),
  radial-gradient(ellipse at bottom right, #111a06 0%, rgba(17,26,6,0) 45%),
  radial-gradient(ellipse at center,       #2f4012 0%, #243010 55%, #1a2408 100%);
```

> ⚠️ **CRÍTICO — no usar `transparent`:** La palabra clave `transparent` en CSS equivale a `rgba(0,0,0,0)` en Chrome y Safari. Al interpolar desde `#111a06` hacia `transparent`, el navegador pasa por negro puro, aplastando el efecto radial y haciendo que el fondo se vea como un rectángulo oscuro uniforme (sin viñeta visible). Siempre usar `rgba(17,26,6,0)` — el mismo color de la parada inicial pero con alfa cero — para que la interpolación se mantenga dentro de la familia verde.

**Cómo funciona el efecto de reflejo:**
- Las elipsis de esquina (`top left` y `bottom right`) parten de `#111a06` (casi negro) y se desvanecen hacia `rgba(17,26,6,0)` → crean las zonas de sombra/viñeta en verde oscuro, no en negro.
- El centro (`#2f4012`) es notablemente más claro que `#243010` (Black Forest puro) → genera el "reflejo" o luminosidad central que da profundidad.
- El anillo intermedio (`#243010` a 55%) ancla el color de marca.
- Resultado: fondo que respira, con profundidad volumétrica real. Las esquinas oscurecen en verde, no en negro.

**Requisito de altura mínima:** la sección debe tener al menos `py-16` (128px total) para que los radiales tengan espacio físico para separarse del centro. Con secciones muy bajas el efecto también se aplana.

**En artifacts JSX/React:**
```jsx
const forestGradient = `
  radial-gradient(ellipse at top left,     #111a06 0%, rgba(17,26,6,0) 45%),
  radial-gradient(ellipse at bottom right, #111a06 0%, rgba(17,26,6,0) 45%),
  radial-gradient(ellipse at center,       #2f4012 0%, #243010 55%, #1a2408 100%)
`

// Uso:
<section style={{ background: forestGradient }}>
  {/* contenido en blanco */}
</section>
```

**Secciones que usan el Forest gradient:**
- Heroes de página (cfo, excelencia-organizacional, servicios oscuro)
- Bloque Propósito (nosotros)
- CTAs finales de alta jerarquía (CtaFinal.astro)

---

## Iconografía — Lucide

El sistema de iconos es **Lucide**. Librería open source, stroke-based, consistente con la estética hairline de Telos.

| Contexto             | Paquete            | Import                                      |
|----------------------|--------------------|---------------------------------------------|
| Astro (.astro)       | `lucide-astro`     | `import { NombreIcono } from 'lucide-astro'` |
| React / artifact JSX | `lucide-react`     | `import { NombreIcono } from 'lucide-react'` |

`lucide-react` está disponible en artifacts de Claude.ai sin instalación.

### Uso estándar

```jsx
// En Astro
import { ArrowRight, Compass, Search } from 'lucide-astro'

<Compass size={24} strokeWidth={1.5} aria-hidden="true" />
```

```jsx
// En artifact React / JSX
import { ArrowRight, Compass, Search } from 'lucide-react'

<Compass size={24} strokeWidth={1.5} aria-hidden="true" />
```

### Reglas de uso en Telos

- **`strokeWidth` siempre `1.5`** — los iconos con stroke 2 (el default de Lucide) pesan demasiado y rompen la estética hairline de la marca.
- **`aria-hidden="true"`** en todos los iconos decorativos. Si el ícono porta significado sin texto acompañante, usar `aria-label` en el elemento contenedor.
- **Tamaños canónicos:**

| Uso                          | `size` |
|------------------------------|--------|
| Caja de ícono de servicio (48×48 px) | `24`   |
| CTA flecha inline            | `16`   |
| Ícono en paso de proceso     | `24`   |
| Ícono en footer / social     | `16`   |
| Ícono hero / ilustración     | `36–40` |

- **Color:** heredado del contenedor (`currentColor` por defecto en Lucide). Controlar con clases de texto: `text-ash-grey`, `text-black-forest`, `text-white`, etc. No pasar `color` como prop directamente.

### Iconos usados en el sitio (referencia)

```jsx
// Servicios y proceso
import { Compass, RefreshCw, Search, TrendingUp } from 'lucide-react'  // cards de servicios
import { ScanSearch, PenTool, Rocket, Anchor }    from 'lucide-react'  // pasos del proceso

// Herramientas Lean
import {
  GitFork, ClipboardList, Layers, BarChart2,
  CalendarClock, BookOpen, Footprints,
} from 'lucide-react'

// Navegación y UI
import { ArrowRight, Menu, X }   from 'lucide-react'  // header / CTAs
import { Linkedin }              from 'lucide-react'  // footer social
import { Users }                 from 'lucide-react'  // placeholder equipo
import { Image as ImageIcon }    from 'lucide-react'  // placeholder imagen blog
```

### Patrón: caja de ícono con hover

Caja cuadrada de 48×48 px con borde y transición al pasar el cursor. Patrón estándar en cards de servicio y herramientas.

```jsx
<div className="w-12 h-12 border border-dust-grey group-hover:border-ash-grey transition-colors duration-200 flex items-center justify-center shrink-0 text-ash-grey group-hover:text-black-forest">
  <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
</div>
```

En secciones oscuras (Forest), invertir los colores:
```jsx
<div
  className="tool-icon-box"
  style={{
    width: 48, height: 48, flexShrink: 0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#D6D5C9', color: '#243010',
    transition: 'background-color 0.25s ease, color 0.25s ease',
  }}
>
  <Compass size={20} strokeWidth={1.2} aria-hidden="true" />
</div>
{/* Al activarse (acordeón abierto): backgroundColor '#243010', color '#FFFFFF' */}
```

---

## Componentes canónicos

### Eyebrow (etiqueta de sección)

**Sobre fondo blanco:**
```jsx
<p className="font-mono text-xs uppercase tracking-widest text-ash-grey mb-4">
  Nuestra metodología
</p>
```

**Sobre fondo `bg-dust-grey`:** usar `text-black-forest/50` en lugar de `text-ash-grey` (el contraste ash/dust es ~1.5:1 — ilegible).
```jsx
<p className="font-mono text-xs uppercase tracking-widest text-black-forest/50 mb-4">
  Situaciones comunes
</p>
```

**Sobre fondo Forest (oscuro):** usar `text-white/50`.
```jsx
<p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-5">
  Senior Consultant · Independent
</p>
```

---

### Botón primario (CTA principal)
```jsx
<a
  href="/contacto"
  className="inline-flex items-center justify-center bg-black-forest text-white font-sans font-medium text-sm px-6 py-3 hover:bg-opacity-90 transition-colors duration-150"
>
  Agenda una conversación
</a>
```

### Botón secundario (outline)
```jsx
<a
  href="/servicios"
  className="inline-flex items-center justify-center border border-black-forest text-black-forest font-sans font-medium text-sm px-6 py-3 hover:bg-dust-grey transition-colors duration-150"
>
  Ver servicios
</a>
```

### Botón outline sobre fondo Forest
```jsx
<a
  href="/contacto"
  className="inline-flex items-center justify-center border border-white text-white font-sans font-medium text-sm px-8 py-4 hover:bg-white hover:text-black-forest transition-colors duration-200"
>
  Conversemos
</a>
```

---

### Card de servicio (con hover y ícono)
```jsx
import { Compass, ArrowRight } from 'lucide-react'

<div className="group border border-dust-grey p-8 hover:border-ash-grey transition-colors duration-200 flex flex-col">
  {/* Caja de ícono 48×48 */}
  <div className="w-12 h-12 border border-dust-grey group-hover:border-ash-grey transition-colors duration-200 mb-6 flex items-center justify-center shrink-0 text-ash-grey group-hover:text-black-forest">
    <Compass size={24} strokeWidth={1.5} aria-hidden="true" />
  </div>

  {/* Eyebrow número */}
  <p className="font-mono text-xs uppercase tracking-widest text-ash-grey mb-3">01</p>

  {/* Título */}
  <h3 className="font-sans text-xl font-bold text-black-forest mb-3">Estrategia</h3>

  {/* Descripción */}
  <p className="text-sm text-ink/70 leading-relaxed mb-8 flex-1">
    Muchas empresas creen tener una estrategia. Verificamos si realmente la tienen.
  </p>

  {/* CTA flecha */}
  <a href="/servicios" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-black-forest group-hover:gap-3 transition-all duration-200 mt-auto">
    Ver más
    <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
  </a>
</div>
```

---

### Separadores en grids (gap-px)

Para grids donde se quieren líneas divisorias delgadas entre celdas, usar `gap-px` sobre el contenedor con fondo `ash-grey/30`, y fondo blanco (o el color de la sección) en cada celda. Esto evita borders individuales por celda.

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-ash-grey/30">
  {items.map(item => (
    <div className="bg-white p-8 lg:p-10 flex flex-col">
      {/* contenido */}
    </div>
  ))}
</div>
```

---

### Cita destacada / blockquote

```jsx
<div className="border-l-2 border-ash-grey pl-6">
  <p className="font-sans text-lg text-ink/60 italic leading-relaxed">
    &#8220;Frase importante del cliente o del contenido.&#8221;
  </p>
</div>
```

**Variante sobre fondo oscuro (Forest):**
```jsx
{/* No usar border-l aquí — la frase va centrada y grande */}
<blockquote
  className="font-sans font-medium leading-relaxed text-white/95 text-center"
  style={{ fontSize: 'clamp(1.75rem, 2.5vw, 2.25rem)' }}
>
  {proposito}
</blockquote>
```

---

### Etiquetas / badges en tablas o listas (ancho fijo obligatorio)

> ⚠️ **REGLA CRÍTICA — siempre ancho fijo en columnas de etiquetas.**
> Cuando varias etiquetas/badges aparecen en una columna (tabla, lista, acordeón), **nunca** usar ancho automático (`width: fit-content` o sin `w-*`). Cada etiqueta toma el ancho de su texto y la columna se ve irregular. Usar siempre `w-28` (112 px) o `w-32` (128 px) con `text-center` para que todas las celdas sean idénticas visualmente.

**Patrón correcto — etiqueta en columna de tabla:**
```jsx
{/* ✅ Ancho fijo — todas las etiquetas iguales */}
<span className="inline-flex items-center justify-center w-28 border border-ash-grey font-mono text-xs text-ink/70 px-2 py-1">
  Understands
</span>

{/* ❌ Incorrecto — ancho variable según texto */}
<span className="border border-ash-grey font-mono text-xs text-ink/70 px-2 py-1">
  Understands
</span>
```

**Guía de anchos según longitud máxima del texto en la columna:**

| Texto más largo en la columna | Clase Tailwind | px equivalente |
|-------------------------------|----------------|----------------|
| Hasta ~8 caracteres           | `w-24`         | 96 px          |
| Hasta ~12 caracteres          | `w-28`         | 112 px         |
| Hasta ~16 caracteres          | `w-32`         | 128 px         |
| Hasta ~20 caracteres          | `w-36`         | 144 px         |

Si se usa en un `<table>` HTML, aplicar ancho fijo en la celda `<td>` o en el `<th>` con `w-28` o `style={{ width: 112 }}`, no en el badge interno.

**Patrón completo: fila de tabla con ícono + etiqueta + descripción + badge lateral:**
```jsx
<div className="grid items-start py-5 border-t border-dust-grey"
     style={{ gridTemplateColumns: '1.5rem 9rem 1fr 7rem', gap: '1.5rem' }}>

  {/* Columna 1: ícono */}
  <span className="text-ash-grey mt-0.5">
    <CircleDot size={16} strokeWidth={1.5} aria-hidden="true" />
  </span>

  {/* Columna 2: etiqueta — ancho fijo */}
  <span className="inline-flex items-center justify-center w-28 border border-ash-grey font-mono text-xs text-ink/70 px-2 py-1 shrink-0">
    Understands
  </span>

  {/* Columna 3: descripción — crece */}
  <p className="font-sans text-sm text-ink/80 leading-relaxed">
    Interpreta señales contextuales y prioriza entradas según la tarea.
  </p>

  {/* Columna 4: limitación — ancho fijo, alineada a la derecha */}
  <span className="inline-flex items-center justify-center w-24 border border-dust-grey font-mono text-xs text-ash-grey px-2 py-1 shrink-0 justify-self-end">
    Info
  </span>

</div>
```

---

### Monograma VF (Logo)

El monograma usa **tres líneas paralelas equidistantes (triple hairline)** — una por cada pilar: Estrategia, Excelencia, Transformación. El diagonal derecho de la V y el stem de la F son un tripleto compartido.

```jsx
{/* SVG del monograma — simplificado para uso digital */}
<svg
  width="36" height="36"
  viewBox="0 0 36 36"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
  aria-hidden="true"
>
  <rect x="1.5" y="1.5" width="33" height="33" rx="3"
    stroke="#243010" strokeWidth="1.5" />
  <text
    x="18" y="24"
    textAnchor="middle"
    fontFamily="sans-serif"
    fontSize="13"
    fontWeight="700"
    fill="#243010"
  >VF</text>
</svg>
```

**Lockup completo (wordmark):**
```jsx
<a href="/" className="inline-flex items-center gap-3" aria-label="Telos — Inicio">
  {/* Monograma SVG arriba */}
  <span className="font-sans font-semibold text-xl tracking-tight text-black-forest leading-none">
    Telos
  </span>
  <span className="font-sans text-sm text-ash-grey leading-none hidden sm:inline" aria-hidden="true">—</span>
  <span className="font-sans text-sm text-ash-grey leading-none hidden sm:inline">
    Consultores
  </span>
</a>
```

**Reglas de uso:**
- Mínimo digital: 24px (sin tagline debajo de esa medida)
- Clear space: igual al alto del monograma en todos los lados
- Color único en toda la marca: Black Forest `#243010` sobre blanco; blanco sobre Forest

---

### Contenedor estándar

```jsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* contenido */}
</div>
```

Para contenido editorial (artículos, propuestas):
```jsx
<div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* prose */}
</div>
```

---

## Uso de color en contextos específicos

### Contextos de aplicación

| Contexto                    | Fondo       | Texto principal  | Eyebrow                  |
|-----------------------------|-------------|------------------|--------------------------|
| **DOCUMENT** (default)      | `#FFFFFF`   | `#1A1A1A` (ink)  | `text-ash-grey`          |
| **SECTION** (énfasis suave) | `#D6D5C9`   | `#1A1A1A` (ink)  | `text-black-forest/50`   |
| **STATEMENT** (brand cover) | Forest grad | `#FFFFFF`        | `text-white/50`          |

### Hover en borders de cards
- Reposo: `border-dust-grey`
- Hover: `border-ash-grey`
- Nunca usar `border-black-forest` en hover de cards (reservado para CTA destacados)

---

## Instrucciones para artifacts en Claude.ai (JSX/React)

Cuando construyas un artifact JSX/React dentro de Claude.ai (sin acceso a npm ni Google Fonts), **simula los tokens** con variables JS y carga las fuentes desde Google Fonts inline:

```jsx
const telosTokens = {
  blackForest: '#243010',
  dustGrey:    '#D6D5C9',
  ashGrey:     '#B9BAA3',
  ink:         '#1A1A1A',
  white:       '#FFFFFF',

  // Gradiente Forest (efecto vignette con reflejo central)
  // ⚠️ Usar rgba(17,26,6,0) — nunca "transparent" (interpolaría por negro puro en Chrome/Safari)
  forestGradient: `
    radial-gradient(ellipse at top left,     #111a06 0%, rgba(17,26,6,0) 45%),
    radial-gradient(ellipse at bottom right, #111a06 0%, rgba(17,26,6,0) 45%),
    radial-gradient(ellipse at center,       #2f4012 0%, #243010 55%, #1a2408 100%)
  `,

  fontSans: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
  fontMono: '"DM Mono", "Courier New", monospace',
}
```

Inyectar Google Fonts en el artifact:
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
```

Construye los componentes manualmente replicando la estética Telos: fondo blanco como base, Black Forest como firma, tipografía limpia sin decoración innecesaria, bordes hairline, transiciones 150ms.

---

## Principios visuales Telos

1. **Light-first:** fondo blanco (#FFFFFF) como base, con secciones alternadas en Dust Grey (#D6D5C9). El negro Forest entra como acento de firma, no como fondo por defecto.
2. **Tres pilares visuales:** Estrategia (claridad), Excelencia (rigor), Transformación (movimiento) — cada patrón de diseño debe comunicar uno de estos valores.
3. **Tipografía monolítica:** Noto Sans para todo lo legible, DM Mono exclusivamente para eyebrows, captions y metadata — pequeño, en uppercase, tracking amplio.
4. **Restraint cromático:** solo 5 colores; nunca agregar colores externos al sistema. La riqueza viene de la combinación y las opacidades (`/70`, `/50`, `/30`).
5. **Hairlines sobre masas:** bordes de 1px/1.5px, nunca gruesos. Las separaciones son sutiles. El peso visual viene de la tipografía y el espacio, no de los colores.
6. **Black Forest como acción:** `#243010` es el color de acción principal — botones, links activos, estados hover de bordes. No diluir.
7. **Gradiente Forest para impacto:** las secciones de máximo impacto emocional (heroes, CTAs de cierre, statements de propósito) usan el gradiente radial multicapa con reflejo central, nunca el color plano.
8. **Espacio como mensaje:** padding generoso, nunca apretado. El espacio en blanco es intencional y comunica rigor.

---

## Componentes de layout frecuentes

### Hero 2 columnas (texto + imagen)
```jsx
<section className="py-20 lg:py-28">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Columna texto */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ash-grey mb-5">
          Eyebrow
        </p>
        <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-black-forest leading-tight mb-6">
          Título principal
        </h1>
        <p className="text-lg text-ink/80 leading-relaxed mb-10 max-w-lg">
          Subtítulo descriptivo.
        </p>
        {/* CTAs */}
      </div>
      {/* Columna imagen — hidden en mobile */}
      <div className="relative aspect-[4/3] hidden md:block overflow-hidden">
        <img src="/images/hero.png" alt="..." className="w-full h-full object-cover" loading="lazy" />
      </div>
    </div>
  </div>
</section>
```

### Sección de impacto máximo (Forest gradient)
```jsx
<section
  className="py-24"
  style={{
    background: `
      radial-gradient(ellipse at top left,     #111a06 0%, rgba(17,26,6,0) 45%),
      radial-gradient(ellipse at bottom right, #111a06 0%, rgba(17,26,6,0) 45%),
      radial-gradient(ellipse at center,       #2f4012 0%, #243010 55%, #1a2408 100%)
    `
  }}
>
  <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
    <p className="font-mono text-xs uppercase tracking-widest text-white/50 mb-5">
      Eyebrow
    </p>
    <h2 className="font-sans text-3xl sm:text-4xl font-bold mb-6">
      Título de impacto
    </h2>
    <p className="text-white/80 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
      Descripción.
    </p>
    <a
      href="/contacto"
      className="inline-flex items-center justify-center border border-white text-white font-sans font-medium text-sm px-8 py-4 hover:bg-white hover:text-black-forest transition-colors duration-200"
    >
      CTA label
    </a>
  </div>
</section>
```

### Tabla de entregables (estilo data table)
```jsx
<div className="border border-dust-grey divide-y divide-dust-grey">
  {items.map((item, i) => (
    <div key={i} className="flex items-center gap-6 px-6 py-5">
      <span className="font-mono text-sm text-ash-grey shrink-0 w-6" aria-hidden="true">
        {String(i + 1).padStart(2, '0')}
      </span>
      <span className="font-sans text-ink/80">{item}</span>
    </div>
  ))}
</div>
```

---

## Referencia rápida de clases Tailwind más usadas

```
/* Fondos */
bg-white · bg-dust-grey · bg-black-forest · bg-ink

/* Texto */
text-black-forest · text-ink · text-ink/80 · text-ink/70 · text-ink/60
text-ash-grey · text-white · text-white/80 · text-white/50
text-black-forest/50

/* Bordes */
border-dust-grey · border-ash-grey · border-black-forest · border-white

/* Tipografía */
font-sans · font-mono
font-bold · font-semibold · font-medium · font-normal
tracking-widest · tracking-tight

/* Transiciones */
transition-colors duration-150 · transition-colors duration-200
transition-all duration-200

/* Espaciado de sección */
py-16 · py-20 · py-24
```
