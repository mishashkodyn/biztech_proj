using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Migrations
{
    /// <inheritdoc />
    public partial class addpsychologistandspecializationsandnotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "UserCategory",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    IsRead = table.Column<bool>(type: "bit", nullable: false),
                    ReadAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    RelatedEntityId = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PsychologistApplications",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Education = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExperienceYears = table.Column<int>(type: "int", nullable: false),
                    DocumentUrls = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedById = table.Column<Guid>(type: "uniqueidentifier", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PsychologistApplications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PsychologistApplications_AspNetUsers_ReviewedById",
                        column: x => x.ReviewedById,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_PsychologistApplications_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Psychologists",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Bio = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    VideoGreetingUrl = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PricePerSession = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    SessionDurationMinutes = table.Column<int>(type: "int", nullable: false),
                    IsPublished = table.Column<bool>(type: "bit", nullable: false),
                    Education = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ExperienceYears = table.Column<int>(type: "int", nullable: false),
                    ContactPhone = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    WorksWithMilitary = table.Column<bool>(type: "bit", nullable: false),
                    HasTraumaTraining = table.Column<bool>(type: "bit", nullable: false),
                    OffersFreeSessionsForMilitary = table.Column<bool>(type: "bit", nullable: false),
                    DiscountForAffected = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Psychologists", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Psychologists_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Specializations",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Specializations", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PsychologistApplicationSpecialization",
                columns: table => new
                {
                    ApplicationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpecializationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PsychologistApplicationSpecialization", x => new { x.ApplicationsId, x.SpecializationsId });
                    table.ForeignKey(
                        name: "FK_PsychologistApplicationSpecialization_PsychologistApplications_ApplicationsId",
                        column: x => x.ApplicationsId,
                        principalTable: "PsychologistApplications",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PsychologistApplicationSpecialization_Specializations_SpecializationsId",
                        column: x => x.SpecializationsId,
                        principalTable: "Specializations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PsychologistSpecialization",
                columns: table => new
                {
                    PsychologistsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SpecializationsId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PsychologistSpecialization", x => new { x.PsychologistsId, x.SpecializationsId });
                    table.ForeignKey(
                        name: "FK_PsychologistSpecialization_Psychologists_PsychologistsId",
                        column: x => x.PsychologistsId,
                        principalTable: "Psychologists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PsychologistSpecialization_Specializations_SpecializationsId",
                        column: x => x.SpecializationsId,
                        principalTable: "Specializations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistApplications_ReviewedById",
                table: "PsychologistApplications",
                column: "ReviewedById");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistApplications_UserId",
                table: "PsychologistApplications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistApplicationSpecialization_SpecializationsId",
                table: "PsychologistApplicationSpecialization",
                column: "SpecializationsId");

            migrationBuilder.CreateIndex(
                name: "IX_Psychologists_UserId",
                table: "Psychologists",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PsychologistSpecialization_SpecializationsId",
                table: "PsychologistSpecialization",
                column: "SpecializationsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "PsychologistApplicationSpecialization");

            migrationBuilder.DropTable(
                name: "PsychologistSpecialization");

            migrationBuilder.DropTable(
                name: "PsychologistApplications");

            migrationBuilder.DropTable(
                name: "Psychologists");

            migrationBuilder.DropTable(
                name: "Specializations");

            migrationBuilder.DropColumn(
                name: "UserCategory",
                table: "AspNetUsers");
        }
    }
}
