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
    public class TimingEvento : IValidable
    {
        public int Id { get; set; }
        [Required]
        public int? PlanificacionId { get; set; }
        [ForeignKey(nameof(PlanificacionId))]
        public Planificacion? Planificacion { get; set; }
        [Required]
        [MaxLength(100)]
        public string Momento { get; set; }
        [Required]
        public TimeSpan Hora { get; set; }
        [Required]
        [Range(0, int.MaxValue)]
        public int Orden {  get; set; }

        public TimingEvento() { }
        public TimingEvento(int id, int planificacionId, string momento, TimeSpan hora, int orden)
        {
            Id = id;
            PlanificacionId = planificacionId;
            Momento = momento;
            Hora = hora;
            Orden = orden;
        }

        public void Validar()
        {
            throw new NotImplementedException();
        }
    }
}
