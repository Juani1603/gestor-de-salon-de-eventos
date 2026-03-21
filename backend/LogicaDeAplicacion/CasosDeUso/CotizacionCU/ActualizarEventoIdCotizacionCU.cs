using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.CotizacionCU
{
    public class ActualizarEventoIdCotizacionCU : IActualizarEventoIdCotizacion
    {
        private ICotizacionRepositorio _repositorio;
        public ActualizarEventoIdCotizacionCU(ICotizacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public void ActualizarEventoId(int idCotizacion, int? idEvento)
        {
            _repositorio.ActualizarEventoId(idCotizacion, idEvento);
        }
    }
}
