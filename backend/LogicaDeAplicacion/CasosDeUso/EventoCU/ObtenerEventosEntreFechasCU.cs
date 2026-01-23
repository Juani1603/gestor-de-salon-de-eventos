using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
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

        public IEnumerable<Evento> ObtenerEventosEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            return _repositorio.ObtenerEventosEntreFechas(fechaDesde, fechaHasta);
        }
    }
}
