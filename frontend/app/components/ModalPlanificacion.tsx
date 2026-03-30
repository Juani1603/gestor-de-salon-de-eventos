'use client';

import { useState, useRef, useEffect } from 'react';
import {
  X, ChevronRight, ChevronLeft, Plus, Trash2, Check,
  Clock, GripVertical, ClipboardList, Calendar, CheckSquare,
  Sunset, UtensilsCrossed, LogIn, UserCheck, Baby, LayoutGrid
} from 'lucide-react';
import { Planificacion, ServicioEvento, TimingEvento, Evento } from '@/app/types';
import { planificacionService } from '@/app/services/planificacionService';
import { timingEventoService, TimingTemplate } from '@/app/services/timingEventoService';
import TimeSelect from '@/app/components/TimeSelect';

const HORAS = Array.from({ length: 16 }, (_, i) => String(i + 7).padStart(2, '0'));
const MINUTOS = ['00', '15', '30', '45'];

const SERVICIOS_CONFIG: {
  tipo: number;
  label: string;
  tieneCantidad?: boolean;
  tieneDescripcion?: boolean;
  labelCantidad?: string;
  labelDescripcion?: string;
  soloBoda?: boolean;
}[] = [
  { tipo: 0,  label: 'Cóctel Primavera' },
  { tipo: 1,  label: 'Cócteles Frutales para Jóvenes' },
  { tipo: 2,  label: 'Cerveza (barriles)', tieneCantidad: true, labelCantidad: 'Barriles' },
  { tipo: 3,  label: 'Vino', tieneCantidad: true, labelCantidad: 'Botellas' },
  { tipo: 4,  label: 'Whisky', tieneCantidad: true, labelCantidad: 'Botellas' },
  { tipo: 5,  label: 'Champagne', tieneCantidad: true, labelCantidad: 'Botellas' },
  { tipo: 6,  label: 'Postres' },
  { tipo: 7,  label: 'Torta' },
  { tipo: 8,  label: 'Café y/o Té' },
  { tipo: 9,  label: 'Arreglos Florales', tieneDescripcion: true, labelDescripcion: 'Colores y estilo' },
  { tipo: 10, label: 'Arreglo Floral Mesa Principal' },
  { tipo: 11, label: 'Senderos' },
  { tipo: 12, label: 'Cotillón' },
  { tipo: 13, label: 'Fotógrafo', tieneDescripcion: true, labelDescripcion: 'Nombre del fotógrafo' },
  { tipo: 14, label: 'Pantalla Gigante' },
  { tipo: 15, label: 'Música en Vivo', tieneDescripcion: true, labelDescripcion: 'Nombre del artista/banda' },
  { tipo: 16, label: 'Altar para Boda', soloBoda: true },
];

