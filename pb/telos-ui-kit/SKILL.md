---
name: telos-ui-kit
description: "Build React components, UI screens, dashboards, and artifacts using the official Telos Design System (telos-ui-kit), including WCAG AA contrast rules."
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
| `ash-grey`          | `#B9BAA3` | SOLO bordes, líneas, fondos y números/íconos decorativos (aria-hidden). Nunca texto de menos de 18px (1.98:1 sobre blanco) |
| `ash-deep`          | `#5A5D4A` | Texto tenue pequeño: eyebrows, captions, folios, metadata (6.78:1 sobre blanco, 4.59:1 sobre Dust) |
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
- Contraste y combinaciones seguras: ver la sección "Contraste y accesibilidad (WCAG AA)" más abajo (Sage 2.99:1 sobre blanco; Forest/Guinda y Steel Blue/Slate casi indistinguibles en luminosidad).

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

/* Eyebrow — DM Mono 500, 12px (mínimo), +18% tracking, UPPERCASE */
font-family: "DM Mono", "Courier New", monospace;
font-size: 0.75rem;
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
        'ash-deep':     '#5A5D4A',
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

## Contraste y accesibilidad (WCAG AA) — reglas obligatorias

Auditoría 17-nov-2026 sobre el kit y telos.cl (ratios WCAG 2.x medidos). Texto principal (Ink, Forest, blanco) cumple de sobra. Los fallos estaban en texto pequeño tenue. Estas reglas tienen prioridad sobre cualquier snippet más abajo.

**Reglas**
1. `ash-grey #B9BAA3` **nunca** como color de texto menor a 18px (1.98:1 sobre blanco, 1.34:1 sobre Dust). Solo bordes, líneas, fondos y elementos decorativos con `aria-hidden="true"`.
2. Texto tenue pequeño (eyebrows, captions, folios, metadata, números de paso) → `ash-deep #5A5D4A`, sobre blanco **y** sobre Dust.
3. Sobre Forest/gradiente: texto tenue = `text-white/65` como mínimo (5.79:1 en el centro del gradiente). `text-white/50` prohibido para texto (4.13:1 en el centro).
4. Pisos de opacidad para texto: `text-ink/60` sobre blanco (4.54:1) es el mínimo. `text-black-forest/NN` sobre blanco: mínimo `/70` (5.34:1; `/60` = 3.93:1 falla). Sobre Dust: mínimo `/75` (5.01:1). `text-black-forest/50` nunca para texto.
5. Eyebrows y metadata en DM Mono: 12px mínimo (no 11px).
6. Si un ejemplo antiguo de este documento usa `#B9BAA3` / `text-ash-grey` para texto, o `11px`, léelo como `#5A5D4A` / `text-ash-deep` y `12px`.

**Pares aprobados (ratio)**

| Texto / fondo | Ratio | Uso |
|---|---|---|
| Ink / Blanco | 17.4 | Cuerpo |
| Forest / Blanco | 13.95 | Títulos, acción |
| Forest / Dust | 9.45 | Títulos sobre secciones Dust |
| Ink 80% / Blanco | 9.15 | Cuerpo secundario |
| Ink 70% / Blanco | 6.39 | Descripciones de card |
| Ash Deep / Blanco | 6.78 | Eyebrow, folio, caption |
| Ash Deep / Dust | 4.59 | Eyebrow sobre Dust |
| Blanco / Forest (centro) | 11.27 | Texto sobre gradiente |
| Blanco 80% / Forest | 9.49 | Texto secundario sobre Forest |
| Blanco 65% / Forest (centro) | 5.79 | Eyebrow sobre Forest |
| Ink 60% / Blanco | 4.54 | Piso: no bajar |

**Gráficos**
- No usar Forest y Guinda como series adyacentes (luminosidad 1.20:1). Tampoco Steel Blue con Slate (1.09:1) ni Forest Light con Slate (1.43:1).
- Tríada con buena separación de luminosidad: Forest → Steel Blue → Sage (2.06 y 2.27 entre vecinos).
- Sage (2.99:1 sobre blanco, 2.03:1 sobre Dust): solo como relleno con contorno Forest de 1px, nunca línea fina ni texto.
- Ash Chart y Dust Chart solo para referencia, totales o fondo, no para series principales.
- No depender solo del color: etiquetas directas en las series, marcadores o trazos distintos.

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
<p className="font-mono text-xs uppercase tracking-widest text-ash-deep mb-4">
  Nuestra metodología
