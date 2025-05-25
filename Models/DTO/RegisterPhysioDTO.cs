using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models
{
    public class RegisterPhysioDTO
    {
        [Required]
        [StringLength(50, ErrorMessage = "El nombre debe tener menos de 50 caracteres")]
        public string Name { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "El apellido debe tener menos de 50 caracteres")]
        public string FirstSurname { get; set; }

        [Required]
        [StringLength(50, ErrorMessage = "El apellido debe tener menos de 50 caracteres")]
        public string SecondSurname { get; set; }

        [Required]
        [EmailAddress(ErrorMessage = "Formato de correo electrónico no válido")]
        [StringLength(100, ErrorMessage = "El correo debe tener menos de 100 caracteres")]
        public string Email { get; set; }

        [Required]
        public int RegistrationNumber { get; set; }

        [Required]
        [StringLength(100, MinimumLength = 4, ErrorMessage = "La contraseña debe tener entre 4 y 100 caracteres")]
        public string Password { get; set; }
    }
}
