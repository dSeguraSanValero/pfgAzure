using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models
{
    public class RegisterGeneralAssessmentDTO
    {  
        [Required]
        public int TreatmentId { get; set; }

        [Required]
        public int PainLevel { get; set; } 

        [StringLength(50, ErrorMessage = "El ejercicio practicado debe tener menos de 50 caracteres")]
        public string? UsualPhysicalActivity { get; set; }

        [StringLength(50, ErrorMessage = "La altura debe tener menos de 50 caracteres")]
        public string? Height { get; set; }

        [StringLength(50, ErrorMessage = "El peso debe tener menos de 50 caracteres")]
        public string? Weight { get; set; }

        [StringLength(50, ErrorMessage = "La profesión debe tener menos de 100 caracteres")]
        public string? Occupation { get; set; }

        [StringLength(300, ErrorMessage = "La historia médica pasada debe tener menos de 300 caracteres")]
        public string? MedicalHistory { get; set; }
    }
}