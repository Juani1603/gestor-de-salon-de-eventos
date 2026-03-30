using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.ITimingEvento;
using Microsoft.AspNetCore.Mvc;

namespace SalonEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TimingEventoController : ControllerBase
    {
        private readonly IObtenerTimingsPorDefecto _obtenerTimingsPorDefecto;
        public TimingEventoController(IObtenerTimingsPorDefecto obtenerTimingsPorDefecto)
        {
            _obtenerTimingsPorDefecto = obtenerTimingsPorDefecto;
        }

        [HttpGet("templates")]
        public ActionResult<IEnumerable<TimingEventoDTO>> ObtenerTemplates()
        {
            try
            {
                return Ok(_obtenerTimingsPorDefecto.ObtenerTimingsPorDefecto());
            }
            catch (Exception ex)
            {
                return BadRequest(new { mensaje = ex.Message });
            }
        }
    }
}
