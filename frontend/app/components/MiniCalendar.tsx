'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Evento, TipoEventoLabels } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';

interface MiniCalendarProps {
  eventos: Evento[];
}

interface TooltipState {
  day: number;
  x: number;
  y: number;
} 

const DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const TOOLTIP_WIDTH = 224;

function Tooltip({
  tooltip,
  eventosDelDia,
}: {
  tooltip: TooltipState;
  eventosDelDia: Evento[];
}) {
  const [pos, setPos] = useState({ x: tooltip.x, y: tooltip.y });

  useEffect(() => {
    setPos({ x: tooltip.x, y: tooltip.y });
  }, [tooltip]);

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={`tooltip-${tooltip.day}`}
        initial={{ opacity: 0, y: 5, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 5, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-[9999] pointer-events-none"
        style={{
          left: pos.x,
          bottom: pos.y,
          width: TOOLTIP_WIDTH,
        }}
      >
        <div className="bg-white rounded-lg shadow-lg border border-[#E8E8E8] p-3">
          {/* Flecha del tooltip */}
          <div
            className="absolute left-1/2 -translate-x-1/2 top-full"
            style={{ marginTop: '-1px' }}
          >
            <div className="border-[6px] border-transparent border-t-[#E8E8E8]" />
            <div
              className="absolute border-[5px] border-transparent border-t-white"
              style={{ top: '-7px', left: '50%', transform: 'translateX(-50%)' }}
            />
          </div>

          {/* Contenido */}
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
    </AnimatePresence>,
    document.body
  );
}

export default function MiniCalendar({ eventos }: MiniCalendarProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const eventosPorDia = eventos.reduce((acc, evento) => {
    const day = new Date(evento.fechaEvento).getDate();
    if (!acc[day]) acc[day] = [];
    acc[day].push(evento);
    return acc;
  }, {} as Record<number, Evento[]>);

  const handleMouseEnter = (day: number, el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    setTooltip({
      day,
      x: rect.left + rect.width / 2 - TOOLTIP_WIDTH / 2,
      // Distancia desde el borde inferior de la pantalla hasta el borde superior del círculo
      y: window.innerHeight - rect.top + 8,
    });
  };

  const handleMouseLeave = () => setTooltip(null);

  const days = [];

  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const eventosDelDia = eventosPorDia[day] || [];
    const hasEvent = eventosDelDia.length > 0;
    const isToday = day === today.getDate();

    days.push(
      <div
        key={`day-${day}`}
        className="flex items-center justify-center"
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
          onMouseEnter={(e) => hasEvent && handleMouseEnter(day, e.currentTarget)}
          onMouseLeave={handleMouseLeave}
        >
          {day}
        </div>
      </div>
    );
  }

  return (
    <div className="card p-5">
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
      {/* Tooltip via portal — único, fuera del árbol del calendario */}
      {tooltip && eventosPorDia[tooltip.day] && (
        <Tooltip tooltip={tooltip} eventosDelDia={eventosPorDia[tooltip.day]} />
      )}
    </div>
  );
}