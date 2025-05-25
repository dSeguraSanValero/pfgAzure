using FisioScan.Data;
using FisioScan.Models;

namespace FisioScan.Business;

public class GeneralAssessmentService : IGeneralAssessmentService
{
    private readonly IGeneralAssessmentRepository _repository;

    public GeneralAssessmentService(IGeneralAssessmentRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public IEnumerable<GeneralAssessment> GetGeneralAssessments(int? generalAssessmentId, int? createdBy, int? treatmentId, int? painLevel, string? usualPhysicalActivity, string? height, string? weight, string? occupation, string? medicalHistory)
    {
        return _repository.GetAllGeneralAssessments(generalAssessmentId, createdBy, treatmentId, painLevel, usualPhysicalActivity, height, weight, occupation, medicalHistory);
    }

    public void RegisterGeneralAssessment(int createdBy, int treatmentId, int painLevel, string usualPhysicalActivity, string height, string weight, string occupation, string medicalHistory)
    {
        var newGeneralAssessment = new GeneralAssessment
        {
            CreatedBy = createdBy,
            TreatmentId = treatmentId,
            PainLevel = painLevel,
            UsualPhysicalActivity = usualPhysicalActivity,
            Height = height,
            Weight = weight,
            Occupation = occupation,
            MedicalHistory = medicalHistory
        };

        _repository.AddGeneralAssessment(newGeneralAssessment);
    }

    public void RemoveGeneralAssessment(GeneralAssessment generalAssessment)
    {
        _repository.DeleteGeneralAssessment(generalAssessment);
    }

    public void UpdateGeneralAssessment(GeneralAssessment generalAssessment, int generalAssessmentId, int painLevel, string usualPhysicalActivity, string height, string weight, string occupation, string medicalHistory)
    {
        var existingGeneralAssessment = _repository.GetAllGeneralAssessments(generalAssessmentId, null, null, null, null, null, null, null, null).FirstOrDefault();
        if (existingGeneralAssessment != null)
        {
            existingGeneralAssessment.PainLevel = painLevel;
            existingGeneralAssessment.UsualPhysicalActivity = usualPhysicalActivity;
            existingGeneralAssessment.Height = height;
            existingGeneralAssessment.Weight = weight;
            existingGeneralAssessment.Occupation = occupation;
            existingGeneralAssessment.MedicalHistory = medicalHistory;

            _repository.UpdateGeneralAssessment(existingGeneralAssessment);
        }
        else
        {
            throw new KeyNotFoundException($"General Assessment with ID {generalAssessmentId} not found.");
        }
    }
}