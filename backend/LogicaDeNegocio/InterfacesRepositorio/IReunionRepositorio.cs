using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.InterfacesRepositorio
{
    public interface IReunionRepositorio : IRepositorio<Reunion>
    {
        Reunion ObtenerReunionProxima();
        IEnumerable<Reunion> ObtenerReunionesDelMes(int mes, int anio);
    }
}
