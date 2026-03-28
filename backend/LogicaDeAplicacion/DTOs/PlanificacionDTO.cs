using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.DTOs
{
    public class PlanificacionDTO
    {
        public int Id { get; set; }
        public int EventoId { get; set; }
        public string HoraLlegada { get; set; }  
        public string? HoraSalida { get; set; }
        public string HoraComida { get; set; }
        public int CantidadMesas { get; set; }
        public string? Observaciones { get; set; }
        public List<ServicioEventoDTO> Servicios { get; set; } = new();
        public List<TimingEventoDTO> Timings { get; set; } = new();
    }
}
