'use client';

import { useState } from 'react';
import { X, Download, FileText, Loader2 } from 'lucide-react';
import { Evento, Planificacion, TipoEventoLabels } from '@/app/types';

interface ModalDescargaPDFProps {
  evento: Evento;
  planificacion: Planificacion;
  onClose: () => void;
}

export default function ModalDescargaPDF({ evento, planificacion, onClose }: ModalDescargaPDFProps) {
  const [descargando, setDescargando] = useState(false);
  const nombreArchivo = `planificacion-${evento.nombreCliente.toLowerCase().replace(/\s+/g, '-')}.pdf`;

  async function handleDescargar() {
    try {
      setDescargando(true);
      const res = await fetch('/api/planificacion-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evento, planificacion }),
      });

      if (!res.ok) throw new Error('Error al generar el PDF');

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = nombreArchivo;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error descargando PDF:', error);
    } finally {
      setDescargando(false);
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      style={{ minHeight: '100dvh' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'modalIn 0.2s ease-out' }}
      >
        {/* Header */}
        <div className="px-7 pt-7 pb-5 border-b border-[#F5F5F5] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1C1C1C]">Descargar Planificación</h2>
            <p className="text-[#9CA3AF] text-sm mt-0.5">{evento.nombreCliente}</p>
          </div>
          <button onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#F5F5F5] hover:bg-[#EBEBEB] transition-colors">
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Resumen */}
        <div className="px-7 py-6 space-y-4">
          <div className="bg-[#FAFAFA] border border-[#F0F0F0] rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#9CA3AF]">Contenido del PDF</p>
            <div className="space-y-2">
              {[
                { label: 'Evento', valor: `${TipoEventoLabels[evento.tipoEvento]} — ${evento.nombreCliente}` },
                {
                  label: 'Fecha', valor: new Date(evento.fechaEvento.split('T')[0] + 'T00:00:00')
                    .toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
                },
                {
                  label: 'Horarios',
                  valor: `Llegada ${planificacion.horaLlegada}hs · Cena ${planificacion.horaComida}hs${planificacion.horaSalida ? ` · Cierre ${planificacion.horaSalida}hs` : ''}`
                },
                { label: 'Invitados', valor: `${evento.cantidadInvitados} personas · ${planificacion.cantidadMesas} mesas` },
                { label: 'Servicios', valor: `${planificacion.servicios.length} servicios incluidos` },
                { label: 'Cronograma', valor: `${planificacion.timings.length} momentos planificados` },
                ...(planificacion.observaciones ? [{ label: 'Observaciones', valor: 'Incluidas' }] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35] mt-1.5 shrink-0" />
                  <div className="flex-1 flex items-start justify-between gap-2 min-w-0">
                    <span className="text-xs font-semibold text-[#6B7280] shrink-0">{item.label}</span>
                    <span className="text-xs text-[#3C3C3C] text-right">{item.valor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2.5 bg-[#FFF4F0] rounded-xl border border-[#FFD4C2]">
            <FileText size={13} className="text-[#FF6B35] shrink-0" />
            <p className="text-xs text-[#FF6B35] font-medium">{nombreArchivo}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-7 pb-7 flex gap-3">
          <button onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-xl border border-[#EBEBEB] text-sm font-semibold text-[#6B7280] hover:bg-[#F9F9F9] transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleDescargar}
            disabled={descargando}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-orange-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #FF6B35 0%, #FF8C5A 100%)' }}
          >
            {descargando
              ? <><Loader2 size={14} className="animate-spin" /> Generando...</>
              : <><Download size={14} /> Descargar PDF</>
            }
          </button>
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