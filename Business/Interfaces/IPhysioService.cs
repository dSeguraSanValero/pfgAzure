using FisioScan.Models;

namespace FisioScan.Business;

public interface IPhysioService
{
    public IEnumerable<Physio> GetPhysios(int? physioId, int? registrationNumber, string? email, string? name, string? firstSurname, string? secondSurname, string? sortBy, string? sortOrder, string? role);

    public void RegisterPhysio(string name, string firstSurname, string secondSurname, int registrationNumber, string email, string password);
    
    public void DeletePhysio(Physio physio);

    public void UpdatePhysio(Physio physio, string name, string firstSurname, string secondSurname, string email, int registrationNumber, string password);
}
