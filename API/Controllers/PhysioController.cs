using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FisioScan.Models;
using FisioScan.Business;



namespace FisioScan.API.Controllers;

[ApiController]
[Route("[controller]")]
public class PhysioController : ControllerBase
{
    private readonly ILogger<PhysioController> _logger;

    private readonly IPhysioService _physioService;

    private readonly IAuthService _authService;

    public PhysioController(ILogger<PhysioController> logger, IPhysioService physioService, IAuthService authService)
    {
        _logger = logger;
        _physioService = physioService;
        _authService = authService;
    }

    [Authorize]
    [HttpGet(Name = "GetAllPhysios")]
    public ActionResult<IEnumerable<Physio>> SearchPhysio(int? physioId, int? registrationNumber, string? email, string? name, string? firstSurname, string? secondSurname, string? sortBy, string? sortOrder, string? role)
    {
        if (_authService.HasAccessToResource(User, out int? rolePhysioId))
        {
            if (rolePhysioId == null)
            {
                try
                {
                    var physios = _physioService.GetPhysios(physioId, registrationNumber, email, name, firstSurname, secondSurname, sortBy, sortOrder, role);
                    
                    if (physios == null || !physios.Any())
                    {
                        return NotFound("No se encontraron fisioterapeutas con los parámetros proporcionados.");
                    }

                    return Ok(physios);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Error al obtener los fisioterapeutas: {ex.Message}");
                    return StatusCode(500, "Error interno del servidor.");
                }
            }
            if (rolePhysioId.HasValue)
            {
                physioId = rolePhysioId.Value;
                var physio = _physioService.GetPhysios(physioId, null, null, null, null, null, null, null, null);
                
                if (physio == null || !physio.Any())
                {
                    return NotFound("No se encontraron fisioterapeutas con los parámetros proporcionados.");
                }

                return Ok(physio);
            }
        }
        return Unauthorized("Acceso denegado");
    }

    [HttpPost]
    public IActionResult RegisterPhysio([FromBody] RegisterPhysioDTO physioDTO)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            _physioService.RegisterPhysio(
                name: physioDTO.Name,
                firstSurname: physioDTO.FirstSurname,
                secondSurname: physioDTO.SecondSurname,
                email: physioDTO.Email,
                registrationNumber: physioDTO.RegistrationNumber,
                password: physioDTO.Password
            );

            return CreatedAtAction(nameof(SearchPhysio), new { registrationNumber = physioDTO.RegistrationNumber }, physioDTO);
        }
        catch (Exception ex)
        {
            _logger.LogError("Error al registrar fisioterapeuta: ", ex);
            return BadRequest(ex.Message);
        }

    }

    [HttpDelete("{physioId}")]
    public IActionResult DeletePhysioById(int physioId)
    {
        try
        {
            var physios = _physioService.GetPhysios(null, null, null, null, null, null, null, null, null);
            var physio = physios.FirstOrDefault(p => p.PhysioId == physioId);

            if (physio == null)
            {
                return NotFound();
            }

            _physioService.DeletePhysio(physio);
            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al eliminar el fisioterapeuta.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error interno al procesar la solicitud.");
        }
    }


    [HttpPut("{physioId}")]
    public IActionResult UpdatePhysio(int physioId, [FromBody] UpdatePhysioDTO physioDTO)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var physios = _physioService.GetPhysios(null, null, null, null, null, null, null, null, null);
            var physio = physios.FirstOrDefault(p => p.PhysioId == physioId);

            if (physio == null)
            {
                return NotFound();
            }

            _physioService.UpdatePhysio(physio, 
                physioDTO.Name,
                physioDTO.FirstSurname,
                physioDTO.SecondSurname,
                physioDTO.Email,
                physioDTO.RegistrationNumber,
                physioDTO.Password
            );

            return NoContent();
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogInformation(ex.Message);
            return NotFound();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error al actualizar el fisioterapeuta.");
            return StatusCode(StatusCodes.Status500InternalServerError, "Error interno al procesar la solicitud.");
        }
    }
}

