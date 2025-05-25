using FisioScan.Models;

namespace FisioScan.Business;

public interface ITreatmentService
{
    public IEnumerable<Treatment> GetTreatments(int? treatmentId, int? patientId, int? createdBy, string? treatmentCause, DateTime treatmentDate);
    public void RegisterTreatment(int patientId, int createdBy, string treatmentCause, DateTime treatmentDate);
    public void RemoveTreatment(int treatmentId);
    public void UpdateTreatment(int treatmentId, string treatmentCause, DateTime treatmentDate);
}