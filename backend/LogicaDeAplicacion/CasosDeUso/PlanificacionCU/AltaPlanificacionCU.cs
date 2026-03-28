using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.IPlanificacion;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.PlanificacionCU
{
    public class AltaPlanificacionCU : IAltaPlanificacion
    {
        private IPlanificacionRepositorio _repositorio;
        public AltaPlanificacionCU(IPlanificacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public PlanificacionDTO AltaPlanificacion(PlanificacionDTO planificacionDTO)
        {
            Planificacion planificacion = PlanificacionMapper.FromDTO(planificacionDTO);
            _repositorio.Add(planificacion);
            return PlanificacionMapper.ToDTO(planificacion);
        }
    }
}
