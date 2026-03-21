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
    public class RepositorioCotizacionEF : ICotizacionRepositorio
    {
        private Context _context;
        public RepositorioCotizacionEF(Context context)
        {
            _context = context;
        }

        public void Add(Cotizacion obj)
        {
            obj.Validar();
            _context.Cotizaciones.Add(obj);
            _context.SaveChanges();
        }

        public IEnumerable<Cotizacion> FindAll()
        {
            return _context.Cotizaciones;
        }

        public Cotizacion FindById(int id)
        {
            Cotizacion cotizacion = _context.Cotizaciones
                                    .Where(c => c.Id == id).FirstOrDefault();

            if (cotizacion == null) 
            {
                throw new CotizacionException("No se encontró una cotización con ese Id");
            }

            return cotizacion;
        }

        public void Remove(int id)
        {
            Cotizacion cotizacion = new Cotizacion { Id = id };
            _context.Cotizaciones.Remove(cotizacion);
            _context.SaveChanges(); 
        }

        public void Update(Cotizacion obj)
        {
            _context.Cotizaciones.Update(obj);
            _context.SaveChanges();
        }

        public void ActualizarEventoId(int idCotizacion, int? idEvento)
        {
            Cotizacion cotizacion = _context.Cotizaciones
                                    .Where(c => c.Id == idCotizacion).FirstOrDefault();

            if (cotizacion == null)
            {
                throw new CotizacionException("No se encontró una cotización con ese Id");
            }

            cotizacion.EventoId = idEvento;
            _context.SaveChanges();
        }
    }
}
