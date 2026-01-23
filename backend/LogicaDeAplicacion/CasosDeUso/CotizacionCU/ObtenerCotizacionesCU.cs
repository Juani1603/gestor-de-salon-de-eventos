using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.CotizacionCU
{
    public class ObtenerCotizacionesCU : IObtenerCotizaciones
    {
        private ICotizacionRepositorio _repositorio;
        public ObtenerCotizacionesCU(ICotizacionRepositorio repositorio )
        {
            _repositorio = repositorio;
        }

        public IEnumerable<Cotizacion> ObtenerCotizaciones()
        {
            return _repositorio.FindAll();
        }
    }
}
