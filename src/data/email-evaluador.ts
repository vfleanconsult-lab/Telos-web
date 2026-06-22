export function emailEvaluador({
  nombre,
  empresa,
  fecha,
  link
}: {
  nombre: string
  empresa: string
  fecha: string
  link: string
}): string {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Diagnóstico de Madurez — ${empresa}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:#243010;padding:32px 40px;">
              <p style="margin:0;font-family:'DM Mono',Courier,monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B9BAA3;">TELOS — CONSULTORES</p>
              <p style="margin:8px 0 0;font-size:20px;font-weight:600;color:#ffffff;">Diagnóstico de Madurez</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">Hola <strong>${nombre}</strong>,</p>
              <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#444;">
                Has sido invitado/a a participar en el diagnóstico de madurez del área de <strong>${empresa}</strong>,
                programado para el <strong>${fecha}</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:15px;line-height:1.7;color:#444;">
                Tu evaluación es independiente y confidencial. Usa la rúbrica de 0 a 4 para calificar
                20 prácticas en 4 dimensiones. El sistema guarda automáticamente tu progreso.
              </p>
              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#243010;border-radius:4px;padding:14px 28px;">
                    <a href="${link}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:block;">
                      Iniciar mi evaluación →
                    </a>
                  </td>
                </tr>
              </table>
              <!-- Link fallback -->
              <p style="margin:0 0 8px;font-size:13px;color:#888;">Si el botón no funciona, copia este enlace en tu navegador:</p>
              <p style="margin:0 0 32px;font-size:13px;word-break:break-all;">
                <a href="${link}" style="color:#243010;">${link}</a>
              </p>
              <hr style="border:none;border-top:1px solid #e8e8e0;margin:0 0 24px;">
              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                Este enlace es personal e intransferible. El proceso toma aproximadamente 45-60 minutos.
                Puedes pausar y retomar cuando quieras — tu avance se guarda automáticamente.
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f5f5f0;padding:20px 40px;">
              <p style="margin:0;font-size:12px;color:#B9BAA3;font-family:'DM Mono',Courier,monospace;">
                NLACE · Telos Consultores · victor@telos.cl
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
