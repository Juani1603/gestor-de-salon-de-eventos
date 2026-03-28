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
    public class ObtenerPlanificacionPorIdCU : IObtenerPlanificacionPorId
    {
        private IPlanificacionRepositorio _repositorio;
        public ObtenerPlanificacionPorIdCU(IPlanificacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public PlanificacionDTO ObtenerPlanificacion(int id)
        {
            Planificacion planificacionBuscada = _repositorio.FindById(id);
            return PlanificacionMapper.ToDTO(planificacionBuscada);
        }
    }
}
