import { defineMiddleware } from 'astro:middleware';

// Sirve config.yml dinámicamente porque el hosting no sirve archivos .yml estáticos
const CONFIG_YAML = `backend:
  name: github
  repo: vfleanconsult-lab/Telos-web
  branch: main
  base_url: https://www.telos.cl
  auth_endpoint: api/auth
media_folder: public/images/blog
public_folder: /images/blog
locale: es
collections:
  - name: blog
    label: Artículos
    label_singular: Artículo
    folder: src/content/blog
    create: true
    slug: "{{slug}}"
    fields:
      - label: Título
        name: titulo
        widget: string
      - label: Bajada
        name: bajada
        widget: text
        hint: >-
          Párrafo editorial de 2 a 4 líneas — contextualiza y engancha al lector
      - label: Fecha
        name: fecha
        widget: datetime
        format: "YYYY-MM-DD"
        date_format: "YYYY-MM-DD"
        time_format: false
      - label: Categoría
        name: categoria
        widget: select
        options:
          - Estrategia
          - Excelencia Organizacional
          - Liderazgo
          - Inteligencia Artificial
      - label: Imagen de portada
        name: imagen
        widget: image
        required: false
        multiple: false
      - label: Contenido
        name: body
        widget: markdown
`;

// Cabeceras de seguridad para respuestas SSR.
// Netlify solo aplica [[headers]] de netlify.toml a archivos estáticos,
// así que las páginas dinámicas las reciben aquí. Mantener en sync con netlify.toml.
const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.hsforms.net https://forms.hsforms.com https://static.hsappstatic.net https://js.hubspot.com https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com https://fonts.googleapis.com; img-src 'self' data: https: blob:; connect-src 'self' https://*.hubspot.com https://*.hubapi.com https://api.hsforms.com https://forms.hsforms.com https://track.hubspot.com https://www.google-analytics.com https://region1.google-analytics.com https://analytics.google.com https://*.supabase.co https://jsvnedimselixowhzmkt.supabase.co; frame-src 'self' https://js.hsforms.net https://forms.hsforms.com https://*.hubspot.com; frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://forms.hsforms.com https://api.hsforms.com;",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
};

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = new URL(context.request.url);
  if (pathname === '/admin/config.yml') {
    return new Response(CONFIG_YAML, {
      headers: {
        'Content-Type':  'text/yaml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
  const original = await next();
  // Response.redirect() devuelve cabeceras inmutables: se copia la respuesta antes de modificarla
  const response = new Response(original.body, original);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    if (!response.headers.has(key)) response.headers.set(key, value);
  }
  return response;
});
