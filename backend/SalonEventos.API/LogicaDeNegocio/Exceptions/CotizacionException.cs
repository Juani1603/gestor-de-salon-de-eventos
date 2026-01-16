using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class CotizacionException : Exception
    {
        public CotizacionException() { }
        public CotizacionException(string mensaje) : base(mensaje) { }
        public CotizacionException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
