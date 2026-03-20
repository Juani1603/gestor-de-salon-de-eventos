using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.Mappers
{
    public class CotizacionMapper
    {
        public static Cotizacion FromDTO(CotizacionDTO dto)
        {
            return new Cotizacion
            {
                Id = dto.Id,
                NombreCliente = dto.NombreCliente,
                FechaEvento = dto.FechaEvento,
                TipoEvento = dto.TipoEvento,
                CantidadInvitados = dto.CantidadInvitados,
                PrecioPorInvitado = dto.PrecioPorInvitado,
                FechaCreacion = dto.FechaCreacion,
                EventoId = dto.EventoId == 0 ? null : dto.EventoId
            };
        }

        public static CotizacionDTO ToDTO(Cotizacion cotizacion)
        {
            return new CotizacionDTO
            {
                Id = cotizacion.Id,
                NombreCliente = cotizacion.NombreCliente,
                FechaEvento = cotizacion.FechaEvento,
                TipoEvento = cotizacion.TipoEvento,
                CantidadInvitados = cotizacion.CantidadInvitados,
                PrecioPorInvitado = cotizacion.PrecioPorInvitado,
                FechaCreacion = cotizacion.FechaCreacion,
                EventoId = cotizacion.EventoId
            };
        }
    }
}