function TimeInput({
  value, onChange, label, optional = false, icon,
}: {
  value: string;
  onChange: (val: string) => void;
  label: string;
  optional?: boolean;
  icon?: React.ReactNode;
}) {
  const partes = value ? value.split(':') : ['09', '00'];
  const hora = partes[0] || '09';
  const minutos = partes[1] || '00';
  return (
    <div className="border border-[#F0F0F0] rounded-xl p-3.5 flex items-center gap-3">
      {icon && (
        <div className="w-8 h-8 rounded-lg border border-[#EBEBEB] flex items-center justify-center shrink-0 text-[#FF6B35]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-[#6B7280] mb-1.5">
          {label}{optional && <span className="text-[#C4C4C4] font-normal ml-1">(opcional)</span>}
        </p>
        <div className="flex items-center gap-1.5">
          <TimeSelect value={hora} onChange={(h) => onChange(`${h}:${minutos}`)} options={HORAS} suffix="hs" />
          <span className="text-[#C4C4C4] font-bold shrink-0">:</span>
          <TimeSelect value={minutos} onChange={(m) => onChange(`${hora}:${m}`)} options={MINUTOS} suffix="min" />
        </div>
      </div>
    </div>
  );
}

interface ModalPlanificacionProps {
  evento: Evento;
  planificacionExistente?: Planificacion | null;
  onClose: () => void;
  onGuardado: (planificacion: Planificacion) => void;
}

function getEstadoInicial(evento: Evento, existente?: Planificacion | null) {
  const total = evento.cantidadInvitados;
  if (existente) {
    return {
      horaLlegada: existente.horaLlegada,
      horaSalida: existente.horaSalida ?? '',
      horaComida: existente.horaComida,
      cantidadMayores: total,
      cantidadMenores: 0,
      cantidadMesas: existente.cantidadMesas,
      serviciosSeleccionados: existente.servicios.reduce((acc, s) => {
        acc[s.tipoServicio] = { cantidad: s.cantidad ?? undefined, descripcion: s.descripcion ?? '' };
        return acc;
      }, {} as Record<number, { cantidad?: number; descripcion?: string }>),
      timings: existente.timings.sort((a, b) => a.orden - b.orden).map(t => ({ ...t, tempId: Math.random() })),
      observaciones: existente.observaciones ?? '',
    };
  }
  return {
    horaLlegada: '19:00',
    horaSalida: '',
    horaComida: '21:00',
    cantidadMayores: total,
    cantidadMenores: 0,
    cantidadMesas: Math.ceil(total / 8),
    serviciosSeleccionados: {} as Record<number, { cantidad?: number; descripcion?: string }>,
    timings: [] as { tempId: number; id: number; momento: string; hora: string; orden: number }[],
    observaciones: '',
  };
}

export default function ModalPlanificacion({ evento, planificacionExistente, onClose, onGuardado }: ModalPlanificacionProps) {
  const esEdicion = !!planificacionExistente;
  const [paso, setPaso] = useState(1);
  const [guardando, setGuardando] = useState(false);
  const dragIndex = useRef<number | null>(null);
  const totalInvitados = evento.cantidadInvitados;

  // Templates
  const [templates, setTemplates] = useState<TimingTemplate[]>([]);
  const [loadingTemplates, setLoadingTemplates] = useState(true);

  // Timing nuevo custom
  const [mostrandoInputCustom, setMostrandoInputCustom] = useState(false);
  const [nuevoMomentoCustom, setNuevoMomentoCustom] = useState('');

  // Hora para el timing seleccionado (template o custom)
  const [horaTimingSeleccionado, setHoraTimingSeleccionado] = useState('20');
  const [minutosTimingSeleccionado, setMinutosTimingSeleccionado] = useState('00');

  // Template seleccionado pendiente de agregar
  const [templatePendiente, setTemplatePendiente] = useState<TimingTemplate | null>(null);

  const init = getEstadoInicial(evento, planificacionExistente);
  const [horaLlegada, setHoraLlegada] = useState(init.horaLlegada);
  const [horaSalida, setHoraSalida] = useState(init.horaSalida);
  const [horaComida, setHoraComida] = useState(init.horaComida);
  const [cantidadMayores, setCantidadMayores] = useState(init.cantidadMayores);
  const [cantidadMenores, setCantidadMenores] = useState(init.cantidadMenores);
  const [cantidadMesas, setCantidadMesas] = useState(init.cantidadMesas);
  const [servicios, setServicios] = useState<Record<number, { cantidad?: number; descripcion?: string }>>(init.serviciosSeleccionados);
  const [timings, setTimings] = useState(init.timings);
  const [observaciones, setObservaciones] = useState(init.observaciones);

  const paso1Valido = horaLlegada && horaComida && cantidadMesas > 0;

  useEffect(() => {
    async function cargar() {
      setLoadingTemplates(true);
      const data = await timingEventoService.obtenerTemplates();
      setTemplates(data);
      setLoadingTemplates(false);
    }
    cargar();
  }, []);

  const handleMayoresChange = (val: number) => {
    const clamped = Math.min(Math.max(0, val), totalInvitados);
    setCantidadMayores(clamped);
    setCantidadMenores(totalInvitados - clamped);
  };

  const handleMenoresChange = (val: number) => {
    const clamped = Math.min(Math.max(0, val), totalInvitados);
    setCantidadMenores(clamped);
    setCantidadMayores(totalInvitados - clamped);
  };

  const toggleServicio = (tipo: number) => {
    setServicios(prev => {
      const next = { ...prev };
      if (next[tipo] !== undefined) delete next[tipo];
      else next[tipo] = {};
      return next;
    });
  };

  const updateServicio = (tipo: number, field: 'cantidad' | 'descripcion', value: any) => {
    setServicios(prev => ({ ...prev, [tipo]: { ...prev[tipo], [field]: value } }));
  };

  // Agrega un timing (desde template o custom)
  const agregarTiming = (momento: string) => {
    if (!momento.trim()) return;
    const hora = `${horaTimingSeleccionado}:${minutosTimingSeleccionado}`;
    setTimings(prev => [...prev, {
      tempId: Math.random(), id: 0,
      momento: momento.trim(),
      hora,
      orden: prev.length,
    }].map((t, i) => ({ ...t, orden: i })));
    // Reset
    setTemplatePendiente(null);
    setMostrandoInputCustom(false);
    setNuevoMomentoCustom('');
    setHoraTimingSeleccionado('20');
    setMinutosTimingSeleccionado('00');
  };

  const eliminarTiming = (tempId: number) => {
    setTimings(prev => prev.filter(t => t.tempId !== tempId).map((t, i) => ({ ...t, orden: i })));
  };

  const onDragStart = (index: number) => { dragIndex.current = index; };
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex.current === null || dragIndex.current === index) return;
    setTimings(prev => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next.map((t, i) => ({ ...t, orden: i }));
    });
  };
  const onDragEnd = () => { dragIndex.current = null; };

  async function handleGuardar() {
    try {
      setGuardando(true);
      const payload = {
        id: planificacionExistente?.id ?? 0,
        eventoId: evento.id,
        horaLlegada, horaSalida: horaSalida || null, horaComida,
        cantidadMesas, observaciones: observaciones || null,
        servicios: Object.entries(servicios).map(([tipo, data]) => ({
          id: 0, tipoServicio: parseInt(tipo),
          cantidad: data.cantidad ?? null, descripcion: data.descripcion || null,
        })) as ServicioEvento[],
        timings: timings.map((t, i) => ({ id: t.id, momento: t.momento, hora: t.hora, orden: i })) as TimingEvento[],
      };
      const resultado = esEdicion
        ? await planificacionService.editarPlanificacion(payload as Planificacion)
        : await planificacionService.crearPlanificacion(payload);
      if (resultado) onGuardado(resultado);
    } catch (error) {
      console.error('Error guardando planificación:', error);
    } finally {
      setGuardando(false);
    }
  }

  const serviciosFiltrados = SERVICIOS_CONFIG.filter(s => !s.soloBoda || evento.tipoEvento === 1);

  // Templates que ya están en la lista de timings
  const momentosAgregados = new Set(timings.map(t => t.momento));

  // Si hay un template o custom pendiente, mostramos selector de hora
  const hayPendiente = templatePendiente !== null || mostrandoInputCustom;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ minHeight: '100dvh' }} onClick={() => !guardando && onClose()}>
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>

        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5] shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-[#1C1C1C]">{esEdicion ? 'Editar Planificación' : 'Planificar Evento'}</h2>
              <p className="text-[#9CA3AF] text-sm mt-0.5">{evento.nombreCliente}</p>
            </div>
            <button onClick={onClose} disabled={guardando}
              className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors disabled:opacity-50">
              <X size={16} className="text-[#6B7280]" />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {[
              { n: 1, icon: <Clock size={13} />, label: 'Horarios' },
              { n: 2, icon: <CheckSquare size={13} />, label: 'Servicios' },
              { n: 3, icon: <ClipboardList size={13} />, label: 'Cronograma' },
            ].map((s, i) => (
              <div key={s.n} className="flex items-center gap-2 flex-1">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                  paso === s.n ? 'bg-[#FF6B35] text-white' : paso > s.n ? 'bg-[#FFF4F0] text-[#FF6B35]' : 'bg-[#F5F5F5] text-[#9CA3AF]'
                }`}>
                  {s.icon}{s.label}
                </div>
                {i < 2 && <div className={`flex-1 h-px transition-all ${paso > s.n ? 'bg-[#FF6B35]' : 'bg-[#EBEBEB]'}`} />}
              </div>
            ))}
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* ── Paso 1 ── */}
          {paso === 1 && (
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Horarios</p>
              <TimeInput label="Llegada" value={horaLlegada} onChange={setHoraLlegada} icon={<LogIn size={14} />} />
              <TimeInput label="Finalización" value={horaSalida} onChange={setHoraSalida} optional icon={<Sunset size={14} />} />
              <TimeInput label="Cena / Almuerzo" value={horaComida} onChange={setHoraComida} icon={<UtensilsCrossed size={14} />} />

              <div className="h-px bg-[#F0F0F0] my-1" />

              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Invitados</p>
                <span className="text-xs font-bold px-2.5 py-1 bg-[#FFF4F0] text-[#FF6B35] rounded-lg">
                  {cantidadMayores + cantidadMenores} / {totalInvitados}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="border border-[#F0F0F0] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-[#EBEBEB] flex items-center justify-center shrink-0 text-[#FF6B35]">
                    <UserCheck size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#6B7280] mb-1.5">Mayores</p>
                    <input type="number" value={cantidadMayores}
                      onChange={(e) => handleMayoresChange(parseInt(e.target.value) || 0)}
                      min={0} max={totalInvitados}
                      className="w-full bg-transparent text-base font-bold text-[#1C1C1C] focus:outline-none" />
                  </div>
                </div>
                <div className="border border-[#F0F0F0] rounded-xl p-3.5 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg border border-[#EBEBEB] flex items-center justify-center shrink-0 text-[#FF6B35]">
                    <Baby size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-[#6B7280] mb-1.5">Menores</p>
                    <input type="number" value={cantidadMenores}
                      onChange={(e) => handleMenoresChange(parseInt(e.target.value) || 0)}
                      min={0} max={totalInvitados}
                      className="w-full bg-transparent text-base font-bold text-[#1C1C1C] focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="h-1.5 bg-[#F0F0F0] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(((cantidadMayores + cantidadMenores) / totalInvitados) * 100, 100)}%`,
                    background: cantidadMayores + cantidadMenores === totalInvitados
                      ? 'linear-gradient(90deg, #FF6B35, #FF8C5A)'
                      : 'linear-gradient(90deg, #FFB59A, #FFD4C2)',
                  }} />
              </div>

              <div className="h-px bg-[#F0F0F0] my-1" />

              <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Configuración</p>
              <div className="border border-[#F0F0F0] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg border border-[#EBEBEB] flex items-center justify-center shrink-0 text-[#FF6B35]">
                  <LayoutGrid size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-[#6B7280] mb-1.5">Cantidad de mesas</p>
                  <input type="number" value={cantidadMesas}
                    onChange={(e) => setCantidadMesas(parseInt(e.target.value) || 0)}
                    min={1}
                    className="w-full bg-transparent text-base font-bold text-[#1C1C1C] focus:outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* ── Paso 2: Servicios ── */}
          {paso === 2 && (
            <div className="space-y-2">
              <p className="text-xs text-[#9CA3AF] mb-4">Seleccioná los servicios incluidos en el evento.</p>
              {serviciosFiltrados.map((config) => {
                const seleccionado = servicios[config.tipo] !== undefined;
                return (
                  <div key={config.tipo}
                    className={`border rounded-xl transition-all ${seleccionado ? 'border-[#FFD4C2] bg-[#FFFAF8]' : 'border-[#F0F0F0] bg-white'}`}>
                    <button type="button" onClick={() => toggleServicio(config.tipo)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${seleccionado ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-[#D1D5DB] bg-white'}`}>
                        {seleccionado && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className={`text-sm font-medium ${seleccionado ? 'text-[#1C1C1C]' : 'text-[#6B7280]'}`}>{config.label}</span>
                      {config.soloBoda && (
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 bg-pink-50 text-pink-500 rounded-md font-medium shrink-0">Solo bodas</span>
                      )}
                    </button>
                    {seleccionado && (config.tieneCantidad || config.tieneDescripcion) && (
                      <div className="px-4 pb-3 flex gap-3">
                        {config.tieneCantidad && (
                          <div className="flex-1">
                            <p className="text-xs text-[#9CA3AF] mb-1">{config.labelCantidad}</p>
                            <input type="number" value={servicios[config.tipo]?.cantidad ?? ''}
                              onChange={(e) => updateServicio(config.tipo, 'cantidad', parseInt(e.target.value) || undefined)}
                              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                              placeholder="0" />
                          </div>
                        )}
                        {config.tieneDescripcion && (
                          <div className="flex-1">
                            <p className="text-xs text-[#9CA3AF] mb-1">{config.labelDescripcion}</p>
                            <input type="text" value={servicios[config.tipo]?.descripcion ?? ''}
                              onChange={(e) => updateServicio(config.tipo, 'descripcion', e.target.value)}
                              className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                              placeholder={config.labelDescripcion} />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Paso 3: Timing + Observaciones ── */}
          {paso === 3 && (
            <div className="space-y-5">

              {/* Templates */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Momentos predefinidos</label>
                </div>

                {loadingTemplates ? (
                  <div className="flex items-center gap-2 text-[#9CA3AF] text-sm py-2">
                    <div className="w-4 h-4 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                    Cargando...
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {templates.map(t => {
                      const yaAgregado = momentosAgregados.has(t.momento);
                      const seleccionado = templatePendiente?.id === t.id;
                      return (
                        <button key={t.id} type="button"
                          onClick={() => {
                            if (yaAgregado) return;
                            setMostrandoInputCustom(false);
                            setNuevoMomentoCustom('');
                            setTemplatePendiente(seleccionado ? null : t);
                          }}
                          disabled={yaAgregado}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                            yaAgregado
                              ? 'border-[#F0F0F0] bg-[#F9F9F9] text-[#C4C4C4] cursor-not-allowed'
                              : seleccionado
                              ? 'border-[#FF6B35] bg-[#FFF4F0] text-[#FF6B35]'
                              : 'border-[#EBEBEB] bg-white text-[#6B7280] hover:border-[#FFD4C2] hover:text-[#FF6B35]'
                          }`}>
                          {yaAgregado ? <span className="flex items-center gap-1"><Check size={10} />{t.momento}</span> : t.momento}
                        </button>
                      );
                    })}

                    {/* Botón + para custom */}
                    <button type="button"
                      onClick={() => {
                        setTemplatePendiente(null);
                        setMostrandoInputCustom(!mostrandoInputCustom);
                        setNuevoMomentoCustom('');
                      }}
                      className={`w-8 h-8 flex items-center justify-center rounded-xl border transition-all ${
                        mostrandoInputCustom
                          ? 'border-[#FF6B35] bg-[#FFF4F0] text-[#FF6B35]'
                          : 'border-[#EBEBEB] bg-white text-[#9CA3AF] hover:border-[#FFD4C2] hover:text-[#FF6B35]'
                      }`}>
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Panel de hora — aparece al seleccionar template o pulsar + */}
              {hayPendiente && (
                <div className="border border-[#FFD4C2] bg-[#FFFAF8] rounded-xl p-4 space-y-3">
                  <p className="text-xs font-semibold text-[#FF6B35]">
                    {templatePendiente ? templatePendiente.momento : 'Nuevo momento'}
                  </p>

                  {/* Input custom */}
                  {mostrandoInputCustom && (
                    <input type="text" value={nuevoMomentoCustom}
                      onChange={(e) => setNuevoMomentoCustom(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && agregarTiming(nuevoMomentoCustom)}
                      autoFocus
                      className="w-full px-3 py-2 border border-[#EBEBEB] rounded-lg text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                      placeholder="Nombre del momento..." />
                  )}

                  <div className="flex items-center gap-2">
                    <Clock size={13} className="text-[#FF6B35] shrink-0" />
                    <TimeSelect value={horaTimingSeleccionado} onChange={setHoraTimingSeleccionado} options={HORAS} suffix="hs" />
                    <span className="text-[#C4C4C4] font-bold shrink-0">:</span>
                    <TimeSelect value={minutosTimingSeleccionado} onChange={setMinutosTimingSeleccionado} options={MINUTOS} suffix="min" />
                    <button
                      onClick={() => agregarTiming(templatePendiente ? templatePendiente.momento : nuevoMomentoCustom)}
                      disabled={mostrandoInputCustom && !nuevoMomentoCustom.trim()}
                      className="w-9 h-9 flex items-center justify-center rounded-xl text-white transition-all hover:shadow-md active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                      style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
                      <Check size={15} />
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de timings agregados */}
              {timings.length === 0 ? (
                <div className="border border-dashed border-[#E8E8E8] rounded-xl p-8 text-center">
                  <Calendar size={20} className="text-[#D1D5DB] mx-auto mb-2" />
                  <p className="text-sm text-[#9CA3AF]">Aún no hay momentos en el cronograma</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-xs text-[#9CA3AF]">Arrastrá las tarjetas para reordenar</p>
                  {timings.map((t, index) => (
                    <div key={t.tempId} draggable
                      onDragStart={() => onDragStart(index)}
                      onDragOver={(e) => onDragOver(e, index)}
                      onDragEnd={onDragEnd}
                      className="flex items-center gap-3 bg-white border border-[#F0F0F0] rounded-xl px-4 py-3 cursor-grab active:cursor-grabbing hover:border-[#FFD4C2] transition-all group">
                      <GripVertical size={15} className="text-[#D1D5DB] shrink-0 group-hover:text-[#FF6B35] transition-colors" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#1C1C1C] truncate">{t.momento}</p>
                      </div>
                      <span className="text-xs font-semibold text-[#FF6B35] bg-[#FFF4F0] px-2 py-1 rounded-lg shrink-0">{t.hora}hs</span>
                      <button onClick={() => eliminarTiming(t.tempId)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-red-50 transition-colors group/del shrink-0">
                        <Trash2 size={13} className="text-[#D1D5DB] group-hover/del:text-red-400 transition-colors" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Observaciones */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                  Observaciones <span className="text-[#C4C4C4] font-normal normal-case">(opcional)</span>
                </label>
                <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} rows={3}
                  className="w-full px-4 py-3 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all resize-none"
                  placeholder="Notas adicionales, detalles especiales, pedidos del cliente..." />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 pt-4 border-t border-[#F5F5F5] shrink-0 flex gap-3">
          {paso > 1 ? (
            <button onClick={() => setPaso(p => p - 1)} disabled={guardando}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50">
              <ChevronLeft size={15} /> Atrás
            </button>
          ) : (
            <button onClick={onClose} disabled={guardando}
              className="px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50">
              Cancelar
            </button>
          )}
          <div className="flex-1" />
          {paso < 3 ? (
            <button onClick={() => setPaso(p => p + 1)} disabled={paso === 1 && !paso1Valido}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
              Siguiente <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleGuardar} disabled={guardando}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
              {guardando ? 'Guardando...' : esEdicion ? 'Guardar cambios' : 'Crear planificación'}
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.96) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}