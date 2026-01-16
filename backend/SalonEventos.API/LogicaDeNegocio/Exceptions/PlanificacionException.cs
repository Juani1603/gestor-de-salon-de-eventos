using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class PlanificacionException : Exception
    {
        public PlanificacionException() { }
        public PlanificacionException(string mensaje) : base(mensaje) { }
        public PlanificacionException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
