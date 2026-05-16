# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Comandos

```bash
npm run dev      # servidor de desarrollo
npm run build    # build de producción (verifica errores antes de push)
npm run preview  # previsualiza el build local
```

Siempre ejecutar `npm run build` y confirmar `[build] Complete!` antes de hacer commit. No hay test suite — el build es la verificación.

## Stack

- **Astro 5** — `output: 'server'`, adaptador `@astrojs/vercel`
- **Tailwind CSS v3** — vía PostCSS (`postcss.config.mjs`), sin `@astrojs/tailwind`
- **lucide-astro** — sistema de iconos; importar como `import { NombreIcono } from 'lucide-astro'`
- **Sin frameworks JS adicionales** — interactividad solo con vanilla JS inline en `<script>` dentro de `.astro`
- **TypeScript** — configuración `astro/tsconfigs/strict`

## Tokens de marca

Definidos en `tailwind.config.mjs` y únicos en el proyecto — no usar colores Tailwind estándar para elementos de marca:

| Token | Hex | Uso |
|---|---|---|
| `black-forest` | `#243010` | Color principal, CTAs, textos clave, fondos oscuros |
| `dust-grey` | `#D6D5C9` | Fondos secundarios, secciones alternadas |
| `ash-grey` | `#B9BAA3` | Eyebrows, bordes, acentos tenues |
| `ink` | `#1A1A1A` | Texto corriente |
| `font-sans` | Noto Sans / Helvetica Neue | Cuerpo, títulos, CTAs |
| `font-mono` | DM Mono | Eyebrows uppercase, captions, números de paso, metadata |

## Arquitectura de contenido

**Regla central:** todos los textos visibles vienen de archivos `.md` en `src/content/site/`. Los componentes reciben props y no contienen copy en duro.

### Colección `site`

Un único schema Zod en `src/content/config.ts` cubre todos los archivos de `src/content/site/`. Dado que cada página usa solo un subconjunto de campos, **todos son `.optional()`**. Al acceder a ellos en las páginas se usa el operador `!` porque se sabe que el campo existe en ese archivo concreto.

```
src/content/site/
  home.md       → hero, voc, proceso, services, ctaFinal
  nosotros.md   → proposito, vision, mision
  servicios.md  → paginaHero, serviciosList, serviciosCta
  cfo.md        → cfoHero, cfoProblema, cfoSolucion, cfoEntregables, cfoCierre

src/content/blog/
  *.md          → colección de artículos; campos: titulo, fecha, imagen, extracto, body
```

Al añadir una nueva página con contenido propio:
1. Crear `src/content/site/[pagina].md` con los campos en frontmatter YAML
2. Añadir esos campos al schema en `config.ts` como `.optional()`
3. Leerlos en la página con `getEntry('site', '[pagina]')`

### Patrón de página completa

```astro
---
import Layout from '../layouts/Layout.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import { getEntry } from 'astro:content';

const entry = await getEntry('site', '[pagina]');
const { campo1, campo2 } = entry!.data;
---
<Layout title="..." description={campo1}>
  <Header />
  <main>
    <!-- secciones -->
  </main>
  <Footer />
</Layout>
```

## Convenciones de diseño

- **Mobile-first** — clases base para móvil, `sm:` / `md:` / `lg:` para escalado
- **Contenedor estándar:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Eyebrows sobre fondo blanco** — `font-mono text-xs uppercase tracking-widest text-ash-grey`
- **Eyebrows sobre `bg-dust-grey`** — usar `text-black-forest/50` en lugar de `text-ash-grey` (el contraste ash-grey/dust-grey es ~1.5:1, ilegible)
- **Separadores finos en grids** — usar `gap-px` con `bg-ash-grey/30` en el contenedor en lugar de bordes individuales por celda
- **Hover en cards** — `border-dust-grey` en reposo, `hover:border-ash-grey` en hover
- **Sección de impacto máximo** — usar el gradiente Forest (ver abajo), no `bg-black-forest` plano
- **Comentarios en español** — los comentarios de código van en español

### Gradiente Forest estándar

Todas las secciones con fondo oscuro (heroes, CTAs, bloques de propósito) usan este gradiente radial multicapa en lugar del color plano `bg-black-forest`:

```css
background:
  radial-gradient(ellipse at top left,     #111a06 0%, transparent 45%),
  radial-gradient(ellipse at bottom right, #111a06 0%, transparent 45%),
  radial-gradient(ellipse at center,       #2f4012 0%, #243010 55%, #1a2408 100%);
```

Aplicado vía `style` inline — no existe clase Tailwind equivalente. Secciones que lo usan actualmente:
- `nosotros.astro` — banda Propósito
- `servicios/index.astro` — bloque Excelencia Organizacional
- `components/home/CtaFinal.astro` — sección "Siguiente paso"
- `pages/cfo.astro` — Hero y CTA final

### Imágenes

Todas en `public/images/`. Las actuales:

| Archivo | Usado en |
|---|---|
| `hero-home.png` | Home hero |
| `nosotros-faro.png` | Nosotros — columna izquierda |
| `cfo-hero.png` | fCFO hero |
| `cfo-caos.png` | fCFO sección Problema |
| `cfo-orden.png` | fCFO sección Solución |

## CMS — Sveltia CMS + GitHub

El panel de administración vive en `/admin` y usa **Sveltia CMS** (no Decap ni Netlify CMS). Sveltia es un reemplazo directo compatible con el mismo `config.yml`, pero sin los bugs de autenticación de Decap 3.x.

