using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FlightBooking.API.Migrations
{
    /// <inheritdoc />
    public partial class AddCarModels : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Cars",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Brand = table.Column<string>(type: "TEXT", nullable: false),
                    Category = table.Column<string>(type: "TEXT", nullable: false),
                    Emoji = table.Column<string>(type: "TEXT", nullable: false),
                    Seats = table.Column<int>(type: "INTEGER", nullable: false),
                    Bags = table.Column<int>(type: "INTEGER", nullable: false),
                    Transmission = table.Column<string>(type: "TEXT", nullable: false),
                    Fuel = table.Column<string>(type: "TEXT", nullable: false),
                    PricePerDay = table.Column<decimal>(type: "REAL", nullable: false),
                    Rating = table.Column<decimal>(type: "REAL", nullable: false),
                    Reviews = table.Column<int>(type: "INTEGER", nullable: false),
                    FeaturesJson = table.Column<string>(type: "TEXT", nullable: false),
                    Color = table.Column<string>(type: "TEXT", nullable: false),
                    Available = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cars", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CarRentals",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    CarId = table.Column<int>(type: "INTEGER", nullable: true),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false),
                    PickupLocation = table.Column<string>(type: "TEXT", nullable: false),
                    DropoffLocation = table.Column<string>(type: "TEXT", nullable: false),
                    PickupDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ReturnDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TotalDays = table.Column<int>(type: "INTEGER", nullable: false),
                    TotalPrice = table.Column<decimal>(type: "REAL", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    BookingDate = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DriverDetailsJson = table.Column<string>(type: "TEXT", nullable: false),
                    AddOnsJson = table.Column<string>(type: "TEXT", nullable: false),
                    CarName = table.Column<string>(type: "TEXT", nullable: false),
                    CarCategory = table.Column<string>(type: "TEXT", nullable: false),
                    CarPricePerDay = table.Column<decimal>(type: "REAL", nullable: false),
                    CarEmoji = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarRentals", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CarRentals_Cars_CarId",
                        column: x => x.CarId,
                        principalTable: "Cars",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_CarRentals_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CarRentals_CarId",
                table: "CarRentals",
                column: "CarId");

            migrationBuilder.CreateIndex(
                name: "IX_CarRentals_UserId",
                table: "CarRentals",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CarRentals");

            migrationBuilder.DropTable(
                name: "Cars");
        }
    }
}
