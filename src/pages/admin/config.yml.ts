// Sirve /admin/config.yml como ruta server-side.
// Necesario porque Vercel no sirve archivos .yml como estáticos
// con el adaptador @astrojs/vercel en modo server.
import type { APIRoute } from 'astro';

export const GET: APIRoute = () => {
  const yaml = `backend:
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
        allow_multiple: false
      - label: Contenido
        name: body
        widget: markdown
`;

  return new Response(yaml, {
    headers: {
      'Content-Type':  'text/yaml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
