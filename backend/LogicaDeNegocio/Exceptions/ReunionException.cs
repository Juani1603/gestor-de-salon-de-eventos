using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.Exceptions
{
    public class ReunionException : Exception
    {
        public ReunionException() { }
        public ReunionException(string mensaje) : base(mensaje) { }
        public ReunionException(string mensaje, Exception ex) : base(mensaje, ex) { }
    }
}
