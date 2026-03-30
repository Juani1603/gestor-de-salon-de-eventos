using AccesoDatos.EntityFramework;
using AccesoDatos.EntityFramework;
using AccesoDatos.EntityFramework.Repositorios;
using LogicaDeAplicacion.CasosDeUso.CotizacionCU;
using LogicaDeAplicacion.CasosDeUso.EventoCU;
using LogicaDeAplicacion.CasosDeUso.PlanificacionCU;
using LogicaDeAplicacion.CasosDeUso.ReunionCU;
using LogicaDeAplicacion.CasosDeUso.TimingEventoCU;
using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeAplicacion.InterfacesCasosDeUso.IPlanificacion;
using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeAplicacion.InterfacesCasosDeUso.ITimingEvento;
using LogicaDeNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;

namespace SalonEventos.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configuración de Base de datos
            builder.Services.AddDbContext<Context>(options =>
                options.UseSqlServer(builder.Configuration.GetConnectionString("Negocio")));

            //Inicialización de Repositorios
            builder.Services.AddScoped<ICotizacionRepositorio, RepositorioCotizacionEF>();
            builder.Services.AddScoped<IEventoRepositorio, RepositorioEventoEF>();
            builder.Services.AddScoped<IPlanificacionRepositorio, RepositorioPlanificacionEF>();
            builder.Services.AddScoped<IReunionRepositorio, RepositorioReunionEF>();
            builder.Services.AddScoped<IServicioEventoRepositorio, RepositorioServicioEventoEF>();
            builder.Services.AddScoped<ITimingEventoRepositorio, RepositorioTimingEventoEF>();

            //Inicialización de Casos De Uso
            
            //Cotización
            builder.Services.AddScoped<IAltaCotizacion, AltaCotizacionCU>();
            builder.Services.AddScoped<IObtenerCotizaciones, ObtenerCotizacionesCU>();
            builder.Services.AddScoped<IObtenerCotizacionPorId, ObtenerCotizacionPorIdCU>();
            builder.Services.AddScoped<IEliminarCotizacion, EliminarCotizacionCU>();
            builder.Services.AddScoped<IActualizarEventoIdCotizacion, ActualizarEventoIdCotizacionCU>();

            //Evento
            builder.Services.AddScoped<IObtenerEventoPorId, ObtenerEventoPorIdCU>();
            builder.Services.AddScoped<IObtenerEventoProximo, ObtenerEventoProximoCU>();
            builder.Services.AddScoped<IObtenerEventosDelMes, ObtenerEventosDelMesCU>();
            builder.Services.AddScoped<IObtenerEventosEntreFechas, ObtenerEventosEntreFechasCU>();
            builder.Services.AddScoped<IAltaEvento, AltaEventoCU>();
            builder.Services.AddScoped<IEliminarEvento, EliminarEventoCU>();
            builder.Services.AddScoped<IEditarEvento, EditarEventoCU>();

            //Reunión
            builder.Services.AddScoped<IAltaReunion, AltaReunionCU>();
            builder.Services.AddScoped<IBajaReunion, BajaReunionCU>();
            builder.Services.AddScoped<IObtenerReunionesDelMes, ObtenerReunionesDelMesCU>();
            builder.Services.AddScoped<IObtenerReunionProxima, ObtenerReunionProximaCU>();

            //Planificación
            builder.Services.AddScoped<IAltaPlanificacion, AltaPlanificacionCU>();
            builder.Services.AddScoped<IEditarPlanificacion, EditarPlanificacionCU>();
            builder.Services.AddScoped<IObtenerPlanificacionPorId, ObtenerPlanificacionPorIdCU>();

            //TimingEvento
            builder.Services.AddScoped<IObtenerTimingsPorDefecto, ObtenerTimingsPorDefectoCU>();

            // Servicios
            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowFrontend", policy =>
                {
                    policy.WithOrigins("http://localhost:3000")  // URL del frontend 
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            var app = builder.Build();

            // Middleware
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseCors("AllowFrontend");   
            app.UseHttpsRedirection(); 
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}