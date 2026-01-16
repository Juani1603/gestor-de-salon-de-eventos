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
    public class Cotizacion : IValidable
    {
        public int Id { get; set; }
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
        public DateTime FechaCreacion { get; set; }
        public int? EventoId { get; set; }
        public Evento? Evento { get; set; }

        public Cotizacion() { }
        public Cotizacion(int id, string nombreCliente, DateTime fechaEvento,
                        TipoEvento tipoEvento, int cantidadInvitados, decimal precioPorInvitado,
                        DateTime fechaCreacion, int? eventoId)
        {
            this.Id = id;
            this.NombreCliente = nombreCliente;
            this.FechaEvento = fechaEvento;
            this.TipoEvento = tipoEvento;
            this.CantidadInvitados = cantidadInvitados;
            this.PrecioPorInvitado = precioPorInvitado;
            this.FechaCreacion = fechaCreacion;
            this.EventoId = eventoId;
        }

        public void Validar()
        {
            throw new NotImplementedException();
        }
    }
}
