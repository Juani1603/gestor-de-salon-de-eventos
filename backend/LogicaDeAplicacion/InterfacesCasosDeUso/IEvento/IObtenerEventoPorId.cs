using LogicaDeNegocio.Entidades;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.InterfacesCasosDeUso.IEvento
{
    public interface IObtenerEventoPorId
    {
        Evento ObtenerEventoPorId(int idEvento);
    }
}
