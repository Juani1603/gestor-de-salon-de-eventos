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
    public class RepositorioTimingEventoEF : ITimingEventoRepositorio
    {
        private Context _context;
        public RepositorioTimingEventoEF(Context context)
        {
            _context = context;
        }

        public void Add(TimingEvento obj)
        {
            _context.TimingEventos.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<TimingEvento> FindAll()
        {
            return _context.TimingEventos;
        }

        public TimingEvento FindById(int id)
        {
            TimingEvento timingEvento = _context.TimingEventos
                                        .Where(te  => te.Id == id)
                                        .FirstOrDefault();

            if(timingEvento == null)
            {
                throw new TimingEventoException("No se encontró un timing de evento con ese Id");
            }

            return timingEvento;
        }

        public void Remove(int id)
        {
            TimingEvento timingEvento = new TimingEvento { Id = id };
            _context.TimingEventos.Remove(timingEvento);   
            _context.SaveChanges();
        }

        public void Update(TimingEvento obj)
        {
            _context.TimingEventos.Update(obj);
            _context.SaveChanges();
        }
    }
}
