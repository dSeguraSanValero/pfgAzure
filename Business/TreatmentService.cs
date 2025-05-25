using FisioScan.Data;
using FisioScan.Models;

namespace FisioScan.Business;

public class TreatmentService : ITreatmentService
{
    private readonly ITreatmentRepository _repository;

    public TreatmentService(ITreatmentRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public IEnumerable<Treatment> GetTreatments(int? treatmentId, int? patientId, int? createdBy, string? treatmentCause, DateTime treatmentDate)
    {
        return _repository.GetAllTreatments(treatmentId, patientId, createdBy, treatmentCause, treatmentDate);
    }

    public void RegisterTreatment(int patientId, int createdBy, string treatmentCause, DateTime treatmentDate)
    {
        var newTreatment = new Treatment
        {
            PatientId = patientId,
            CreatedBy = createdBy,
            TreatmentCause = treatmentCause,
            TreatmentDate = treatmentDate
        };

        _repository.AddTreatment(newTreatment);
    }

    public void RemoveTreatment(int treatmentId)
    {
        var treatment = _repository.GetAllTreatments(treatmentId, null, null, null, default).FirstOrDefault();
        if (treatment != null)
        {
            _repository.RemoveTreatment(treatment);
        }
        else
        {
            throw new KeyNotFoundException($"Treatment with ID {treatmentId} not found.");
        }
    }

    public void UpdateTreatment(int treatmentId, string treatmentCause, DateTime treatmentDate)
    {
        var treatment = _repository.GetAllTreatments(treatmentId, null, null, null, default).FirstOrDefault();
        if (treatment != null)
        {
            treatment.TreatmentCause = treatmentCause;
            treatment.TreatmentDate = treatmentDate;
            _repository.UpdateTreatment(treatment);
        }
        else
        {
            throw new KeyNotFoundException($"Treatment with ID {treatmentId} not found.");
        }
    }
}