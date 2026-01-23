using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.ReunionCU
{
    public class BajaReunionCU : IBajaReunion
    {
        private IReunionRepositorio _repositorio;
        public BajaReunionCU(IReunionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public void BajaReunion(int idReunion)
        {
            _repositorio.Remove(idReunion);
        }
    }
}
