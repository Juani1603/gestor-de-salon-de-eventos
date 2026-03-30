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
  return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' });
}

function generarHTML(evento: any, planificacion: any): string {
  const timingsOrdenados = [...(planificacion.timings || [])].sort(
    (a: any, b: any) => a.orden - b.orden
  );

  const serviciosHTML = planificacion.servicios?.length > 0
    ? planificacion.servicios.map((s: any) => {
        const label = SERVICIOS_LABELS[s.tipoServicio] ?? `Servicio ${s.tipoServicio}`;
        const detalle = [
          s.cantidad ? `${s.cantidad} uds.` : null,
          s.descripcion ?? null,
        ].filter(Boolean).join(' · ');
        return `<span class="chip">${label}${detalle ? ` <span class="chip-detalle">— ${detalle}</span>` : ''}</span>`;
      }).join('')
    : '';

  const timingsHTML = timingsOrdenados.map((t: any, i: number) => `
    <div class="timing-row">
      <div class="timing-num">${i + 1}</div>
      <div class="timing-momento">${t.momento}</div>
      <div class="timing-hora">${t.hora}hs</div>
    </div>
  `).join('');

  const horariosHTML = [
    { label: 'Llegada', valor: `${planificacion.horaLlegada}hs` },
    { label: 'Cena / Almuerzo', valor: `${planificacion.horaComida}hs` },
    ...(planificacion.horaSalida ? [{ label: 'Finalización', valor: `${planificacion.horaSalida}hs` }] : []),
  ].map(h => `
    <div class="horario-card">
      <div class="horario-label">${h.label}</div>
      <div class="horario-valor">${h.valor}</div>
    </div>
  `).join('');

  const aproxPorMesa = Math.ceil(evento.cantidadInvitados / planificacion.cantidadMesas);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: Helvetica, Arial, sans-serif;
      color: #1C1C1C;
      background: white;
      font-size: 12px;
    }

    /* HEADER */
    .header {
      background: linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%);
      padding: 32px 40px 28px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .header-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    .logo {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
    .header-fecha {
      text-align: right;
    }
    .header-fecha-label {
      font-size: 8px;
      color: rgba(255,255,255,0.7);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }
    .header-fecha-valor {
      font-size: 11px;
      font-weight: bold;
      color: white;
      margin-top: 2px;
    }
    .header-tipo {
      font-size: 9px;
      color: rgba(255,255,255,0.7);
      letter-spacing: 2px;
      text-transform: uppercase;
    }
    .header-nombre {
      font-size: 28px;
      font-weight: bold;
      color: white;
      line-height: 1.2;
    }

    /* CONTENIDO */
    .content { padding: 28px 40px; }

    /* SECCIÓN */
    .seccion { margin-bottom: 24px; }
    .seccion-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
      padding-bottom: 6px;
      border-bottom: 1px solid #F0F0F0;
    }
    .seccion-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      background: #FF6B35;
      flex-shrink: 0;
    }
    .seccion-titulo {
      font-size: 8px;
      font-weight: bold;
      color: #6B7280;
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    /* HORARIOS */
    .horarios-grid {
      display: flex;
      gap: 0;
    }
    .horario-card {
      flex: 1;
      padding: 0 16px;
      border-left: 1px solid #F0F0F0;
    }
    .horario-card:first-child {
      padding-left: 0;
      border-left: none;
    }
    .horario-label {
      font-size: 8px;
      color: #6B7280;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .horario-valor {
      font-size: 18px;
      font-weight: bold;
      color: #1C1C1C;
      margin-top: 4px;
    }

    /* CAPACIDAD */
    .capacidad-grid {
      display: flex;
      gap: 12px;
    }
    .cap-card {
      flex: 1;
      background: #FFF4F0;
      border-radius: 6px;
      padding: 12px;
    }
    .cap-label {
      font-size: 8px;
      font-weight: bold;
      color: #FF6B35;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .cap-valor {
      font-size: 24px;
      font-weight: bold;
      color: #1C1C1C;
      margin-top: 4px;
    }

    /* SERVICIOS */
    .servicios-wrap {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .chip {
      background: #FFF4F0;
      color: #FF6B35;
      font-size: 9px;
      font-weight: bold;
      padding: 5px 10px;
      border-radius: 20px;
      display: inline-block;
    }
    .chip-detalle {
      color: #FF8C5A;
      font-weight: normal;
    }

    /* CRONOGRAMA */
    .timing-row {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 0;
      border-bottom: 1px solid #F0F0F0;
    }
    .timing-row:last-child { border-bottom: none; }
    .timing-num {
      width: 24px; height: 24px;
      background: #FFF4F0;
      color: #FF6B35;
      font-size: 9px;
      font-weight: bold;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .timing-momento {
      flex: 1;
      font-size: 10px;
      color: #1C1C1C;
    }
    .timing-hora {
      font-size: 10px;
      font-weight: bold;
      color: #FF6B35;
      background: #FFF4F0;
      padding: 3px 8px;
      border-radius: 4px;
      flex-shrink: 0;
    }

    /* OBSERVACIONES */
    .obs-box {
      border-left: 3px solid #FF6B35;
      padding: 10px 12px;
      background: #FAFAFA;
      border-radius: 0 4px 4px 0;
    }
    .obs-texto {
      font-size: 10px;
      color: #6B7280;
      line-height: 1.6;
    }

    /* FOOTER */
    .footer {
      position: fixed;
      bottom: 20px;
      left: 40px;
      right: 40px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid #F0F0F0;
      padding-top: 8px;
      font-size: 8px;
      color: #C4C4C4;
    }
  </style>
</head>
<body>
  <!-- HEADER -->
  <div class="header">
    <div class="header-top">
      <img class="logo" src="http://localhost:3000/logo.png" alt="Logo" />
      <div class="header-fecha">
        <div class="header-fecha-label">Fecha del evento</div>
        <div class="header-fecha-valor">${formatearFecha(evento.fechaEvento)}</div>
      </div>
    </div>
    <div class="header-tipo">${TIPO_EVENTO_LABELS[evento.tipoEvento] ?? ''}</div>
    <div class="header-nombre">${evento.nombreCliente}</div>
  </div>

  <!-- CONTENIDO -->
  <div class="content">

    <!-- Horarios -->
    <div class="seccion">
      <div class="seccion-header">
        <div class="seccion-dot"></div>
        <div class="seccion-titulo">Horarios</div>
      </div>
      <div class="horarios-grid">${horariosHTML}</div>
    </div>

    <!-- Capacidad -->
    <div class="seccion">
      <div class="seccion-header">
        <div class="seccion-dot"></div>
        <div class="seccion-titulo">Capacidad</div>
      </div>
      <div class="capacidad-grid">
        <div class="cap-card">
          <div class="cap-label">Invitados</div>
          <div class="cap-valor">${evento.cantidadInvitados}</div>
        </div>
        <div class="cap-card">
          <div class="cap-label">Mesas</div>
          <div class="cap-valor">${planificacion.cantidadMesas}</div>
        </div>
        <div class="cap-card">
          <div class="cap-label">Aprox. por mesa</div>
          <div class="cap-valor">${aproxPorMesa}</div>
        </div>
      </div>
    </div>

    ${serviciosHTML ? `
    <!-- Servicios -->
    <div class="seccion">
      <div class="seccion-header">
        <div class="seccion-dot"></div>
        <div class="seccion-titulo">Servicios</div>
      </div>
      <div class="servicios-wrap">${serviciosHTML}</div>
    </div>
    ` : ''}

    ${timingsHTML ? `
    <!-- Cronograma -->
    <div class="seccion">
      <div class="seccion-header">
        <div class="seccion-dot"></div>
        <div class="seccion-titulo">Cronograma</div>
      </div>
      <div class="timings">${timingsHTML}</div>
    </div>
    ` : ''}

    ${planificacion.observaciones ? `
    <!-- Observaciones -->
    <div class="seccion">
      <div class="seccion-header">
        <div class="seccion-dot"></div>
        <div class="seccion-titulo">Observaciones</div>
      </div>
      <div class="obs-box">
        <div class="obs-texto">${planificacion.observaciones}</div>
      </div>
    </div>
    ` : ''}

  </div>

  <!-- FOOTER -->
  <div class="footer">
    <span>Generado el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
    <span>${evento.nombreCliente} — ${TIPO_EVENTO_LABELS[evento.tipoEvento] ?? ''}</span>
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
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
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