using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeNegocio.Entidades;
using Microsoft.AspNetCore.Mvc;

namespace SalonEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly IObtenerEventoPorId _obtenerEventoPorId;
        private readonly IObtenerEventoProximo _obtenerEventoProximo;
        private readonly IObtenerEventosDelMes _obtenerEventosDelMes;
        private readonly IObtenerEventosEntreFechas _obtenerEventosEntreFechas;
        private readonly IAltaEvento _altaEvento;

        public EventoController(
            IObtenerEventoPorId obtenerEventoPorId,
            IObtenerEventoProximo obtenerEventoProximo,
            IObtenerEventosDelMes obtenerEventosDelMes,
            IObtenerEventosEntreFechas obtenerEventosEntreFechas,
            IAltaEvento altaEvento)
        {
            _obtenerEventoPorId = obtenerEventoPorId;
            _obtenerEventoProximo = obtenerEventoProximo;
            _obtenerEventosDelMes = obtenerEventosDelMes;
            _obtenerEventosEntreFechas = obtenerEventosEntreFechas;
            _altaEvento = altaEvento;
        }

        // GET: api/evento/proximo
        [HttpGet("proximo")]
        public ActionResult<Evento> ObtenerEventoProximo()
        {
            try
            {
                Evento? evento = _obtenerEventoProximo.ObtenerEventoProximo();

                if (evento == null)
                    return NotFound(new { mensaje = "No hay eventos próximos" });

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        // GET: api/evento/mes?mes=1&anio=2026
        [HttpGet("mes")]
        public ActionResult<IEnumerable<Evento>> ObtenerEventosDelMes([FromQuery] int mes, [FromQuery] int anio)
        {
            try
            {
                IEnumerable<Evento> eventos = _obtenerEventosDelMes.ObtenerEventosDelMes(mes, anio);
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // GET: api/evento/rango?fechaInicio=2026-01-01&fechaFin=2026-01-31
        [HttpGet("rango")]
        public ActionResult<IEnumerable<Evento>> ObtenerEventosEntreFechas(
            [FromQuery] DateTime fechaInicio,
            [FromQuery] DateTime fechaFin)
        {
            try
            {
                IEnumerable<Evento> eventos = _obtenerEventosEntreFechas.ObtenerEventosEntreFechas(fechaInicio, fechaFin);
                return Ok(eventos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }

        // GET: api/evento/5
        [HttpGet("{id}")]
        public ActionResult<Evento> ObtenerPorId(int id)
        {
            try
            {
                Evento evento = _obtenerEventoPorId.ObtenerEventoPorId(id);

                if (evento == null)
                    return NotFound(new { mensaje = "Evento no encontrado" });

                return Ok(evento);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensaje = ex.Message });
            }
        }

        //POST: api/evento
        [HttpPost]
        public ActionResult<Evento> AltaEvento(Evento evento)
        {
            try
            {
                _altaEvento.AltaEvento(evento);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}