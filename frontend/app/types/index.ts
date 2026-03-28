export enum TipoEvento {
  Quinceaños = 0,
  Boda = 1,
  Cumpleaños = 2,
  Empresarial = 3,
}

export enum EstadoEvento {
  Cotizado = 0,
  Confirmado = 1,
  ConSeña = 2,
  Pagado = 3,
  Realizado = 4,
}

export interface Evento {
  id: number;
  cotizacionId: number | null;
  nombreCliente: string;
  fechaEvento: string; 
  tipoEvento: TipoEvento;
  cantidadInvitados: number;
  precioPorInvitado: number;
  estadoEvento: EstadoEvento;
  fechaCreacion: string;
  planificacionId?: number | null;
  linkCompartible?: string | null;
}

export interface Cotizacion {
  id: number;
  nombreCliente: string;
  fechaEvento: string;
  tipoEvento: TipoEvento;
  cantidadInvitados: number;
  precioPorInvitado: number;
  fechaCreacion: string;
  eventoId?: number | null;
}

export interface Reunion {
  id: number;
  cotizacionId: number | null;
  nombreCliente: string;
  fechaHora: string; 
  fechaCreacion: string;
}

// Helpers para labels
export const TipoEventoLabels = {
  [TipoEvento.Quinceaños]: 'Cumpleaños de XV',
  [TipoEvento.Boda]: 'Boda',
  [TipoEvento.Cumpleaños]: 'Cumpleaños',
  [TipoEvento.Empresarial]: 'Empresarial',
};

export const EstadoEventoLabels = {
  [EstadoEvento.Cotizado]: 'Cotizado',
  [EstadoEvento.Confirmado]: 'Confirmado',
  [EstadoEvento.ConSeña]: 'Con Seña',
  [EstadoEvento.Pagado]: 'Pagado',
  [EstadoEvento.Realizado]: 'Realizado',
};

export interface TimingEvento {
  id: number;
  momento: string;
  hora: string; 
  orden: number;
}

export interface ServicioEvento {
  id: number;
  tipoServicio: number;
  cantidad?: number | null;
  descripcion?: string | null;
}

export interface Planificacion {
  id: number;
  eventoId: number;
  horaLlegada: string;   
  horaSalida?: string | null;
  horaComida: string;
  cantidadMesas: number;
  observaciones?: string | null;
  servicios: ServicioEvento[];
  timings: TimingEvento[];
}