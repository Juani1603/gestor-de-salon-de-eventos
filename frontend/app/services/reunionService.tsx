import { apiClient } from './api';
import { Reunion } from '@/app/types';

export const reunionService = {
  async obtenerReunionProxima(): Promise<Reunion | null> {
    try {
      return await apiClient.get<Reunion>('/reunion/proxima');
    } catch (error) {
      console.error('Error al obtener reunión próxima:', error);
      return null;
    }
  },

  async obtenerReunionesDelMes(mes: number, anio: number): Promise<Reunion[]> {
    try {
      return await apiClient.get<Reunion[]>(`/reunion/mes?mes=${mes}&anio=${anio}`);
    } catch (error) {
      console.error('Error al obtener reuniones del mes:', error);
      return [];
    }
  },

  async crearReunion(reunion: Omit<Reunion, 'id' | 'fechaCreacion'>): Promise<Reunion | null> {
    return await apiClient.post<Reunion>('/reunion', reunion);
  },

  async eliminarReunion(id: number): Promise<void> {
    await apiClient.delete(`/reunion/${id}`);
  },
};