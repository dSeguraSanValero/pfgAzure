using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models;

public class UpdatePatientDTO
{
    [Required]
    public string Name { get; set; }

    [Required]
    public string FirstSurname { get; set; }

    [Required]
    public string SecondSurname { get; set; }

    [Required]
    public string Dni { get; set; }

    [Required]
    public DateTime BirthDate { get; set; }
}
