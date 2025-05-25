namespace FisioScan.Models;

public class Patient
{
   public int PatientId { get; set; }
   public int CreatedBy { get; set; }
   public string? Name { get; set; }
   public string? FirstSurname { get; set; }
   public string? SecondSurname { get; set; }
   public static int PatientIdSeed { get; set; }
   public string? Dni { get; set; }
   private DateTime birthDate;
   public DateTime BirthDate
   {
      get => birthDate.Date;
      set => birthDate = value.Date;
   }

   public Patient() {
      
   }

   public Patient(string name, int createdBy, string firstSurname, string secondSurname, string dni, DateTime birthDate) 
   {
      PatientId = PatientIdSeed++;
      CreatedBy = createdBy;
      Name = name;
      FirstSurname = firstSurname;
      SecondSurname = secondSurname;
      Dni = dni;
      BirthDate = birthDate.Date;
   }
}
