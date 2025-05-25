using FisioScan.Models;

namespace FisioScan.Data;

public interface IPatientRepository
{
    public IEnumerable<Patient> GetAllPatients(string? dni, int? createdBy, string? name, string? firstSurname, string? secondSurname, DateTime birthDate);
    void AddPatient(Patient patient);
    public void RemovePatient(Patient patient);
    
    public void UpdatePatient(Patient patient);
}