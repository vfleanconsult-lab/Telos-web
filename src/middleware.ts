import { defineMiddleware } from 'astro:middleware';

// Sirve config.yml dinámicamente porque Vercel no sirve archivos .yml estáticos
const CONFIG_YAML = `backend:
  name: github
  repo: vfleanconsult-lab/Telos-web
  branch: main
  base_url: https://telos-web-pi.vercel.app
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
      - label: Imagen de portada
        name: imagen
        widget: image
        required: false
        multiple: false
      - label: Contenido
        name: body
        widget: markdown
`;

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
  return next();
});
