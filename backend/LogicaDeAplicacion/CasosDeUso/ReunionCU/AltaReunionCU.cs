using LogicaDeAplicacion.DTOs;
using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeAplicacion.Mappers;
using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LogicaDeAplicacion.CasosDeUso.ReunionCU
{
    public class AltaReunionCU : IAltaReunion
    {
        private IReunionRepositorio _repositorio;
        public AltaReunionCU(IReunionRepositorio repositorio)
        {
            _repositorio = repositorio;
        }

        public ReunionDTO AltaReunion(ReunionDTO reunionDto)
        {
            Reunion reunion = ReunionMapper.FromDTO(reunionDto);
            _repositorio.Add(reunion);
            return ReunionMapper.ToDTO(reunion);
        }
    }
}
