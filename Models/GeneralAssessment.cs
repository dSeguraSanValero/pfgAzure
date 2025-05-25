namespace FisioScan.Models;


public class GeneralAssessment
{
    public int GeneralAssessmentId { get; set; }
    public int CreatedBy { get; set; }
    public int TreatmentId { get; set; }
    public int PainLevel { get; set; }
    public string? UsualPhysicalActivity { get; set; }
    public string? Height { get; set; }
    public string? Weight { get; set; }
    public string? Occupation { get; set; }
    public string? MedicalHistory { get; set; }
    public static int GeneralAssessmentIdSeed { get; set; }


    public GeneralAssessment() {
    
    }

    public GeneralAssessment(int createdBy, int treatmentId, int painLevel, string usualPhysicalActivity, string height, string weight, string occupation, string medicalHistory) 
    {
        GeneralAssessmentId = GeneralAssessmentIdSeed++;
        CreatedBy = createdBy;
        TreatmentId = treatmentId;
        PainLevel = painLevel;
        UsualPhysicalActivity = usualPhysicalActivity;
        Height = height;
        Weight = weight;
        Occupation = occupation;
        MedicalHistory = medicalHistory;
    }
}


