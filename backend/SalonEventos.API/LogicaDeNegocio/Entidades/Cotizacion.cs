using LogicaDeNegocio.Enum;
using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class Cotizacion : IValidable
    {
        public int Id { get; set; }
        public string NombreCliente { get; set; }
        public DateTime FechaEvento { get; set; }
        public TipoEvento TipoEvento { get; set; }
        public int CantidadInvitados { get; set; }
        public double PrecioPorInvitado { get; set; }
        public DateTime FechaCreacion {  get; set; }
        public int? EventoId { get; set; }

        public Cotizacion() { }
        public Cotizacion(int id, string nombreCliente, DateTime fechaEvento,
                        TipoEvento tipoEvento, int cantidadInvitados, double precioPorInvitado,
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
