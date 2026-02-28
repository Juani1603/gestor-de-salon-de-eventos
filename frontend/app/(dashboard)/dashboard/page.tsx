'use client';

import { useEffect, useState } from 'react';
import { eventoService } from '@/app/services/eventoService';
import { Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';
import MiniCalendar from '@/app/components/MiniCalendar';
import { motion } from 'framer-motion';
import { Calendar, Users, FileText, Clock, ChevronRight, Sparkles } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease: 'easeOut' as const, delay },
});

export default function DashboardPage() {
  const [eventoProximo, setEventoProximo] = useState<Evento | null>(null);
  const [eventosDelMes, setEventosDelMes] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  const now = new Date();
  const hora = now.getHours();
  const saludo = hora < 12 ? 'Buenos días' : hora < 18 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    async function cargarDatos() {
      try {
        const mes = now.getMonth() + 1;
        const anio = now.getFullYear();
        const [proximo, eventos] = await Promise.all([
          eventoService.obtenerEventoProximo(),
          eventoService.obtenerEventosDelMes(mes, anio),
        ]);
        setEventoProximo(proximo);
        setEventosDelMes(eventos);
      } catch (error) {
        console.error('Error cargando dashboard:', error);
      } finally {
        setLoading(false);
      }
    }
    cargarDatos();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Cargando...</p>
        </div>
      </div>
    );
  }

  const diasParaEvento = eventoProximo
    ? Math.ceil((new Date(eventoProximo.fechaEvento).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div {...fadeUp(0)} className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-1">{saludo}</p>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Dashboard</h1>
          <p className="text-[#6B7280] mt-1 text-sm">
            {now.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
      </motion.div>

      {/* Top row: Próximo evento hero + Reunión + Calendario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

        {/* Card 1 — Próximo Evento (hero con gradiente) */}
        <motion.div
          {...fadeUp(0.08)}
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          className="relative rounded-2xl overflow-hidden min-h-[200px] flex flex-col"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
        >
          {/* Texture rings */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full border border-white/10 pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />

          <div className="relative z-10 flex flex-col flex-1 p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-widest text-white/70">Próximo Evento</span>
              {eventoProximo && (
                <span className="text-xs px-2 py-1 bg-white/20 text-white rounded-lg font-medium backdrop-blur-sm">
                  {EstadoEventoLabels[eventoProximo.estadoEvento]}
                </span>
              )}
            </div>

            {eventoProximo ? (
              <div className="flex-1 flex flex-col">
                <p className="text-2xl font-bold text-white mb-1 leading-tight">
                  {eventoProximo.nombreCliente}
                </p>
                <p className="text-sm text-white/75 mb-0.5">
                  {new Date(eventoProximo.fechaEvento).toLocaleDateString('es-ES', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </p>
                <p className="text-xs text-white/60">{TipoEventoLabels[eventoProximo.tipoEvento]}</p>

                <div className="mt-auto pt-4 border-t border-white/20 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-white/75 text-xs">
                    <Users size={11} />
                    {eventoProximo.cantidadInvitados} invitados
                  </div>
                  {diasParaEvento !== null && (
                    <span className="text-xs font-bold text-white bg-white/20 px-2 py-1 rounded-lg">
                      {diasParaEvento === 0 ? '¡Hoy!' : `en ${diasParaEvento}d`}
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-white/60 text-sm mt-2">No hay eventos próximos</p>
            )}
          </div>
        </motion.div>

        {/* Card 2 — Próxima Reunión */}
        <motion.div
          {...fadeUp(0.14)}
          whileHover={{ y: -3, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
          className="bg-white border border-[#F0F0F0] rounded-2xl p-6 flex flex-col min-h-[200px] hover:border-[#FFD4C2] hover:shadow-md transition-all duration-200"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF]">Próxima Reunión</span>
            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-medium">Agendada</span>
          </div>

          <div className="flex-1 flex flex-col">
            <p className="text-2xl font-bold text-[#1C1C1C] mb-1">María López</p>
            <div className="flex items-center gap-1.5 text-sm text-[#6B7280]">
              <Clock size={13} />
              Hoy, 14:00 hs
            </div>

            <div className="mt-auto pt-4 border-t border-[#F5F5F5] flex items-center justify-between">
              <p className="text-xs text-[#9CA3AF]">Visita al salón</p>
              <button
                className="flex items-center gap-1 text-xs font-semibold text-[#FF6B35] hover:gap-2 transition-all"
              >
                Ver <ChevronRight size={12} />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Card 3 — Mini Calendario */}
        <motion.div
          {...fadeUp(0.20)}
          className="bg-white border border-[#F0F0F0] rounded-2xl overflow-hidden min-h-[200px] hover:border-[#FFD4C2] hover:shadow-md transition-all duration-200 lg:col-span-1"
        >
          <MiniCalendar eventos={eventosDelMes} />
        </motion.div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          {
            icon: <Calendar size={18} />,
            value: eventosDelMes.length,
            label: 'Eventos',
            sub: 'este mes',
          },
          {
            icon: <Clock size={18} />,
            value: 12,
            label: 'Reuniones',
            sub: 'este mes',
          },
          {
            icon: <FileText size={18} />,
            value: 5,
            label: 'Cotizaciones',
            sub: 'pendientes',
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            {...fadeUp(0.28 + i * 0.06)}
            whileHover={{ y: -2, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
            className="bg-white border border-[#F0F0F0] rounded-2xl px-5 py-4 flex items-center gap-4 hover:border-[#FFD4C2] hover:shadow-md transition-all duration-200"
          >
            {/* Icon ring */}
            <div className="w-12 h-12 rounded-xl bg-[#FFF4F0] flex items-center justify-center shrink-0 text-[#FF6B35]">
              {stat.icon}
            </div>
            <div>
              <p className="text-2xl font-bold text-[#1C1C1C] leading-none">{stat.value}</p>
              <p className="text-sm text-[#3C3C3C] font-medium mt-0.5">{stat.label}</p>
              <p className="text-xs text-[#9CA3AF]">{stat.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}