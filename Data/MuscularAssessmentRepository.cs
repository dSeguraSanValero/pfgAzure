using FisioScan.Models;

namespace FisioScan.Data;

public class MuscularAssessmentRepository : IMuscularAssessmentRepository
{
    private readonly FisioScanContext _context;

    public MuscularAssessmentRepository(FisioScanContext context)
    {
        _context = context;
    }

    public IEnumerable<MuscularAssessment> GetAllMuscularAssessments(int? muscularAssessmentId, int? createdBy, int? treatmentId, string? muscleName, string? muscleAssessment)
    {
        var query = _context.MuscularAssessments.AsQueryable();

        if (muscularAssessmentId.HasValue)
        {
            query = query.Where(p => p.MuscularAssessmentId == muscularAssessmentId);
        }

        if (createdBy.HasValue)
        {
            query = query.Where(p => p.CreatedBy == createdBy);
        }

        if (treatmentId.HasValue)
        {
            query = query.Where(p => p.TreatmentId == treatmentId);
        }

        if (!string.IsNullOrEmpty(muscleName))
        {
            query = query.Where(p => p.MuscleName == muscleName);
        }

        if (!string.IsNullOrEmpty(muscleAssessment))
        {
            query = query.Where(p => p.MuscleAssessment == muscleAssessment);
        }

        return query.ToList();
    }

    public void AddMuscularAssessment(MuscularAssessment muscularAssessment)
    {
        _context.MuscularAssessments.Add(muscularAssessment);
        _context.SaveChanges();
    }

    public void DeleteMuscularAssessment(MuscularAssessment muscularAssessment)
    {

        _context.MuscularAssessments.Remove(muscularAssessment);
        _context.SaveChanges();
        
    }

    public void UpdateMuscularAssessment(MuscularAssessment muscularAssessment)
    {
        _context.MuscularAssessments.Update(muscularAssessment);
        _context.SaveChanges();
    }
}