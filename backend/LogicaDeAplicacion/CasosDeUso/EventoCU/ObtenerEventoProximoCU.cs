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
    public class ObtenerEventoProximoCU : IObtenerEventoProximo
    {
        private IEventoRepositorio _repositorio;
        public ObtenerEventoProximoCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }
        public Evento? ObtenerEventoProximo()
        {
            return _repositorio.ObtenerEventoProximo();
        }
    }
}
