using FisioScan.Models;

namespace FisioScan.Data;

public interface ITreatmentRepository
{
    
    public IEnumerable<Treatment> GetAllTreatments(int? treatmentId, int? patientId, int? createdBy, string? treatmentCause, DateTime treatmentDate);
    
    public void AddTreatment(Treatment treatment);

    public void RemoveTreatment(Treatment treatment);

    public void UpdateTreatment(Treatment treatment);
}