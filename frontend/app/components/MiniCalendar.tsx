'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface MiniCalendarProps {
  eventDates: number[]; // Array de días del mes con eventos
}

const DAYS = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function MiniCalendar({ eventDates }: MiniCalendarProps) {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  
  const days = [];
  
  // Días vacíos antes del primer día
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-8" />);
  }
  
  // Días del mes
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvent = eventDates.includes(day);
    const isToday = day === today.getDate();
    
    days.push(
      <div
        key={`day-${day}`}
        className={`
          h-8 w-8 flex items-center justify-center text-sm rounded-full transition-colors
          ${hasEvent 
            ? 'bg-[#FF6B35] text-white font-semibold' 
            : isToday 
              ? 'font-bold text-[#FF6B35]' 
              : 'text-[#6B7280]'
          }
        `}
      >
        {day}
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
    </div>
  );
}