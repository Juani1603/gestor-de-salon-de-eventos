using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework.Repositorios
{
    public class RepositorioEventoEF : IEventoRepositorio
    {
        public void Add(Evento obj)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<Evento> FindAll()
        {
            throw new NotImplementedException();
        }

        public Evento FindById(int id)
        {
            throw new NotImplementedException();
        }

        public void Remove(int id)
        {
            throw new NotImplementedException();
        }

        public void Update(Evento obj)
        {
            throw new NotImplementedException();
        }
    }
}
