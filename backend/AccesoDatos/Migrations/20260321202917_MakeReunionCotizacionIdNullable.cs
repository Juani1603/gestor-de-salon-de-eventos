using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AccesoDatos.Migrations
{
    /// <inheritdoc />
    public partial class MakeReunionCotizacionIdNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evento_Cotizacion_CotizacionId",
                table: "Evento");

            migrationBuilder.DropIndex(
                name: "IX_Evento_CotizacionId",
                table: "Evento");

            migrationBuilder.AlterColumn<int>(
                name: "CotizacionId",
                table: "Evento",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.CreateIndex(
                name: "IX_Evento_CotizacionId",
                table: "Evento",
                column: "CotizacionId",
                unique: true,
                filter: "[CotizacionId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Evento_Cotizacion_CotizacionId",
                table: "Evento",
                column: "CotizacionId",
                principalTable: "Cotizacion",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Evento_Cotizacion_CotizacionId",
                table: "Evento");

            migrationBuilder.DropIndex(
                name: "IX_Evento_CotizacionId",
                table: "Evento");

            migrationBuilder.AlterColumn<int>(
                name: "CotizacionId",
                table: "Evento",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Evento_CotizacionId",
                table: "Evento",
                column: "CotizacionId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Evento_Cotizacion_CotizacionId",
                table: "Evento",
                column: "CotizacionId",
                principalTable: "Cotizacion",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
