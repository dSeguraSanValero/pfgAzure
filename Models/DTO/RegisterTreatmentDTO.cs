using System.ComponentModel.DataAnnotations;

namespace FisioScan.Models
{
    public class RegisterTreatmentDTO
    {
        [Required]
        public int PatientId { get; set; }
    
        [Required]
        [StringLength(100, ErrorMessage = "El motivo de tratamiento debe tener menos de 100 caracteres")]
        public string? TreatmentCause { get; set; }

        private DateTime treatmentDate;

        [Required]
        public DateTime TreatmentDate
        {
            get => treatmentDate.Date;
            set => treatmentDate = value.Date;
        }
    }
}