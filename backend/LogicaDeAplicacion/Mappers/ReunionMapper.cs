using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.Mappers
{
    public class ReunionMapper
    {
        public static Reunion FromDTO(ReunionDTO dto)
        {
            return new Reunion
            {
                Id = dto.Id,
                CotizacionId = dto.CotizacionId,
                NombreCliente = dto.NombreCliente,
                FechaHora = dto.FechaHora,
                FechaCreacion = dto.FechaCreacion,
            };
        }

        public static ReunionDTO ToDTO(Reunion reunion)
        {
            return new ReunionDTO
            {
                Id = reunion.Id,
                CotizacionId = reunion.CotizacionId,
                NombreCliente = reunion.NombreCliente,
                FechaHora = reunion.FechaHora,
                FechaCreacion = reunion.FechaCreacion,
            };
        }
    }
}
