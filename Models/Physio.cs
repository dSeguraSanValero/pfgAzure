namespace FisioScan.Models;

public class Physio
{
   public int PhysioId { get; set; }
   public string? Name { get; set; }
   public string? FirstSurname { get; set; }
   public string? SecondSurname { get; set; }
   public int RegistrationNumber { get; set; }
   public string Email { get; set; }
   public string Role { get; set; }
   public string? Password { get; set; }
   public static int PhysioIdSeed { get; set; }

   public Physio() {

   }

   public Physio(string name, string firstSurname, string secondSurname, string email, int registrationNumber, string password, string role = "Physio") 
   {
      PhysioId = PhysioIdSeed++;
      Name = name;
      FirstSurname = firstSurname;
      SecondSurname = secondSurname;
      Email = email;
      Role = role;
      RegistrationNumber = registrationNumber;
      Password = password;
   }
}

