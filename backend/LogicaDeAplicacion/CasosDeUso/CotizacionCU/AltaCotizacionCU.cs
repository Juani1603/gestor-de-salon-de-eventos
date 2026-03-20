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
    public class AltaCotizacionCU : IAltaCotizacion
    {
        private ICotizacionRepositorio _repositorio;
        public AltaCotizacionCU(ICotizacionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public void AltaCotizacion(CotizacionDTO cotizacion)
        {
            _repositorio.Add(CotizacionMapper.FromDTO(cotizacion));
        }
    }
}
