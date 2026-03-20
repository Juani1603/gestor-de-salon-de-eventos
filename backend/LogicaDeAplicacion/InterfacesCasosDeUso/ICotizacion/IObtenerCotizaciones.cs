using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion
{
    public interface IObtenerCotizaciones
    {
        IEnumerable<CotizacionDTO> ObtenerCotizaciones();
    }
}
