using FisioScan.Models;
using Microsoft.EntityFrameworkCore;

namespace FisioScan.Data;

public class PhysioRepository : IPhysioRepository
{
    private readonly FisioScanContext _context;

    public PhysioRepository(FisioScanContext context)
    {
        _context = context;
    } 

    
    public IEnumerable<Physio> GetAllPhysios(int? physioId, int? registrationNumber, string? email, string? name, string? firstSurname, string? secondSurname, string? sortBy, string? sortOrder, string? role)
    {
        var query = _context.Physios.AsQueryable();

        if (physioId.HasValue)
        {
            query = query.Where(p => p.PhysioId == physioId.Value);
        }

        if (registrationNumber.HasValue)
        {
            query = query.Where(p => p.RegistrationNumber == registrationNumber.Value);
        }

        if (!string.IsNullOrEmpty(email))
        {
            query = query.Where(p => p.Email == email);
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

        if (!string.IsNullOrEmpty(role))
        {
            query = query.Where(p => p.Role == role);
        }

        if (!string.IsNullOrEmpty(sortBy))
        {
            switch (sortBy.ToLower())
            {
                case "name":
                    query = sortOrder != null && sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.Name)
                        : query.OrderBy(p => p.Name);
                    break;

                case "firstSurname":
                    query = sortOrder != null && sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.FirstSurname)
                        : query.OrderBy(p => p.FirstSurname);
                    break;

                case "secondSurname":
                    query = sortOrder != null && sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.SecondSurname)
                        : query.OrderBy(p => p.SecondSurname);
                    break;    

                case "email":
                    query = sortOrder != null && sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.Email)
                        : query.OrderBy(p => p.Email);
                    break;

                case "physioid":
                default:
                    query = sortOrder != null && sortOrder.ToLower() == "desc"
                        ? query.OrderByDescending(p => p.PhysioId)
                        : query.OrderBy(p => p.PhysioId);
                    break;
            }
        }

        return query.ToList();
    }


    public void AddPhysio(Physio physio)
    {
        _context.Physios.Add(physio);
        _context.SaveChanges();
    }

    public void UpdatePhysioDetails(Physio physio)
    {
        _context.Physios.Update(physio);
        _context.SaveChanges();
    }


    public void RemovePhysio(Physio physio)
    {
        _context.Physios.Remove(physio);
        _context.SaveChanges();
    }
}


