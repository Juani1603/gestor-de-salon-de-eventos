using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.Mappers
{
    public class TimingEventoMapper
    {
        public static TimingEvento FromDTO(TimingEventoDTO dto)
        {
            return new TimingEvento
            {
                Id = dto.Id,
                PlanificacionId = dto.PlanificacionId,
                Momento = dto.Momento,
                Hora = TimeSpan.Parse(dto.Hora),
                Orden = dto.Orden,
            };
        }

        public static TimingEventoDTO ToDTO(TimingEvento t)
        {
            return new TimingEventoDTO
            {
                Id = t.Id,
                PlanificacionId = t.PlanificacionId,
                Momento = t.Momento,
                Hora = t.Hora.ToString(@"hh\:mm"),
                Orden = t.Orden,
            };
        }
    }
}
