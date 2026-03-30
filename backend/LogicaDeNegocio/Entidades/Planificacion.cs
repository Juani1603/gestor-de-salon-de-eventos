using LogicaDeNegocio.Exceptions;
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
    public class Planificacion : IValidable
    {
        public int Id { get; set; }
        [Required]
        public int EventoId { get; set; }
        [ForeignKey(nameof(EventoId))]
        public Evento? Evento { get; set; }
        [Required]
        public TimeSpan HoraLlegada {  get; set; }
        public TimeSpan? HoraSalida { get; set; }
        [Required]
        public TimeSpan HoraComida { get; set; }
        [Required]
        [Range(1, int.MaxValue)]
        public int CantidadMesas { get; set; }
        [Required]
        public string ConfiguracionMesasJson { get; set; }
        [MaxLength(1000)]
        public string? Observaciones {  get; set; }
        public List<ServicioEvento>? ServicioEvento { get; set; }
        public List<TimingEvento>? TimingsEvento { get; set; }

        public Planificacion() { }

        public Planificacion(int id, int eventoId, TimeSpan horaLlegada, TimeSpan? horaSalida,
                             TimeSpan horaComida, int cantidadMesas, string configMesaJson, string? observaciones)
        {
            this.Id = id;
            this.EventoId = eventoId;
            this.HoraLlegada = horaLlegada;
            this.HoraSalida = horaSalida;
            this.HoraComida = horaComida;
            this.CantidadMesas = cantidadMesas;
            this.ConfiguracionMesasJson = configMesaJson;
            this.Observaciones = observaciones;
        }

        public void Validar()
        {
            if (this.HoraLlegada == TimeSpan.Zero)
            {
                throw new PlanificacionException("Debe ingresar una hora de llegada válida.");
            }

            if (this.HoraSalida.HasValue)
            {
                if (this.HoraLlegada >= this.HoraSalida.Value)
                {
                    throw new PlanificacionException("La hora de llegada debe ser menor que la hora de salida.");
                }
            }
            if (this.CantidadMesas <= 0)
            {
                throw new PlanificacionException("Debe ingresar la cantidad de mesas.");
            }
        }
    }
}
