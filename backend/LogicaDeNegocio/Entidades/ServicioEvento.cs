using LogicaDeNegocio.Enum;
using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class ServicioEvento : IValidable
    {
        public int Id { get; set; }
        [Required]
        public int PlanificacionId { get; set; }
        [ForeignKey(nameof(PlanificacionId))]
        public Planificacion? Planificacion { get; set; }
        [Required]
        public TipoServicio TipoServicio { get; set; }
        [Range(1, int.MaxValue)]
        public int? Cantidad { get; set; }
        [MaxLength(500)]
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
