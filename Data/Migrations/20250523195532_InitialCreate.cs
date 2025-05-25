using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FisioScan.Data.Migrations
{
    public partial class InitialCreate : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "GeneralAssessments",
                columns: table => new
                {
                    GeneralAssessmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    TreatmentId = table.Column<int>(type: "int", nullable: false),
                    PainLevel = table.Column<int>(type: "int", nullable: false),
                    UsualPhysicalActivity = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Height = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Weight = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Occupation = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MedicalHistory = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_GeneralAssessments", x => x.GeneralAssessmentId);
                });

            migrationBuilder.CreateTable(
                name: "MuscularAssessments",
                columns: table => new
                {
                    MuscularAssessmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    TreatmentId = table.Column<int>(type: "int", nullable: false),
                    MuscleName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MuscleAssessment = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MuscularAssessments", x => x.MuscularAssessmentId);
                });

            migrationBuilder.CreateTable(
                name: "Patients",
                columns: table => new
                {
                    PatientId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Dni = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    BirthDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Patients", x => x.PatientId);
                });

            migrationBuilder.CreateTable(
                name: "Physios",
                columns: table => new
                {
                    PhysioId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SecondSurname = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    RegistrationNumber = table.Column<int>(type: "int", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Role = table.Column<string>(type: "nvarchar(max)", nullable: false, defaultValue: "Physio"),
                    Password = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Physios", x => x.PhysioId);
                });

            migrationBuilder.CreateTable(
                name: "Treatments",
                columns: table => new
                {
                    TreatmentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PatientId = table.Column<int>(type: "int", nullable: false),
                    CreatedBy = table.Column<int>(type: "int", nullable: false),
                    TreatmentCause = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TreatmentDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Treatments", x => x.TreatmentId);
                });

            migrationBuilder.InsertData(
                table: "GeneralAssessments",
                columns: new[] { "GeneralAssessmentId", "CreatedBy", "Height", "MedicalHistory", "Occupation", "PainLevel", "TreatmentId", "UsualPhysicalActivity", "Weight" },
                values: new object[,]
                {
                    { 1, 2, "1.80", "no previous injuries", "engineer", 6, 1, "running", "75" },
                    { 2, 2, "1.80", "Lumbar disc herniation", "engineer", 4, 2, "running", "75" },
                    { 3, 2, "1.73", "no previous injuries", "truck driver", 3, 3, "No physical activity", "80" }
                });

            migrationBuilder.InsertData(
                table: "MuscularAssessments",
                columns: new[] { "MuscularAssessmentId", "CreatedBy", "MuscleAssessment", "MuscleName", "TreatmentId" },
                values: new object[,]
                {
                    { 1, 2, "increased muscle tone", "Right Serratus-posterior", 1 },
                    { 2, 2, "painful on palpation", "Right Latissimus-dorsi", 1 },
                    { 3, 2, "painful on palpation", "Right Latissimus-dorsi", 2 },
                    { 4, 3, "painful on palpation", "Right Deltoid", 3 }
                });

            migrationBuilder.InsertData(
                table: "Patients",
                columns: new[] { "PatientId", "BirthDate", "CreatedBy", "Dni", "FirstSurname", "Name", "SecondSurname" },
                values: new object[,]
                {
                    { 1, new DateTime(1990, 1, 2, 0, 0, 0, 0, DateTimeKind.Unspecified), 1, "724264567", "González", "John", "Rodríguez" },
                    { 2, new DateTime(1985, 5, 4, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "723626246", "Sánchez", "Luis", "Martínez" },
                    { 3, new DateTime(1995, 3, 22, 0, 0, 0, 0, DateTimeKind.Unspecified), 2, "745751345", "Sanz", "Rebeca", "Gimenez" },
                    { 4, new DateTime(1988, 3, 12, 0, 0, 0, 0, DateTimeKind.Unspecified), 3, "714265724", "Prieto", "Javier", "Alonso" }
                });

            migrationBuilder.InsertData(
                table: "Physios",
                columns: new[] { "PhysioId", "Email", "FirstSurname", "Name", "Password", "RegistrationNumber", "Role", "SecondSurname" },
                values: new object[,]
                {
                    { 1, "admin@admin.com", "Perez", "Juan", "admin", 1568, "Admin", "Martínez" },
                    { 2, "david.calvo@example.com", "Calvo", "David", "1234", 1247, "Physio", "Alonso" },
                    { 3, "rocio.reinosa@example.com", "Reinosa", "Rocío", "1234", 1174, "Physio", "Duate" }
                });

            migrationBuilder.InsertData(
                table: "Treatments",
                columns: new[] { "TreatmentId", "CreatedBy", "PatientId", "TreatmentCause", "TreatmentDate" },
                values: new object[,]
                {
                    { 1, 2, 2, "lumbalgia", new DateTime(2024, 11, 17, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 2, 2, 2, "lumbalgia", new DateTime(2024, 11, 23, 0, 0, 0, 0, DateTimeKind.Unspecified) },
                    { 3, 3, 4, "hombro congelado", new DateTime(2024, 12, 27, 0, 0, 0, 0, DateTimeKind.Unspecified) }
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "GeneralAssessments");

            migrationBuilder.DropTable(
                name: "MuscularAssessments");

            migrationBuilder.DropTable(
                name: "Patients");

            migrationBuilder.DropTable(
                name: "Physios");

            migrationBuilder.DropTable(
                name: "Treatments");
        }
    }
}
