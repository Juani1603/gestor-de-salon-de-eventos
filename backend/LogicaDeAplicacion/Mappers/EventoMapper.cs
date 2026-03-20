using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.Mappers
{
    public class EventoMapper
    {
        public static Evento FromDTO(EventoDTO dto)
        {
            return new Evento
            {
                Id = dto.Id,
                CotizacionId = dto.CotizacionId == 0 ? null : dto.CotizacionId,
                NombreCliente = dto.NombreCliente,
                FechaEvento = dto.FechaEvento,
                TipoEvento = dto.TipoEvento,
                CantidadInvitados = dto.CantidadInvitados,
                PrecioPorInvitado = dto.PrecioPorInvitado,
                EstadoEvento = dto.EstadoEvento,
                FechaCreacion = dto.FechaCreacion,
                PlanificacionId = dto.PlanificacionId == 0 ? null : dto.PlanificacionId,
                LinkCompartible = dto.LinkCompartible
            };
        }

        public static EventoDTO ToDTO(Evento evento)
        {
            return new EventoDTO
            {
                Id = evento.Id,
                CotizacionId = evento.CotizacionId,
                NombreCliente = evento.NombreCliente,
                FechaEvento = evento.FechaEvento,
                TipoEvento = evento.TipoEvento,
                CantidadInvitados = evento.CantidadInvitados,
                PrecioPorInvitado = evento.PrecioPorInvitado,
                EstadoEvento = evento.EstadoEvento,
                FechaCreacion = evento.FechaCreacion,
                PlanificacionId = evento.PlanificacionId,
                LinkCompartible = evento.LinkCompartible
            };
        }
    }
}
