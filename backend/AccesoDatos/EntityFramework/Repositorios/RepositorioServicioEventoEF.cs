using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.Exceptions;
using LogicaDeNegocio.InterfacesRepositorio;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework.Repositorios
{
    public class RepositorioServicioEventoEF : IServicioEventoRepositorio
    {
        private Context _context;
        public RepositorioServicioEventoEF(Context context)
        {
            _context = context;
        }

        public void Add(ServicioEvento obj)
        {
            _context.ServiciosEventos.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<ServicioEvento> FindAll()
        {
            return _context.ServiciosEventos;
        }

        public ServicioEvento FindById(int id)
        {
            ServicioEvento servicioEvento = _context.ServiciosEventos
                                            .Where(se => se.Id == id)
                                            .FirstOrDefault();
            if (servicioEvento == null)
            {
                throw new ServicioEventoException("No se encontró un servicio de evento con ese Id");
            }
            return servicioEvento;
        }

        public void Remove(int id)
        {
            ServicioEvento servicioEvento = new ServicioEvento { Id =  id };
            _context.ServiciosEventos.Remove(servicioEvento);
            _context.SaveChanges();
        }

        public void Update(ServicioEvento obj)
        {
            _context.ServiciosEventos.Update(obj);
            _context.SaveChanges();
        }
    }
}
