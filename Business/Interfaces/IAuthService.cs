using FisioScan.Models;
using System.Security.Claims;

namespace FisioScan.Business;

public interface IAuthService
{

    public Physio LoginPhysio(string email, string password);

    public string GeneratePhysioToken(Physio physio);

    public bool HasAccessToResource(ClaimsPrincipal user, out int? physioId);

}