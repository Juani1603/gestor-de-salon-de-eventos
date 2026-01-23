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
    public class ObtenerCotizacionPorIdCU : IObtenerCotizacionPorId
    {
        private ICotizacionRepositorio _repositorio;
        public ObtenerCotizacionPorIdCU(ICotizacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public Cotizacion ObtenerCotizacionPorId(int id)
        {
            return _repositorio.FindById(id);
        }
    }
}
