using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.CotizacionCU
{
    public class EliminarCotizacionCU : IEliminarCotizacion
    {
        private ICotizacionRepositorio _repositorio;
        public EliminarCotizacionCU(ICotizacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public void EliminarCotizacion(int idCotizacion)
        {
            _repositorio.Remove(idCotizacion);
        }
    }
}
