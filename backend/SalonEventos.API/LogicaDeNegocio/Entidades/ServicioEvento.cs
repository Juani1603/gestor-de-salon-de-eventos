using LogicaDeNegocio.Enum;
using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class ServicioEvento : IValidable
    {
        public int Id { get; set; }
        public int PlanificacionId { get; set; }
        public TipoServicio TipoServicio { get; set; }
        public int? Cantidad { get; set; }
        public string? Descripcion { get; set; }

        public ServicioEvento() { }
        public ServicioEvento(int id, int planificacionId, TipoServicio tipoServicio, int? cantidad, string? descripcion)
        {
            Id = id;
            PlanificacionId = planificacionId;
            TipoServicio = tipoServicio;
            Cantidad = cantidad;
            Descripcion = descripcion;
        }

        public void Validar()
        {
            throw new NotImplementedException();
        }
    }
}
