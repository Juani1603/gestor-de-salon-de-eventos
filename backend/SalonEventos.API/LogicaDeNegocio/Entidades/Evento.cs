using LogicaDeNegocio.Enum;
using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class Evento : IValidable
    {
        public int Id { get; set; }
        public int CotizacionId { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaEvento { get; set; }
        public TipoEvento TipoEvento { get; set; }
        public int CantidadInvitados { get; set; }
        public double PrecioPorInvitado { get; set; }
        public EstadoEvento EstadoEvento { get; set; }
        public DateTime FechaCreacion { get; set; }
        public int? PlanificacionId { get; set; }
        public string LinkCompartible { get; set; }

        public Evento() { }

        public Evento(int id, int cotizacionId, string nombreCliente, DateTime fechaEvento,
                    TipoEvento tipoEvento, int cantidadInvitados, double precioPorInvitado, EstadoEvento estadoEvento,
                    DateTime fechaCreacion, int? planificacionId, string linkCompartible)
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
