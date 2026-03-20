using LogicaDeNegocio.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.DTOs
{
    public class EventoDTO
    {
        public int Id { get; set; }
        public int? CotizacionId { get; set; }

        [Required]
        [MaxLength(200)]
        public string NombreCliente { get; set; }

        [Required]
        public DateTime FechaEvento { get; set; }

        [Required]
        public TipoEvento TipoEvento { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int CantidadInvitados { get; set; }

        [Required]
        [Range(0, double.MaxValue)]
        public decimal PrecioPorInvitado { get; set; }

        [Required]
        public EstadoEvento EstadoEvento { get; set; }

        [Required]
        public DateTime FechaCreacion { get; set; }

        public int? PlanificacionId { get; set; }
        public string? LinkCompartible { get; set; }
    }
}
