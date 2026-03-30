using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.ITimingEvento;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.TimingEventoCU
{
    public class ObtenerTimingsPorDefectoCU : IObtenerTimingsPorDefecto
    {
        private ITimingEventoRepositorio _repositorio;
        public ObtenerTimingsPorDefectoCU(ITimingEventoRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public IEnumerable<TimingEventoDTO> ObtenerTimingsPorDefecto()
        {
            return _repositorio.FindAll()
                .Where(t => t.PlanificacionId == null)
                .Select(t => TimingEventoMapper.ToDTO(t));
        }
    }
}
