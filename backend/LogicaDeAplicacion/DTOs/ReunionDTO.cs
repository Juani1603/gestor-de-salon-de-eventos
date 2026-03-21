using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.DTOs
{
    public class ReunionDTO
    {
        public int Id { get; set; }
        public int CotizacionId { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaHora { get; set; }
        public DateTime FechaCreacion { get; set; }
    }
}
