import { NextRequest, NextResponse } from 'next/server';

const SERVICIOS_LABELS: Record<number, string> = {
  0:  'Cóctel Primavera',
  1:  'Cócteles Frutales para Jóvenes',
  2:  'Cerveza (barriles)',
  3:  'Vino',
  4:  'Whisky',
  5:  'Champagne',
  6:  'Postres',
  7:  'Torta',
  8:  'Café y/o Té',
  9:  'Arreglos Florales',
  10: 'Arreglo Floral Mesa Principal',
  11: 'Senderos',
  12: 'Cotillón',
  13: 'Fotógrafo',
  14: 'Pantalla Gigante',
  15: 'Música en Vivo',
  16: 'Altar para Boda',
};

const TIPO_EVENTO_LABELS: Record<number, string> = {
  0: 'Quinceaños',
  1: 'Boda',
  2: 'Cumpleaños',
  3: 'Empresarial',
};

function formatearFecha(fechaISO: string) {
  const fecha = new Date(fechaISO.split('T')[0] + 'T00:00:00');
  return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

function generarHTML(evento: any, planificacion: any): string {
  const timingsOrdenados = [...(planificacion.timings || [])].sort(
    (a: any, b: any) => a.orden - b.orden
  );

  const aproxPorMesa = Math.ceil(evento.cantidadInvitados / planificacion.cantidadMesas);

  const serviciosHTML = planificacion.servicios?.length > 0
    ? planificacion.servicios.map((s: any) => {
        const label = SERVICIOS_LABELS[s.tipoServicio] ?? `Servicio ${s.tipoServicio}`;
        const detalle = [
          s.cantidad ? `${s.cantidad} uds.` : null,
          s.descripcion ?? null,
        ].filter(Boolean).join(' · ');
        return `<div class="servicio-row">
          <span class="servicio-bullet">—</span>
          <span class="servicio-nombre">${label}</span>
          ${detalle ? `<span class="servicio-detalle">${detalle}</span>` : ''}
        </div>`;
      }).join('')
    : '';

  const timingsHTML = timingsOrdenados.map((t: any, i: number) => `
    <tr class="${i % 2 === 0 ? 'timing-par' : ''}">
      <td class="timing-num">${String(i + 1).padStart(2, '0')}</td>
      <td class="timing-momento">${t.momento}</td>
      <td class="timing-hora">${t.hora}hs</td>
    </tr>
  `).join('');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Source+Sans+3:wght@300;400;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }

    body {
      font-family: 'Source Sans 3', Helvetica, sans-serif;
      color: #1a1a1a;
      background: white;
      font-size: 11px;
      line-height: 1.5;
    }

    /* ── HEADER ── */
    .header {
      background: #FF6B35;
      padding: 24px 48px 20px;
      position: relative;
      overflow: hidden;
    }
    .header::after {
      content: '';
      position: absolute;
      right: -40px;
      top: -40px;
      width: 180px;
      height: 180px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.12);
    }
    .header::before {
      content: '';
      position: absolute;
      right: 20px;
      top: 10px;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .header-meta {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 14px;
    }
    .logo {
      height: 36px;
      object-fit: contain;
      opacity: 0.95;
    }
    .header-fecha {
      text-align: right;
    }
    .header-fecha-label {
      font-size: 7.5px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      font-weight: 600;
    }
    .header-fecha-valor {
      font-size: 12px;
      font-weight: 600;
      color: white;
      margin-top: 2px;
      text-transform: capitalize;
    }
    .header-divider {
      height: 1px;
      background: rgba(255,255,255,0.2);
      margin-bottom: 14px;
    }
    .header-bottom {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }
    .header-tipo {
      font-size: 8px;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: rgba(255,255,255,0.65);
      font-weight: 600;
    }
    .header-nombre {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 30px;
      font-weight: 700;
      color: white;
      letter-spacing: -0.5px;
      line-height: 1;
    }

    /* ── CONTENIDO ── */
    .content {
      padding: 32px 48px 80px;
    }

    /* ── BLOQUE ── */
    .bloque {
      margin-bottom: 28px;
    }
    .bloque-titulo {
      font-size: 7.5px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      color: #FF6B35;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #FF6B35;
    }

    /* ── HORARIOS ── */
    .horarios-row {
      display: flex;
      gap: 0;
    }
    .horario-item {
      flex: 1;
      padding-right: 24px;
      border-right: 1px solid #e8e8e8;
      margin-right: 24px;
    }
    .horario-item:last-child {
      border-right: none;
      margin-right: 0;
      padding-right: 0;
    }
    .horario-label {
      font-size: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #999;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .horario-valor {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.5px;
    }

    /* ── CAPACIDAD ── */
    .capacidad-row {
      display: flex;
      gap: 0;
    }
    .cap-item {
      flex: 1;
      padding-right: 24px;
      border-right: 1px solid #e8e8e8;
      margin-right: 24px;
    }
    .cap-item:last-child {
      border-right: none;
      margin-right: 0;
      padding-right: 0;
    }
    .cap-label {
      font-size: 8px;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      color: #999;
      font-weight: 600;
      margin-bottom: 3px;
    }
    .cap-valor {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 22px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .cap-sub {
      font-size: 9px;
      color: #bbb;
      margin-top: 2px;
    }

    /* ── SERVICIOS ── */
    .servicios-lista {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6px 24px;
    }
    .servicio-row {
      display: flex;
      align-items: baseline;
      gap: 8px;
      padding: 4px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    .servicio-bullet {
      color: #FF6B35;
      font-weight: 700;
      flex-shrink: 0;
    }
    .servicio-nombre {
      font-size: 11px;
      color: #1a1a1a;
      font-weight: 400;
    }
    .servicio-detalle {
      font-size: 10px;
      color: #999;
      margin-left: auto;
      flex-shrink: 0;
    }

    /* ── CRONOGRAMA ── */
    .cronograma-table {
      width: 100%;
      border-collapse: collapse;
    }
    .cronograma-table td {
      padding: 7px 0;
      border-bottom: 1px solid #f0f0f0;
      vertical-align: middle;
    }
    .timing-num {
      font-size: 9px;
      color: #ccc;
      font-weight: 600;
      letter-spacing: 1px;
      width: 28px;
    }
    .timing-momento {
      font-size: 11px;
      color: #1a1a1a;
    }
    .timing-hora {
      font-size: 11px;
      font-weight: 600;
      color: #FF6B35;
      text-align: right;
      width: 64px;
    }
    .timing-par td {
      background: #fafafa;
      padding-left: 4px;
      padding-right: 4px;
    }

    /* ── OBSERVACIONES ── */
    .obs-texto {
      font-size: 11px;
      color: #555;
      line-height: 1.7;
      padding-left: 14px;
      border-left: 2px solid #FF6B35;
    }

    /* ── FOOTER ── */
    .footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 12px 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 1px solid #ebebeb;
      background: white;
    }
    .footer-left {
      font-size: 8px;
      color: #ccc;
      letter-spacing: 0.5px;
    }
    .footer-right {
      font-size: 8px;
      color: #ccc;
      text-align: right;
    }
    .footer-accent {
      display: inline-block;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #FF6B35;
      margin-right: 6px;
      vertical-align: middle;
      opacity: 0.6;
    }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="header">
    <div class="header-meta">
      <img class="logo" src="http://localhost:3000/logo-white.svg" alt="Logo" />
      <div class="header-fecha">
        <div class="header-fecha-label">Fecha del evento</div>
        <div class="header-fecha-valor">${formatearFecha(evento.fechaEvento)}</div>
      </div>
    </div>
    <div class="header-divider"></div>
    <div class="header-bottom">
      <div>
        <div class="header-tipo">${TIPO_EVENTO_LABELS[evento.tipoEvento] ?? ''}</div>
        <div class="header-nombre">${evento.nombreCliente}</div>
      </div>
    </div>
  </div>

  <!-- CONTENIDO -->
  <div class="content">

    <!-- Horarios -->
    <div class="bloque">
      <div class="bloque-titulo">Horarios</div>
      <div class="horarios-row">
        <div class="horario-item">
          <div class="horario-label">Llegada</div>
          <div class="horario-valor">${planificacion.horaLlegada}hs</div>
        </div>
        <div class="horario-item">
          <div class="horario-label">Cena / Almuerzo</div>
          <div class="horario-valor">${planificacion.horaComida}hs</div>
        </div>
        ${planificacion.horaSalida ? `
        <div class="horario-item">
          <div class="horario-label">Finalización</div>
          <div class="horario-valor">${planificacion.horaSalida}hs</div>
        </div>` : ''}
      </div>
    </div>

    <!-- Capacidad -->
    <div class="bloque">
      <div class="bloque-titulo">Capacidad</div>
      <div class="capacidad-row">
        <div class="cap-item">
          <div class="cap-label">Invitados</div>
          <div class="cap-valor">${evento.cantidadInvitados}</div>
        </div>
        <div class="cap-item">
          <div class="cap-label">Mesas</div>
          <div class="cap-valor">${planificacion.cantidadMesas}</div>
        </div>
        <div class="cap-item">
          <div class="cap-label">Aprox. por mesa</div>
          <div class="cap-valor">${aproxPorMesa}</div>
          <div class="cap-sub">${evento.cantidadInvitados} ÷ ${planificacion.cantidadMesas}</div>
        </div>
      </div>
    </div>

    ${serviciosHTML ? `
    <!-- Servicios -->
    <div class="bloque">
      <div class="bloque-titulo">Servicios</div>
      <div class="servicios-lista">${serviciosHTML}</div>
    </div>
    ` : ''}

    ${timingsHTML ? `
    <!-- Cronograma -->
    <div class="bloque">
      <div class="bloque-titulo">Cronograma</div>
      <table class="cronograma-table">
        <tbody>${timingsHTML}</tbody>
      </table>
    </div>
    ` : ''}

    ${planificacion.observaciones ? `
    <!-- Observaciones -->
    <div class="bloque">
      <div class="bloque-titulo">Observaciones</div>
      <div class="obs-texto">${planificacion.observaciones}</div>
    </div>
    ` : ''}

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <div class="footer-left">
      <span class="footer-accent"></span>
      Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
    </div>
    <div class="footer-right">
      ${evento.nombreCliente} &nbsp;·&nbsp; ${TIPO_EVENTO_LABELS[evento.tipoEvento] ?? ''}
    </div>
  </div>

</body>
</html>`;
}

export async function POST(req: NextRequest) {
  try {
    const { evento, planificacion } = await req.json();

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    const html = generarHTML(evento, planificacion);
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '48px', left: '0' },
    });

    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="planificacion-${evento.nombreCliente.replace(/\s+/g, '-')}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error('Error generando PDF:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}