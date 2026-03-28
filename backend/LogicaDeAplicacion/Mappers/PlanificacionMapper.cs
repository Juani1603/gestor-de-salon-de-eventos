using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.Mappers
{
    public class PlanificacionMapper
    {
        public static Planificacion FromDTO(PlanificacionDTO dto)
        {
            return new Planificacion
            {
                Id = dto.Id,
                EventoId = dto.EventoId,
                HoraLlegada = TimeSpan.Parse(dto.HoraLlegada),
                HoraSalida = dto.HoraSalida != null ? TimeSpan.Parse(dto.HoraSalida) : null,
                HoraComida = TimeSpan.Parse(dto.HoraComida),
                CantidadMesas = dto.CantidadMesas,
                ConfiguracionMesasJson = "{}",
                Observaciones = dto.Observaciones,
                ServicioEvento = dto.Servicios.Select(s => new ServicioEvento
                {
                    Id = s.Id,
                    TipoServicio = (TipoServicio)s.TipoServicio,
                    Cantidad = s.Cantidad,
                    Descripcion = s.Descripcion,
                }).ToList(),
                TimingsEvento = dto.Timings.Select(t => new TimingEvento
                {
                    Id = t.Id,
                    Momento = t.Momento,
                    Hora = TimeSpan.Parse(t.Hora),
                    Orden = t.Orden,
                }).ToList(),
            };
        }

        public static PlanificacionDTO ToDTO(Planificacion p)
        {
            return new PlanificacionDTO
            {
                Id = p.Id,
                EventoId = p.EventoId,
                HoraLlegada = p.HoraLlegada.ToString(@"hh\:mm"),
                HoraSalida = p.HoraSalida?.ToString(@"hh\:mm"),
                HoraComida = p.HoraComida.ToString(@"hh\:mm"),
                CantidadMesas = p.CantidadMesas,
                Observaciones = p.Observaciones,
                Servicios = p.ServicioEvento?.Select(s => new ServicioEventoDTO
                {
                    Id = s.Id,
                    TipoServicio = (int)s.TipoServicio,
                    Cantidad = s.Cantidad,
                    Descripcion = s.Descripcion,
                }).ToList() ?? new(),
                Timings = p.TimingsEvento?.Select(t => new TimingEventoDTO
                {
                    Id = t.Id,
                    Momento = t.Momento,
                    Hora = t.Hora.ToString(@"hh\:mm"),
                    Orden = t.Orden,
                }).ToList() ?? new(),
            };
        }
    }
}
