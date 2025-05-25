using Microsoft.EntityFrameworkCore;
using FisioScan.Models;
using Microsoft.Extensions.Logging;
using System.ComponentModel.DataAnnotations;

namespace FisioScan.Data
{
    public class FisioScanContext : DbContext
    {
        public FisioScanContext(DbContextOptions<FisioScanContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Physio>()
                .Property(p => p.Role)
                .HasDefaultValue("Physio");

            modelBuilder.Entity<Physio>().HasData(
                new Physio 
                { 
                    PhysioId = 1, 
                    Name = "Juan",
                    FirstSurname = "Perez",
                    SecondSurname = "Martínez",
                    Email = "admin@admin.com",
                    RegistrationNumber = 1568,
                    Password = "admin",
                    Role = "Admin"
                },
                new Physio 
                { 
                    PhysioId = 2, 
                    Name = "David", 
                    FirstSurname = "Calvo",
                    SecondSurname = "Alonso",
                    Email = "david.calvo@example.com",
                    RegistrationNumber = 1247, 
                    Password = "1234",
                    Role = "Physio"
                },
                new Physio 
                { 
                    PhysioId = 3, 
                    Name = "Rocío", 
                    FirstSurname = "Reinosa",
                    SecondSurname = "Duate",
                    Email = "rocio.reinosa@example.com",
                    RegistrationNumber = 1174, 
                    Password = "1234",
                    Role = "Physio"
                }
            );

            modelBuilder.Entity<Patient>().HasData(
                new Patient 
                { 
                    PatientId = 1,
                    CreatedBy = 1, 
                    Name = "John",
                    FirstSurname = "González",
                    SecondSurname = "Rodríguez",
                    Dni = "724264567",
                    BirthDate = new DateTime(1990 , 1, 2)
                },
                new Patient 
                { 
                    PatientId = 2,
                    CreatedBy = 2, 
                    Name = "Luis",
                    FirstSurname = "Sánchez",
                    SecondSurname = "Martínez",
                    Dni = "723626246",
                    BirthDate = new DateTime(1985, 5, 4)
                },
                new Patient 
                { 
                    PatientId = 3,
                    CreatedBy = 2, 
                    Name = "Rebeca",
                    FirstSurname = "Sanz",
                    SecondSurname = "Gimenez",
                    Dni = "745751345",
                    BirthDate = new DateTime(1995, 3, 22)
                },
                new Patient
                {
                    PatientId = 4,
                    CreatedBy = 3, 
                    Name = "Javier",
                    FirstSurname = "Prieto",
                    SecondSurname = "Alonso",
                    Dni = "714265724",
                    BirthDate = new DateTime(1988, 3, 12)
                }
            );

            modelBuilder.Entity<Treatment>().HasData(
                new Treatment
                {
                    TreatmentId = 1,
                    PatientId = 2,
                    CreatedBy = 2,
                    TreatmentCause = "lumbalgia",
                    TreatmentDate = new DateTime(2024, 11, 17)
                },
                new Treatment
                {
                    TreatmentId = 2,
                    PatientId = 2,
                    CreatedBy = 2,
                    TreatmentCause = "lumbalgia",
                    TreatmentDate = new DateTime(2024, 11, 23)
                },
                new Treatment
                {
                    TreatmentId = 3,
                    PatientId = 4,
                    CreatedBy = 3,
                    TreatmentCause = "hombro congelado",
                    TreatmentDate = new DateTime(2024, 12, 27)
                }
            );

            modelBuilder.Entity<GeneralAssessment>().HasData(
                new GeneralAssessment
                {
                    GeneralAssessmentId = 1,
                    CreatedBy = 2,
                    TreatmentId = 1,
                    PainLevel = 6,
                    UsualPhysicalActivity = "running",
                    Height = "1.80",
                    Weight = "75",
                    Occupation = "engineer",
                    MedicalHistory = "no previous injuries"
                },
                new GeneralAssessment
                {
                    GeneralAssessmentId = 2,
                    CreatedBy = 2,
                    TreatmentId = 2,
                    PainLevel = 4,
                    UsualPhysicalActivity = "running",
                    Height = "1.80",
                    Weight = "75",
                    Occupation = "engineer",
                    MedicalHistory = "Lumbar disc herniation"
                },
                new GeneralAssessment
                {
                    GeneralAssessmentId = 3,
                    CreatedBy = 2,
                    TreatmentId = 3,
                    PainLevel = 3,
                    UsualPhysicalActivity = "No physical activity",
                    Height = "1.73",
                    Weight = "80",
                    Occupation = "truck driver",
                    MedicalHistory = "no previous injuries"
                }
            );

            modelBuilder.Entity<MuscularAssessment>().HasData(
                new MuscularAssessment
                {
                    MuscularAssessmentId = 1,
                    CreatedBy = 2,
                    TreatmentId = 1,
                    MuscleName = "Right Serratus-posterior",
                    MuscleAssessment = "increased muscle tone"
                },
                new MuscularAssessment
                {
                    MuscularAssessmentId = 2,
                    CreatedBy = 2,
                    TreatmentId = 1,
                    MuscleName = "Right Latissimus-dorsi",
                    MuscleAssessment = "painful on palpation"
                },
                new MuscularAssessment
                {
                    MuscularAssessmentId = 3,
                    CreatedBy = 2,
                    TreatmentId = 2,
                    MuscleName = "Right Latissimus-dorsi",
                    MuscleAssessment = "painful on palpation"
                },
                new MuscularAssessment
                {
                    MuscularAssessmentId = 4,
                    CreatedBy = 3,
                    TreatmentId = 3,
                    MuscleName = "Right Deltoid",
                    MuscleAssessment = "painful on palpation"
                }
            );
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder
                .LogTo(Console.WriteLine, LogLevel.Information)
                .EnableSensitiveDataLogging();
        }

        public DbSet<Patient> Patients { get; set; }
        public DbSet<Physio> Physios { get; set; }
        public DbSet<Treatment> Treatments { get; set; }
        public DbSet<GeneralAssessment> GeneralAssessments { get; set; }
        public DbSet<MuscularAssessment> MuscularAssessments { get; set; }
    }
}

