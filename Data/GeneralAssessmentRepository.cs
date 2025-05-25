using FisioScan.Models;

namespace FisioScan.Data;

public class GeneralAssessmentRepository : IGeneralAssessmentRepository
{
    private readonly FisioScanContext _context;

    public GeneralAssessmentRepository(FisioScanContext context)
    {
        _context = context;
    }

    public IEnumerable<GeneralAssessment> GetAllGeneralAssessments(int? generalAssessmentId, int? createdBy, int? treatmentId, int? painLevel, string? usualPhysicalActivity, string? height, string? weight, string? occupation, string? medicalHistory)
    {
        var query = _context.GeneralAssessments.AsQueryable();

        if (generalAssessmentId.HasValue)
        {
            query = query.Where(p => p.GeneralAssessmentId == generalAssessmentId);
        }

        if (createdBy.HasValue)
        {
            query = query.Where(p => p.CreatedBy == createdBy);
        }

        if (treatmentId.HasValue)
        {
            query = query.Where(p => p.TreatmentId == treatmentId);
        }

        if (painLevel.HasValue)
        {
            query = query.Where(p => p.PainLevel == painLevel);
        }

        if (!string.IsNullOrEmpty(usualPhysicalActivity))
        {
            query = query.Where(p => p.UsualPhysicalActivity == usualPhysicalActivity);
        }

        if (!string.IsNullOrEmpty(height))
        {
            query = query.Where(p => p.Height == height);
        }

        if (!string.IsNullOrEmpty(weight))
        {
            query = query.Where(p => p.Weight == weight);
        }

        if (!string.IsNullOrEmpty(occupation))
        {
            query = query.Where(p => p.Occupation == occupation);
        }

        if (!string.IsNullOrEmpty(medicalHistory))
        {
            query = query.Where(p => p.MedicalHistory == medicalHistory);
        }

        return query.ToList();
    }

    public void AddGeneralAssessment(GeneralAssessment generalAssessment)
    {
        _context.GeneralAssessments.Add(generalAssessment);
        _context.SaveChanges();
    }

    public void DeleteGeneralAssessment(GeneralAssessment generalAssessment)
    {
        _context.GeneralAssessments.Remove(generalAssessment);
        _context.SaveChanges();
    }

    public void UpdateGeneralAssessment(GeneralAssessment generalAssessment)
    {
        _context.GeneralAssessments.Update(generalAssessment);
        _context.SaveChanges();
    }
}