import {
  Document, Page, Text, View, Image, StyleSheet, Font
} from '@react-pdf/renderer';
import { Evento, Planificacion, TipoEventoLabels } from '@/app/types';

// ─── Labels ──────────────────────────────────────────────────────────────────
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

// ─── Colores ──────────────────────────────────────────────────────────────────
const NARANJA = '#FF6B35';
const NARANJA_CLARO = '#FFF4F0';
const GRIS_OSCURO = '#1C1C1C';
const GRIS_MEDIO = '#6B7280';
const GRIS_CLARO = '#F0F0F0';
const BLANCO = '#FFFFFF';

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    backgroundColor: BLANCO,
    paddingTop: 0,
    paddingBottom: 40,
    paddingHorizontal: 0,
    fontFamily: 'Helvetica',
  },

  // Header con fondo naranja
  header: {
    backgroundColor: NARANJA,
    paddingHorizontal: 40,
    paddingTop: 32,
    paddingBottom: 28,
    marginBottom: 32,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  logo: {
    width: 48,
    height: 48,
    objectFit: 'contain',
  },
  fechaLabel: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  fechaValor: {
    fontSize: 11,
    color: BLANCO,
    fontFamily: 'Helvetica-Bold',
    marginTop: 2,
  },
  tipoEvento: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.7)',
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 6,
  },
  nombreCliente: {
    fontSize: 28,
    color: BLANCO,
    fontFamily: 'Helvetica-Bold',
    lineHeight: 1.2,
  },

  // Contenido principal
  content: {
    paddingHorizontal: 40,
  },

  // Secciones
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: GRIS_CLARO,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: NARANJA,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 9,
    color: GRIS_MEDIO,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
  },

  // Grid de datos
  grid2: {
    flexDirection: 'row',
    gap: 12,
  },
  grid3: {
    flexDirection: 'row',
    gap: 12,
  },
  card: {
    flex: 1,
    backgroundColor: NARANJA_CLARO,
    borderRadius: 6,
    padding: 12,
  },
  cardLabel: {
    fontSize: 8,
    color: NARANJA,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
    fontFamily: 'Helvetica-Bold',
  },
  cardValue: {
    fontSize: 18,
    color: GRIS_OSCURO,
    fontFamily: 'Helvetica-Bold',
  },
  cardValueSmall: {
    fontSize: 12,
    color: GRIS_OSCURO,
    fontFamily: 'Helvetica-Bold',
  },

  // Horarios
  horariosRow: {
    flexDirection: 'row',
    gap: 12,
  },
  horarioCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: GRIS_CLARO,
    borderRadius: 6,
    padding: 12,
  },
  horarioLabel: {
    fontSize: 8,
    color: GRIS_MEDIO,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 4,
  },
  horarioValor: {
    fontSize: 15,
    color: GRIS_OSCURO,
    fontFamily: 'Helvetica-Bold',
  },

  // Servicios
  serviciosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  servicioChip: {
    backgroundColor: NARANJA_CLARO,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  servicioTexto: {
    fontSize: 9,
    color: NARANJA,
    fontFamily: 'Helvetica-Bold',
  },
  servicioDetalle: {
    fontSize: 8,
    color: GRIS_MEDIO,
    marginLeft: 4,
  },

  // Timing
  timingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: GRIS_CLARO,
  },
  timingOrden: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: NARANJA_CLARO,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  timingOrdenText: {
    fontSize: 8,
    color: NARANJA,
    fontFamily: 'Helvetica-Bold',
  },
  timingMomento: {
    flex: 1,
    fontSize: 10,
    color: GRIS_OSCURO,
  },
  timingHora: {
    fontSize: 10,
    color: NARANJA,
    fontFamily: 'Helvetica-Bold',
    backgroundColor: NARANJA_CLARO,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },

  // Observaciones
  observacionesBox: {
    backgroundColor: '#FAFAFA',
    borderLeftWidth: 3,
    borderLeftColor: NARANJA,
    borderRadius: 4,
    padding: 12,
  },
  observacionesTexto: {
    fontSize: 10,
    color: GRIS_MEDIO,
    lineHeight: 1.6,
  },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 40,
    right: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: GRIS_CLARO,
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#C4C4C4',
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatearFecha(fechaISO: string) {
  const fecha = new Date(fechaISO.split('T')[0] + 'T00:00:00');
  return fecha.toLocaleDateString('es-ES', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });
}

// ─── Componente PDF ───────────────────────────────────────────────────────────
interface PlanificacionPDFProps {
  evento: Evento;
  planificacion: Planificacion;
}

