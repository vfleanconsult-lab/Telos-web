import { defineCollection, z } from 'astro:content';

// Campos marcados como .optional() porque la colección "site"
// alberga múltiples páginas (home, nosotros…) y cada una solo
// usa los campos que le corresponden.
const siteCollection = defineCollection({
  type: 'content',
  schema: z.object({

    // ── home.md ─────────────────────────────────────────────
    hero: z.object({
      eyebrow:   z.string(),
      h1:        z.string(),
      subtitle:  z.string(),
      cta1Label: z.string(),
      cta1Href:  z.string(),
      cta2Label: z.string(),
      cta2Href:  z.string(),
    }).optional(),

    // Voz del cliente — "¿Te suena familiar?"
    voc: z.object({
      h2:     z.string(),
      quotes: z.array(z.string()),
      cierre: z.string(),
    }).optional(),

    // Proceso de trabajo — 4 pasos
    proceso: z.object({
      h2:    z.string(),
      pasos: z.array(z.object({
        numero:      z.string(),
        titulo:      z.string(),
        descripcion: z.string(),
      })),
    }).optional(),

    services: z.object({
      eyebrow: z.string(),
      h2:      z.string(),
      items:   z.array(z.object({
        number:      z.string(),
        title:       z.string(),
        description: z.string(),
        href:        z.string(),
      })),
    }).optional(),

    ctaFinal: z.object({
      eyebrow:     z.string(),
      h2:          z.string(),
      paragraph:   z.string(),
      buttonLabel: z.string(),
      buttonHref:  z.string(),
    }).optional(),

    // ── nosotros.md ─────────────────────────────────────────
    proposito: z.string().optional(),
    vision:    z.string().optional(),
    mision:    z.string().optional(),

    // ── páginas interiores — hero simple sin CTAs ────────────
    paginaHero: z.object({
      eyebrow:  z.string(),
      h1:       z.string(),
      subtitle: z.string(),
    }).optional(),

    // ── servicios.md ─────────────────────────────────────────
    serviciosList: z.array(z.object({
      numero: z.string(),
      titulo: z.string(),
      p1:     z.string(),
      p2:     z.string(),
      cta:    z.boolean().optional(),
    })).optional(),

    serviciosCta: z.object({
      texto:       z.string(),
      descripcion: z.string(),
      boton:       z.string(),
      href:        z.string(),
    }).optional(),

    // ── cfo.md ───────────────────────────────────────────────
    cfoHero: z.object({
      eyebrow: z.string(),
      h1:      z.string(),
    }).optional(),

    cfoProblema: z.object({
      titulo:  z.string(),
      bullets: z.array(z.string()),
      cierre:  z.string(),
    }).optional(),

    cfoSolucion: z.object({
      titulo: z.string(),
      p1:     z.string(),
    }).optional(),

    cfoEntregables: z.object({
      titulo: z.string(),
      items:  z.array(z.string()),
    }).optional(),

    cfoCierre: z.object({
      frase: z.string(),
      boton: z.string(),
      href:  z.string(),
    }).optional(),

    // ── equipo.md ────────────────────────────────────────────
    nombre:       z.string().optional(),
    rol:          z.string().optional(),
    tagline:      z.string().optional(),
    foto:         z.string().optional(),    // ruta relativa a /public
    bio:          z.array(z.string()).optional(),
    credenciales: z.array(z.string()).optional(),
  }),
});

export const collections = {
  site: siteCollection,
};
