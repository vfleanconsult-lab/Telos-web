import { defineCollection, z } from 'astro:content';

const siteCollection = defineCollection({
  type: 'content',
  schema: z.object({
    hero: z.object({
      eyebrow:   z.string(),
      h1:        z.string(),
      subtitle:  z.string(),
      cta1Label: z.string(),
      cta1Href:  z.string(),
      cta2Label: z.string(),
      cta2Href:  z.string(),
    }),
    stats: z.array(
      z.object({
        value: z.string(),
        label: z.string(),
      })
    ),
    services: z.object({
      eyebrow: z.string(),
      h2:      z.string(),
      items:   z.array(
        z.object({
          number:      z.string(),
          title:       z.string(),
          description: z.string(),
          href:        z.string(),
        })
      ),
    }),
    ctaFinal: z.object({
      eyebrow:     z.string(),
      h2:          z.string(),
      paragraph:   z.string(),
      buttonLabel: z.string(),
      buttonHref:  z.string(),
    }),
  }),
});

export const collections = {
  site: siteCollection,
};
