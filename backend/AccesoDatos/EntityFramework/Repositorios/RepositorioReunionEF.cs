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
    public class RepositorioReunionEF : IReunionRepositorio
    {
        private Context _context;
        public RepositorioReunionEF(Context context)
        {
            _context = context;
        }
        public void Add(Reunion obj)
        {
            obj.Validar();
            _context.Reuniones.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<Reunion> FindAll()
        {
            return _context.Reuniones;
        }

        public Reunion FindById(int id)
        {
            Reunion reunion = _context.Reuniones
                              .Where(r => r.Id == id)
                              .FirstOrDefault();

            if (reunion != null)
            {
                throw new ReunionException("No se encontró una reunión con ese Id");
            }
            return reunion;
        }

        public void Remove(int id)
        {
            Reunion reunion = new Reunion { Id = id };
            _context.Reuniones.Remove(reunion);
            _context.SaveChanges();
        }

        public void Update(Reunion obj)
        {
            _context.Reuniones.Update(obj);
            _context.SaveChanges();
        }
    }
}
