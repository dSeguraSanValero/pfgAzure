using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models
{
    public class RegisterMuscularAssessmentDTO
    {
        [Required]
        public int TreatmentId { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "El nombre del músculo debe tener menos de 100 caracteres")]
        public string? MuscleName { get; set; }

        [Required]
        [StringLength(500, ErrorMessage = "La evaluación del músculo debe tener menos de 500 caracteres")]
        public string? MuscleAssessment { get; set; }
    }
}