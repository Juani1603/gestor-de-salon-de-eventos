'use client';

import { useEffect, useState } from 'react';
import { eventoService } from '@/app/services/eventoService';
import { Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';
import MiniCalendar from '@/app/components/MiniCalendar';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const [eventoProximo, setEventoProximo] = useState<Evento | null>(null);
  const [eventosDelMes, setEventosDelMes] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarDatos() {
      try {
        const now = new Date();
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
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.p 
            className="text-[#6B7280]"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Cargando...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-[#E8E8E8] pb-6">
        <h1 className="text-3xl font-semibold text-[#3C3C3C]">
          Dashboard
        </h1>
        <p className="text-[#6B7280] mt-2">
          Resumen de tu sistema de gestión
        </p>
      </div>

      {/* Grid de cards principales - más altura */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 - Próximo Evento */}
        <motion.div 
          className="relative card p-6 transition-shadow overflow-hidden min-h-[280px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 0.2
          }}
          whileHover={{
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
        >
          {/* Degradado naranja con blur - menor opacidad y tamaño */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FF6B35] opacity-10 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-[#FF8C61] opacity-8 blur-2xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#6B7280]">Próximo Evento</h3>
              {eventoProximo && (
                <motion.span 
                  className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                >
                  {EstadoEventoLabels[eventoProximo.estadoEvento]}
                </motion.span>
              )}
            </div>

            {eventoProximo ? (
              <motion.div
                className="flex-1 flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
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
                <motion.div 
                  className="mt-auto pt-4 border-t border-[#F3F4F6]"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.3 }}
                  style={{ transformOrigin: "left" }}
                >
                  <p className="text-xs text-[#9CA3AF]">
                    {eventoProximo.cantidadInvitados} invitados
                  </p>
                </motion.div>
              </motion.div>
            ) : (
              <p className="text-[#9CA3AF]">No hay eventos próximos</p>
            )}
          </div>
        </motion.div>

        {/* Card 2 - Próxima Reunión */}
        <motion.div 
          className="relative card p-6 transition-shadow overflow-hidden min-h-[280px] flex flex-col"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 0.28
          }}
          whileHover={{
            y: -5,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 20
            }
          }}
        >
          {/* Degradado naranja con blur - menor opacidad y tamaño */}
          <div className="absolute -top-16 -left-16 w-32 h-32 bg-[#FF6B35] opacity-10 blur-2xl rounded-full pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#FF8C61] opacity-8 blur-2xl rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-[#6B7280]">Próxima Reunión</h3>
              <motion.span 
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              >
                Agendada
              </motion.span>
            </div>
            <div className="flex-1 flex flex-col">
              <p className="text-2xl font-semibold text-[#3C3C3C] mb-1">María López</p>
              <p className="text-sm text-[#9CA3AF]">Hoy, 14:00 hs</p>
              <motion.div 
                className="mt-auto pt-4 border-t border-[#F3F4F6]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.7, duration: 0.3 }}
                style={{ transformOrigin: "left" }}
              >
                <p className="text-xs text-[#9CA3AF]">Visita al salón</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Card 3 - Mini Calendario */}
        <motion.div 
          className="lg:col-span-1 relative overflow-hidden rounded-lg min-h-[280px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 12,
            delay: 0.36
          }}
        >
          {/* Degradado naranja con blur para el calendario - menor opacidad */}
          <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#FF6B35] opacity-10 blur-2xl rounded-full pointer-events-none z-0" />
          <div className="absolute -bottom-12 -left-12 w-28 h-28 bg-[#FF8C61] opacity-8 blur-2xl rounded-full pointer-events-none z-0" />
          <div className="relative z-10 h-full">
            <MiniCalendar eventos={eventosDelMes} />
          </div>
        </motion.div>
      </div>

      {/* Estadísticas rápidas - círculos con borde naranja */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <motion.div 
          className="card p-4 flex items-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.44
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Círculo con borde naranja */}
          <motion.div 
            className="w-14 h-14 rounded-full border-2 border-[#FF6B35] bg-transparent flex items-center justify-center flex-shrink-0"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 150 }}
          >
            <span className="text-[#FF6B35] text-xl font-bold">{eventosDelMes.length}</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3C3C3C]">Eventos</p>
            <p className="text-xs text-[#9CA3AF]">este mes</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="card p-4 flex items-center gap-4"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.52
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Círculo con borde naranja */}
          <motion.div 
            className="w-14 h-14 rounded-full border-2 border-[#FF6B35] bg-transparent flex items-center justify-center flex-shrink-0"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 150 }}
          >
            <span className="text-[#FF6B35] text-xl font-bold">12</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3C3C3C]">Reuniones</p>
            <p className="text-xs text-[#9CA3AF]">este mes</p>
          </div>
        </motion.div>
        
        <motion.div 
          className="card p-4 flex items-center gap-4 sm:col-span-2 lg:col-span-1"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 15,
            delay: 0.60
          }}
          whileHover={{ scale: 1.02 }}
        >
          {/* Círculo con borde naranja */}
          <motion.div 
            className="w-14 h-14 rounded-full border-2 border-[#FF6B35] bg-transparent flex items-center justify-center flex-shrink-0"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ delay: 0.7, type: "spring", stiffness: 150 }}
          >
            <span className="text-[#FF6B35] text-xl font-bold">5</span>
          </motion.div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3C3C3C]">Cotizaciones</p>
            <p className="text-xs text-[#9CA3AF]">pendientes</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}