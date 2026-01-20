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
    public class ObtenerEventosDelMesCU : IObtenerEventosDelMes
    {
        public IEventoRepositorio _repositorio;
        public ObtenerEventosDelMesCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }
        public IEnumerable<Evento> ObtenerEventosDelMes(int mes, int anio)
        {
            throw new NotImplementedException();
        }
    }
}
