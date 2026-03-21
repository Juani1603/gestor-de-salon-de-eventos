using LogicaDeNegocio.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.DTOs
{
    public class CotizacionDTO
    {
        public int Id { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaEvento { get; set; }
        public TipoEvento TipoEvento { get; set; }
        public int CantidadInvitados { get; set; }
        public decimal PrecioPorInvitado { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int? EventoId { get; set; }
    }
}
