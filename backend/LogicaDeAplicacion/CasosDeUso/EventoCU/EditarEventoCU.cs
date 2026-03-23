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
    public class EditarEventoCU : IEditarEvento
    {
        private IEventoRepositorio _repositorio;
        public EditarEventoCU(IEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public EventoDTO EditarEvento(EventoDTO dto)
        {
            Evento evento = EventoMapper.FromDTO(dto);
            _repositorio.Update(evento);
            return EventoMapper.ToDTO(evento);
        }
    }
}
