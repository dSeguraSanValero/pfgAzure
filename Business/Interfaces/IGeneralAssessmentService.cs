using FisioScan.Models;

namespace FisioScan.Business;

public interface IGeneralAssessmentService
{
    public IEnumerable<GeneralAssessment> GetGeneralAssessments(int? generalAssessmentId, int? createdBy, int? treatmentId, int? painLevel, string? usualPhysicalActivity, string? height, string? weight, string? occupation, string? medicalHistory);
    public void RegisterGeneralAssessment(int createdBy, int treatmentId, int painLevel, string usualPhysicalActivity, string height, string weight, string occupation, string medicalHistory);
    public void RemoveGeneralAssessment(GeneralAssessment generalAssessment);
    public void UpdateGeneralAssessment(GeneralAssessment generalAssessment, int generalAssessmentId, int painLevel, string usualPhysicalActivity, string height, string weight, string occupation, string medicalHistory);
}