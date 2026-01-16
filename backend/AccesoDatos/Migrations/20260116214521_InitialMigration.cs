using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccesoDatos.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cotizacion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NombreCliente = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FechaEvento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TipoEvento = table.Column<int>(type: "int", nullable: false),
                    CantidadInvitados = table.Column<int>(type: "int", nullable: false),
                    PrecioPorInvitado = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    EventoId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cotizacion", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Evento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CotizacionId = table.Column<int>(type: "int", nullable: false),
                    NombreCliente = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    FechaEvento = table.Column<DateTime>(type: "datetime2", nullable: false),
                    TipoEvento = table.Column<int>(type: "int", nullable: false),
                    CantidadInvitados = table.Column<int>(type: "int", nullable: false),
                    PrecioPorInvitado = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    EstadoEvento = table.Column<int>(type: "int", nullable: false),
                    FechaCreacion = table.Column<DateTime>(type: "datetime2", nullable: false),
                    PlanificacionId = table.Column<int>(type: "int", nullable: true),
                    LinkCompartible = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Evento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Evento_Cotizacion_CotizacionId",
                        column: x => x.CotizacionId,
                        principalTable: "Cotizacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Planificacion",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventoId = table.Column<int>(type: "int", nullable: false),
                    HoraLlegada = table.Column<TimeSpan>(type: "time", nullable: false),
                    HoraSalida = table.Column<TimeSpan>(type: "time", nullable: true),
                    HoraComida = table.Column<TimeSpan>(type: "time", nullable: false),
                    CantidadMesas = table.Column<int>(type: "int", nullable: false),
                    ConfiguracionMesasJson = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Observaciones = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Planificacion", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Planificacion_Evento_EventoId",
                        column: x => x.EventoId,
                        principalTable: "Evento",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "ServicioEvento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanificacionId = table.Column<int>(type: "int", nullable: false),
                    TipoServicio = table.Column<int>(type: "int", nullable: false),
                    Cantidad = table.Column<int>(type: "int", nullable: true),
                    Descripcion = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ServicioEvento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ServicioEvento_Planificacion_PlanificacionId",
                        column: x => x.PlanificacionId,
                        principalTable: "Planificacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "TimingEvento",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PlanificacionId = table.Column<int>(type: "int", nullable: false),
                    Momento = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Hora = table.Column<TimeSpan>(type: "time", nullable: false),
                    Orden = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TimingEvento", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TimingEvento_Planificacion_PlanificacionId",
                        column: x => x.PlanificacionId,
                        principalTable: "Planificacion",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Evento_CotizacionId",
                table: "Evento",
                column: "CotizacionId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Planificacion_EventoId",
                table: "Planificacion",
                column: "EventoId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ServicioEvento_PlanificacionId",
                table: "ServicioEvento",
                column: "PlanificacionId");

            migrationBuilder.CreateIndex(
                name: "IX_TimingEvento_PlanificacionId",
                table: "TimingEvento",
                column: "PlanificacionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ServicioEvento");

            migrationBuilder.DropTable(
                name: "TimingEvento");

            migrationBuilder.DropTable(
                name: "Planificacion");

            migrationBuilder.DropTable(
                name: "Evento");

            migrationBuilder.DropTable(
                name: "Cotizacion");
        }
    }
}
