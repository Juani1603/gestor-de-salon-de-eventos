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
    public class EditarPlanificacionCU : IEditarPlanificacion
    {
        private IPlanificacionRepositorio _repositorio;
        public EditarPlanificacionCU(IPlanificacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public PlanificacionDTO EditarPlanificacion(PlanificacionDTO planificacionDTO)
        {
            Planificacion planificacion = PlanificacionMapper.FromDTO(planificacionDTO);
            _repositorio.Update(planificacion);
            return PlanificacionMapper.ToDTO(planificacion);
        }
    }
}
