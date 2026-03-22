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
    public class Reunion : IValidable
    {
        public int Id { get; set; }
        [Required]
        public int? CotizacionId { get; set; }
        [ForeignKey(nameof(CotizacionId))]
        public Cotizacion? Cotizacion { get; set; }
        [Required]
        [MaxLength(200)]
        public string NombreCliente { get; set; }
        [Required]
        public DateTime FechaHora { get; set; }
        [Required]
        public DateTime FechaCreacion { get; set; }
        public Reunion() { }
        public Reunion(int id, int cotizacionId, Cotizacion? cotizacion,
                      string nombreCliente, DateTime fechaHora, DateTime fechaCreacion)
        {
            Id = id;
            CotizacionId = cotizacionId;
            Cotizacion = cotizacion;
            NombreCliente = nombreCliente;
            FechaHora = fechaHora;
            FechaCreacion = fechaCreacion;
        }

        public void Validar()
        {
            if (string.IsNullOrEmpty(this.NombreCliente))
            {
                throw new ReunionException("El nombre del cliente no puede estar vacío");
            }
            if (this.FechaHora == DateTime.MinValue)
            {
                throw new ReunionException("La fecha es obligatoria");
            }
            if (this.FechaHora < DateTime.Now)
            {
                throw new ReunionException("La fecha y hora de la reunión no puede ser anterior a la actual");
            }
        }
    }
}
