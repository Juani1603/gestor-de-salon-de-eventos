using LogicaDeNegocio.Entidades;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AccesoDatos.EntityFramework
{
    public class Context : DbContext
    {
        public DbSet<Cotizacion> Cotizaciones { get; set; }
        public DbSet<Evento> Eventos { get; set; }
        public DbSet<Planificacion> Planificacions { get; set; }
        public DbSet<ServicioEvento> ServiciosEventos { get; set; }
        public DbSet<TimingEvento> TimingEventos { get; set; }
    }
}
