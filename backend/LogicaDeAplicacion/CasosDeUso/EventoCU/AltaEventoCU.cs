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
    public class AltaEventoCU : IAltaEvento
    {
        private IEventoRepositorio _repositorio;
        public AltaEventoCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public void AltaEvento(EventoDTO evento)
        {
            _repositorio.Add(EventoMapper.FromDTO(evento));
        }
    }
}