</p>
```

**Sobre fondo `bg-dust-grey`:** usar `text-ash-deep` (4.59:1). `text-ash-grey` es ilegible sobre Dust (1.34:1) y `text-black-forest/50` también falla (2.69:1).
```jsx
<p className="font-mono text-xs uppercase tracking-widest text-ash-deep mb-4">
  Situaciones comunes
</p>
```

**Sobre fondo Forest (oscuro):** usar `text-white/65` (mínimo).
```jsx
<p className="font-mono text-xs uppercase tracking-widest text-white/65 mb-5">
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
  <p className="font-mono text-xs uppercase tracking-widest text-ash-deep mb-3">01</p>

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
  <span className="inline-flex items-center justify-center w-24 border border-dust-grey font-mono text-xs text-ash-deep px-2 py-1 shrink-0 justify-self-end">
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

## Documentos y Propuestas — Estilo Tipográfico Internacional (Diseño Suizo)

Esta sección rige el layout de entregables formales: propuestas de servicio, reportes,
informes de diagnóstico, y cualquier documento que Telos produzca para clientes.
La tipografía no se modifica — estas reglas operan sobre grilla, proporciones y espacio.

### Principio base

El Diseño Suizo trata el espacio en blanco como estructura, no como vacío.
En documentos Telos, esto se traduce en tres reglas:

1. **Todo elemento ocupa una posición racional** en una grilla de columnas y módulos.
2. **Los márgenes son proporcionales** — no decorativos. Definen el peso visual de la página.
3. **La jerarquía se lee sin color** — tamaño, peso y posición son suficientes.

### Sistema de grilla para documentos (A4 / carta)

Unidad modular base: **8px** (0.5rem). Todos los espaciados son múltiplos de esta unidad.

#### Márgenes de página

| Posición        | Medida | Equivalente rem |
|-----------------|--------|-----------------|
| Superior        | 48px   | 3rem            |
| Inferior        | 48px   | 3rem            |
| Interior (bind) | 56px   | 3.5rem          |
| Exterior        | 40px   | 2.5rem          |

> En documentos de una sola columna (PDF, propuesta digital), usar margen uniforme de 48px.

#### Columnas

| Tipo de documento           | Estructura de columnas               |
|-----------------------------|--------------------------------------|
| Propuesta / carta ejecutiva | 1 columna, max-width 640px centrado  |
| Reporte con datos           | 2 columnas: 2/3 texto + 1/3 sidebar  |
| Portada / cover             | Libre, anclada a grilla de 8px       |
| Tabla de entregables        | 4 columnas fijas (ver componentes)   |

#### Ritmo vertical (line grid)

El interlineado del cuerpo (`line-height: 1.5625` = 25px sobre 16px base) define la **unidad de ritmo vertical**. Todos los espaciados entre bloques deben ser múltiplos de esta unidad: 25px, 50px, 75px, 100px.

En Tailwind, usar `mb-6` (24px ≈ 25px), `mb-12` (48px ≈ 50px), `mb-20` (80px), `py-16` (64px).

### Jerarquía de información en documentos

Cuatro niveles funcionales — sin agregar colores, sin cambiar fuentes:

| Nivel | Elemento         | Tratamiento                                      | Rol                              |
|-------|------------------|--------------------------------------------------|----------------------------------|
| 0     | Metadata / folio | DM Mono · 11px · ash-grey · uppercase            | Número de página, fecha, versión |
| 1     | Eyebrow          | DM Mono · 11px · ash-grey · uppercase · tracking | Identifica bloque temático       |
| 2     | Título / H2      | Noto Sans 500 · 32px · black-forest · -2% track  | Tema principal del bloque        |
| 3     | Cuerpo           | Noto Sans 400 · 16px · ink · 1.5625 line-height  | Contenido                        |

> **Regla de separación entre niveles:** el espacio antes de un H2 es siempre el doble del espacio después. Esto ancla el título a su contenido y lo separa del bloque anterior.
> En CSS: `margin-top: 3rem; margin-bottom: 1.5rem`.

### Uso del espacio en blanco como estructura

**Regla de respiración:** ningún bloque de contenido ocupa más del 65% del ancho disponible cuando el texto es corrido (body copy). Las columnas anchas fatigan la lectura. Aplicar `max-w-2xl` (672px) o `max-w-prose` sobre el texto corrido.

### Separadores en documentos

El Diseño Suizo usa líneas, no espacios vacíos, para separar secciones de jerarquía equivalente. En Telos, los separadores son siempre hairline:

