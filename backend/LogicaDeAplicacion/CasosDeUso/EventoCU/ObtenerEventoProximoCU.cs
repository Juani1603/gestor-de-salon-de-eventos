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
    public class ObtenerEventoProximoCU : IObtenerEventoProximo
    {
        private IEventoRepositorio _repositorio;
        public ObtenerEventoProximoCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }
        public EventoDTO? ObtenerEventoProximo()
        {
            return EventoMapper.ToDTO(_repositorio.ObtenerEventoProximo());
        }
    }
}
