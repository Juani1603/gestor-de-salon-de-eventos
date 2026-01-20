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
        private Context _context;
        public RepositorioEventoEF(Context context)
        {
            _context = context;
        }
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
        public Evento? ObtenerEventoProximo()
        {
            return _context.Eventos
            .Where(e => e.FechaEvento >= DateTime.Now)
            .OrderBy(e => e.FechaEvento)
            .FirstOrDefault();
        }

        public IEnumerable<Evento> ObtenerEventosDelMes(int mes, int anio)
        {
            return _context.Eventos
                .Where(e => e.FechaEvento.Year == anio && e.FechaEvento.Month == mes)
                .OrderBy(e => e.FechaEvento)
                .ToList();
        }

        public IEnumerable<Evento> ObtenerEventosPorRango(DateTime fechaInicio, DateTime fechaFin)
        {
            return _context.Eventos
               .Where(e => e.FechaEvento >= fechaInicio && e.FechaEvento <= fechaFin)
               .OrderBy(e => e.FechaEvento)
               .ToList();
        }
    }
}
