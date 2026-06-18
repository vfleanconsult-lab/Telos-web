# Lecciones aprendidas — Telos-web

Aprendizajes de proceso y decisiones no obvias. Técnica repetible va en CLAUDE.md.

---

## 2026-06-18 — Fix CSP HubSpot

### Lo que pasó

El sprint Ley 21.719 (sesión anterior) dejó el formulario de contacto roto: el CSP en `vercel.json` no incluía todos los dominios que HubSpot necesita para cargar. El formulario no aparecía sin mensaje de error visible para el usuario.

### Causa raíz

El CSP se implementó sin verificar en producción que el formulario cargara correctamente después. Se asumió que incluir `js.hsforms.net` y `forms.hsforms.com` era suficiente, pero HubSpot también carga recursos desde `static.hsappstatic.net`, `js.hubspot.com`, y necesita `unsafe-eval` para inicializar.

### Dominios completos que HubSpot necesita en CSP

```
script-src:   https://js.hsforms.net https://forms.hsforms.com
              https://static.hsappstatic.net https://js.hubspot.com
              'unsafe-eval'
font-src:     https://fonts.googleapis.com https://fonts.gstatic.com
frame-src:    https://forms.hsforms.com https://*.hubspot.com
connect-src:  https://*.hubspot.com https://*.hubapi.com
              https://api.hsforms.com https://track.hubspot.com
```

### Lección de proceso

**Siempre leer el estado actual del repo antes de actuar.** En esta sesión, el repo local estaba desactualizado respecto al remoto — `contacto.astro` local no tenía los cambios de consentimiento del sprint anterior. Trabajar sobre una versión desactualizada genera confusión sobre qué está bien y qué hay que arreglar.

**Protocolo mínimo al iniciar sesión en un repo activo:**
1. `git pull` antes de leer cualquier archivo
2. `git log --oneline -10` para entender qué se hizo recientemente
3. Leer CLAUDE.md (sprints completados) antes de proponer cambios

### Lo que quedó bien separado

El CSP (capa de red) y la lógica de consentimiento de la Ley 21.719 (capa de JS) son completamente independientes. Expandir el CSP no afecta en absoluto cuándo ni cómo se carga HubSpot según el consentimiento del usuario.

---

## Estructura de seguridad — referencia rápida

Los headers de seguridad viven en `vercel.json` (raíz del repo), **no** en el dashboard de Vercel. Hay dos reglas:

- `/(.*)`  — headers generales del sitio (CSP completo + HSTS + X-Frame-Options + etc.)
- `/admin(.*)` — CSP específico para el panel CMS (permite `unpkg.com`, `api.github.com`, etc.)

Si se agrega un nuevo servicio externo que requiera recursos (scripts, iframes, fuentes), actualizar `vercel.json` y verificar en producción que el recurso carga correctamente **antes de cerrar la sesión**.
