using LogicaDeNegocio.Entidades;
using Microsoft.EntityFrameworkCore;

namespace AccesoDatos.EntityFramework
{

    public class Context : DbContext
    {
        public DbSet<Cotizacion> Cotizaciones { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Planificacion> Planificaciones { get; set; }
        public DbSet<ServicioEvento> ServiciosEventos { get; set; }
        public DbSet<TimingEvento> TimingEventos { get; set; }
        public DbSet<Reunion> Reuniones { get; set; }

        public Context(DbContextOptions<Context> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Cotizacion>().ToTable("Cotizacion");
            modelBuilder.Entity<Evento>().ToTable("Evento");
            modelBuilder.Entity<Planificacion>().ToTable("Planificacion");
            modelBuilder.Entity<ServicioEvento>().ToTable("ServicioEvento");
            modelBuilder.Entity<TimingEvento>().ToTable("TimingEvento");
            modelBuilder.Entity<Reunion>().ToTable("Reunion");

            modelBuilder.Entity<Cotizacion>()
                .Property(c => c.PrecioPorInvitado)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Evento>()
                .Property(e => e.PrecioPorInvitado)
                .HasColumnType("decimal(10,2)");

            modelBuilder.Entity<Evento>()
                .Property(e => e.CotizacionId)
                .IsRequired(false);

            modelBuilder.Entity<Evento>()
                .Property(e => e.PlanificacionId)
                .IsRequired(false);

            modelBuilder.Entity<Reunion>()
                .Property(r => r.CotizacionId)
                .IsRequired(false);
        }
    }
}
