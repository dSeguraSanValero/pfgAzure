namespace FisioScan.Models;

public class Treatment
{
    public int TreatmentId { get; set; }
    public int PatientId { get; set; }
    public int CreatedBy { get; set; }
    public string? TreatmentCause { get; set; }
    private DateTime treatmentDate;
    public DateTime TreatmentDate
    {
        get => treatmentDate.Date;
        set => treatmentDate = value.Date;
    }
    public static int TreatmentIdSeed { get; set; }

    public Treatment() {
      
    }

    public Treatment(int patientId, int createdBy, string treatmentCause, DateTime treatmentDate) 
    {
        TreatmentId = TreatmentIdSeed++;
        PatientId = patientId;
        CreatedBy = createdBy;
        TreatmentCause = treatmentCause;
        TreatmentDate = treatmentDate.Date;
    }
}