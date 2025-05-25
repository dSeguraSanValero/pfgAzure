using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models;

public class UpdatePhysioDTO
{
    [Required]
    [StringLength(100, MinimumLength = 4, ErrorMessage = "El nombre debe tener entre 4 y 100 caracteres")]
    public string Name { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 4, ErrorMessage = "El primer apellido debe tener entre 4 y 100 caracteres")]
    public string FirstSurname { get; set; } = string.Empty;

    [StringLength(100, MinimumLength = 4, ErrorMessage = "El segundo apellido debe tener entre 4 y 100 caracteres")]
    public string? SecondSurname { get; set; } = string.Empty;

    [Required]
    [EmailAddress(ErrorMessage = "Formato de correo electrónico no válido")]
    [StringLength(100, ErrorMessage = "El correo debe tener menos de 100 caracteres")]
    public string Email { get; set; } = string.Empty;

    [Required]
    [Range(1, int.MaxValue, ErrorMessage = "El número de colegiado debe ser un número positivo")]
    public int RegistrationNumber { get; set; }

    [Required]
    [StringLength(100, MinimumLength = 4, ErrorMessage = "La contraseña debe tener entre 4 y 100 caracteres")]
    public string? Password { get; set; }
}