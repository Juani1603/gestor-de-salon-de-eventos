using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.Exceptions;
using LogicaDeNegocio.InterfacesRepositorio;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework.Repositorios
{
    public class RepositorioPlanificacionEF : IPlanificacionRepositorio
    {
        private Context _context;
        public RepositorioPlanificacionEF(Context context)
        {
            _context = context;
        }
        public void Add(Planificacion obj)
        {
            obj.Validar();
            _context.Planificaciones.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<Planificacion> FindAll()
        {
            return _context.Planificaciones;
        }

        public Planificacion FindById(int id)
        {
            Planificacion planificacion = _context.Planificaciones
                                          .Where(p => p.Id == id).FirstOrDefault();

            if (planificacion == null)
            {
                throw new PlanificacionException("No se encontró una planificación con ese Id");
            }

            return planificacion;
        }

        public void Remove(int id)
        {
            Planificacion planificacion = new Planificacion { Id = id };
            _context.Planificaciones.Remove(planificacion);
            _context.SaveChanges();
        }

        public void Update(Planificacion obj)
        {
            _context.Planificaciones.Update(obj);
            _context.SaveChanges();
        }
    }
}
