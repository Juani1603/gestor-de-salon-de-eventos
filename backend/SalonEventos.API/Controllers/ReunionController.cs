using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeAplicacion.InterfacesCasosDeUso;
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
        private readonly IObtenerReunionesPorFecha _obtenerReunionesPorFecha;
        private readonly IObtenerReunionProxima _obtenerReunionProxima;

        public ReunionController(
            IAltaReunion altaReunion,
            IBajaReunion bajaReunion,
            IObtenerReunionesDelMes obtenerReunionesDelMes,
            IObtenerReunionesPorFecha obtenerReunionesPorFecha,
            IObtenerReunionProxima obtenerReunionProxima)
        {
            _altaReunion = altaReunion;
            _bajaReunion = bajaReunion;
            _obtenerReunionesDelMes = obtenerReunionesDelMes;
            _obtenerReunionesPorFecha = obtenerReunionesPorFecha;
            _obtenerReunionProxima = obtenerReunionProxima;
        }

        // POST: api/reunion
        [HttpPost]
        public ActionResult<Reunion> CrearReunion([FromBody] Reunion reunion)
        {
            try
            {
                _altaReunion.AltaReunion(reunion);
                return CreatedAtAction(nameof(ObtenerReunionProxima), reunion);
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
                return NoContent();
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

                return Ok(reunion);
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
                return Ok(reuniones);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // GET: api/reunion/fecha?fecha=2026-01-23
        [HttpGet("fecha")]
        public ActionResult<IEnumerable<Reunion>> ObtenerReunionesPorFecha([FromQuery] DateTime fecha)
        {
            try
            {
                IEnumerable<Reunion> reuniones = _obtenerReunionesPorFecha.ObtenerReunionesPorFecha(fecha);
                return Ok(reuniones);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}