import { apiClient } from './api';
import { Cotizacion } from '@/app/types';

export const cotizacionService = {
  async obtenerCotizaciones(): Promise<Cotizacion[]> {
    try {
      return await apiClient.get<Cotizacion[]>('/cotizacion');
    } catch (error) {
      console.error('Error al obtener cotizaciones:', error);
      return [];
    }
  },

  async obtenerCotizacionPorId(id: number): Promise<Cotizacion | null> {
    try {
      return await apiClient.get<Cotizacion>(`/cotizacion/${id}`);
    } catch (error) {
      console.error('Error al obtener cotización:', error);
      return null;
    }
  },

  async crearCotizacion(cotizacion: Omit<Cotizacion, 'id' | 'fechaCreacion' | 'eventoId'>): Promise<Cotizacion | null> {
    return await apiClient.post<Cotizacion>('/cotizacion', cotizacion);
  },

  async eliminarCotizacion(id: number): Promise<void> {
    await apiClient.delete(`/cotizacion/${id}`);
  },

  async actualizarEventoId(cotizacionId: number, eventoId: number | null): Promise<void> {
  await apiClient.patch(`/cotizacion/${cotizacionId}/evento`, { eventoId });
},
};