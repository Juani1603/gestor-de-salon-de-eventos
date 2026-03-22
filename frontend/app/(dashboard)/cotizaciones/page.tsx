'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Calendar, Users, DollarSign, X, ChevronRight, Sparkles, Star, Heart, Cake, Briefcase, Search, CheckCircle, AlertCircle, AlertTriangle, ArrowUpRight } from 'lucide-react';
import { cotizacionService } from '@/app/services/cotizacionService';
import { eventoService } from '@/app/services/eventoService';
import { Cotizacion, Evento, TipoEventoLabels, EstadoEventoLabels } from '@/app/types';
import DatePicker from '@/app/components/DatePicker';
import PageTransition from '@/app/components/PageTransition';

const TIPO_EVENTO_OPTIONS = [
    { value: 0, label: 'Quinceaños', icon: <Star size={15} /> },
    { value: 1, label: 'Boda', icon: <Heart size={15} /> },
    { value: 2, label: 'Cumpleaños', icon: <Cake size={15} /> },
    { value: 3, label: 'Empresarial', icon: <Briefcase size={15} /> },
];

export default function CotizacionesPage() {
    const router = useRouter();

    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [cotizacionAEliminar, setCotizacionAEliminar] = useState<Cotizacion | null>(null);
    const [cotizacionParaEvento, setCotizacionParaEvento] = useState<Cotizacion | null>(null);
    const [creandoEvento, setCreandoEvento] = useState(false);
    const [eliminando, setEliminando] = useState(false);
    const [busqueda, setBusqueda] = useState('');
    const [soloSinEvento, setSoloSinEvento] = useState(false);
    const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
    const [estadoEvento, setEstadoEvento] = useState(0);
    const [formData, setFormData] = useState({
        nombreCliente: '',
        fechaEvento: '',
        tipoEvento: 0,
        cantidadInvitados: '',
        precioPorInvitado: '',
    });

    const showToast = (msg: string, type: 'success' | 'error') => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        cargarCotizaciones();
    }, []);

    async function cargarCotizaciones() {
        setLoading(true);
        try {
            const data = await cotizacionService.obtenerCotizaciones();
            setCotizaciones(data);
        } catch (error) {
            console.error('Error cargando cotizaciones:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleCrearCotizacion() {
        try {
            const nuevaCotizacion = {
                nombreCliente: formData.nombreCliente,
                fechaEvento: formData.fechaEvento,
                tipoEvento: formData.tipoEvento,
                cantidadInvitados: parseInt(formData.cantidadInvitados),
                precioPorInvitado: parseFloat(formData.precioPorInvitado),
            };

            const result = await cotizacionService.crearCotizacion(nuevaCotizacion);
            if (result) {
                setCotizaciones([result, ...cotizaciones]);
                setShowModal(false);
                setFormData({ nombreCliente: '', fechaEvento: '', tipoEvento: 0, cantidadInvitados: '', precioPorInvitado: '' });
                showToast('Cotización creada exitosamente', 'success');
            }
        } catch (error: any) {
            showToast(error?.message ?? 'Error al crear la cotización', 'error');
        }
    }

    async function handleConfirmarEliminar() {
        if (!cotizacionAEliminar) return;
        try {
            setEliminando(true);
            await cotizacionService.eliminarCotizacion(cotizacionAEliminar.id);
            setCotizaciones(cotizaciones.filter(c => c.id !== cotizacionAEliminar.id));
            setCotizacionAEliminar(null);
            showToast('Cotización eliminada correctamente', 'success');
        } catch (error: any) {
            showToast(error?.message ?? 'Error al eliminar la cotización', 'error');
        } finally {
            setEliminando(false);
        }
    }

    function abrirModalCrearEvento(cotizacion: Cotizacion) {
        setCotizacionParaEvento(cotizacion);
        setEstadoEvento(0);
    }

    async function handleCrearEventoDesdeCotizacion() {
        if (!cotizacionParaEvento) return;
        try {
            setCreandoEvento(true);

            const nuevoEvento = {
                id: 0,
                cotizacionId: cotizacionParaEvento.id,
                nombreCliente: cotizacionParaEvento.nombreCliente,
                fechaEvento: cotizacionParaEvento.fechaEvento,
                tipoEvento: cotizacionParaEvento.tipoEvento,
                cantidadInvitados: cotizacionParaEvento.cantidadInvitados,
                precioPorInvitado: cotizacionParaEvento.precioPorInvitado,
                estadoEvento: estadoEvento,
                fechaCreacion: new Date().toISOString(),
                planificacionId: null,
                linkCompartible: null,
            } as Evento;

            const eventoCreado = await eventoService.crearEvento(nuevoEvento);

            if (eventoCreado) {
                // Con el id real del evento recién guardado, actualizamos la cotización
                await cotizacionService.actualizarEventoId(cotizacionParaEvento.id, eventoCreado.id);

                // Actualizamos el estado local para reflejar el vínculo
                setCotizaciones(cotizaciones.map(c =>
                    c.id === cotizacionParaEvento.id ? { ...c, eventoId: eventoCreado.id } : c
                ));
                setCotizacionParaEvento(null);
                showToast('Evento creado y vinculado correctamente', 'success');

                // Guardamos solo el eventoId y navegamos
                localStorage.setItem('eventoSeleccionado', JSON.stringify({ eventoId: eventoCreado.id }));
                router.push('/eventos');
            }
        } catch (error: any) {
            showToast(error?.message ?? 'Error al crear el evento', 'error');
        } finally {
            setCreandoEvento(false);
        }
    }

    function navegarAEvento(eventoId: number) {
        localStorage.setItem('eventoSeleccionado', JSON.stringify({ eventoId }));
        router.push('/eventos');
    }

    const cotizacionesFiltradas = useMemo(() => {
        return cotizaciones.filter(c => {
            const coincideBusqueda = c.nombreCliente.toLowerCase().includes(busqueda.toLowerCase());
            const coincideSinEvento = soloSinEvento ? !c.eventoId : true;
            return coincideBusqueda && coincideSinEvento;
        });
    }, [cotizaciones, busqueda, soloSinEvento]);

    const isFormValid = formData.nombreCliente && formData.fechaEvento && formData.cantidadInvitados && formData.precioPorInvitado;

    return (
        <PageTransition>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#FF6B35] mb-1">Gestión</p>
                        <h1 className="text-3xl font-bold text-[#1C1C1C]">Cotizaciones</h1>
                        <p className="text-[#6B7280] mt-1 text-sm">Seguimiento y administración de propuestas</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="group relative overflow-hidden btn-primary flex items-center gap-2 justify-center sm:justify-start px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95"
                        style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                    >
                        <Plus size={16} className="transition-transform group-hover:rotate-90 duration-200" />
                        Nueva Cotización
                    </button>
                </div>

                {/* Filtros */}
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar por nombre de cliente..."
                            className="w-full pl-9 pr-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] bg-white focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                        />
                        {busqueda && (
                            <button onClick={() => setBusqueda('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4C4C4] hover:text-[#6B7280] transition-colors">
                                <X size={14} />
                            </button>
                        )}
                    </div>
                    <label className="flex items-center gap-2.5 px-4 py-2.5 bg-white border border-[#EBEBEB] rounded-xl cursor-pointer hover:border-[#FFD4C2] hover:bg-[#FFFAF8] transition-all select-none shrink-0">
                        <div className="relative flex items-center">
                            <input type="checkbox" checked={soloSinEvento} onChange={(e) => setSoloSinEvento(e.target.checked)} className="sr-only" />
                            <div className={`w-4 h-4 rounded flex items-center justify-center border-2 transition-all ${soloSinEvento ? 'border-[#FF6B35] bg-[#FF6B35]' : 'border-[#D1D5DB] bg-white'}`}>
                                {soloSinEvento && (
                                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </div>
                        </div>
                        <span className="text-sm font-medium text-[#3C3C3C] whitespace-nowrap">Sin evento asignado</span>
                    </label>
                </div>

                {(busqueda || soloSinEvento) && !loading && (
                    <p className="text-xs text-[#9CA3AF] -mt-3">
                        {cotizacionesFiltradas.length === 0
                            ? 'Sin resultados'
                            : `${cotizacionesFiltradas.length} resultado${cotizacionesFiltradas.length !== 1 ? 's' : ''}`}
                    </p>
                )}

                {/* List */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-64 gap-3">
                        <div className="w-8 h-8 border-2 border-[#FF6B35] border-t-transparent rounded-full animate-spin" />
                        <p className="text-[#9CA3AF] text-sm">Cargando cotizaciones...</p>
                    </div>
                ) : cotizaciones.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#E8E8E8] rounded-2xl p-16 text-center">
                        <div className="w-12 h-12 rounded-2xl bg-[#FFF4F0] flex items-center justify-center mx-auto mb-4">
                            <Plus size={22} className="text-[#FF6B35]" />
                        </div>
                        <p className="text-[#3C3C3C] font-semibold mb-1">Aún no hay cotizaciones</p>
                        <p className="text-[#9CA3AF] text-sm mb-6">Crea tu primera propuesta para un cliente</p>
                        <button
                            onClick={() => setShowModal(true)}
                            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                        >
                            <Plus size={16} />
                            Crear primera cotización
                        </button>
                    </div>
                ) : cotizacionesFiltradas.length === 0 ? (
                    <div className="bg-white border border-dashed border-[#E8E8E8] rounded-2xl p-12 text-center">
                        <div className="w-10 h-10 rounded-2xl bg-[#F5F5F5] flex items-center justify-center mx-auto mb-3">
                            <Search size={18} className="text-[#9CA3AF]" />
                        </div>
                        <p className="text-[#3C3C3C] font-semibold mb-1">Sin resultados</p>
                        <p className="text-[#9CA3AF] text-sm">Probá con otro nombre o ajustá los filtros</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {cotizacionesFiltradas.map((cotizacion, index) => {
                            const total = cotizacion.cantidadInvitados * cotizacion.precioPorInvitado;
                            return (
                                <div
                                    key={cotizacion.id}
                                    className="group bg-white border border-[#F0F0F0] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#FFD4C2] hover:shadow-md transition-all duration-200"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    <div className="flex items-center gap-4 flex-1 min-w-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                                                <h3 className="text-[15px] font-semibold text-[#1C1C1C] truncate">{cotizacion.nombreCliente}</h3>
                                                <span className="px-2 py-0.5 bg-[#FEF3F0] text-[#FF6B35] rounded-md text-xs font-medium whitespace-nowrap">
                                                    {TipoEventoLabels[cotizacion.tipoEvento]}
                                                </span>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
                                                <span className="flex items-center gap-1">
                                                    <Calendar size={11} />
                                                    {new Date(cotizacion.fechaEvento.split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users size={11} />
                                                    {cotizacion.cantidadInvitados} invitados
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <DollarSign size={11} />
                                                    ${cotizacion.precioPorInvitado.toFixed(2)} / persona
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0">
                                        <div className="text-right hidden sm:block">
                                            <p className="text-xs text-[#9CA3AF] leading-none mb-0.5">Total</p>
                                            <p className="text-base font-bold text-[#1C1C1C]">
                                                ${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                        <div className="hidden sm:block w-px h-8 bg-[#F0F0F0]" />
                                        {!cotizacion.eventoId ? (
                                            <>
                                                <button
                                                    onClick={() => abrirModalCrearEvento(cotizacion)}
                                                    className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md hover:shadow-orange-200 active:scale-95"
                                                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                                                >
                                                    <Sparkles size={13} />
                                                    Crear evento
                                                    <ChevronRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                                                </button>
                                                <button
                                                    onClick={() => setCotizacionAEliminar(cotizacion)}
                                                    className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors group/del"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={15} className="text-[#D1D5DB] group-hover/del:text-red-500 transition-colors" />
                                                </button>
                                            </>
                                        ) : (
                                            <button
                                                onClick={() => navegarAEvento(cotizacion.eventoId!)}
                                                className="group/nav flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100 whitespace-nowrap hover:bg-emerald-100 hover:border-emerald-200 transition-all"
                                            >
                                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                                Evento creado
                                                <ArrowUpRight size={12} className="transition-transform group-hover/nav:translate-x-0.5 group-hover/nav:-translate-y-0.5" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Modal Nueva Cotización */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100dvh' }} onClick={() => setShowModal(false)}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>
                            <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#1C1C1C]">Nueva Cotización</h2>
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
                                <button onClick={handleCrearCotizacion} disabled={!isFormValid}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                    style={{ background: isFormValid ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' : '#E5E7EB' }}>
                                    Crear Cotización
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Crear Evento desde Cotización */}
                {cotizacionParaEvento && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100dvh' }} onClick={() => !creandoEvento && setCotizacionParaEvento(null)}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>
                            <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-[#1C1C1C]">Crear Evento</h2>
                                        <p className="text-[#9CA3AF] text-sm mt-0.5">Desde cotización de <span className="font-medium text-[#3C3C3C]">{cotizacionParaEvento.nombreCliente}</span></p>
                                    </div>
                                    <button onClick={() => setCotizacionParaEvento(null)} disabled={creandoEvento} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors disabled:opacity-50">
                                        <X size={16} className="text-[#6B7280]" />
                                    </button>
                                </div>
                            </div>
                            <div className="px-7 py-6 space-y-4">
                                <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-4 space-y-3">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Datos de la cotización</p>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-0.5">Fecha</p>
                                            <p className="font-medium text-[#1C1C1C]">
                                                {new Date(cotizacionParaEvento.fechaEvento.split('T')[0] + 'T00:00:00').toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-0.5">Tipo</p>
                                            <p className="font-medium text-[#1C1C1C]">{TipoEventoLabels[cotizacionParaEvento.tipoEvento]}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-0.5">Invitados</p>
                                            <p className="font-medium text-[#1C1C1C]">{cotizacionParaEvento.cantidadInvitados}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[#9CA3AF] mb-0.5">Precio / persona</p>
                                            <p className="font-medium text-[#1C1C1C]">${cotizacionParaEvento.precioPorInvitado.toFixed(2)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Estado del Evento</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(EstadoEventoLabels).map(([value, label]) => (
                                            <button key={value} type="button" onClick={() => setEstadoEvento(parseInt(value))}
                                                className="px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all text-left"
                                                style={estadoEvento === parseInt(value) ? { borderColor: '#FF6B35', background: '#FFF4F0', color: '#FF6B35' } : { borderColor: '#EBEBEB', background: 'white', color: '#6B7280' }}>
                                                {label as string}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-7 pb-7 flex gap-3">
                                <button onClick={() => setCotizacionParaEvento(null)} disabled={creandoEvento}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50">
                                    Cancelar
                                </button>
                                <button onClick={handleCrearEventoDesdeCotizacion} disabled={creandoEvento}
                                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}>
                                    {creandoEvento ? 'Creando...' : 'Confirmar y crear'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Modal Confirmar Eliminación */}
                {cotizacionAEliminar && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4" style={{ minHeight: '100dvh' }} onClick={() => !eliminando && setCotizacionAEliminar(null)}>
                        <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full" onClick={(e) => e.stopPropagation()} style={{ animation: 'modalIn 0.2s ease-out' }}>
                            <div className="px-7 pt-7 pb-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center shrink-0">
                                        <AlertTriangle size={18} className="text-red-500" />
                                    </div>
                                    <div>
                                        <h2 className="text-base font-bold text-[#1C1C1C] mb-1">Eliminar cotización</h2>
                                        <p className="text-sm text-[#6B7280]">
                                            ¿Estás seguro que querés eliminar la cotización de{' '}
                                            <span className="font-semibold text-[#1C1C1C]">{cotizacionAEliminar.nombreCliente}</span>?
                                            Esta acción no se puede deshacer.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="px-7 pb-7 flex gap-3">
                                <button onClick={() => setCotizacionAEliminar(null)} disabled={eliminando}
                                    className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors disabled:opacity-50">
                                    Cancelar
                                </button>
                                <button onClick={handleConfirmarEliminar} disabled={eliminando}
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