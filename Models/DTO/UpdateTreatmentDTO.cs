using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models;

public class UpdateTreatmentDTO
{
    [Required]
    [StringLength(300, ErrorMessage = "Treatment cause cannot exceed 300 characters.")]
    public string TreatmentCause { get; set; } = string.Empty;

    [Required]
    public DateTime TreatmentDate { get; set; }
}