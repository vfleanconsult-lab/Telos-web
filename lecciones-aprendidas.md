# Lecciones aprendidas — Telos-web

Aprendizajes de proceso y decisiones no obvias. Técnica repetible va en CLAUDE.md.

---

## 2026-08-04 — Bug reportado con síntoma genérico, causa real dos niveles más abajo

### Lo que pasó

Usuario reportó "no funciona el sistema de cambio de password" tras usarlo en producción. La revisión de código no mostró nada roto — la lógica de `solicitar-reset.ts` / `actualizar-password.ts` era correcta. Se aplicó un primer fix real pero secundario (el token de reset se invalidaba con cada clic en "¿Olvidaste tu contraseña?", así que un segundo intento rompía el correo del primero) y se pusheó. El usuario reprodujo el mismo error en dos navegadores distintos — descartando cache/cookies como causa — con el mensaje exacto "No se pudo enviar el correo: error desconocido".

### Cómo se encontró la causa real

Sin acceso a los logs de Vercel de este proyecto (el MCP de Vercel conectado a esta sesión solo ve el proyecto `dashboard-nlace`, no Telos-web), la única vía fue reproducir la llamada del navegador con `curl` variando los headers hasta reproducir el fallo:
- `curl -X POST .../solicitar-reset` con `Content-Type: application/json` + body → `200 {"ok":true}`
- La misma URL sin body ni `Content-Type` (igual que el `fetch` real del botón) → `403` con cuerpo en texto plano `"Cross-site POST form submissions are forbidden"`

Ese 403 no-JSON es lo que rompía el `res.json().catch(() => ({}))` del cliente y producía el mensaje genérico. Ver detalle técnico en `CLAUDE.md` → "Protección CSRF (`security.checkOrigin`)".

### Lección de proceso

**Cuando el reporte del usuario es un síntoma genérico de UI ("no funciona", "error desconocido") y la revisión de código no revela nada, reproducir la llamada de red exacta con `curl` antes de seguir adivinando.** La corrección de la lógica de negocio (token que se invalidaba solo) era real y necesaria, pero no era la causa del bug que el usuario seguía viendo — dos bugs distintos en el mismo flujo, uno tapando al otro. Sin la reproducción por `curl`, el segundo (CSRF) habría quedado sin diagnosticar.

**Efecto colateral a tener presente:** reproducir con `curl` contra el endpoint real de producción disparó un envío de correo real (no datos falsos, pero sí una acción con efecto en el mundo). Avisar al usuario después de hacerlo, como se hizo, en vez de asumir que "solo estoy probando" no tiene consecuencias.

---

## 2026-06-18 — Fix CSP HubSpot

### Lo que pasó

El sprint Ley 21.719 (sesión anterior) dejó el formulario de contacto roto: el CSP en `vercel.json` no incluía todos los dominios que HubSpot necesita para cargar. El formulario no aparecía sin mensaje de error visible para el usuario.

### Causa raíz

El CSP se implementó sin verificar en producción que el formulario cargara correctamente después. Se asumió que incluir `js.hsforms.net` y `forms.hsforms.com` era suficiente, pero HubSpot también carga recursos desde `static.hsappstatic.net`, `js.hubspot.com`, y necesita `unsafe-eval` para inicializar.

### Dominios completos que HubSpot necesita en CSP

El CSP se descubrió de forma incremental — cada deploy revelaba un dominio bloqueado adicional en la consola del navegador. La lista final validada en producción:

```
script-src:   https://js.hsforms.net https://forms.hsforms.com
              https://static.hsappstatic.net https://js.hubspot.com
              'unsafe-eval'
font-src:     https://fonts.googleapis.com https://fonts.gstatic.com
frame-src:    https://js.hsforms.net https://forms.hsforms.com https://*.hubspot.com
connect-src:  https://*.hubspot.com https://*.hubapi.com
              https://api.hsforms.com https://track.hubspot.com
```

El dominio que faltó en el primer fix fue `https://js.hsforms.net` en `frame-src` — HubSpot carga el formulario como iframe desde ese mismo dominio del script, no solo desde `forms.hsforms.com`.

### Advertencia en DevTools que es normal e inofensiva

Chrome muestra en la pestaña "Issues": *"A form field element should have an id or name attribute"*. Es una advertencia de accesibilidad generada por el HTML interno del iframe de HubSpot — código de terceros que no podemos modificar. No impide el envío del formulario ni es un error nuestro.

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