```jsx
{/* Separador de sección — entre bloques temáticos */}
<hr className="border-t border-dust-grey my-12" />

{/* Separador de datos — dentro de una tabla o lista */}
<hr className="border-t border-dust-grey my-0" />

{/* Separador de página — antes del folio */}
<hr className="border-t border-ash-grey mt-16 mb-4" />
```

> ⚠️ Nunca usar `border-black-forest` como separador — ese peso está reservado para CTAs y elementos de acción, no para estructura.

### Folio y metadata de documento

Elemento obligatorio en todo entregable formal. Va en el pie de página, alineado en la misma línea de base, usando solo Nivel 0.

```jsx
{/* Folio — pie de página de documento */}
<footer
  className="flex items-center justify-between pt-4"
  style={{ borderTop: '1px solid #B9BAA3' }}
>
  <span
    style={{
      fontFamily: '"DM Mono", "Courier New", monospace',
      fontSize: '0.6875rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#5A5D4A',
    }}
  >
    Propuesta de Servicios — Cliente
  </span>

  <span
    style={{
      fontFamily: '"DM Mono", "Courier New", monospace',
      fontSize: '0.6875rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#5A5D4A',
    }}
  >
    Telos · telos.cl
  </span>

  <span
    style={{
      fontFamily: '"DM Mono", "Courier New", monospace',
      fontSize: '0.6875rem',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color: '#5A5D4A',
    }}
  >
    p. 01 · v1.0 · 2026
  </span>
</footer>
```

### Portada de documento (Swiss cover)

La portada aplica el principio suizo de asimetría controlada: el título ancla en el tercio inferior izquierdo, el espacio superior es intencionalmente vacío.

```jsx
{/* Cover page — propuesta formal */}
<div
  className="relative"
  style={{
    width: '100%',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF',
    padding: '48px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  }}
>
  {/* Header: solo marca — mínimo */}
  <div className="flex items-center justify-between">
    <span
      style={{
        fontFamily: '"DM Mono", "Courier New", monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#243010',
      }}
    >
      Telos
    </span>
    <span
      style={{
        fontFamily: '"DM Mono", "Courier New", monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#B9BAA3',
      }}
    >
      Confidencial
    </span>
  </div>

  {/* Espacio vacío intencional — zona de respiración superior */}
  <div style={{ flex: 1 }} />

  {/* Bloque de título — anclado al tercio inferior */}
  <div style={{ maxWidth: '640px' }}>
    <div style={{ height: '1px', backgroundColor: '#243010', marginBottom: '32px' }} />

    <p
      style={{
        fontFamily: '"DM Mono", "Courier New", monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#B9BAA3',
        marginBottom: '16px',
      }}
    >
      Propuesta de Servicios
    </p>

    <h1
      style={{
        fontFamily: '"Noto Sans", "Helvetica Neue", Helvetica, Arial, sans-serif',
        fontWeight: 500,
        fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
        lineHeight: 1.07,
        letterSpacing: '-0.025em',
        color: '#243010',
        marginBottom: '24px',
      }}
    >
      Nombre del Proyecto
    </h1>

    <p
      style={{
        fontFamily: '"DM Mono", "Courier New", monospace',
        fontSize: '0.6875rem',
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: '#B9BAA3',
      }}
    >
      Cliente · Mes Año
    </p>
  </div>
</div>
```

### Checklist de revisión — antes de entregar un documento Telos

- [ ] ¿Todos los espaciados son múltiplos de 8px?
- [ ] ¿El texto corrido está contenido en `max-w-2xl` o `max-w-prose`?
- [ ] ¿El espacio antes de cada H2 es el doble del espacio después?
- [ ] ¿Los separadores son `border-dust-grey` o `border-ash-grey`? (nunca `border-black-forest`)
- [ ] ¿Hay folio con los tres campos (documento · marca · página)?
- [ ] ¿La portada tiene zona de respiración superior intencional?
- [ ] ¿La jerarquía se lee sin color? (testear en escala de grises)

---

## Componentes de layout frecuentes

### Hero 2 columnas (texto + imagen)
```jsx
<section className="py-20 lg:py-28">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
      {/* Columna texto */}
      <div>
        <p className="font-mono text-xs uppercase tracking-widest text-ash-deep mb-5">
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
    <p className="font-mono text-xs uppercase tracking-widest text-white/65 mb-5">
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
text-ash-deep · text-white · text-white/80 · text-white/65
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