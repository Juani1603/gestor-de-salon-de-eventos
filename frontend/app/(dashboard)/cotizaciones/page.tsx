'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Users, DollarSign, X, ChevronRight, Sparkles, Star, Heart, Cake, Briefcase } from 'lucide-react';
import { cotizacionService } from '@/app/services/cotizacionService';
import { Cotizacion, TipoEventoLabels } from '@/app/types';

const tipoEventoConfig: Record<number, { icon: React.ReactNode }> = {
    0: { icon: <Star size={15} /> },
    1: { icon: <Heart size={15} /> },
    2: { icon: <Cake size={15} /> },
    3: { icon: <Briefcase size={15} /> },
};

export default function CotizacionesPage() {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        nombreCliente: '',
        fechaEvento: '',
        tipoEvento: 0,
        cantidadInvitados: '',
        precioPorInvitado: '',
    });

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
        }
    }

    function handleEliminarCotizacion(id: number) {
        if (confirm('¿Estás seguro de eliminar esta cotización?')) {
            setDeletingId(id);
            setTimeout(() => {
                setCotizaciones(cotizaciones.filter(c => c.id !== id));
                setDeletingId(null);
            }, 300);
        }
    }

    function handleCrearEvento(cotizacionId: number) {
        alert(`Crear evento desde cotización ${cotizacionId}`);
    }

    const isFormValid = formData.nombreCliente && formData.fechaEvento && formData.cantidadInvitados && formData.precioPorInvitado;

    return (
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
            ) : (
                <div className="space-y-2">
                    {cotizaciones.map((cotizacion, index) => {
                        const total = cotizacion.cantidadInvitados * cotizacion.precioPorInvitado;
                        const isDeleting = deletingId === cotizacion.id;

                        return (
                            <div
                                key={cotizacion.id}
                                className="group bg-white border border-[#F0F0F0] rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:border-[#FFD4C2] hover:shadow-md transition-all duration-200"
                                style={{
                                    opacity: isDeleting ? 0 : 1,
                                    transform: isDeleting ? 'translateX(20px)' : 'translateX(0)',
                                    transition: 'all 0.3s ease',
                                    animationDelay: `${index * 40}ms`,
                                }}
                            >
                                {/* Left */}
                                <div className="flex items-center gap-4 flex-1 min-w-0">
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="text-[15px] font-semibold text-[#1C1C1C] truncate">
                                                {cotizacion.nombreCliente}
                                            </h3>
                                            <span className="px-2 py-0.5 bg-[#FEF3F0] text-[#FF6B35] rounded-md text-xs font-medium whitespace-nowrap">
                                                {TipoEventoLabels[cotizacion.tipoEvento]}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#9CA3AF]">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={11} />
                                                {new Date(cotizacion.fechaEvento).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
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

                                {/* Right: total + actions */}
                                <div className="flex items-center gap-3 shrink-0">
                                    {/* Total */}
                                    <div className="text-right hidden sm:block">
                                        <p className="text-xs text-[#9CA3AF] leading-none mb-0.5">Total</p>
                                        <p className="text-base font-bold text-[#1C1C1C]">
                                            ${total.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    {/* Divider */}
                                    <div className="hidden sm:block w-px h-8 bg-[#F0F0F0]" />

                                    {!cotizacion.eventoId ? (
                                        <>
                                            <button
                                                onClick={() => handleCrearEvento(cotizacion.id)}
                                                className="group/btn flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-md hover:shadow-orange-200 active:scale-95"
                                                style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
                                            >
                                                <Sparkles size={13} />
                                                Crear evento
                                                <ChevronRight size={13} className="transition-transform group-hover/btn:translate-x-0.5" />
                                            </button>
                                            <button
                                                onClick={() => handleEliminarCotizacion(cotizacion.id)}
                                                className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-red-50 transition-colors group/del"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={15} className="text-[#D1D5DB] group-hover/del:text-red-500 transition-colors" />
                                            </button>
                                        </>
                                    ) : (
                                        <span className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-100 whitespace-nowrap">
                                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            Evento creado
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    style={{ minHeight: '100dvh' }}
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                        style={{ animation: 'modalIn 0.2s ease-out' }}
                    >
                        {/* Modal header */}
                        <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5]">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-[#1C1C1C]">Nueva Cotización</h2>
                                    <p className="text-[#9CA3AF] text-sm mt-0.5">Completa los detalles del evento</p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors"
                                >
                                    <X size={16} className="text-[#6B7280]" />
                                </button>
                            </div>
                        </div>

                        {/* Modal body */}
                        <div className="px-7 py-6 space-y-5">
                            {[
                                {
                                    label: 'Nombre del Cliente',
                                    key: 'nombreCliente',
                                    type: 'text',
                                    placeholder: 'Ej: Juan Pérez',
                                },
                                {
                                    label: 'Fecha del Evento',
                                    key: 'fechaEvento',
                                    type: 'date',
                                    placeholder: '',
                                },
                            ].map(({ label, key, type, placeholder }) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">{label}</label>
                                    <input
                                        type={type}
                                        value={(formData as any)[key]}
                                        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                                        placeholder={placeholder}
                                    />
                                </div>
                            ))}

                            <div>
                                <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Tipo de Evento</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { value: 0, label: 'Quinceaños', icon: <Star size={15} /> },
                                        { value: 1, label: 'Boda', icon: <Heart size={15} /> },
                                        { value: 2, label: 'Cumpleaños', icon: <Cake size={15} /> },
                                        { value: 3, label: 'Empresarial', icon: <Briefcase size={15} /> },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, tipoEvento: opt.value })}
                                            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-sm font-medium transition-all"
                                            style={
                                                formData.tipoEvento === opt.value
                                                    ? { borderColor: '#FF6B35', background: '#FFF4F0', color: '#FF6B35' }
                                                    : { borderColor: '#EBEBEB', background: 'white', color: '#6B7280' }
                                            }
                                        >
                                            {opt.icon}
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Invitados</label>
                                    <input
                                        type="number"
                                        value={formData.cantidadInvitados}
                                        onChange={(e) => setFormData({ ...formData, cantidadInvitados: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                                        placeholder="100"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#6B7280] mb-2">Precio / persona</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.precioPorInvitado}
                                        onChange={(e) => setFormData({ ...formData, precioPorInvitado: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-[#EBEBEB] rounded-xl text-sm text-[#1C1C1C] placeholder:text-[#C4C4C4] focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 focus:border-[#FF6B35] transition-all"
                                        placeholder="75.00"
                                    />
                                </div>
                            </div>

                            {/* Live total preview */}
                            {formData.cantidadInvitados && formData.precioPorInvitado && (
                                <div className="flex items-center justify-between px-4 py-3 bg-[#FFF4F0] rounded-xl border border-[#FFD4C2]">
                                    <span className="text-sm text-[#FF6B35] font-medium">Total estimado</span>
                                    <span className="text-base font-bold text-[#FF6B35]">
                                        ${(parseInt(formData.cantidadInvitados || '0') * parseFloat(formData.precioPorInvitado || '0')).toLocaleString('es-ES', { minimumFractionDigits: 2 })}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Modal footer */}
                        <div className="px-7 pb-7 flex gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleCrearCotizacion}
                                disabled={!isFormValid}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none"
                                style={{ background: isFormValid ? 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' : '#E5E7EB' }}
                            >
                                Crear Cotización
                            </button>
                        </div>
                    </div>
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