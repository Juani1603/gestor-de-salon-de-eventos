using LogicaDeNegocio.Entidades;
using LogicaDeNegocio.Exceptions;
using LogicaDeNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

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

            // Vinculamos el PlanificacionId al Evento
            Evento evento = _context.Eventos.Find(obj.EventoId);
            if (evento == null) throw new PlanificacionException("Evento no encontrado.");
            evento.PlanificacionId = obj.Id;
            _context.SaveChanges();
        }

        public IEnumerable<Planificacion> FindAll()
        {
            return _context.Planificaciones;
        }

        public Planificacion FindById(int id)
        {
            Planificacion planificacion = _context.Planificaciones
            .Include(p => p.ServicioEvento)
            .Include(p => p.TimingsEvento)
            .FirstOrDefault(p => p.Id == id);

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
            var planificacion = _context.Planificaciones
                .Include(p => p.ServicioEvento)
                .Include(p => p.TimingsEvento)
                .FirstOrDefault(p => p.Id == obj.Id);

            if (planificacion == null) throw new PlanificacionException("Planificación no encontrada.");

            // Campos base — el mapper ya convirtió los TimeSpan
            planificacion.HoraLlegada = obj.HoraLlegada;
            planificacion.HoraSalida = obj.HoraSalida;
            planificacion.HoraComida = obj.HoraComida;
            planificacion.CantidadMesas = obj.CantidadMesas;
            planificacion.Observaciones = obj.Observaciones;

            // Reemplazamos servicios y timings
            _context.ServiciosEventos.RemoveRange(planificacion.ServicioEvento!);
            _context.TimingEventos.RemoveRange(planificacion.TimingsEvento!);

            planificacion.ServicioEvento = obj.ServicioEvento?.Select(s => new ServicioEvento
            {
                PlanificacionId = planificacion.Id,
                TipoServicio = s.TipoServicio,
                Cantidad = s.Cantidad,
                Descripcion = s.Descripcion,
            }).ToList() ?? new();

            planificacion.TimingsEvento = obj.TimingsEvento?.Select(t => new TimingEvento
            {
                PlanificacionId = planificacion.Id,
                Momento = t.Momento,
                Hora = t.Hora,
                Orden = t.Orden,
            }).ToList() ?? new();

            _context.SaveChanges();
        }
    }
}
