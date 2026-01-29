'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, Calendar, Users, DollarSign, X } from 'lucide-react';
import { cotizacionService } from '@/app/services/cotizacionService';
import { Cotizacion, TipoEventoLabels } from '@/app/types';

export default function CotizacionesPage() {
    const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
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
            setFormData({
                nombreCliente: '',
                fechaEvento: '',
                tipoEvento: 0,
                cantidadInvitados: '',
                precioPorInvitado: '',
            });
        }
    }

    function handleEliminarCotizacion(id: number) {
        if (confirm('¿Estás seguro de eliminar esta cotización?')) {
            setCotizaciones(cotizaciones.filter(c => c.id !== id));
        }
    }

    function handleCrearEvento(cotizacionId: number) {
        alert(`Crear evento desde cotización ${cotizacionId}`);
    }

    const isFormValid = formData.nombreCliente && formData.fechaEvento && formData.cantidadInvitados && formData.precioPorInvitado;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold text-[#3C3C3C]">Cotizaciones</h1>
                    <p className="text-[#6B7280] mt-2">Gestiona las cotizaciones de eventos</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="btn-primary flex items-center gap-2 justify-center sm:justify-start"
                >
                    <Plus size={18} />
                    Nueva Cotización
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#9CA3AF]">Cargando cotizaciones...</p>
                </div>
            ) : cotizaciones.length === 0 ? (
                <div className="card p-12 text-center">
                    <p className="text-[#9CA3AF] mb-4">No hay cotizaciones registradas</p>
                    <button onClick={() => setShowModal(true)} className="btn-primary inline-flex items-center gap-2">
                        <Plus size={18} />
                        Crear primera cotización
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cotizaciones.map((cotizacion) => (
                        <div key={cotizacion.id} className="card p-5 hover:shadow-lg transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-[#3C3C3C] mb-1">
                                        {cotizacion.nombreCliente}
                                    </h3>
                                    <span className="inline-block px-2 py-1 bg-[#FEF3F0] text-[#FF6B35] rounded-md text-xs font-medium">
                                        {TipoEventoLabels[cotizacion.tipoEvento]}
                                    </span>
                                </div>
                                {cotizacion.eventoId === null && (
                                    <button
                                        onClick={() => handleEliminarCotizacion(cotizacion.id)}
                                        className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} className="text-red-500" />
                                    </button>
                                )}

                            </div>

                            <div className="space-y-3 mb-4">
                                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                    <Calendar size={16} />
                                    <span>{new Date(cotizacion.fechaEvento).toLocaleDateString('es-ES')}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                    <Users size={16} />
                                    <span>{cotizacion.cantidadInvitados} invitados</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                                    <DollarSign size={16} />
                                    <span>${cotizacion.precioPorInvitado.toFixed(2)} por persona</span>
                                </div>
                            </div>

                            {!cotizacion.eventoId ? (
                                <button
                                    onClick={() => handleCrearEvento(cotizacion.id)}
                                    className="btn-primary w-full text-sm py-2"
                                >
                                    Crear Evento
                                </button>
                            ) : (
                                <div className="text-center py-2 text-sm text-green-600 font-medium bg-green-50 rounded-lg">
                                    ✓ Evento Creado
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-semibold text-[#3C3C3C]">Nueva Cotización</h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                <X size={20} className="text-[#6B7280]" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-[#3C3C3C] mb-2">Nombre del Cliente</label>
                                <input
                                    type="text"
                                    value={formData.nombreCliente}
                                    onChange={(e) => setFormData({ ...formData, nombreCliente: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                    placeholder="Juan Pérez"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3C3C3C] mb-2">Fecha del Evento</label>
                                <input
                                    type="date"
                                    value={formData.fechaEvento}
                                    onChange={(e) => setFormData({ ...formData, fechaEvento: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3C3C3C] mb-2">Tipo de Evento</label>
                                <select
                                    value={formData.tipoEvento}
                                    onChange={(e) => setFormData({ ...formData, tipoEvento: parseInt(e.target.value) })}
                                    className="w-full px-4 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35] bg-white"
                                >
                                    <option value={0}>Quinceaños</option>
                                    <option value={1}>Boda</option>
                                    <option value={2}>Cumpleaños</option>
                                    <option value={3}>Empresarial</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3C3C3C] mb-2">Cantidad de Invitados</label>
                                <input
                                    type="number"
                                    value={formData.cantidadInvitados}
                                    onChange={(e) => setFormData({ ...formData, cantidadInvitados: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                    placeholder="100"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[#3C3C3C] mb-2">Precio por Invitado</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precioPorInvitado}
                                    onChange={(e) => setFormData({ ...formData, precioPorInvitado: e.target.value })}
                                    className="w-full px-4 py-2 border border-[#E8E8E8] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B35]"
                                    placeholder="75.00"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleCrearCotizacion}
                                    disabled={!isFormValid}
                                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Crear Cotización
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}