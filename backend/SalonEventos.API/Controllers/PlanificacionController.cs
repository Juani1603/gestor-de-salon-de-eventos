using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.IPlanificacion;
using Microsoft.AspNetCore.Mvc;

namespace SalonEventos.API.Controllers
{
    public class PlanificacionController : ControllerBase
    {
        private readonly IAltaPlanificacion _altaPlanificacion;
        private readonly IEditarPlanificacion _editarPlanificacion;
        private readonly IObtenerPlanificacionPorId _obtenerPlanificacion;

        public PlanificacionController(IAltaPlanificacion altaPlanificacion, IEditarPlanificacion editarPlanificacion, IObtenerPlanificacionPorId obtenerPlanificacion)
        {
            _altaPlanificacion = altaPlanificacion;
            _editarPlanificacion = editarPlanificacion;
            _obtenerPlanificacion = obtenerPlanificacion;
        }

        // GET: api/planificacion/5
        [HttpGet("{id}")]
        public ActionResult<PlanificacionDTO> ObtenerPlanificacion(int id)
        {
            try
            {
                return Ok(_obtenerPlanificacion.ObtenerPlanificacion(id));
            }
            catch (Exception ex)
            {
                return NotFound(new { mensaje = ex.Message });
            }
        }

        // POST: api/planificacion
        [HttpPost]
        public ActionResult<PlanificacionDTO> CrearPlanificacion([FromBody] PlanificacionDTO dto)
        {
            try
            {
                var resultado = _altaPlanificacion.AltaPlanificacion(dto);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // PUT: api/planificacion/5
        [HttpPut("{id}")]
        public ActionResult<PlanificacionDTO> EditarPlanificacion(int id, [FromBody] PlanificacionDTO dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { mensaje = "El ID no coincide." });

                var resultado = _editarPlanificacion.EditarPlanificacion(dto);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}
