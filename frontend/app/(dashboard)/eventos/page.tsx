'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, X, Users, DollarSign } from 'lucide-react';
import { eventoService } from '@/app/services/eventoService';
import { Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAYS_MOBILE = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export default function EventosPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);

  useEffect(() => {
    cargarEventosDelMes();
  }, [currentMonth, currentYear]);

  async function cargarEventosDelMes() {
    setLoading(true);
    try {
      const mes = currentMonth + 1;
      const eventosData = await eventoService.obtenerEventosDelMes(mes, currentYear);
      setEventos(eventosData);
    } catch (error) {
      console.error('Error cargando eventos:', error);
    } finally {
      setLoading(false);
    }
  }

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
  };

  const goToToday = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const calendarDays: { day: number | null; eventos: Evento[] }[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) calendarDays.push({ day: null, eventos: [] });
  for (let day = 1; day <= daysInMonth; day++) {
    const eventosDelDia = eventos.filter(e => new Date(e.fechaEvento).getDate() === day);
    calendarDays.push({ day, eventos: eventosDelDia });
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const currentYearNow = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYearNow - 5 + i);

  return (
    <div className="flex-1 space-y-6 min-w-0">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-1">Calendario</p>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Eventos</h1>
          <p className="text-[#6B7280] mt-1 text-sm">Gestiona el calendario de eventos</p>
        </div>
        <button
          className="group flex items-center gap-2 justify-center sm:justify-start px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
        >
          <Plus size={16} className="transition-transform group-hover:rotate-90 duration-200" />
          Nuevo Evento
        </button>
      </div>

      {/*  Calendar card y Side panel */}
      <div className="flex gap-6 items-stretch">

        {/* Calendar card */}
        <div className="bg-white border border-[#F0F0F0] rounded-2xl p-4 sm:p-6 flex-1 min-w-0">

          {/* Controls */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={prevMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronLeft size={18} className="text-[#6B7280]" />
                </button>

                <h2 className="text-lg font-bold text-[#1C1C1C] min-w-[190px] text-center">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>

                <button
                  onClick={nextMonth}
                  className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors"
                >
                  <ChevronRight size={18} className="text-[#6B7280]" />
                </button>
              </div>

              <button
                onClick={goToToday}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors"
              >
                <Calendar size={14} />
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="text-sm border border-[#EBEBEB] rounded-xl px-3 py-2 text-[#3C3C3C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] cursor-pointer transition-all"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="text-sm border border-[#EBEBEB] rounded-xl px-3 py-2 text-[#3C3C3C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] cursor-pointer transition-all"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Day headers — desktop */}
          <div className="hidden sm:grid grid-cols-7 gap-2 mb-2">
            {DAYS_SHORT.map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Day headers — mobile */}
          <div className="grid sm:hidden grid-cols-7 gap-1 mb-2">
            {DAYS_MOBILE.map((day, i) => (
              <div key={i} className="text-center text-xs font-semibold text-[#9CA3AF] py-1">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#9CA3AF] text-sm">Cargando eventos...</p>
            </div>
          ) : (
            <>
              {/* Desktop grid */}
              <div className="hidden sm:grid grid-cols-7 gap-2">
                {calendarDays.map((item, index) => {
                  const { day, eventos: eventosDelDia } = item;
                  const today = isToday(day);
                  return (
                    <div
                      key={index}
                      className={`min-h-[110px] p-2.5 rounded-xl border transition-all ${
                        day ? 'bg-white hover:shadow-sm' : 'bg-[#FAFAFA]'
                      } ${today ? 'border-[#FF6B35] border-2' : 'border-[#F0F0F0]'}`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs font-semibold mb-2 w-6 h-6 flex items-center justify-center rounded-full ${
                            today ? 'bg-[#FF6B35] text-white' : 'text-[#6B7280]'
                          }`}>
                            {day}
                          </div>
                          <div className="space-y-1">
                            {eventosDelDia.map(evento => (
                              <div
                                key={evento.id}
                                onClick={() => setSelectedEvento(evento)}
                                className="text-xs px-2 py-1 rounded-lg text-white font-medium cursor-pointer truncate transition-all hover:brightness-90 active:scale-95"
                                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                              >
                                {evento.nombreCliente}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Mobile grid */}
              <div className="sm:hidden grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => {
                  const { day, eventos: eventosDelDia } = item;
                  const hasEvents = eventosDelDia.length > 0;
                  const today = isToday(day);
                  return (
                    <div
                      key={index}
                      onClick={() => hasEvents && setSelectedEvento(eventosDelDia[0])}
                      className={`aspect-square p-1 rounded-lg border flex flex-col items-center justify-center transition-all ${
                        day ? 'bg-white' : 'bg-[#FAFAFA]'
                      } ${hasEvents ? 'cursor-pointer' : ''} ${
                        today ? 'border-[#FF6B35] border-2' : 'border-[#F0F0F0]'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-xs ${today ? 'text-[#FF6B35] font-bold' : 'text-[#6B7280]'}`}>
                            {day}
                          </div>
                          {hasEvents && (
                            <div className="w-1.5 h-1.5 rounded-full mt-0.5"
                              style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)' }} />
                          )}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ← Side panel ahora es hermano directo del calendar card */}
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden self-stretch ${
            selectedEvento ? 'w-96 opacity-100' : 'w-0 opacity-0 pointer-events-none'
          }`}
        >
          {/* Mobile overlay */}
          {selectedEvento && (
            <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelectedEvento(null)} />
          )}

          <div className="fixed top-0 right-0 w-96 bg-white z-50 h-screen overflow-y-auto shadow-2xl lg:static lg:h-full lg:shadow-none lg:rounded-2xl lg:border lg:border-[#F0F0F0] lg:overflow-y-auto"
            style={{
              transform: selectedEvento ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.3s ease-in-out',
            }}
          >
            {/* Panel header */}
            <div
              className="px-6 py-4 flex items-center justify-between rounded-t-2xl"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-white/70">Detalle</p>
                <h3 className="text-lg font-bold text-white leading-tight">Evento</h3>
              </div>
              <button
                onClick={() => setSelectedEvento(null)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-white/20 hover:bg-white/30 transition-colors"
              >
                <X size={16} className="text-white" />
              </button>
            </div>

            {selectedEvento && (
              <div className="flex flex-col p-6 gap-5">

                {/* Cliente */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Cliente</p>
                  <p className="text-xl font-bold text-[#1C1C1C]">{selectedEvento.nombreCliente}</p>
                </div>

                {/* Fecha */}
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Fecha</p>
                  <p className="text-sm text-[#3C3C3C]">
                    {new Date(selectedEvento.fechaEvento).toLocaleDateString('es-ES', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  </p>
                </div>

                {/* Tipo + Estado en fila */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Tipo</p>
                    <span className="inline-block px-3 py-1 bg-[#FEF3F0] text-[#FF6B35] rounded-lg text-xs font-semibold">
                      {TipoEventoLabels[selectedEvento.tipoEvento]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Estado</p>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
                      {EstadoEventoLabels[selectedEvento.estadoEvento]}
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1">
                      <Users size={12} />
                      <span className="text-xs">Invitados</span>
                    </div>
                    <p className="text-2xl font-bold text-[#1C1C1C]">{selectedEvento.cantidadInvitados}</p>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1">
                      <DollarSign size={12} />
                      <span className="text-xs">Por persona</span>
                    </div>
                    <p className="text-2xl font-bold text-[#1C1C1C]">${selectedEvento.precioPorInvitado.toFixed(0)}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                  >
                    Ver Planificación
                  </button>
                  <button className="w-full px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors">
                    Editar Evento
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}