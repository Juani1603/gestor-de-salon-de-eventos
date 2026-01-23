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
    public class ObtenerEventoPorIdCU : IObtenerEventoPorId
    {
        private IEventoRepositorio _repositorio;
        public ObtenerEventoPorIdCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public Evento ObtenerEventoPorId(int idEvento)
        {
            return _repositorio.FindById(idEvento);
        }
    }
}
