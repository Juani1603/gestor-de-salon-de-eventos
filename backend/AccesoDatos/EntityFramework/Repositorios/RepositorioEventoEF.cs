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
    public class RepositorioEventoEF : IEventoRepositorio
    {
        private Context _context;
        public RepositorioEventoEF(Context context)
        {
            _context = context;
        }
        public void Add(Evento obj)
        {
            obj.Validar();
            _context.Eventos.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<Evento> FindAll()
        {
            return _context.Eventos;
        }

        public Evento FindById(int id)
        {
            Evento evento = _context.Eventos
                            .Where(e => e.Id == id).FirstOrDefault();

            if (evento == null)
            {
                throw new EventoException("No se encontró un evento con ese Id");
            }

            return evento;
        }

        public void Remove(int id)
        {
            Evento evento = new Evento { Id = id };
            _context.Eventos.Remove(evento);
            _context.SaveChanges();
        }

        public void Update(Evento obj)
        {
            _context.Eventos.Update(obj);
            _context.SaveChanges();
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
