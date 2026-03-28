import { apiClient } from './api';
import { Planificacion } from '@/app/types';

export const planificacionService = {
  async obtenerPlanificacion(id: number): Promise<Planificacion | null> {
    try {
      return await apiClient.get<Planificacion>(`/planificacion/${id}`);
    } catch (error) {
      console.error('Error al obtener planificación:', error);
      return null;
    }
  },

  async crearPlanificacion(planificacion: Omit<Planificacion, 'id'>): Promise<Planificacion | null> {
    return await apiClient.post<Planificacion>('/planificacion', planificacion);
  },

  async editarPlanificacion(planificacion: Planificacion): Promise<Planificacion | null> {
    return await apiClient.put<Planificacion>(`/planificacion/${planificacion.id}`, planificacion);
  },
};