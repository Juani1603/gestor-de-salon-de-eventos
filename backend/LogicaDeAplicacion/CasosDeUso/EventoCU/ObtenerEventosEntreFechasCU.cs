using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.EventoCU
{
    public class ObtenerEventosEntreFechasCU : IObtenerEventosEntreFechas
    {
        private IEventoRepositorio _repositorio;
        public ObtenerEventosEntreFechasCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public IEnumerable<EventoDTO> ObtenerEventosEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            IEnumerable<Evento> retorno =
               _repositorio.ObtenerEventosEntreFechas(fechaDesde, fechaHasta);
            return retorno.Select(
                evento => EventoMapper.ToDTO(evento)
            );
        }
    }
}