### Archivos clave

| Archivo | Rol |
|---|---|
| `public/admin/index.html` | Carga Sveltia CMS desde unpkg |
| `src/pages/api/cms-config.ts` | Sirve la configuración YAML (ver abajo) |
| `src/middleware.ts` | Fallback: también sirve `/admin/config.yml` |
| `src/pages/api/auth.ts` | Inicia el flujo OAuth con GitHub |
| `src/pages/api/callback.ts` | Recibe el código, intercambia por token, hace `postMessage` |

### Por qué /api/cms-config y no config.yml directamente

Vercel bloquea **todas** las URLs que terminen en `.yml`, incluso las servidas desde funciones serverless. La solución es:
1. Crear el endpoint `src/pages/api/cms-config.ts` que sirve el YAML con `Content-Type: text/yaml`
2. En `public/admin/index.html` apuntar con `<link rel="cms-config-url" href="/api/cms-config" type="text/yaml" />`

### Configuración del backend OAuth

```yaml
backend:
  name: github
  repo: vfleanconsult-lab/Telos-web
  branch: main
  base_url: https://telos-web-pi.vercel.app   # ⚠️ cambiar a https://telos.cl al lanzar dominio
  auth_endpoint: api/auth
```

La variable de entorno `GITHUB_CLIENT_SECRET` debe estar en Vercel. El Client ID del GitHub OAuth App es `Ov23liJhis0KyJECIdZA`.

> **Pendiente al lanzar telos.cl:** actualizar `base_url` a `https://telos.cl` aquí y en `src/pages/api/cms-config.ts`. Además, agregar `https://telos.cl/api/callback` como Authorization callback URL en el GitHub OAuth App (Settings → Developer settings → OAuth Apps — lo hace el dueño de la cuenta manualmente).

### Campo imagen en Sveltia CMS

Usar `multiple: false` — Sveltia no soporta `allow_multiple: false` (que usa Decap).

```yaml
- label: Imagen de portada
  name: imagen
  widget: image
  required: false
  multiple: false
```

---

## Astro 5 — cambios de API que rompen compatibilidad

### entry.id incluye la extensión del archivo

En Astro 5, `entry.id` vale `"articulo-1.md"` (no `"articulo-1"`). Consecuencias:

- **URLs**: nunca usar `entry.id` directamente en un `href` → genera `/articulos/articulo-1.md` → 404.
  ```astro
  <!-- MAL -->
  href={`/articulos/${articulo.id}`}
  <!-- BIEN -->
  href={`/articulos/${articulo.id.replace(/\.md$/, '')}`}
  ```
- **getEntry**: el slug limpio de la URL no coincide con el id del entry. Usar fallback:
  ```typescript
  const entry = slug
    ? (await getEntry('blog', slug) ?? await getEntry('blog', `${slug}.md`))
    : undefined;
  ```

### render() ya no es método del entry

```typescript
// Astro 4 (roto en Astro 5)
const { Content } = await entry.render();

// Astro 5 (correcto)
import { render } from 'astro:content';
const { Content } = await render(entry);
```

### Fechas YAML en colecciones

Sveltia CMS guarda fechas sin comillas (`fecha: 2026-05-13`). YAML las parsea como objeto `Date`, no como `string`. El schema Zod debe aceptar ambos:

```typescript
fecha: z.union([z.string(), z.date()]).transform(v =>
  v instanceof Date ? v.toISOString().split('T')[0] : v
),
```

---

## Integraciones externas — limitaciones conocidas

### HubSpot cuenta gratuita

Los scopes `cms.blog.read` y `cms.blog.write` **requieren plan de pago**. No es posible usar HubSpot como backend de blog con cuenta free. Lo que sí está disponible gratis es la API de formularios:
- Endpoint: `POST /submissions/v3/integration/submit/:portalId/:formGuid`
- Útil para el formulario de contacto sin depender de un servicio de terceros.

---

## Gestión del proyecto

- Rama de desarrollo activa: `claude/telos-sprint-1-5SqER`
- Cada sprint se documenta como un issue cerrado en GitHub con etiquetas `documentation` y `sprint-N`
- Las páginas pendientes de implementar son stubs en `src/pages/` con un comentario que describe qué irá ahí

### Sprints completados

| Sprint | Descripción |
|---|---|
| Sprint 1 | Setup inicial — Astro 5, Tailwind, estructura de páginas y colección de contenido |
| Sprint CMS | Sveltia CMS + OAuth GitHub; fix Vercel bloquea `.yml`; fix Astro 5 API breaks |
| Sprint 8a | Iconografía con lucide-astro; wordmark "Telos — Consultores" en Header |
| Sprint imágenes | Reemplazo de placeholders por imágenes reales (home, nosotros, cfo) |
| Sprint footer | Correo real `victor@telos.cl` + icono LinkedIn |
| Sprint rediseño | Rediseño visual completo Nosotros y Servicios |
| Sprint gradientes | Gradiente Forest multicapa en Nosotros, Servicios, Home CTA y fCFO |
| Sprint 9 | Migración a telos.cl + fix OAuth CMS en iPadOS (4 bugs: www mismatch, dispatchEvent, popup.closed race, fetch throttle) |

### Sprints pendientes

| Sprint | Descripción |
|---|---|
| Sprint SEO | Meta tags OG, sitemap.xml, robots.txt |
