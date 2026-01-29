'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, X } from 'lucide-react';
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
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(new Date().getMonth());
    setCurrentYear(new Date().getFullYear());
  };

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const calendarDays = [];
  
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push({ day: null, eventos: [] });
  }
  
  for (let day = 1; day <= daysInMonth; day++) {
    const eventosDelDia = eventos.filter(evento => {
      const fechaEvento = new Date(evento.fechaEvento);
      return fechaEvento.getDate() === day;
    });
    
    calendarDays.push({ day, eventos: eventosDelDia });
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear === today.getFullYear()
    );
  };

  const currentYearNow = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => currentYearNow - 5 + i);

  return (
    <div className="flex gap-6">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-[#3C3C3C]">Eventos</h1>
            <p className="text-[#6B7280] mt-2">Gestiona el calendario de eventos</p>
          </div>
          <button className="btn-primary flex items-center gap-2 justify-center sm:justify-start">
            <Plus size={18} />
            Nuevo Evento
          </button>
        </div>

        <div className="card p-4 sm:p-6">
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronLeft size={20} className="text-[#6B7280]" />
                </button>
                
                <h2 className="text-lg sm:text-xl font-semibold text-[#3C3C3C] min-w-[180px] text-center">
                  {MONTHS[currentMonth]} {currentYear}
                </h2>
                
                <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <ChevronRight size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <button onClick={goToToday} className="btn-secondary flex items-center gap-2">
                <Calendar size={16} />
                Hoy
              </button>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(parseInt(e.target.value))}
                className="text-sm border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#3C3C3C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent cursor-pointer"
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(parseInt(e.target.value))}
                className="text-sm border border-[#E8E8E8] rounded-lg px-3 py-2 text-[#3C3C3C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent cursor-pointer"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="hidden sm:grid grid-cols-7 gap-2 mb-2">
            {DAYS_SHORT.map((day, index) => (
              <div key={`header-${index}`} className="text-center text-sm font-semibold text-[#6B7280] py-2">{day}</div>
            ))}
          </div>

          <div className="grid sm:hidden grid-cols-7 gap-1 mb-2">
            {DAYS_MOBILE.map((day, index) => (
              <div key={`header-mobile-${index}`} className="text-center text-xs font-semibold text-[#6B7280] py-1">{day}</div>
            ))}
          </div>

          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <p className="text-[#9CA3AF]">Cargando eventos...</p>
            </div>
          ) : (
            <>
              <div className="hidden sm:grid grid-cols-7 gap-2">
                {calendarDays.map((item, index) => {
                  const { day, eventos: eventosDelDia } = item;
                  return (
                    <div key={`day-${index}`} className={`min-h-[120px] p-3 rounded-lg border transition-all ${day ? 'bg-white hover:shadow-md' : 'bg-gray-50'} ${isToday(day) ? 'border-[#FF6B35] border-2' : 'border-[#E8E8E8]'}`}>
                      {day && (
                        <>
                          <div className={`text-sm font-medium mb-2 ${isToday(day) ? 'text-[#FF6B35]' : 'text-[#6B7280]'}`}>{day}</div>
                          <div className="space-y-1">
                            {eventosDelDia.map(evento => (
                              <div key={evento.id} onClick={() => setSelectedEvento(evento)} className="text-xs p-2 rounded-md bg-[#FF6B35] text-white hover:bg-[#E85A2B] transition-colors cursor-pointer truncate">
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

              <div className="sm:hidden grid grid-cols-7 gap-1">
                {calendarDays.map((item, index) => {
                  const { day, eventos: eventosDelDia } = item;
                  const hasEvents = eventosDelDia.length > 0;
                  return (
                    <div key={`day-mobile-${index}`} onClick={() => hasEvents && setSelectedEvento(eventosDelDia[0])} className={`aspect-square p-1 rounded-lg border transition-all text-center flex flex-col items-center justify-center ${day ? 'bg-white' : 'bg-gray-50'} ${hasEvents ? 'cursor-pointer' : ''} ${isToday(day) ? 'border-[#FF6B35] border-2' : 'border-[#E8E8E8]'}`}>
                      {day && (
                        <>
                          <div className={`text-xs ${isToday(day) ? 'text-[#FF6B35] font-bold' : 'text-[#6B7280]'}`}>{day}</div>
                          {hasEvents && <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-1" />}
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {selectedEvento && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/50 z-40" onClick={() => setSelectedEvento(null)} />
          <div className="fixed top-0 right-0 w-80 bg-white border-l border-[#E8E8E8] z-50 h-screen overflow-y-auto shadow-2xl lg:sticky lg:top-6 lg:h-[calc(100vh-12rem)] lg:shadow-none">
            <div className="flex flex-col h-full p-6">
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-semibold text-[#3C3C3C]">Detalles del Evento</h3>
                <button onClick={() => setSelectedEvento(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X size={20} className="text-[#6B7280]" />
                </button>
              </div>

              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Cliente</p>
                  <p className="text-lg font-semibold text-[#3C3C3C]">{selectedEvento.nombreCliente}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Fecha del Evento</p>
                  <p className="text-base text-[#3C3C3C]">
                    {new Date(selectedEvento.fechaEvento).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Tipo de Evento</p>
                  <span className="inline-block px-3 py-1 bg-[#FEF3F0] text-[#FF6B35] rounded-full text-sm font-medium">
                    {TipoEventoLabels[selectedEvento.tipoEvento]}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Estado</p>
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {EstadoEventoLabels[selectedEvento.estadoEvento]}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Cantidad de Invitados</p>
                  <p className="text-2xl font-semibold text-[#3C3C3C]">{selectedEvento.cantidadInvitados}</p>
                </div>
                <div>
                  <p className="text-xs font-medium text-[#9CA3AF] uppercase tracking-wide mb-2">Precio por Invitado</p>
                  <p className="text-lg font-semibold text-[#3C3C3C]">${selectedEvento.precioPorInvitado.toFixed(2)}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-[#E8E8E8] space-y-3">
                <button className="btn-primary w-full">Ver Planificación</button>
                <button className="btn-secondary w-full">Editar Evento</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}