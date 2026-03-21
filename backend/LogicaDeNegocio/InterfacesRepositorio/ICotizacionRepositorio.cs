using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.InterfacesRepositorio
{
    public interface ICotizacionRepositorio : IRepositorio<Cotizacion>
    {
        public void ActualizarEventoId(int idCotizacion, int? idEvento);
    }
}
