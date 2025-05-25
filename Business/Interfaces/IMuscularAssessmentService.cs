using FisioScan.Models;

namespace FisioScan.Business;

public interface IMuscularAssessmentService
{
    public IEnumerable<MuscularAssessment> GetMuscularAssessments(int? muscularAssessmentId, int? createdBy, int? treatmentId, string? muscleName, string? muscleAssessment);
    public void RegisterMuscularAssessment(int createdBy, int treatmentId, string muscleName, string muscleAssessment);
    public void RemoveMuscularAssessment(MuscularAssessment muscularAssessment);
    public void UpdateMuscularAssessment(MuscularAssessment muscularAssessment, int muscularAssessmentId, string muscleAssessment);
}