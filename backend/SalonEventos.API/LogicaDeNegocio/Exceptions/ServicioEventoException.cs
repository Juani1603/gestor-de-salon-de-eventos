using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class ServicioEventoException : Exception
    {
        public ServicioEventoException() { }
        public ServicioEventoException(string mensaje) : base(mensaje) { }
        public ServicioEventoException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
