using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeAplicacion.InterfacesCasosDeUso;
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

        public CotizacionController(
            IAltaCotizacion altaCotizacion,
            IObtenerCotizaciones obtenerCotizaciones,
            IObtenerCotizacionPorId obtenerCotizacionPorId)
        {
            _altaCotizacion = altaCotizacion;
            _obtenerCotizaciones = obtenerCotizaciones;
            _obtenerCotizacionPorId = obtenerCotizacionPorId;
        }

        // POST: api/cotizacion
        [HttpPost]
        public ActionResult<Cotizacion> CrearCotizacion([FromBody] Cotizacion cotizacion)
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
        public ActionResult<IEnumerable<Cotizacion>> ObtenerTodas()
        {
            try
            {
                IEnumerable<Cotizacion> cotizaciones = _obtenerCotizaciones.ObtenerCotizaciones();
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
        public ActionResult<Cotizacion> ObtenerPorId(int id)
        {
            try
            {
                Cotizacion cotizacion = _obtenerCotizacionPorId.ObtenerCotizacionPorId(id);

                if (cotizacion == null)
                    return NotFound(new { mensaje = "Cotización no encontrada" });

                return Ok(cotizacion);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }
    }
}