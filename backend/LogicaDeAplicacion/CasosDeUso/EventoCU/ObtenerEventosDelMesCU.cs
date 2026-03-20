using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
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
        public IEnumerable<EventoDTO> ObtenerEventosDelMes(int mes, int anio)
        {
            IEnumerable<Evento> retorno =
               _repositorio.ObtenerEventosDelMes(mes, anio);
            return retorno.Select(
                evento => EventoMapper.ToDTO(evento)
            );
        }
    }
}
