using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeNegocio.InterfacesRepositorio
{
    public interface IEventoRepositorio : IRepositorio<Evento>
    {
        Evento? ObtenerEventoProximo();
        IEnumerable<Evento> ObtenerEventosDelMes(int mes, int anio);
        IEnumerable<Evento> ObtenerEventosPorRango(DateTime fechaInicio, DateTime fechaFin);
    }
}
