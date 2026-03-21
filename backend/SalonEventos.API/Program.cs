using AccesoDatos.EntityFramework;
using LogicaDeNegocio.InterfacesRepositorio;
using Microsoft.EntityFrameworkCore;
using AccesoDatos.EntityFramework;
using AccesoDatos.EntityFramework.Repositorios;
using LogicaDeAplicacion.InterfacesCasosDeUso.ICotizacion;
using LogicaDeAplicacion.CasosDeUso.CotizacionCU;
using LogicaDeAplicacion.InterfacesCasosDeUso.IEvento;
using LogicaDeAplicacion.CasosDeUso.EventoCU;
using LogicaDeAplicacion.InterfacesCasosDeUso.IReunion;
using LogicaDeAplicacion.CasosDeUso.ReunionCU;

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

            //Reunión
            builder.Services.AddScoped<IAltaReunion, AltaReunionCU>();
            builder.Services.AddScoped<IBajaReunion, BajaReunionCU>();
            builder.Services.AddScoped<IObtenerReunionesDelMes, ObtenerReunionesDelMesCU>();
            builder.Services.AddScoped<IObtenerReunionProxima, ObtenerReunionProximaCU>();

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