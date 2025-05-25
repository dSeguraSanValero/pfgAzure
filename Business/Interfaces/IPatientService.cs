using FisioScan.Models;

namespace FisioScan.Business;

public interface IPatientService
{
    public IEnumerable<Patient> GetPatients(string? dni, int? createdBy, string? name, string? firstSurname, string? secondSurname, DateTime birthDate);
    public void RegisterPatient(int createdBy, string name, string firstSurname, string secondSurname, string dni, DateTime birthDate);
    public void DeletePatient(Patient patient);
    public void UpdatePatient(Patient patient, string name, string firstSurname, string secondSurname, string dni, DateTime birthDate);
}