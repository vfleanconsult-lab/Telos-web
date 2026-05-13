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
- **Sección de impacto máximo** — fondo `bg-black-forest` con texto blanco (usado en CTA final y bloques de propósito)
- **Comentarios en español** — los comentarios de código van en español

## Gestión del proyecto

- Rama de desarrollo activa: `claude/telos-sprint-1-5SqER`
- Cada sprint se documenta como un issue cerrado en GitHub con etiquetas `documentation` y `sprint-N`
- Las páginas pendientes de implementar son stubs en `src/pages/` con un comentario que describe qué irá ahí
