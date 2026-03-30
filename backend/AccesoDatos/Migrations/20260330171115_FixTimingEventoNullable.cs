using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccesoDatos.Migrations
{
    /// <inheritdoc />
    public partial class FixTimingEventoNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimingEvento_Planificacion_PlanificacionId",
                table: "TimingEvento");

            migrationBuilder.AlterColumn<int>(
                name: "PlanificacionId",
                table: "TimingEvento",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_TimingEvento_Planificacion_PlanificacionId",
                table: "TimingEvento",
                column: "PlanificacionId",
                principalTable: "Planificacion",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TimingEvento_Planificacion_PlanificacionId",
                table: "TimingEvento");

            migrationBuilder.AlterColumn<int>(
                name: "PlanificacionId",
                table: "TimingEvento",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TimingEvento_Planificacion_PlanificacionId",
                table: "TimingEvento",
                column: "PlanificacionId",
                principalTable: "Planificacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
