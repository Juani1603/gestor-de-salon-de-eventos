using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso;
using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeNegocio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace SalonEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CotizacionController : ControllerBase
    {
        private readonly IAltaCotizacion _altaCotizacion;
        private readonly IObtenerCotizaciones _obtenerCotizaciones;
        private readonly IObtenerCotizacionPorId _obtenerCotizacionPorId;
        private readonly IEliminarCotizacion _eliminarCotizacion;
        private readonly IActualizarEventoIdCotizacion _actualizarEventoIdCotizacion;

        public CotizacionController(
            IAltaCotizacion altaCotizacion,
            IObtenerCotizaciones obtenerCotizaciones,
            IObtenerCotizacionPorId obtenerCotizacionPorId,
            IEliminarCotizacion eliminarCotizacion,
            IActualizarEventoIdCotizacion actualizarEventoIdCotizacion  )
        {
            _altaCotizacion = altaCotizacion;
            _obtenerCotizaciones = obtenerCotizaciones;
            _obtenerCotizacionPorId = obtenerCotizacionPorId;
            _eliminarCotizacion = eliminarCotizacion;
            _actualizarEventoIdCotizacion = actualizarEventoIdCotizacion;
        }

        // POST: api/cotizacion
        [HttpPost]
        public ActionResult<Cotizacion> CrearCotizacion([FromBody] CotizacionDTO cotizacion)
        {
            try
            {
                cotizacion.FechaCreacion = DateTime.Now;
                _altaCotizacion.AltaCotizacion(cotizacion);
                return CreatedAtAction(nameof(ObtenerPorId), new { id = cotizacion.Id }, cotizacion);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // GET: api/cotizacion
        [HttpGet]
        public ActionResult<IEnumerable<CotizacionDTO>> ObtenerTodas()
        {
            try
            {
                IEnumerable<CotizacionDTO> cotizaciones = _obtenerCotizaciones.ObtenerCotizaciones();
                return Ok(cotizaciones.OrderBy(c => c.EventoId.HasValue)
                                       .ThenByDescending(c => c.FechaCreacion));
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // GET: api/cotizacion/5
        [HttpGet("{id}")]
        public ActionResult<CotizacionDTO> ObtenerPorId(int id)
        {
            try
            {
                CotizacionDTO cotizacion = _obtenerCotizacionPorId.ObtenerCotizacionPorId(id);

                if (cotizacion == null)
                    return NotFound(new { mensaje = "Cotización no encontrada" });

                return Ok(cotizacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        //DELETE: api/cotizacion/5
        [HttpDelete("{id}")]
        public ActionResult<CotizacionDTO> EliminarCotizacion(int id)
        {
            try
            {
                _eliminarCotizacion.EliminarCotizacion(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // PATCH: api/cotizacion/5/evento
        [HttpPatch("{id}/evento")]
        public ActionResult ActualizarEventoId(int id, [FromBody] ActualizarEventoIdDTO dto)
        {
            try
            {
                _actualizarEventoIdCotizacion.ActualizarEventoId(id, dto.EventoId);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}