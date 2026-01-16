using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class EventoException : Exception
    {
        public EventoException() { }
        public EventoException(string mensaje) : base(mensaje) { }
        public EventoException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
