import { apiClient } from './api';

export interface TimingTemplate {
  id: number;
  momento: string;
}

export const timingEventoService = {
  async obtenerTemplates(): Promise<TimingTemplate[]> {
    try {
      return await apiClient.get<TimingTemplate[]>('/timingevento/templates');
    } catch (error) {
      console.error('Error al obtener timing templates:', error);
      return [];
    }
  },
};