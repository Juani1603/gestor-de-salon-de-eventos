using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class Planificacion : IValidable
    {
        public int Id { get; set; }
        public int EventoId { get; set; }
        public TimeSpan HoraLlegada {  get; set; }
        public TimeSpan? HoraSalida { get; set; }
        public TimeSpan HoraComida { get; set; }
        public int CantidadMesas { get; set; }
        public string ConfiguracionMesasJson { get; set; }
        public string Observaciones {  get; set; }

        public Planificacion() { }

        public Planificacion(int id, int eventoId, TimeSpan horaLlegada, TimeSpan? horaSalida,
                             TimeSpan horaComida, int cantidadMesas, string configMesaJson, string observaciones)
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
            throw new NotImplementedException();
        }
    }
}
