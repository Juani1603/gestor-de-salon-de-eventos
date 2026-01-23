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
    public class ObtenerReunionesPorFechaCU : IObtenerReunionesPorFecha
    {
        private IReunionRepositorio _repositorio;
        public ObtenerReunionesPorFechaCU(IReunionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public IEnumerable<Reunion> ObtenerReunionesPorFecha(DateTime fechaReunion)
        {
            return _repositorio.ObtenerReunionesPorFecha(fechaReunion);
        }
    }
}
