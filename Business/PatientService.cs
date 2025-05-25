using FisioScan.Data;
using FisioScan.Models;

namespace FisioScan.Business;

public class PatientService : IPatientService
{
    private readonly IPatientRepository _repository;

    public PatientService(IPatientRepository repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }


    public IEnumerable<Patient> GetPatients(string? dni, int? createdBy, string? name, string? firstSurname, string? secondSurname, DateTime birthDate)
    {
        return _repository.GetAllPatients(dni, createdBy, name, firstSurname, secondSurname, birthDate);
    }

    public void RegisterPatient(int createdBy, string name, string firstSurname, string secondSurname, string dni, DateTime birthDate)
    {
        var newPatient = new Patient
        {
            CreatedBy = createdBy,
            Name = name,
            FirstSurname = firstSurname,
            SecondSurname = secondSurname,
            Dni = dni,
            BirthDate = birthDate
        };

        _repository.AddPatient(newPatient);
    }

    public void DeletePatient(Patient patient)
    {
        _repository.RemovePatient(patient);
    }

    public void UpdatePatient(Patient patient, string name, string firstSurname, string secondSurname, string dni, DateTime birthDate)
    {
        patient.Name = name;
        patient.FirstSurname = firstSurname;
        patient.SecondSurname = secondSurname;
        patient.Dni = dni;
        patient.BirthDate = birthDate;
        _repository.UpdatePatient(patient);
    }
}