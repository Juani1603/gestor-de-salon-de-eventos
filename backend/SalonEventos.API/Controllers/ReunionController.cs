using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso;
using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace SalonEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ReunionController : ControllerBase
    {
        private readonly IAltaReunion _altaReunion;  
        private readonly IBajaReunion _bajaReunion;
        private readonly IObtenerReunionesDelMes _obtenerReunionesDelMes;
        private readonly IObtenerReunionProxima _obtenerReunionProxima;

        public ReunionController(
            IAltaReunion altaReunion,
            IBajaReunion bajaReunion,
            IObtenerReunionesDelMes obtenerReunionesDelMes,
            IObtenerReunionProxima obtenerReunionProxima)
        {
            _altaReunion = altaReunion;
            _bajaReunion = bajaReunion;
            _obtenerReunionesDelMes = obtenerReunionesDelMes;
            _obtenerReunionProxima = obtenerReunionProxima;
        }

        // POST: api/reunion
        [HttpPost]
        public ActionResult<ReunionDTO> CrearReunion([FromBody] ReunionDTO reunionDto)
        {
            try
            {
                reunionDto.FechaCreacion = DateTime.Now;
                var resultado = _altaReunion.AltaReunion(reunionDto);
                return Ok(resultado);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // DELETE: api/reunion/5
        [HttpDelete("{id}")]
        public ActionResult EliminarReunion(int id)
        {
            try
            {
                _bajaReunion.BajaReunion(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // GET: api/reunion/proxima
        [HttpGet("proxima")]
        public ActionResult<Reunion> ObtenerReunionProxima()
        {
            try
            {
                Reunion reunion = _obtenerReunionProxima.ObtenerReunionProxima();

                if (reunion == null)
                    return NotFound(new { mensaje = "No hay reuniones próximas" });

                return Ok(ReunionMapper.ToDTO(reunion));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // GET: api/reunion/mes?mes=1&anio=2026
        [HttpGet("mes")]
        public ActionResult<IEnumerable<Reunion>> ObtenerReunionesDelMes([FromQuery] int mes, [FromQuery] int anio)
        {
            try
            {
                IEnumerable<Reunion> reuniones = _obtenerReunionesDelMes.ObtenerReunionesDelMes(mes, anio);
                return Ok(reuniones.Select(r => ReunionMapper.ToDTO(r)));
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}