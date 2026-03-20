using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeAplicacion.Mappers;
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

        public IEnumerable<CotizacionDTO> ObtenerCotizaciones()
        {
            IEnumerable<Cotizacion> retorno =
               _repositorio.FindAll();
            return retorno.Select(
                cotizacion => CotizacionMapper.ToDTO(cotizacion)
            ); ;
        }
    }
}
