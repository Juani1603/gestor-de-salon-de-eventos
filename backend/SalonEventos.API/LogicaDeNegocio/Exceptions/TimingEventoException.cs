using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class TimingEventoException : Exception
    {
        public TimingEventoException() { }
        public TimingEventoException(string mensaje) : base(mensaje) { }
        public TimingEventoException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
