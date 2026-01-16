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
    public class Evento : IValidable
    {
        public int Id { get; set; }
        [Required]
        public int CotizacionId { get; set; }
        [ForeignKey(nameof(CotizacionId))]
        public Cotizacion? Cotizacion { get; set; }
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
        public Planificacion? Planificacion { get; set; }
        public string? LinkCompartible { get; set; }

        public Evento() { }

        public Evento(int id, int cotizacionId, string nombreCliente, DateTime fechaEvento,
                    TipoEvento tipoEvento, int cantidadInvitados, decimal precioPorInvitado, EstadoEvento estadoEvento,
                    DateTime fechaCreacion, int? planificacionId, string? linkCompartible)
        {
            this.Id = id;
            this.CotizacionId = cotizacionId;
            this.NombreCliente = nombreCliente;
            this.FechaEvento = fechaEvento;
            this.TipoEvento = tipoEvento;
            this.CantidadInvitados = cantidadInvitados;
            this.PrecioPorInvitado = precioPorInvitado;
            this.EstadoEvento = estadoEvento;
            this.FechaCreacion = fechaCreacion;
            this.PlanificacionId = planificacionId;
            this.LinkCompartible = linkCompartible;
        }

        public void Validar()
        {
            throw new NotImplementedException();
        }
    }
}
