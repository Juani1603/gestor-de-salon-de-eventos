'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Plus, Trash2, X, CheckCircle, AlertCircle, AlertTriangle,
  CalendarClock, Clock, User, Link2, CalendarDays
} from 'lucide-react';
import { reunionService } from '@/app/services/reunionService';
import { Reunion } from '@/app/types';
import DatePicker from '@/app/components/DatePicker';

const HORAS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTOS = ['00', '15', '30', '45'];

function esHoy(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const hoy = new Date();
  return fecha.getDate() === hoy.getDate() &&
    fecha.getMonth() === hoy.getMonth() &&
    fecha.getFullYear() === hoy.getFullYear();
}

function esPasada(fechaHora: string) {
  return new Date(fechaHora) < new Date();
}

function formatearFechaHora(fechaHora: string) {
  const fecha = new Date(fechaHora);
  const opcionesFecha: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
  const opcionesHora: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  return {
    fecha: fecha.toLocaleDateString('es-ES', opcionesFecha),
    hora: fecha.toLocaleTimeString('es-ES', opcionesHora),
    esDia: esHoy(fechaHora),
    pasada: esPasada(fechaHora),
  };
}

function diasRestantes(fechaHora: string) {
  const ahora = new Date();
  const fecha = new Date(fechaHora);
  const diff = Math.ceil((fecha.getTime() - ahora.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff < 0) return null;
  return `En ${diff} días`;
}

export default function ReunionesPage() {
  const hoy = new Date();
  const [currentMes] = useState(hoy.getMonth() + 1);
  const [currentAnio] = useState(hoy.getFullYear());

  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [reunionAEliminar, setReunionAEliminar] = useState<Reunion | null>(null);
  const [eliminando, setEliminando] = useState(false);
  const [creando, setCreando] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    nombreCliente: '',
    fecha: '',
    hora: '09',
    minutos: '00',
    cotizacionId: '',
  });

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    cargarReuniones();
  }, []);

  async function cargarReuniones() {
    setLoading(true);
    try {
      const data = await reunionService.obtenerReunionesDelMes(currentMes, currentAnio);
      // Filtramos las pasadas en el frontend también
      const vigentes = data.filter(r => new Date(r.fechaHora) >= new Date());
      setReuniones(vigentes);
    } catch (error) {
      console.error('Error cargando reuniones:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCrearReunion() {
    if (!formData.nombreCliente || !formData.fecha) return;
    try {
      setCreando(true);
      const fechaHoraISO = `${formData.fecha}T${formData.hora}:${formData.minutos}:00`;
      const nuevaReunion = {
        nombreCliente: formData.nombreCliente,
        fechaHora: fechaHoraISO,
        cotizacionId: formData.cotizacionId ? parseInt(formData.cotizacionId) : 0,
      };
      const resultado = await reunionService.crearReunion(nuevaReunion);
      if (resultado) {
        setReuniones(prev => [...prev, resultado].sort((a, b) =>
          new Date(a.fechaHora).getTime() - new Date(b.fechaHora).getTime()
        ));
        setShowModal(false);
        setFormData({ nombreCliente: '', fecha: '', hora: '09', minutos: '00', cotizacionId: '' });
        showToast('Reunión agendada correctamente', 'success');
      }
    } catch (error: any) {
      showToast(error?.message ?? 'Error al crear la reunión', 'error');
    } finally {
      setCreando(false);
    }
  }

  async function handleEliminarReunion() {
    if (!reunionAEliminar) return;
    try {
      setEliminando(true);
      await reunionService.eliminarReunion(reunionAEliminar.id);
      setReuniones(prev => prev.filter(r => r.id !== reunionAEliminar.id));
      setReunionAEliminar(null);
      showToast('Reunión eliminada correctamente', 'success');
    } catch (error: any) {
      showToast(error?.message ?? 'Error al eliminar la reunión', 'error');
    } finally {
      setEliminando(false);
    }
  }

  const isFormValid = formData.nombreCliente.trim() && formData.fecha;

  // Agrupamos por día para mejor visualización
  const reunionesAgrupadas = useMemo(() => {
    const grupos: Record<string, Reunion[]> = {};
    reuniones.forEach(r => {
      const clave = r.fechaHora.split('T')[0];
      if (!grupos[clave]) grupos[clave] = [];
      grupos[clave].push(r);
    });
    return Object.entries(grupos).sort(([a], [b]) => a.localeCompare(b));
  }, [reuniones]);

  function formatearDia(fechaISO: string) {
    const fecha = new Date(fechaISO + 'T00:00:00');
    const hoy = new Date();
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    if (fecha.toDateString() === hoy.toDateString()) return 'Hoy';
    if (fecha.toDateString() === manana.toDateString()) return 'Mañana';
    return fecha.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-1">Agenda</p>
          <h1 className="text-3xl font-bold text-[#1C1C1C]">Reuniones</h1>
          <p className="text-[#6B7280] mt-1 text-sm">Próximos 30 días — {reuniones.length} {reuniones.length === 1 ? 'reunión agendada' : 'reuniones agendadas'}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="group flex items-center gap-2 justify-center sm:justify-start px-5 py-2.5 rounded-xl font-semibold text-sm text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
        >
          <CalendarClock size={15} className="transition-transform group-hover:scale-110 duration-200" />
          Agendar Reunión
        </button>
      </div>

      {/* Lista */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 gap-3">
          <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#9CA3AF] text-sm">Cargando reuniones...</p>
        </div>
      ) : reuniones.length === 0 ? (
        <div className="bg-white border border-dashed border-[#E8E8E8] rounded-2xl p-16 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF4F0] flex items-center justify-center mx-auto mb-4">
            <CalendarDays size={22} className="text-[#FF6B35]" />
          </div>
          <p className="text-[#3C3C3C] font-semibold mb-1">Sin reuniones próximas</p>
          <p className="text-[#9CA3AF] text-sm mb-6">No hay reuniones agendadas para los próximos 30 días</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
          >
            <CalendarClock size={15} />
            Agendar primera reunión
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {reunionesAgrupadas.map(([fecha, reunionesDelDia]) => (
            <div key={fecha}>
              {/* Encabezado del día */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-sm font-bold capitalize ${fecha === new Date().toISOString().split('T')[0] ? 'text-[#FF6B35]' : 'text-[#1C1C1C]'}`}>
                  {formatearDia(fecha)}
                </span>
                <div className="flex-1 h-px bg-[#F0F0F0]" />
                <span className="text-xs text-[#9CA3AF]">{reunionesDelDia.length} {reunionesDelDia.length === 1 ? 'reunión' : 'reuniones'}</span>
              </div>

              {/* Reuniones del día */}
              <div className="space-y-2">
                {reunionesDelDia.map(reunion => {
                  const { hora, pasada } = formatearFechaHora(reunion.fechaHora);
                  const badge = diasRestantes(reunion.fechaHora);

                  return (
                    <div
                      key={reunion.id}
                      className={`bg-white border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-all duration-200 ${pasada ? 'opacity-50 border-[#F0F0F0]' : 'border-[#F0F0F0] hover:border-[#FFD4C2] hover:shadow-md'}`}
                    >
                      {/* Izquierda: hora destacada + info */}
                      <div className="flex items-center gap-4">
                        {/* Bloque de hora */}
                        <div className={`shrink-0 w-16 h-16 rounded-xl flex flex-col items-center justify-center border ${badge === 'Hoy' ? 'bg-[#FFF4F0] border-[#FFD4C2]' : 'bg-[#FAFAFA] border-[#F0F0F0]'}`}>
                          <Clock size={13} className={badge === 'Hoy' ? 'text-[#FF6B35]' : 'text-[#9CA3AF]'} />
                          <span className={`text-base font-bold mt-0.5 ${badge === 'Hoy' ? 'text-[#FF6B35]' : 'text-[#1C1C1C]'}`}>{hora}</span>
                        </div>

                        {/* Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-[15px] font-semibold text-[#1C1C1C] truncate">{reunion.nombreCliente}</span>
                            {badge && (
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-lg ${badge === 'Hoy' ? 'bg-[#FFF4F0] text-[#FF6B35]' : badge === 'Mañana' ? 'bg-amber-50 text-amber-600' : 'bg-[#F5F5F5] text-[#6B7280]'}`}>
                                {badge}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
                            <span className="flex items-center gap-1">
                              <User size={11} />
                              Cliente
                            </span>
                            {reunion.cotizacionId > 0 && (
                              <span className="flex items-center gap-1">
                                <Link2 size={11} />
                                Cotización #{reunion.cotizacionId}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Derecha: acción */}
                      <button
                        onClick={() => setReunionAEliminar(reunion)}
                        className="self-end sm:self-auto w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors group/del shrink-0"
                        title="Eliminar reunión"
                      >
                        <Trash2 size={15} className="text-[#D1D5DB] group-hover/del:text-red-500 transition-colors" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Nueva Reunión */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ minHeight: '100dvh' }}
          onClick={() => !creando && setShowModal(false)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#1C1C1C]">Agendar Reunión</h2>
                  <p className="text-[#9CA3AF] text-sm mt-0.5">Completá los datos de la reunión</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={creando}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors disabled:opacity-50"
                >
                  <X size={16} className="text-[#6B7280]" />
                </button>
              </div>
            </div>

            <div className="px-7 py-6 space-y-5">

              {/* Nombre del cliente */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Nombre del Cliente</label>
                <input
                  type="text"
                  value={formData.nombreCliente}
                  onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                  placeholder="Ej: Juan Pérez"
                />
              </div>

              {/* Fecha */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Fecha</label>
                <DatePicker
                  value={formData.fecha}
                  onChange={(val) => setFormData({ ...formData, fecha: val })}
                />
              </div>

              {/* Hora */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Hora</label>
                <div className="flex items-center gap-2">
                  <select
                    value={formData.hora}
                    onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all cursor-pointer"
                  >
                    {HORAS.map(h => (
                      <option key={h} value={h}>{h}hs</option>
                    ))}
                  </select>
                  <span className="text-[#9CA3AF] font-bold">:</span>
                  <select
                    value={formData.minutos}
                    onChange={(e) => setFormData({ ...formData, minutos: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all cursor-pointer"
                  >
                    {MINUTOS.map(m => (
                      <option key={m} value={m}>{m}min</option>
                    ))}
                  </select>
                </div>
                {formData.fecha && (
                  <p className="text-xs text-[#9CA3AF] mt-2 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(`${formData.fecha}T${formData.hora}:${formData.minutos}:00`).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })} a las {formData.hora}:{formData.minutos}hs
                  </p>
                )}
              </div>

              {/* Cotización (opcional) */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">
                  ID Cotización <span className="text-[#C4C4C4] font-normal normal-case">(opcional)</span>
                </label>
                <input
                  type="number"
                  value={formData.cotizacionId}
                  onChange={(e) => setFormData({ ...formData, cotizacionId: e.target.value })}
                  className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                  placeholder="Ej: 12"
                />
              </div>

            </div>

            <div className="px-7 pb-7 flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                disabled={creando}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleCrearReunion}
                disabled={!isFormValid || creando}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                style={{ background: isFormValid ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' : '#E5E7EB' }}
              >
                {creando ? 'Agendando...' : 'Agendar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación */}
      {reunionAEliminar && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          style={{ minHeight: '100dvh' }}
          onClick={() => !eliminando && setReunionAEliminar(null)}
        >
          <div
            className="bg-white rounded-3xl shadow-2xl max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
            style={{ animation: 'modalIn 0.2s ease-out' }}
          >
            <div className="px-7 pt-7 pb-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                  <AlertTriangle size={18} className="text-red-500" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#1C1C1C] mb-1">Eliminar reunión</h2>
                  <p className="text-sm text-[#6B7280]">
                    ¿Estás seguro que querés eliminar la reunión con{' '}
                    <span className="font-semibold text-[#1C1C1C]">{reunionAEliminar.nombreCliente}</span>?
                    Esta acción no se puede deshacer.
                  </p>
                </div>
              </div>
            </div>
            <div className="px-7 pb-7 flex gap-3">
              <button
                onClick={() => setReunionAEliminar(null)}
                disabled={eliminando}
                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleEliminarReunion}
                disabled={eliminando}
                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {eliminando ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-3 rounded-2xl shadow-lg text-sm font-semibold flex items-center gap-2.5 border transition-all ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-500 text-green-600'
              : 'bg-red-50 border-red-500 text-red-600'
          }`}
          style={{ animation: 'modalIn 0.2s ease-out' }}
        >
          {toast.type === 'success'
            ? <CheckCircle size={18} className="text-green-500 shrink-0" />
            : <AlertCircle size={18} className="text-red-500 shrink-0" />
          }
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
  );
}