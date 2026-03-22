using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.Exceptions;
using LogicaDeNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;
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
            Evento evento = _context.Eventos.FirstOrDefault(e => e.Id == id);
            if (evento == null) throw new Exception("Evento no encontrado.");

            // Si tiene cotización asociada, limpiar el vínculo
            if (evento.CotizacionId.HasValue)
            {
                Cotizacion cotizacion = _context.Cotizaciones.FirstOrDefault(c => c.Id == evento.CotizacionId.Value);
                if (cotizacion != null)
                    cotizacion.EventoId = null;
            }

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
            .Where(e => e.FechaEvento >= DateTime.Today)
            .OrderBy(e => e.FechaEvento)
            .FirstOrDefault();
        }

        public IEnumerable<Evento> ObtenerEventosDelMes(int mes, int anio)
        {
            return _context.Eventos
                .Where(e => e.FechaEvento.Year == anio && e.FechaEvento.Month == mes)
                .OrderBy(e => e.FechaEvento)
                .AsNoTracking()
                .ToList();
        }

        public IEnumerable<Evento> ObtenerEventosEntreFechas(DateTime fechaDesde, DateTime fechaHasta)
        {
            return _context.Eventos
               .Where(e => e.FechaEvento >= fechaDesde && e.FechaEvento <= fechaHasta)
               .OrderBy(e => e.FechaEvento)
               .ToList();
        }
    }
}