export default function PlanificacionPDF({ evento, planificacion }: PlanificacionPDFProps) {
  const timingsOrdenados = [...planificacion.timings].sort((a, b) => a.orden - b.orden);

  return (
    <Document>
      <Page size="A4" style={s.page}>

        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerRow}>
            <Image src="/logo-white.svg" style={s.logo} />
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={s.fechaLabel}>Fecha del evento</Text>
              <Text style={s.fechaValor}>
                {new Date(evento.fechaEvento.split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', {
                  day: '2-digit', month: 'long', year: 'numeric'
                })}
              </Text>
            </View>
          </View>
          <Text style={s.tipoEvento}>{TipoEventoLabels[evento.tipoEvento]}</Text>
          <Text style={s.nombreCliente}>{evento.nombreCliente}</Text>
        </View>

        {/* ── Contenido ── */}
        <View style={s.content}>

          {/* Horarios */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionDot} />
              <Text style={s.sectionTitle}>Horarios</Text>
            </View>
            <View style={s.horariosRow}>
              <View style={s.horarioCard}>
                <Text style={s.horarioLabel}>Llegada</Text>
                <Text style={s.horarioValor}>{planificacion.horaLlegada}hs</Text>
              </View>
              <View style={s.horarioCard}>
                <Text style={s.horarioLabel}>Cena / Almuerzo</Text>
                <Text style={s.horarioValor}>{planificacion.horaComida}hs</Text>
              </View>
              {planificacion.horaSalida && (
                <View style={s.horarioCard}>
                  <Text style={s.horarioLabel}>Finalización</Text>
                  <Text style={s.horarioValor}>{planificacion.horaSalida}hs</Text>
                </View>
              )}
            </View>
          </View>

          {/* Invitados y Mesas */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <View style={s.sectionDot} />
              <Text style={s.sectionTitle}>Capacidad</Text>
            </View>
            <View style={s.grid2}>
              <View style={s.card}>
                <Text style={s.cardLabel}>Invitados</Text>
                <Text style={s.cardValue}>{evento.cantidadInvitados}</Text>
              </View>
              <View style={s.card}>
                <Text style={s.cardLabel}>Mesas</Text>
                <Text style={s.cardValue}>{planificacion.cantidadMesas}</Text>
              </View>
              <View style={s.card}>
                <Text style={s.cardLabel}>Aprox. por mesa</Text>
                <Text style={s.cardValue}>
                  {Math.ceil(evento.cantidadInvitados / planificacion.cantidadMesas)}
                </Text>
              </View>
            </View>
          </View>

          {/* Servicios */}
          {planificacion.servicios.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionDot} />
                <Text style={s.sectionTitle}>Servicios</Text>
              </View>
              <View style={s.serviciosGrid}>
                {planificacion.servicios.map((servicio, i) => {
                  const label = SERVICIOS_LABELS[servicio.tipoServicio] ?? `Servicio ${servicio.tipoServicio}`;
                  const detalle = [
                    servicio.cantidad ? `${servicio.cantidad} uds.` : null,
                    servicio.descripcion ?? null,
                  ].filter(Boolean).join(' · ');

                  return (
                    <View key={i} style={s.servicioChip}>
                      <Text style={s.servicioTexto}>
                        {label}{detalle ? ` — ${detalle}` : ''}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Timing */}
          {timingsOrdenados.length > 0 && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionDot} />
                <Text style={s.sectionTitle}>Cronograma</Text>
              </View>
              {timingsOrdenados.map((t, i) => (
                <View key={i} style={s.timingRow}>
                  <View style={s.timingOrden}>
                    <Text style={s.timingOrdenText}>{i + 1}</Text>
                  </View>
                  <Text style={s.timingMomento}>{t.momento}</Text>
                  <Text style={s.timingHora}>{t.hora}hs</Text>
                </View>
              ))}
            </View>
          )}

          {/* Observaciones */}
          {planificacion.observaciones && (
            <View style={s.section}>
              <View style={s.sectionHeader}>
                <View style={s.sectionDot} />
                <Text style={s.sectionTitle}>Observaciones</Text>
              </View>
              <View style={s.observacionesBox}>
                <Text style={s.observacionesTexto}>{planificacion.observaciones}</Text>
              </View>
            </View>
          )}

        </View>

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>
            Generado el {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })}
          </Text>
          <Text style={s.footerText}>{evento.nombreCliente} — {TipoEventoLabels[evento.tipoEvento]}</Text>
        </View>

      </Page>
    </Document>
  );
}