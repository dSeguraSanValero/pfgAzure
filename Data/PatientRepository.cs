using FisioScan.Models;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;

namespace FisioScan.Data;

public class PatientRepository : IPatientRepository
{
    private readonly FisioScanContext _context;

    public PatientRepository(FisioScanContext context)
    {
        _context = context;
    }


    public IEnumerable<Patient> GetAllPatients(string? dni, int? createdBy, string? name, string? firstSurname, string? secondSurname, DateTime birthDate)
    {
        var query = _context.Patients.AsQueryable();

        if (!string.IsNullOrEmpty(dni))
        {
            query = query.Where(p => p.Dni == dni);
        }

        if (createdBy.HasValue)
        {
            query = query.Where(p => p.CreatedBy == createdBy.Value);
        }

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(p => p.Name == name);
        }

        if (!string.IsNullOrEmpty(firstSurname))
        {
            query = query.Where(p => p.FirstSurname == firstSurname);
        }

        if (!string.IsNullOrEmpty(secondSurname))
        {
            query = query.Where(p => p.SecondSurname == secondSurname);
        }

        if (birthDate != default(DateTime))
        {
            query = query.Where(p => p.BirthDate == birthDate);
        }

        return query.ToList();
    }



    public void AddPatient(Patient patient)
    {
        _context.Patients.Add(patient);
        _context.SaveChanges();
    }


    public void RemovePatient(Patient patient)
    {
        _context.Patients.Remove(patient);
        _context.SaveChanges();
    }

    public void UpdatePatient(Patient patient)
    {
        _context.Patients.Update(patient);
        _context.SaveChanges();
    }
}
