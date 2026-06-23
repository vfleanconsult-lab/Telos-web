interface DimResumen {
  nombre: string
  completadas: number
}

export function emailPausado({
  nombre,
  empresa,
  fecha,
  link,
  dimensiones,
  completadas,
  total
}: {
  nombre: string
  empresa: string
  fecha: string
  link: string
  dimensiones: DimResumen[]
  completadas: number
  total: number
}): string {
  const filasDim = dimensiones.map(d => `
    <tr>
      <td style="padding:8px 12px;font-size:14px;color:#1A1A1A;border-bottom:1px solid #e8e8e0;">${d.nombre}</td>
      <td style="padding:8px 12px;font-size:13px;text-align:center;color:#888;border-bottom:1px solid #e8e8e0;">${d.completadas}/5</td>
    </tr>
  `).join('')

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Recuerda completar tu evaluación — ${empresa}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#1A1A1A;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:4px;overflow:hidden;">
          <tr>
            <td style="background:#243010;padding:32px 40px;">
              <p style="margin:0;font-family:'DM Mono',Courier,monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#B9BAA3;">TELOS — CONSULTORES</p>
              <p style="margin:8px 0 0;font-size:20px;font-weight:600;color:#ffffff;">Evaluación pendiente</p>
            </td>
          </tr>
          <tr>
            <td style="padding:40px;">
              <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">Hola <strong>${nombre}</strong>,</p>
              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#444;">
                Dejaste sin terminar tu evaluación de <strong>${empresa}</strong> del <strong>${fecha}</strong>.
                Llevas <strong>${completadas} de ${total} prácticas</strong> completadas — tus respuestas están guardadas
                y puedes continuar en cualquier momento.
              </p>

              <!-- Tabla de avance -->
              <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #e8e8e0;border-radius:4px;overflow:hidden;margin-bottom:32px;">
                <thead>
                  <tr style="background:#f5f5f0;">
                    <th style="padding:10px 12px;text-align:left;font-size:11px;font-family:'DM Mono',Courier,monospace;text-transform:uppercase;letter-spacing:1px;color:#888;">Dimensión</th>
                    <th style="padding:10px 12px;text-align:center;font-size:11px;font-family:'DM Mono',Courier,monospace;text-transform:uppercase;letter-spacing:1px;color:#888;">Completadas</th>
                  </tr>
                </thead>
                <tbody>${filasDim}</tbody>
              </table>

              <p style="margin:0 0 24px;font-size:15px;line-height:1.7;color:#444;">
                Puedes retomar tu evaluación usando el botón a continuación. Tu progreso estará exactamente donde lo dejaste.
              </p>

              <!-- CTA continuar -->
              <table cellpadding="0" cellspacing="0" style="margin:0 0 32px;">
                <tr>
                  <td style="background:#243010;border-radius:4px;padding:14px 28px;">
                    <a href="${link}" style="color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;display:block;">
                      Continuar mi evaluación →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#888;">Enlace de acceso:</p>
              <p style="margin:0 0 32px;font-size:13px;word-break:break-all;">
                <a href="${link}" style="color:#243010;">${link}</a>
              </p>

              <hr style="border:none;border-top:1px solid #e8e8e0;margin:0 0 24px;">
              <p style="margin:0;font-size:13px;color:#888;line-height:1.6;">
                Si tienes alguna duda, escríbenos a victor@telos.cl
              </p>
            </td>
          </tr>
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
