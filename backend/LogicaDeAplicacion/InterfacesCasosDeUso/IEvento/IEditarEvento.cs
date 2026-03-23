using LogicaDeAplicacion.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.InterfacesCasosDeUso.IEvento
{
    public interface IEditarEvento
    {
        EventoDTO EditarEvento(EventoDTO evento);
    }
}
