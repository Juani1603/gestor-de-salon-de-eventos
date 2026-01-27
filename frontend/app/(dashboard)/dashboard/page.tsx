'use client';

import { useEffect, useState } from 'react';
import { eventoService } from '@/app/services/eventoService';
import { Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';
import MiniCalendar from '@/app/components/MiniCalendar';

export default function DashboardPage() {
  const [eventoProximo, setEventoProximo] = useState<Evento | null>(null);
  const [eventosDelMes, setEventosDelMes] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const now = new Date();
        const mes = now.getMonth() + 1; // JavaScript months are 0-indexed
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

  // Extraer días con eventos para el mini calendario
  const eventDates = eventosDelMes.map(evento => 
    new Date(evento.fechaEvento).getDate()
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#6B7280]">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b border-[#E8E8E8] pb-6">
        <h1 className="text-3xl font-semibold text-[#3C3C3C]">Dashboard</h1>
        <p className="text-[#6B7280] mt-2">Resumen de tu sistema de gestión</p>
      </div>

      {/* Grid de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Próximo Evento */}
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">Próximo Evento</h3>
            {eventoProximo && (
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                {EstadoEventoLabels[eventoProximo.estadoEvento]}
              </span>
            )}
          </div>
          
          {eventoProximo ? (
            <>
              <p className="text-2xl font-semibold text-[#3C3C3C] mb-1">
                {eventoProximo.nombreCliente}
              </p>
              <p className="text-sm text-[#9CA3AF] mb-1">
                {new Date(eventoProximo.fechaEvento).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
              <p className="text-xs text-[#9CA3AF]">
                {TipoEventoLabels[eventoProximo.tipoEvento]}
              </p>
              <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
                <p className="text-xs text-[#9CA3AF]">
                  {eventoProximo.cantidadInvitados} invitados
                </p>
              </div>
            </>
          ) : (
            <p className="text-[#9CA3AF]">No hay eventos próximos</p>
          )}
        </div>

        {/* Card 2 - Próxima Reunión */}
        <div className="card p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-[#6B7280]">Próxima Reunión</h3>
            <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
              Agendada
            </span>
          </div>
          <p className="text-2xl font-semibold text-[#3C3C3C] mb-1">María López</p>
          <p className="text-sm text-[#9CA3AF]">Hoy, 14:00 hs</p>
          <div className="mt-4 pt-4 border-t border-[#F3F4F6]">
            <p className="text-xs text-[#9CA3AF]">Visita al salón</p>
          </div>
        </div>

        {/* Card 3 - Mini Calendario */}
        <div className="lg:col-span-1">
          <MiniCalendar eventDates={eventDates} />
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-6">
          <p className="text-sm text-[#6B7280] mb-1">Eventos este mes</p>
          <p className="text-3xl font-semibold text-[#3C3C3C]">{eventosDelMes.length}</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-[#6B7280] mb-1">Reuniones este mes</p>
          <p className="text-3xl font-semibold text-[#3C3C3C]">12</p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-[#6B7280] mb-1">Cotizaciones pendientes</p>
          <p className="text-3xl font-semibold text-[#3C3C3C]">5</p>
        </div>
      </div>
    </div>
  );
}