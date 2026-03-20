using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LogicaDeAplicacion.DTOs;
using LogicaDeNegocio.Entidades;

namespace LogicaDeAplicacion.InterfacesCasosDeUso.IEvento
{
    public interface IObtenerEventoProximo 
    {
        public EventoDTO? ObtenerEventoProximo();
    }
}
