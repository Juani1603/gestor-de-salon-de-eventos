using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccesoDatos.Migrations
{
    /// <inheritdoc />
    public partial class MakeTimingEventoPlanificacionIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reunion_Cotizacion_CotizacionId",
                table: "Reunion");

            migrationBuilder.AlterColumn<int>(
                name: "CotizacionId",
                table: "Reunion",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Reunion_Cotizacion_CotizacionId",
                table: "Reunion",
                column: "CotizacionId",
                principalTable: "Cotizacion",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reunion_Cotizacion_CotizacionId",
                table: "Reunion");

            migrationBuilder.AlterColumn<int>(
                name: "CotizacionId",
                table: "Reunion",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Reunion_Cotizacion_CotizacionId",
                table: "Reunion",
                column: "CotizacionId",
                principalTable: "Cotizacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
