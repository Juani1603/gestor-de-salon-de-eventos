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
    public class ObtenerReunionProximaCU : IObtenerReunionProxima
    {
        private IReunionRepositorio _repositorio;
        public ObtenerReunionProximaCU(IReunionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public Reunion ObtenerReunionProxima()
        {
            return _repositorio.ObtenerReunionProxima();
        }
    }
}
