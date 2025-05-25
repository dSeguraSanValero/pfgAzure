using FisioScan.Models;

namespace FisioScan.Data
{
    public interface IPhysioRepository
    {
        public IEnumerable<Physio> GetAllPhysios(int? physioId, int? registrationNumber, string? email, string? name, string? firstSurname, string? secondSurname, string? sortBy, string? sortOrder, string? role);
        
        void AddPhysio(Physio physio);

        public void UpdatePhysioDetails(Physio physio);

        public void RemovePhysio(Physio physio);
    }
}

