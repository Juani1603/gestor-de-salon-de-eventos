'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Evento, TipoEventoLabels } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MiniCalendarProps {
  eventos: Evento[];
}

const DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function MiniCalendar({ eventos }: MiniCalendarProps) {
  const [hoveredDay, setHoveredDay] = useState<{ day: number; element: HTMLDivElement } | null>(null);
  
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  // Crear un mapa de día -> eventos
  const eventosPorDia = eventos.reduce((acc, evento) => {
    const day = new Date(evento.fechaEvento).getDate();
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(evento);
    return acc;
  }, {} as Record<number, Evento[]>);
  
  const handleMouseEnter = (day: number, element: HTMLDivElement) => {
    setHoveredDay({ day, element });
  };

  const handleMouseLeave = () => {
    setHoveredDay(null);
  };

  const days = [];
  
  // Días vacíos antes del primer día
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const eventosDelDia = eventosPorDia[day] || [];
    const hasEvent = eventosDelDia.length > 0;
    const isToday = day === today.getDate();
    
    days.push(
      <div
        key={`day-${day}`}
        className="relative"
        onMouseEnter={(e) => hasEvent && handleMouseEnter(day, e.currentTarget)}
        onMouseLeave={handleMouseLeave}
      >
        <div
          className={`
            h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors cursor-pointer
            ${hasEvent 
              ? 'bg-[#FF6B35] text-white font-semibold hover:bg-[#FF8C61]' 
              : isToday 
                ? 'font-bold text-[#FF6B35]' 
                : 'text-[#6B7280]'
            }
          `}
        >
          {day}
        </div>

        {/* Tooltip inline con position absolute */}
        <AnimatePresence>
          {hoveredDay?.day === day && hasEvent && (
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute z-[9999] bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none"
              style={{ minWidth: '224px' }}
            >
              <div className="bg-white rounded-lg shadow-lg border border-[#E8E8E8] p-3">
                {/* Flecha del tooltip */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-px">
                  <div className="border-[6px] border-transparent border-t-white"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full border-[6px] border-transparent border-t-[#E8E8E8]"></div>
                </div>

                {/* Contenido del tooltip */}
                <div className="space-y-2">
                  {eventosDelDia.map((evento, index) => (
                    <div 
                      key={evento.id}
                      className={`${index > 0 ? 'pt-2 border-t border-[#F3F4F6]' : ''}`}
                    >
                      <p className="text-sm font-semibold text-[#3C3C3C] truncate">
                        {evento.nombreCliente}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {TipoEventoLabels[evento.tipoEvento]}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {evento.cantidadInvitados} invitados
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="card p-5 relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#3C3C3C]">
          {MONTHS[month]} {year}
        </h3>
      </div>

      {/* Días de la semana */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day, index) => (
          <div 
            key={`day-header-${index}`} 
            className="h-8 flex items-center justify-center text-xs font-medium text-[#9CA3AF]"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Días del mes */}
      <div className="grid grid-cols-7 gap-1 mb-4">
        {days}
      </div>

      {/* Botón Ver Más */}
      <Link href="/eventos">
        <button className="w-full btn-secondary text-sm py-2">
          Ver calendario completo
        </button>
      </Link>
    </div>
  );
}