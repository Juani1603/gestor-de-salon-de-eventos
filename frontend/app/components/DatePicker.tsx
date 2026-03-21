'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, ChevronDown } from 'lucide-react';

const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];
const DAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

interface DatePickerProps {
  value: string; // formato YYYY-MM-DD
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function DatePicker({ value, onChange, placeholder = 'Seleccionar fecha' }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'days' | 'months' | 'years'>('days');
  const ref = useRef<HTMLDivElement>(null);

  const today = new Date();
  const parsed = value ? new Date(value + 'T00:00:00') : null;

  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? today.getMonth());
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? today.getFullYear());

  const currentYearNow = today.getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => currentYearNow + i);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setView('days');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (parsed) {
      setViewMonth(parsed.getMonth());
      setViewYear(parsed.getFullYear());
    }
  }, [value]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();

  const calendarDays: (number | null)[] = [
    ...Array(firstDayOfMonth).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  function handleSelectDay(day: number) {
    const month = String(viewMonth + 1).padStart(2, '0');
    const dayStr = String(day).padStart(2, '0');
    onChange(`${viewYear}-${month}-${dayStr}`);
    setOpen(false);
    setView('days');
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  }

  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
  }

  function isSelected(day: number) {
    if (!parsed) return false;
    return parsed.getDate() === day && parsed.getMonth() === viewMonth && parsed.getFullYear() === viewYear;
  }

  function isToday(day: number) {
    return today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
  }

  const displayValue = parsed
    ? parsed.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div ref={ref} className="relative w-full">
      {/* Input trigger */}
      <button
        type="button"
        onClick={() => { setOpen(!open); setView('days'); }}
        className={`w-full flex items-center justify-between px-4 py-2.5 border rounded-xl text-sm transition-all focus:outline-none ${
          open
            ? 'border-[#FF6B35] ring-2 ring-[#FF6B35]/30'
            : 'border-[#EBEBEB] hover:border-[#FF6B35]/50'
        } bg-white`}
      >
        <span className={displayValue ? 'text-[#1C1C1C]' : 'text-[#C4C4C4]'}>
          {displayValue ?? placeholder}
        </span>
        <CalendarDays size={15} className={open ? 'text-[#FF6B35]' : 'text-[#9CA3AF]'} />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute top-full left-0 mt-2 bg-white border border-[#EBEBEB] rounded-2xl shadow-xl z-50 p-4 w-full min-w-[280px]"
          style={{ animation: 'dpIn 0.15s ease-out' }}
        >
          {/* Header navegación */}
          <div className="flex items-center justify-between mb-3">
            {view === 'days' && (
              <button type="button" onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFF4F0] hover:text-[#FF6B35] text-[#6B7280] transition-colors">
                <ChevronLeft size={16} />
              </button>
            )}
            {view !== 'days' && <div className="w-8" />}

            {/* Título clickeable */}
            <div className="flex items-center gap-1">
              {view === 'days' && (
                <>
                  <button type="button" onClick={() => setView('months')}
                    className="flex items-center gap-0.5 text-sm font-bold text-[#1C1C1C] hover:text-[#FF6B35] transition-colors px-1 py-0.5 rounded-lg hover:bg-[#FFF4F0]">
                    {MONTHS[viewMonth]}
                    <ChevronDown size={13} className="text-[#9CA3AF]" />
                  </button>
                  <button type="button" onClick={() => setView('years')}
                    className="flex items-center gap-0.5 text-sm font-bold text-[#1C1C1C] hover:text-[#FF6B35] transition-colors px-1 py-0.5 rounded-lg hover:bg-[#FFF4F0]">
                    {viewYear}
                    <ChevronDown size={13} className="text-[#9CA3AF]" />
                  </button>
                </>
              )}
              {view === 'months' && (
                <span className="text-sm font-bold text-[#1C1C1C]">Seleccionar mes</span>
              )}
              {view === 'years' && (
                <span className="text-sm font-bold text-[#1C1C1C]">Seleccionar año</span>
              )}
            </div>

            {view === 'days' && (
              <button type="button" onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FFF4F0] hover:text-[#FF6B35] text-[#6B7280] transition-colors">
                <ChevronRight size={16} />
              </button>
            )}
            {view !== 'days' && (
              <button type="button" onClick={() => setView('days')}
                className="text-xs font-semibold text-[#9CA3AF] hover:text-[#FF6B35] transition-colors px-2 py-1 rounded-lg hover:bg-[#FFF4F0]">
                ✕
              </button>
            )}
          </div>

          {/* Vista: meses */}
          {view === 'months' && (
            <div className="grid grid-cols-3 gap-1.5">
              {MONTHS.map((month, i) => (
                <button key={i} type="button"
                  onClick={() => { setViewMonth(i); setView('days'); }}
                  className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                    i === viewMonth
                      ? 'text-white font-bold shadow-sm shadow-orange-200'
                      : 'text-[#3C3C3C] hover:bg-[#FFF4F0] hover:text-[#FF6B35]'
                  }`}
                  style={i === viewMonth ? { background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' } : {}}
                >
                  {month}
                </button>
              ))}
            </div>
          )}

          {/* Vista: años */}
          {view === 'years' && (
            <div className="grid grid-cols-3 gap-1.5">
              {yearOptions.map(year => (
                <button key={year} type="button"
                  onClick={() => { setViewYear(year); setView('days'); }}
                  className={`px-2 py-2 rounded-xl text-xs font-medium transition-all ${
                    year === viewYear
                      ? 'text-white font-bold shadow-sm shadow-orange-200'
                      : 'text-[#3C3C3C] hover:bg-[#FFF4F0] hover:text-[#FF6B35]'
                  }`}
                  style={year === viewYear ? { background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' } : {}}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Vista: días */}
          {view === 'days' && (
            <>
              <div className="grid grid-cols-7 mb-1">
                {DAYS_SHORT.map(d => (
                  <div key={d} className="text-center text-[10px] font-semibold uppercase tracking-wider text-[#9CA3AF] py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-y-1">
                {calendarDays.map((day, i) => (
                  <div key={i} className="flex items-center justify-center">
                    {day ? (
                      <button type="button" onClick={() => handleSelectDay(day)}
                        className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                          isSelected(day)
                            ? 'text-white font-bold shadow-md shadow-orange-200'
                            : isToday(day)
                            ? 'border border-[#FF6B35] text-[#FF6B35] hover:bg-[#FFF4F0]'
                            : 'text-[#3C3C3C] hover:bg-[#FFF4F0] hover:text-[#FF6B35]'
                        }`}
                        style={isSelected(day) ? { background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' } : {}}
                      >
                        {day}
                      </button>
                    ) : null}
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-3 border-t border-[#F0F0F0] flex justify-between items-center">
                <button type="button"
                  onClick={() => {
                    const t = new Date();
                    setViewMonth(t.getMonth());
                    setViewYear(t.getFullYear());
                    handleSelectDay(t.getDate());
                  }}
                  className="text-xs font-semibold text-[#FF6B35] hover:text-[#FF8C5A] transition-colors"
                >
                  Hoy
                </button>
                {value && (
                  <button type="button"
                    onClick={() => { onChange(''); setOpen(false); }}
                    className="text-xs font-semibold text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    Limpiar
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes dpIn {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}