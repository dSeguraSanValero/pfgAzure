using FisioScan.Models;

namespace FisioScan.Data;

public class TreatmentRepository : ITreatmentRepository
{
    private readonly FisioScanContext _context;

    public TreatmentRepository(FisioScanContext context)
    {
        _context = context;
    }

    public IEnumerable<Treatment> GetAllTreatments(int? treatmentId, int? patientId, int? createdBy, string? treatmentCause, DateTime treatmentDate)
    {
        var query = _context.Treatments.AsQueryable();

        if (treatmentId.HasValue)
        {
            query = query.Where(p => p.TreatmentId == treatmentId);
        }

        if (patientId.HasValue)
        {
            query = query.Where(p => p.PatientId == patientId);
        }

        if (createdBy.HasValue)
        {
            query = query.Where(p => p.CreatedBy == createdBy);
        }

        if (!string.IsNullOrEmpty(treatmentCause))
        {
            query = query.Where(p => p.TreatmentCause == treatmentCause);
        }

        if (treatmentDate != default(DateTime))
        {
            query = query.Where(p => p.TreatmentDate == treatmentDate);
        }

        return query.ToList();
    }

        
    public void AddTreatment(Treatment treatment)
    {
        _context.Treatments.Add(treatment);
        _context.SaveChanges();
    }


    public void RemoveTreatment(Treatment treatment)
    {
        _context.Treatments.Remove(treatment);
        _context.SaveChanges();
    }


    public void UpdateTreatment(Treatment treatment)
    {
        _context.Treatments.Update(treatment);
        _context.SaveChanges();
    }
}