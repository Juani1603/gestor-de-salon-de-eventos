import { apiClient } from './api';
import { Evento } from '@/app/types';

export const eventoService = {
  async obtenerEventoProximo(): Promise<Evento | null> {
    try {
      return await apiClient.get<Evento>('/evento/proximo');
    } catch (error) {
      console.error('Error al obtener evento próximo:', error);
      return null;
    }
  },

  async obtenerEventosDelMes(mes: number, anio: number): Promise<Evento[]> {
    try {
      return await apiClient.get<Evento[]>(`/evento/mes?mes=${mes}&anio=${anio}`);
    } catch (error) {
      console.error('Error al obtener eventos del mes:', error);
      return [];
    }
  },

  async obtenerEventosEntreFechas(fechaInicio: string, fechaFin: string): Promise<Evento[]> {
    try {
      return await apiClient.get<Evento[]>(
        `/evento/rango?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`
      );
    } catch (error) {
      console.error('Error al obtener eventos por rango:', error);
      return [];
    }
  },

  async obtenerEventoPorId(id: number): Promise<Evento | null> {
    try {
      return await apiClient.get<Evento>(`/evento/${id}`);
    } catch (error) {
      console.error('Error al obtener evento por ID:', error);
      return null;
    }
  },

  async crearEvento(evento: Evento): Promise<Evento | null> {
    return await apiClient.post<Evento>('/evento', evento);
  },

  async eliminarEvento(id: number): Promise<void> {
    await apiClient.delete(`/evento/${id}`);
  },
};