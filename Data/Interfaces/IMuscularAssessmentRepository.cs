using FisioScan.Models;

namespace FisioScan.Data;

public interface IMuscularAssessmentRepository
{
    public IEnumerable<MuscularAssessment> GetAllMuscularAssessments(int? muscularAssessmentId, int? createdBy, int? treatmentId, string? muscleName, string? muscleAssessment);
    public void AddMuscularAssessment(MuscularAssessment muscularAssessment);
    public void DeleteMuscularAssessment(MuscularAssessment muscularAssessment);
    public void UpdateMuscularAssessment(MuscularAssessment muscularAssessment);
}