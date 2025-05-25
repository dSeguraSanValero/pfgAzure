namespace FisioScan.Models;


public class MuscularAssessment
{
    public int MuscularAssessmentId { get; set; }
    public int CreatedBy { get; set; }
    public int TreatmentId { get; set; }
    public string MuscleName { get; set; }
    public string MuscleAssessment { get; set; }
    public static int MuscularAssessmentIdSeed { get; set; }


    public MuscularAssessment() {
    }

    public MuscularAssessment(int createdBy, int treatmentId, string muscleName, string muscleAssessment) 
    {
        MuscularAssessmentId = MuscularAssessmentIdSeed++;
        CreatedBy = createdBy;
        TreatmentId = treatmentId;
        MuscleName = muscleName;
        MuscleAssessment = muscleAssessment;
    }
}