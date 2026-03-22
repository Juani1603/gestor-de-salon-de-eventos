'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronDown, ChevronRight, Plus, Calendar, X, Users, DollarSign, Star, Heart, Cake, Briefcase, CheckCircle, AlertCircle, Trash2, AlertTriangle } from 'lucide-react';
import { eventoService } from '@/app/services/eventoService';
import { Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';
import DatePicker from '@/app/components/DatePicker';
import PageTransition from '@/app/components/PageTransition';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const DAYS_MOBILE = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MONTHS = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const TIPO_EVENTO_OPTIONS = [
  { value: 0, label: 'Quinceaños', icon: <Star size={15} /> },
  { value: 1, label: 'Boda', icon: <Heart size={15} /> },
  { value: 2, label: 'Cumpleaños', icon: <Cake size={15} /> },
  { value: 3, label: 'Empresarial', icon: <Briefcase size={15} /> },
];

const FORM_INITIAL = {
  nombreCliente: '',
  fechaEvento: '',
  tipoEvento: 0,
  cantidadInvitados: '',
  precioPorInvitado: '',
  estadoEvento: 0,
};

function SelectCustom({
  value,
  onChange,
  options,
  className = '',
}: {
  value: number;
  onChange: (val: number) => void;
  options: { value: number; label: string }[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button type="button" onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 text-sm border border-[#EBEBEB] rounded-xl px-3 py-2 text-[#3C3C3C] bg-white hover:border-[#FF6B35] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] cursor-pointer transition-all">
        {selected?.label}
        <ChevronDown size={14} className={`text-[#9CA3AF] transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 bg-white border border-[#EBEBEB] rounded-xl shadow-lg z-50 py-1 min-w-full max-h-52 overflow-y-auto">
          {options.map(opt => (
            <button key={opt.value} type="button" onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors ${opt.value === value ? 'bg-[#FFF4F0] text-[#FF6B35] font-semibold' : 'text-[#3C3C3C] hover:bg-[#FFF4F0] hover:text-[#FF6B35]'}`}>
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// Lee el eventoId del localStorage antes de inicializar estados
const getInitialEventoId = (): number | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('eventoSeleccionado');
  if (!stored) return null;
  try {
    const { eventoId } = JSON.parse(stored);
    localStorage.removeItem('eventoSeleccionado');
    return eventoId as number;
  } catch {
    localStorage.removeItem('eventoSeleccionado');
    return null;
  }
};

export default function EventosPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [pendingEventoId] = useState<number | null>(getInitialEventoId);

  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvento, setSelectedEvento] = useState<Evento | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(FORM_INITIAL);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [eventoAEliminar, setEventoAEliminar] = useState<Evento | null>(null);

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    cargarEventosDelMes();
  }, [currentMonth, currentYear]);

  // Si hay un eventoId pendiente, lo buscamos por id, navegamos al mes correcto y lo seleccionamos
  useEffect(() => {
    if (!pendingEventoId) return;
    async function cargarYSeleccionar() {
      try {
        const evento = await eventoService.obtenerEventoPorId(pendingEventoId!);
        if (!evento) return;
        const fecha = new Date(evento.fechaEvento.split('T')[0] + 'T00:00:00');
        setCurrentMonth(fecha.getMonth());
        setCurrentYear(fecha.getFullYear());
        setSelectedEvento(evento);
      } catch (error) {
        console.error('Error cargando evento pendiente:', error);
      }
    }
    cargarYSeleccionar();
  }, [pendingEventoId]);

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

  async function handleCrearEvento() {
    try {
      const nuevoEvento = {
        id: 0,
        cotizacionId: null,
        nombreCliente: formData.nombreCliente,
        fechaEvento: formData.fechaEvento,
        tipoEvento: formData.tipoEvento,
        cantidadInvitados: parseInt(formData.cantidadInvitados),
        precioPorInvitado: parseFloat(formData.precioPorInvitado),
        estadoEvento: formData.estadoEvento,
        fechaCreacion: new Date().toISOString(),
        planificacionId: null,
        linkCompartible: null,
      } as Evento;

      await eventoService.crearEvento(nuevoEvento);
      setShowModal(false);
      setFormData(FORM_INITIAL);
      cargarEventosDelMes();
      showToast('Evento creado exitosamente', 'success');
    } catch (error: any) {
      showToast(error?.message ?? 'Error al crear el evento', 'error');
    }
  }

  async function handleEliminarEvento() {
    if (!eventoAEliminar) return;
    try {
      setEliminando(true);
      await eventoService.eliminarEvento(eventoAEliminar.id);
      setSelectedEvento(null);
      setEventoAEliminar(null);
      cargarEventosDelMes();
      showToast('Evento eliminado correctamente', 'success');
    } catch (error: any) {
      showToast(error?.message ?? 'Error al eliminar el evento', 'error');
    } finally {
      setEliminando(false);
    }
  }

  function openModalWithDate(day: number) {
    const fechaISO = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setFormData({ ...FORM_INITIAL, fechaEvento: fechaISO });
    setShowModal(true);
  }

  const isFormValid = formData.nombreCliente && formData.fechaEvento && formData.cantidadInvitados && formData.precioPorInvitado;

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
    const eventosDelDia = eventos.filter(e => new Date(e.fechaEvento.split('T')[0] + 'T00:00:00').getDate() === day);
    calendarDays.push({ day, eventos: eventosDelDia });
  }

  const isToday = (day: number | null) => {
    if (!day) return false;
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const currentYearNow = new Date().getFullYear();
  const yearOptions = Array.from({ length: 12 }, (_, i) => currentYearNow + i);

  const BtnEliminar = ({ evento }: { evento: Evento }) => (
    <button onClick={() => setEventoAEliminar(evento)} disabled={eliminando}
      className="flex items-center px-3 py-2 rounded-xl border border-red-200 bg-red-50 text-red-500 text-xs font-semibold hover:bg-red-100 hover:border-red-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
      <Trash2 size={13} />
      <span className="hidden sm:inline"></span>
    </button>
  );

  return (
    <PageTransition>
      <div className="flex-1 space-y-6 min-w-0 overflow-x-hidden w-full">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-1">Calendario</p>
            <h1 className="text-3xl font-bold text-[#1C1C1C]">Eventos</h1>
            <p className="text-[#6B7280] mt-1 text-sm">Gestiona el calendario de eventos</p>
          </div>
          <button onClick={() => { setFormData(FORM_INITIAL); setShowModal(true); }}
            className="group flex items-center gap-2 justify-center sm:justify-start px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
            <Plus size={16} className="transition-transform group-hover:rotate-90 duration-200" />
            Nuevo Evento
          </button>
        </div>

        {/* Calendar card y Side panel */}
        <div className="flex gap-6 items-stretch">
          <div className="bg-white border border-[#F0F0F0] rounded-2xl p-4 sm:p-6 flex-1 min-w-0">

            {/* Controls */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex items-center justify-between min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <button onClick={prevMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors shrink-0">
                    <ChevronLeft size={18} className="text-[#6B7280]" />
                  </button>
                  <h2 className="text-lg font-bold text-[#1C1C1C] sm:min-w-[190px] text-center truncate">
                    {MONTHS[currentMonth]} {currentYear}
                  </h2>
                  <button onClick={nextMonth} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-[#F5F5F5] transition-colors shrink-0">
                    <ChevronRight size={18} className="text-[#6B7280]" />
                  </button>
                </div>
                <button onClick={goToToday} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors shrink-0">
                  <Calendar size={14} />
                  Hoy
                </button>
              </div>
              <div className="flex items-center gap-2">
                <SelectCustom value={currentMonth} onChange={setCurrentMonth} options={MONTHS.map((label, index) => ({ value: index, label }))} />
                <SelectCustom value={currentYear} onChange={setCurrentYear} options={yearOptions.map(year => ({ value: year, label: String(year) }))} />
              </div>
            </div>

            {/* Day headers — desktop */}
            <div className="hidden sm:grid grid-cols-7 gap-2 mb-2">
              {DAYS_SHORT.map((day, i) => (
                <div key={i} className="text-center text-xs font-semibold uppercase tracking-wider text-[#9CA3AF] py-2">{day}</div>
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
                    const isEmpty = day !== null && eventosDelDia.length === 0;
                    return (
                      <div key={index}
                        onMouseEnter={() => isEmpty && setHoveredDay(day)}
                        onMouseLeave={() => setHoveredDay(null)}
                        onClick={() => isEmpty && openModalWithDate(day!)}
                        className={`min-h-[110px] p-2.5 rounded-xl border transition-all ${day ? 'bg-white' : 'bg-[#FAFAFA]'} ${today ? 'border-[#FF6B35] border-2' : 'border-[#F0F0F0]'} ${isEmpty ? 'cursor-pointer hover:border-[#FFD4C2] hover:bg-[#FFFAF8]' : ''}`}>
                        {day && (
                          <>
                            <div className={`text-xs font-semibold mb-2 w-6 h-6 flex items-center justify-center rounded-full ${today ? 'bg-[#FF6B35] text-white' : 'text-[#6B7280]'}`}>
                              {day}
                            </div>
                            <div className="space-y-1">
                              {eventosDelDia.length > 0
                                ? eventosDelDia.map(evento => (
                                  <div key={evento.id}
                                    onClick={(e) => { e.stopPropagation(); setSelectedEvento(evento); }}
                                    className={`text-xs px-2 py-1 rounded-lg text-white font-medium cursor-pointer truncate transition-all hover:brightness-90 active:scale-95 ${selectedEvento?.id === evento.id ? 'ring-2 ring-offset-1 ring-[#FF6B35]' : ''}`}
                                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
                                    {evento.nombreCliente}
                                  </div>
                                ))
                                : hoveredDay === day && (
                                  <div className="flex items-center justify-center h-12 text-[#FFB59A] transition-all">
                                    <Plus size={18} strokeWidth={1.5} />
                                  </div>
                                )
                              }
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
                      <div key={index}
                        onClick={() => {
                          if (!day) return;
                          if (hasEvents) setSelectedEvento(eventosDelDia[0]);
                          else openModalWithDate(day);
                        }}
                        className={`aspect-square p-1 rounded-lg border flex flex-col items-center justify-center transition-all ${day ? 'bg-white' : 'bg-[#FAFAFA]'} ${day ? 'cursor-pointer' : ''} ${today ? 'border-[#FF6B35] border-2' : 'border-[#F0F0F0]'}`}>
                        {day && (
                          <>
                            <div className={`text-xs ${today ? 'text-[#FF6B35] font-bold' : 'text-[#6B7280]'}`}>{day}</div>
                            {hasEvents
                              ? <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ background: 'linear-gradient(135deg, #FF6B35, #FF8C5A)' }} />
                              : <Plus size={10} strokeWidth={1.5} className="mt-0.5 text-[#D1D5DB]" />
                            }
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Side panel — desktop only */}
          <div className={`hidden lg:block transition-all duration-300 ease-in-out self-stretch ${selectedEvento ? 'w-80 opacity-100' : 'w-0 opacity-0 pointer-events-none'}`}>
            <div className="w-80 h-full bg-white rounded-2xl border border-[#F0F0F0] overflow-y-auto">
              <div className="px-5 py-4 flex items-center justify-between border-b border-[#F0F0F0] sticky top-0 bg-white rounded-t-2xl z-10">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-0.5">Detalle</p>
                  <h3 className="text-base font-bold text-[#1C1C1C] leading-tight">{selectedEvento?.nombreCliente ?? ''}</h3>
                </div>
                <div className="flex items-center gap-2">
                  {selectedEvento && <BtnEliminar evento={selectedEvento} />}
                  <button onClick={() => setSelectedEvento(null)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#EBEBEB] hover:bg-[#F9F9F9] transition-colors">
                    <X size={15} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>
              {selectedEvento && (
                <div className="flex flex-col p-5 gap-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Fecha</p>
                    <p className="text-sm text-[#3C3C3C]">
                      {new Date(selectedEvento.fechaEvento.split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1.5">Tipo</p>
                      <span className="inline-block px-3 py-1 bg-[#FEF3F0] text-[#FF6B35] rounded-lg text-xs font-semibold">{TipoEventoLabels[selectedEvento.tipoEvento]}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1.5">Estado</p>
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">{EstadoEventoLabels[selectedEvento.estadoEvento]}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1"><Users size={12} /><span className="text-xs">Invitados</span></div>
                      <p className="text-2xl font-bold text-[#1C1C1C]">{selectedEvento.cantidadInvitados}</p>
                    </div>
                    <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                      <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1"><DollarSign size={12} /><span className="text-xs">Por persona</span></div>
                      <p className="text-2xl font-bold text-[#1C1C1C]">${selectedEvento.precioPorInvitado.toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="space-y-2 pt-1">
                    <button className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
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

        {/* Mobile detail sheet */}
        {selectedEvento && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40" onClick={() => setSelectedEvento(null)} />
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-2xl min-h-[70vh] max-h-[95vh] overflow-y-auto">
              <div className="flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-[#E5E7EB]" /></div>
              <div className="px-5 py-3 flex items-center justify-between border-b border-[#F0F0F0]">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-0.5">Detalle</p>
                  <h3 className="text-base font-bold text-[#1C1C1C] leading-tight">{selectedEvento.nombreCliente}</h3>
                </div>
                <div className="flex items-center gap-2">
                  <BtnEliminar evento={selectedEvento} />
                  <button onClick={() => setSelectedEvento(null)} className="w-8 h-8 flex items-center justify-center rounded-xl border border-[#EBEBEB] hover:bg-[#F9F9F9] transition-colors">
                    <X size={15} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>
              <div className="flex flex-col p-5 gap-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1">Fecha</p>
                  <p className="text-sm text-[#3C3C3C]">
                    {new Date(selectedEvento.fechaEvento.split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1.5">Tipo</p>
                    <span className="inline-block px-3 py-1 bg-[#FEF3F0] text-[#FF6B35] rounded-lg text-xs font-semibold">{TipoEventoLabels[selectedEvento.tipoEvento]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#9CA3AF] mb-1.5">Estado</p>
                    <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">{EstadoEventoLabels[selectedEvento.estadoEvento]}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1"><Users size={12} /><span className="text-xs">Invitados</span></div>
                    <p className="text-2xl font-bold text-[#1C1C1C]">{selectedEvento.cantidadInvitados}</p>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-3">
                    <div className="flex items-center gap-1.5 text-[#9CA3AF] mb-1"><DollarSign size={12} /><span className="text-xs">Por persona</span></div>
                    <p className="text-2xl font-bold text-[#1C1C1C]">${selectedEvento.precioPorInvitado.toFixed(0)}</p>
                  </div>
                </div>
                <div className="space-y-2 pt-1 pb-2">
                  <button className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95" style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
                    Ver Planificación
                  </button>
                  <button className="w-full px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors">
                    Editar Evento
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Modal Nuevo Evento */}
        {showModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100dvh' }} onClick={() => setShowModal(false)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>
              <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#1C1C1C]">Nuevo Evento</h2>
                    <p className="text-[#9CA3AF] text-sm mt-0.5">Completa los detalles del evento</p>
                  </div>
                  <button onClick={() => setShowModal(false)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors">
                    <X size={16} className="text-[#6B7280]" />
                  </button>
                </div>
              </div>
              <div className="px-7 py-6 space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Nombre del Cliente</label>
                  <input type="text" value={formData.nombreCliente} onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                    className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                    placeholder="Ej: Juan Pérez" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Fecha del Evento</label>
                  <DatePicker value={formData.fechaEvento} onChange={(val) => setFormData({ ...formData, fechaEvento: val })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Tipo de Evento</label>
                  <div className="grid grid-cols-2 gap-2">
                    {TIPO_EVENTO_OPTIONS.map((opt) => (
                      <button key={opt.value} type="button" onClick={() => setFormData({ ...formData, tipoEvento: opt.value })}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                        style={formData.tipoEvento === opt.value ? { borderColor: '#FF6B35', background: '#FFF4F0', color: '#FF6B35' } : { borderColor: '#EBEBEB', background: 'white', color: '#6B7280' }}>
                        {opt.icon}{opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Estado</label>
                  <SelectCustom value={formData.estadoEvento} onChange={(val) => setFormData({ ...formData, estadoEvento: val })}
                    options={Object.entries(EstadoEventoLabels).map(([value, label]) => ({ value: parseInt(value), label: label as string }))}
                    className="w-full" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Invitados</label>
                    <input type="number" value={formData.cantidadInvitados} onChange={(e) => setFormData({ ...formData, cantidadInvitados: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                      placeholder="100" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Precio / persona</label>
                    <input type="number" step="0.01" value={formData.precioPorInvitado} onChange={(e) => setFormData({ ...formData, precioPorInvitado: e.target.value })}
                      className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                      placeholder="75.00" />
                  </div>
                </div>
                {formData.cantidadInvitados && formData.precioPorInvitado && (
                  <div className="flex items-center justify-between px-4 py-3 bg-[#FFF4F0] rounded-xl border border-[#FFD4C2]">
                    <span className="text-sm text-[#FF6B35] font-medium">Total estimado</span>
                    <span className="text-base font-bold text-[#FF6B35]">
                      ${(parseInt(formData.cantidadInvitados || '0') * parseFloat(formData.precioPorInvitado || '0')).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
              </div>
              <div className="px-7 pb-7 flex gap-3">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors">Cancelar</button>
                <button onClick={handleCrearEvento} disabled={!isFormValid}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                  style={{ background: isFormValid ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' : '#E5E7EB' }}>
                  Crear Evento
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Confirmar Eliminación */}
        {eventoAEliminar && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100dvh' }} onClick={() => !eliminando && setEventoAEliminar(null)}>
            <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>
              <div className="px-7 pt-7 pb-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                    <AlertTriangle size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-[#1C1C1C] mb-1">Eliminar evento</h2>
                    <p className="text-sm text-[#6B7280]">
                      ¿Estás seguro que querés eliminar el evento de{' '}
                      <span className="font-semibold text-[#1C1C1C]">{eventoAEliminar.nombreCliente}</span>?
                      Esta acción no se puede deshacer.
                    </p>
                  </div>
                </div>
              </div>
              <div className="px-7 pb-7 flex gap-3">
                <button onClick={() => setEventoAEliminar(null)} disabled={eliminando}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50">
                  Cancelar
                </button>
                <button onClick={handleEliminarEvento} disabled={eliminando}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  {eliminando ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2.5 border transition-all ${toast.type === 'success' ? 'bg-green-50 border-green-500 text-green-600' : 'bg-red-50 border-red-500 text-red-600'}`}
            style={{ animation: 'modalIn 0.2s ease-out' }}>
            {toast.type === 'success' ? <CheckCircle size={18} className="text-green-500 shrink-0" /> : <AlertCircle size={18} className="text-red-500 shrink-0" />}
            {toast.msg}
            <button onClick={() => setToast(null)} className="ml-1">
              <X size={15} className={toast.type === 'success' ? 'text-green-400' : 'text-red-400'} />
            </button>
          </div>
        )}

        <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      </div>
    </PageTransition>
  );
}