using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using FisioScan.Models;
using FisioScan.Data;

namespace FisioScan.Business;

public class AuthService : IAuthService
{
    private readonly IConfiguration _configuration;

    private readonly IPhysioRepository _physioRepository;

    private readonly IPatientRepository _patientRepository;

    public AuthService(IConfiguration configuration, IPhysioRepository physioRepository, IPatientRepository patientRepository)
    {
        _configuration = configuration;
        _physioRepository = physioRepository;
        _patientRepository = patientRepository;
    }

    public Physio LoginPhysio(string email, string password)
    {
        if (string.IsNullOrEmpty(password))
        {
            throw new ArgumentException("Email and password are obligatory.");
        }

        foreach (var physio in _physioRepository.GetAllPhysios(null, null, null, null, null, null, null, null, null))
        {
            if (physio.Email == email && physio.Password == password)
            {
                return physio;
            }
        }
        throw new ArgumentException("Fisioterapeuta no encontrado");
    }

    public string GeneratePhysioToken(Physio physio)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var secretKey = _configuration["JWT:SecretKey"];
        var key = Encoding.ASCII.GetBytes(secretKey);

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.NameIdentifier, physio.PhysioId.ToString()),
                new Claim(ClaimTypes.Email, physio.Email),
                new Claim(ClaimTypes.Role, physio.Role),
                new Claim("PhysioId", physio.PhysioId.ToString())
            }),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    public bool HasAccessToResource(ClaimsPrincipal user, out int? rolePhysioId)
    {
        rolePhysioId = null;

        var roleClaim = user.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Role);
        var physioIdClaim = user.Claims.FirstOrDefault(c => c.Type == "PhysioId");

        if (roleClaim == null)
        {
            throw new ArgumentNullException("Falta el claim de rol en el token.");
        }

        if (roleClaim.Value.Equals("Admin", StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (roleClaim.Value.Equals("Physio", StringComparison.OrdinalIgnoreCase) && physioIdClaim != null)
        {
            if (int.TryParse(physioIdClaim.Value, out int parsedPhysioId))
            {
                rolePhysioId = parsedPhysioId;
                return true; 
            }
            else
            {
                throw new InvalidOperationException("El claim del ID del fisioterapeuta no es válido.");
            }
        }

        return false;
    }
}