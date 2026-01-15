using LogicaDeNegocio.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Entidades
{
    public class TimingEvento : IValidable
    {
        public int Id { get; set; }
        public int PlanificacionId { get; set; }
        public string Momento { get; set; }
        public TimeSpan Hora { get; set; }
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
