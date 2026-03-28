using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.DTOs
{
    public class ServicioEventoDTO
    {
        public int Id { get; set; }
        public int TipoServicio { get; set; }
        public int? Cantidad { get; set; }
        public string? Descripcion { get; set; }
    }
}
