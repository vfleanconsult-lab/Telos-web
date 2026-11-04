// Lee variables de entorno en runtime (no se inyectan en el bundle al compilar).
// En producción (Netlify) vienen de process.env; en `astro dev` de .env.local vía import.meta.env.
export function env(name: string): string | undefined {
  const fromProcess = process.env[name]
  if (fromProcess !== undefined) return fromProcess
  if (import.meta.env.DEV) {
    return (import.meta.env as Record<string, string | undefined>)[name]
  }
  return undefined
}
