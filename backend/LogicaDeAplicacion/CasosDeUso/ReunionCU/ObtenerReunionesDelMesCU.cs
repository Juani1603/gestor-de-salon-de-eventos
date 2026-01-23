using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.ReunionCU
{
    public class ObtenerReunionesDelMesCU : IObtenerReunionesDelMes
    {
        private IReunionRepositorio _repositorio;
        public ObtenerReunionesDelMesCU(IReunionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public IEnumerable<Reunion> ObtenerReunionesDelMes(int mes, int anio)
        {
            return _repositorio.ObtenerReunionesDelMes(mes, anio);
        }
    }
}
