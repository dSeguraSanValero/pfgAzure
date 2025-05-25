using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models;

public class UpdateMuscularAssessmentDTO
{
    [Required]
    [StringLength(500, ErrorMessage = "La evaluación del músculo debe tener menos de 500 caracteres")]
    public string? MuscleAssessment { get; set; }
}
